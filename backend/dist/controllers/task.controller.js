"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateTasks = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const mongoose_1 = __importDefault(require("../lib/mongoose"));
const Task_1 = require("../models/Task");
const Project_1 = require("../models/Project");
const Member_1 = require("../models/Member");
const User_1 = require("../models/User");
const Notification_1 = require("../models/Notification");
const types_1 = require("../features/tasks/types");
const EmailService_1 = require("../services/EmailService");
const socket_1 = require("../lib/socket");
const getMember = async (workspaceId, userId) => Member_1.Member.findOne({ workspaceId, userId });
const mapTask = (task, project, assignee) => ({
    $id: task._id.toString(),
    name: task.name,
    status: task.status,
    position: task.position,
    dueDate: task.dueDate?.toISOString?.() ?? task.dueDate,
    description: task.description,
    workspaceId: task.workspaceId.toString(),
    projectId: task.projectId.toString(),
    assigneeId: task.assigneeId.toString(),
    // PredictFlow extra fields
    priority: task.priority,
    complexity: task.complexity,
    storyPoints: task.storyPoints,
    labels: task.labels,
    project: project
        ? { $id: project._id.toString(), name: project.name, imageUrl: project.imageUrl, workspaceId: project.workspaceId.toString() }
        : null,
    assignee,
});
// GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const { workspaceId, projectId, assigneeId, status, search, dueDate } = req.query;
        if (!workspaceId) {
            res.status(400).json({ error: 'workspaceId is required.' });
            return;
        }
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const query = { workspaceId };
        if (projectId)
            query.projectId = projectId;
        if (status)
            query.status = status;
        if (assigneeId)
            query.assigneeId = assigneeId;
        if (dueDate)
            query.dueDate = new Date(dueDate);
        if (search)
            query.name = { $regex: search, $options: 'i' };
        const tasks = await Task_1.Task.find(query).sort({ createdAt: -1 }).lean();
        const projectIds = [...new Set(tasks.map((t) => t.projectId.toString()))];
        const assigneeIds = [...new Set(tasks.map((t) => t.assigneeId.toString()))];
        const [projects, members] = await Promise.all([
            Project_1.Project.find({ _id: { $in: projectIds } }).lean(),
            Member_1.Member.find({ _id: { $in: assigneeIds } }).lean(),
        ]);
        const users = await User_1.User.find({ _id: { $in: members.map((m) => m.userId) } }).lean();
        const assigneesMap = {};
        members.forEach((m) => {
            const u = users.find((u) => u._id.toString() === m.userId.toString());
            assigneesMap[m._id.toString()] = { $id: m._id.toString(), name: u?.name, email: u?.email, userId: m.userId.toString(), workspaceId: m.workspaceId.toString(), role: m.role };
        });
        const projectsMap = {};
        projects.forEach((p) => { projectsMap[p._id.toString()] = p; });
        const populatedTasks = tasks.map((t) => mapTask(t, projectsMap[t.projectId.toString()], assigneesMap[t.assigneeId.toString()]));
        res.json({ data: { documents: populatedTasks, total: populatedTasks.length } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getTasks = getTasks;
// GET /api/tasks/:taskId
const getTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await (0, mongoose_1.default)();
        const task = await Task_1.Task.findById(taskId).lean();
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        const member = await getMember(task.workspaceId.toString(), req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const [project, assigneeMember] = await Promise.all([
            Project_1.Project.findById(task.projectId).lean(),
            Member_1.Member.findById(task.assigneeId).lean(),
        ]);
        let assignee = null;
        if (assigneeMember) {
            const u = await User_1.User.findById(assigneeMember.userId).lean();
            if (u)
                assignee = { $id: assigneeMember._id.toString(), name: u.name, email: u.email, userId: assigneeMember.userId.toString(), workspaceId: assigneeMember.workspaceId.toString(), role: assigneeMember.role };
        }
        res.json({ data: mapTask(task, project, assignee) });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getTask = getTask;
// POST /api/tasks
const createTask = async (req, res) => {
    try {
        const { name, status, workspaceId, projectId, dueDate, assigneeId, priority, complexity, storyPoints, labels, description } = req.body;
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const highestPositionTask = await Task_1.Task.findOne({ status, workspaceId }).sort({ position: -1 }).lean();
        const position = highestPositionTask ? highestPositionTask.position + 1000 : 1000;
        const task = await Task_1.Task.create({
            name, status, workspaceId, projectId,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            assigneeId, position,
            priority, complexity, storyPoints, labels, description,
        });
        if (assigneeId) {
            const assigneeMember = await Member_1.Member.findById(assigneeId).populate('userId');
            const project = await Project_1.Project.findById(projectId);
            if (assigneeMember && assigneeMember.userId && project) {
                const assignedUser = await User_1.User.findById(assigneeMember.userId);
                if (assignedUser) {
                    // Send Email
                    await EmailService_1.EmailService.sendTaskAssignedEmail(assignedUser.email, assignedUser.name, project.name, task.name, task.priority || 'Normal', task.dueDate || new Date(), task.description || 'No description provided').catch(e => console.error('Failed to send email:', e));
                    // Save Notification
                    const notification = await Notification_1.Notification.create({
                        userId: assignedUser._id,
                        title: 'New Task Assigned',
                        message: `You have been assigned to task: ${task.name}`,
                        type: 'task_assigned',
                    });
                    // Emit Socket event
                    try {
                        (0, socket_1.getIO)().to(assignedUser._id.toString()).emit('notification', notification);
                    }
                    catch (e) {
                        console.error('Socket error:', e);
                    }
                }
            }
        }
        res.json({ data: { $id: task._id.toString(), ...task.toObject() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.createTask = createTask;
// PATCH /api/tasks/:taskId
const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await (0, mongoose_1.default)();
        const existing = await Task_1.Task.findById(taskId).lean();
        if (!existing) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        // Member is attached by rbac.middleware.ts, but we'll fetch just in case it's missed
        const member = req.member || await getMember(existing.workspaceId.toString(), req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        if (member.role === Member_1.MemberRole.MEMBER && existing.assigneeId.toString() !== member._id.toString()) {
            res.status(403).json({ error: 'Forbidden. You can only update your own tasks.' });
            return;
        }
        const { name, status, description, projectId, dueDate, assigneeId, priority, complexity, storyPoints, labels } = req.body;
        // Prevent members from reassigning tasks to others
        if (member.role === Member_1.MemberRole.MEMBER && assigneeId && assigneeId !== member._id.toString()) {
            res.status(403).json({ error: 'Forbidden. You cannot reassign your tasks.' });
            return;
        }
        const updateData = { name, status, projectId, assigneeId, description, priority, complexity, storyPoints, labels };
        if (dueDate)
            updateData.dueDate = new Date(dueDate);
        // Remove undefined keys
        Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);
        const task = await Task_1.Task.findByIdAndUpdate(taskId, updateData, { new: true });
        if (task && existing.status !== task.status && (task.status === types_1.TaskStatus.IN_REVIEW || task.status === types_1.TaskStatus.DONE)) {
            // Find workspace admins
            const admins = await Member_1.Member.find({ workspaceId: existing.workspaceId, role: Member_1.MemberRole.ADMIN }).populate('userId');
            const modifier = await User_1.User.findById(req.user._id);
            for (const admin of admins) {
                if (admin.userId) {
                    const adminUser = await User_1.User.findById(admin.userId);
                    if (adminUser && modifier) {
                        if (task.status === types_1.TaskStatus.IN_REVIEW) {
                            await EmailService_1.EmailService.sendTaskReviewEmail(adminUser.email, adminUser.name, task.name, modifier.name).catch(console.error);
                            const notification = await Notification_1.Notification.create({
                                userId: adminUser._id,
                                title: 'Task Ready for Review',
                                message: `Task "${task.name}" has been moved to Review by ${modifier.name}`,
                                type: 'task_review',
                            });
                            try {
                                (0, socket_1.getIO)().to(adminUser._id.toString()).emit('notification', notification);
                            }
                            catch (e) { }
                        }
                        else if (task.status === types_1.TaskStatus.DONE) {
                            await EmailService_1.EmailService.sendTaskCompletedEmail(adminUser.email, adminUser.name, task.name, modifier.name, new Date()).catch(console.error);
                            const notification = await Notification_1.Notification.create({
                                userId: adminUser._id,
                                title: 'Task Completed',
                                message: `Task "${task.name}" has been completed by ${modifier.name}`,
                                type: 'task_completed',
                            });
                            try {
                                (0, socket_1.getIO)().to(adminUser._id.toString()).emit('notification', notification);
                            }
                            catch (e) { }
                        }
                    }
                }
            }
        }
        res.json({ data: { $id: task?._id.toString(), ...task?.toObject() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.updateTask = updateTask;
// DELETE /api/tasks/:taskId
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await (0, mongoose_1.default)();
        const task = await Task_1.Task.findById(taskId).lean();
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        const member = await getMember(task.workspaceId.toString(), req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        await Task_1.Task.findByIdAndDelete(taskId);
        res.json({ data: { $id: taskId, workspaceId: task.workspaceId.toString(), projectId: task.projectId.toString() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.deleteTask = deleteTask;
// POST /api/tasks/bulk-update
const bulkUpdateTasks = async (req, res) => {
    try {
        const { tasks } = req.body;
        await (0, mongoose_1.default)();
        const taskIds = tasks.map((t) => t.$id);
        const tasksToUpdate = await Task_1.Task.find({ _id: { $in: taskIds } }).lean();
        if (tasksToUpdate.length === 0) {
            res.json({ data: { updatedTasks: [] } });
            return;
        }
        const workspaceIds = new Set(tasksToUpdate.map((t) => t.workspaceId.toString()));
        if (workspaceIds.size !== 1) {
            res.status(400).json({ error: 'All tasks must belong to the same workspace.' });
            return;
        }
        const workspaceId = [...workspaceIds][0];
        const member = req.member || await getMember(workspaceId, req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        if (member.role === Member_1.MemberRole.MEMBER) {
            const unauthorizedTask = tasksToUpdate.find(t => t.assigneeId.toString() !== member._id.toString());
            if (unauthorizedTask) {
                res.status(403).json({ error: 'Forbidden. You can only update your own tasks.' });
                return;
            }
        }
        const updatedTasks = await Promise.all(tasks.map(async (t) => Task_1.Task.findByIdAndUpdate(t.$id, { status: t.status, position: t.position }, { new: true })));
        res.json({ data: { updatedTasks, workspaceId } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.bulkUpdateTasks = bulkUpdateTasks;
//# sourceMappingURL=task.controller.js.map