"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_validator_1 = require("@hono/zod-validator");
const hono_1 = require("hono");
const zod_1 = require("zod");
const utils_1 = require("../../members/utils");
const schema_1 = require("../schema");
const types_1 = require("../types");
const session_middleware_1 = require("../../../lib/session-middleware");
const mongoose_1 = __importDefault(require("../../../lib/mongoose"));
const Task_1 = require("../../../models/Task");
const Project_1 = require("../../../models/Project");
const Member_1 = require("../../../models/Member");
const User_1 = require("../../../models/User");
const app = new hono_1.Hono()
    .get('/', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('query', zod_1.z.object({
    workspaceId: zod_1.z.string(),
    projectId: zod_1.z.string().nullish(),
    assigneeId: zod_1.z.string().nullish(),
    status: zod_1.z.nativeEnum(types_1.TaskStatus).nullish(),
    search: zod_1.z.string().nullish(),
    dueDate: zod_1.z.string().nullish(),
})), async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId, projectId, assigneeId, status, search, dueDate } = ctx.req.valid('query');
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
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
    const tasks = await Task_1.Task.find(query).sort({ createdAt: -1 });
    const projectIds = tasks.map((task) => task.projectId);
    const assigneeIds = tasks.map((task) => task.assigneeId);
    const projects = await Project_1.Project.find({ _id: { $in: projectIds } });
    const members = await Member_1.Member.find({ _id: { $in: assigneeIds } });
    const users = await User_1.User.find({ _id: { $in: members.map(m => m.userId) } });
    const assignees = members.map((m) => {
        const userDoc = users.find(u => u._id.toString() === m.userId.toString());
        return {
            $id: m._id.toString(),
            name: userDoc?.name,
            email: userDoc?.email,
            userId: m.userId.toString(),
            workspaceId: m.workspaceId.toString(),
            role: m.role
        };
    });
    const populatedTasks = tasks.map((task) => {
        const project = projects.find((project) => project._id.toString() === task.projectId.toString());
        const assignee = assignees.find((assignee) => assignee.$id === task.assigneeId.toString());
        return {
            $id: task._id.toString(),
            name: task.name,
            status: task.status,
            position: task.position,
            dueDate: task.dueDate.toISOString(),
            description: task.description,
            workspaceId: task.workspaceId.toString(),
            projectId: task.projectId.toString(),
            assigneeId: task.assigneeId.toString(),
            project: project ? {
                $id: project._id.toString(),
                name: project.name,
                imageUrl: project.imageUrl,
                workspaceId: project.workspaceId.toString()
            } : null,
            assignee,
        };
    });
    return ctx.json({
        data: {
            documents: populatedTasks,
            total: populatedTasks.length,
        },
    });
})
    .get('/:taskId', session_middleware_1.sessionMiddleware, async (ctx) => {
    const { taskId } = ctx.req.param();
    const currentUser = ctx.get('user');
    await (0, mongoose_1.default)();
    const task = await Task_1.Task.findById(taskId);
    if (!task) {
        return ctx.json({ error: 'Task not found' }, 404);
    }
    const currentMember = await (0, utils_1.getMember)({
        workspaceId: task.workspaceId.toString(),
        userId: currentUser._id.toString(),
    });
    if (!currentMember) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    const project = await Project_1.Project.findById(task.projectId);
    const member = await Member_1.Member.findById(task.assigneeId);
    let assignee = null;
    if (member) {
        const user = await User_1.User.findById(member.userId);
        if (user) {
            assignee = {
                $id: member._id.toString(),
                name: user.name,
                email: user.email,
                userId: member.userId.toString(),
                workspaceId: member.workspaceId.toString(),
                role: member.role
            };
        }
    }
    return ctx.json({
        data: {
            $id: task._id.toString(),
            name: task.name,
            status: task.status,
            position: task.position,
            dueDate: task.dueDate.toISOString(),
            description: task.description,
            workspaceId: task.workspaceId.toString(),
            projectId: task.projectId.toString(),
            assigneeId: task.assigneeId.toString(),
            project: project ? {
                $id: project._id.toString(),
                name: project.name,
                imageUrl: project.imageUrl,
                workspaceId: project.workspaceId.toString()
            } : null,
            assignee,
        },
    });
})
    .post('/', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('json', schema_1.createTaskSchema), async (ctx) => {
    const user = ctx.get('user');
    const { name, status, workspaceId, projectId, dueDate, assigneeId } = ctx.req.valid('json');
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    const highestPositionTask = await Task_1.Task.findOne({
        status,
        workspaceId,
    }).sort({ position: -1 });
    const newPosition = highestPositionTask ? highestPositionTask.position + 1000 : 1000;
    const task = await Task_1.Task.create({
        name,
        status,
        workspaceId,
        projectId,
        dueDate: new Date(dueDate),
        assigneeId,
        position: newPosition,
    });
    return ctx.json({ data: { $id: task._id.toString(), ...task.toObject() } });
})
    .patch('/:taskId', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('json', schema_1.createTaskSchema.partial()), async (ctx) => {
    const user = ctx.get('user');
    const { name, status, description, projectId, dueDate, assigneeId } = ctx.req.valid('json');
    const { taskId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const existingTask = await Task_1.Task.findById(taskId);
    if (!existingTask) {
        return ctx.json({ error: 'Task not found' }, 404);
    }
    const member = await (0, utils_1.getMember)({
        workspaceId: existingTask.workspaceId.toString(),
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    const updateData = {
        name,
        status,
        projectId,
        assigneeId,
        description,
    };
    if (dueDate)
        updateData.dueDate = new Date(dueDate);
    const task = await Task_1.Task.findByIdAndUpdate(taskId, updateData, { new: true });
    return ctx.json({ data: { $id: task?._id.toString(), ...task?.toObject() } });
})
    .post('/bulk-update', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('json', zod_1.z.object({
    tasks: zod_1.z.array(zod_1.z.object({
        $id: zod_1.z.string(),
        status: zod_1.z.nativeEnum(types_1.TaskStatus),
        position: zod_1.z.number().int().positive().min(1000).max(1_00_000),
    })),
})), async (ctx) => {
    const user = ctx.get('user');
    const { tasks } = ctx.req.valid('json');
    await (0, mongoose_1.default)();
    const taskIds = tasks.map((task) => task.$id);
    const tasksToUpdate = await Task_1.Task.find({ _id: { $in: taskIds } });
    const workspaceIds = new Set(tasksToUpdate.map((task) => task.workspaceId.toString()));
    if (workspaceIds.size !== 1) {
        return ctx.json({ error: 'All tasks must belong to the same workspace.' }, 401);
    }
    const workspaceId = workspaceIds.values().next().value;
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    const updatedTasks = await Promise.all(tasks.map(async (task) => {
        const { $id, status, position } = task;
        const updated = await Task_1.Task.findByIdAndUpdate($id, { status, position }, { new: true });
        return updated;
    }));
    return ctx.json({ data: { updatedTasks, workspaceId } });
})
    .delete('/:taskId', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { taskId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const task = await Task_1.Task.findById(taskId);
    if (!task) {
        return ctx.json({ error: 'Task not found' }, 404);
    }
    const member = await (0, utils_1.getMember)({
        workspaceId: task.workspaceId.toString(),
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    await Task_1.Task.findByIdAndDelete(taskId);
    return ctx.json({ data: { $id: taskId, workspaceId: task.workspaceId.toString(), projectId: task.projectId.toString() } });
});
exports.default = app;
