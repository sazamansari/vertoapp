"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceAnalytics = exports.joinWorkspace = exports.resetInviteCode = exports.deleteWorkspace = exports.updateWorkspace = exports.getWorkspaceInfo = exports.getWorkspace = exports.createWorkspace = exports.getWorkspaces = void 0;
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("../lib/mongoose"));
const Workspace_1 = require("../models/Workspace");
const Member_1 = require("../models/Member");
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const types_1 = require("../features/members/types");
const utils_1 = require("../lib/utils");
const types_2 = require("../features/tasks/types");
const getMember = async (workspaceId, userId) => Member_1.Member.findOne({ workspaceId, userId });
const mapWorkspace = (w) => ({
    $id: w._id.toString(),
    name: w.name,
    imageUrl: w.imageUrl,
    inviteCode: w.inviteCode,
    userId: w.userId.toString(),
});
// GET /api/workspaces
const getWorkspaces = async (req, res) => {
    try {
        await (0, mongoose_1.default)();
        const members = await Member_1.Member.find({ userId: req.user._id });
        if (members.length === 0) {
            res.json({ data: { documents: [], total: 0 } });
            return;
        }
        const workspaceIds = members.map((m) => m.workspaceId);
        const workspaces = await Workspace_1.Workspace.find({ _id: { $in: workspaceIds } }).sort({ createdAt: -1 });
        res.json({ data: { documents: workspaces.map(mapWorkspace), total: workspaces.length } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getWorkspaces = getWorkspaces;
// POST /api/workspaces
const createWorkspace = async (req, res) => {
    try {
        const { name } = req.body;
        let imageUrl;
        if (req.file) {
            const base64 = req.file.buffer.toString('base64');
            imageUrl = `data:${req.file.mimetype};base64,${base64}`;
        }
        else if (req.body.image) {
            imageUrl = req.body.image;
        }
        await (0, mongoose_1.default)();
        const workspace = await Workspace_1.Workspace.create({
            name, userId: req.user._id, imageUrl, inviteCode: (0, utils_1.generateInviteCode)(6),
        });
        await Member_1.Member.create({ userId: req.user._id, workspaceId: workspace._id, role: types_1.MemberRole.ADMIN });
        res.json({ data: { $id: workspace._id.toString(), ...workspace.toObject() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.createWorkspace = createWorkspace;
// GET /api/workspaces/:workspaceId
const getWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const workspace = await Workspace_1.Workspace.findById(workspaceId);
        if (!workspace) {
            res.status(404).json({ error: 'Not found.' });
            return;
        }
        res.json({ data: mapWorkspace(workspace) });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getWorkspace = getWorkspace;
// GET /api/workspaces/:workspaceId/info
const getWorkspaceInfo = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        await (0, mongoose_1.default)();
        const workspace = await Workspace_1.Workspace.findById(workspaceId);
        if (!workspace) {
            res.status(404).json({ error: 'Not found.' });
            return;
        }
        res.json({ data: { $id: workspace._id.toString(), name: workspace.name, imageUrl: workspace.imageUrl } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getWorkspaceInfo = getWorkspaceInfo;
// PATCH /api/workspaces/:workspaceId
const updateWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        const { name } = req.body;
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member || member.role !== types_1.MemberRole.ADMIN) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        let imageUrl;
        if (req.file) {
            const base64 = req.file.buffer.toString('base64');
            imageUrl = `data:${req.file.mimetype};base64,${base64}`;
        }
        else if (req.body.image) {
            imageUrl = req.body.image;
        }
        const updateData = { name };
        if (imageUrl !== undefined)
            updateData.imageUrl = imageUrl;
        const workspace = await Workspace_1.Workspace.findByIdAndUpdate(workspaceId, updateData, { new: true });
        res.json({ data: { $id: workspace?._id.toString(), ...workspace?.toObject() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.updateWorkspace = updateWorkspace;
// DELETE /api/workspaces/:workspaceId
const deleteWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member || member.role !== types_1.MemberRole.ADMIN) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        await Member_1.Member.deleteMany({ workspaceId });
        await Project_1.Project.deleteMany({ workspaceId });
        await Task_1.Task.deleteMany({ workspaceId });
        await Workspace_1.Workspace.findByIdAndDelete(workspaceId);
        res.json({ data: { $id: workspaceId } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.deleteWorkspace = deleteWorkspace;
// POST /api/workspaces/:workspaceId/resetInviteCode
const resetInviteCode = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member || member.role !== types_1.MemberRole.ADMIN) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const workspace = await Workspace_1.Workspace.findByIdAndUpdate(workspaceId, { inviteCode: (0, utils_1.generateInviteCode)(6) }, { new: true });
        res.json({ data: { $id: workspace?._id.toString(), ...workspace?.toObject() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.resetInviteCode = resetInviteCode;
// POST /api/workspaces/:workspaceId/join
const joinWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        const { code } = req.body;
        await (0, mongoose_1.default)();
        const existing = await getMember(workspaceId, req.user._id.toString());
        if (existing) {
            res.status(400).json({ error: 'Already a member.' });
            return;
        }
        const workspace = await Workspace_1.Workspace.findById(workspaceId);
        if (!workspace || workspace.inviteCode !== code) {
            res.status(400).json({ error: 'Invalid invite code.' });
            return;
        }
        await Member_1.Member.create({ workspaceId, userId: req.user._id, role: types_1.MemberRole.MEMBER });
        res.json({ data: { $id: workspace._id.toString(), ...workspace.toObject() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.joinWorkspace = joinWorkspace;
// GET /api/workspaces/:workspaceId/analytics
const getWorkspaceAnalytics = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        await (0, mongoose_1.default)();
        const member = await getMember(workspaceId, req.user._id.toString());
        if (!member) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        const now = new Date();
        const thisMonthStart = (0, date_fns_1.startOfMonth)(now);
        const thisMonthEnd = (0, date_fns_1.endOfMonth)(now);
        const lastMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const lastMonthEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const [thisMonthTasks, lastMonthTasks, thisMonthAssigned, lastMonthAssigned, thisMonthIncomplete, lastMonthIncomplete, thisMonthCompleted, lastMonthCompleted, thisMonthOverdue, lastMonthOverdue,] = await Promise.all([
            Task_1.Task.countDocuments({ workspaceId, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, assigneeId: member._id, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, assigneeId: member._id, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, status: { $ne: types_2.TaskStatus.DONE }, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, status: { $ne: types_2.TaskStatus.DONE }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, status: types_2.TaskStatus.DONE, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, status: types_2.TaskStatus.DONE, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, status: { $ne: types_2.TaskStatus.DONE }, dueDate: { $lt: now }, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Task_1.Task.countDocuments({ workspaceId, status: { $ne: types_2.TaskStatus.DONE }, dueDate: { $lt: now }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
        ]);
        res.json({
            data: {
                taskCount: thisMonthTasks,
                taskDifference: thisMonthTasks - lastMonthTasks,
                assignedTaskCount: thisMonthAssigned,
                assignedTaskDifference: thisMonthAssigned - lastMonthAssigned,
                incompleteTaskCount: thisMonthIncomplete,
                incompleteTaskDifference: thisMonthIncomplete - lastMonthIncomplete,
                completedTaskCount: thisMonthCompleted,
                completedTaskDifference: thisMonthCompleted - lastMonthCompleted,
                overdueTaskCount: thisMonthOverdue,
                overdueTaskDifference: thisMonthOverdue - lastMonthOverdue,
            },
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getWorkspaceAnalytics = getWorkspaceAnalytics;
//# sourceMappingURL=workspace.controller.js.map