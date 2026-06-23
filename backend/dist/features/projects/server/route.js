"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_validator_1 = require("@hono/zod-validator");
const date_fns_1 = require("date-fns");
const hono_1 = require("hono");
const zod_1 = require("zod");
const utils_1 = require("../../members/utils");
const schema_1 = require("../schema");
const types_1 = require("../../tasks/types");
const session_middleware_1 = require("../../../lib/session-middleware");
const mongoose_1 = __importDefault(require("../../../lib/mongoose"));
const Project_1 = require("../../../models/Project");
const Task_1 = require("../../../models/Task");
const app = new hono_1.Hono()
    .post('/', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('form', schema_1.createProjectSchema), async (ctx) => {
    const user = ctx.get('user');
    const { name, image, workspaceId } = ctx.req.valid('form');
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    let uploadedImageId = undefined;
    if (image instanceof File) {
        const arrayBuffer = await image.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        uploadedImageId = `data:${image.type};base64,${base64}`;
    }
    else {
        uploadedImageId = image;
    }
    const project = await Project_1.Project.create({
        name,
        imageUrl: uploadedImageId,
        workspaceId,
    });
    return ctx.json({ data: { $id: project._id.toString(), ...project.toObject() } });
})
    .get('/', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('query', zod_1.z.object({
    workspaceId: zod_1.z.string(),
})), async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.valid('query');
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    const projects = await Project_1.Project.find({ workspaceId }).sort({ createdAt: -1 });
    return ctx.json({
        data: {
            documents: projects.map(p => ({
                $id: p._id.toString(),
                name: p.name,
                imageUrl: p.imageUrl,
                workspaceId: p.workspaceId.toString(),
            })),
            total: projects.length,
        },
    });
})
    .get('/:projectId', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { projectId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const project = await Project_1.Project.findById(projectId);
    if (!project) {
        return ctx.json({ error: 'Not found.' }, 404);
    }
    const member = await (0, utils_1.getMember)({
        workspaceId: project.workspaceId.toString(),
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({
            error: 'Unauthorized.',
        }, 401);
    }
    return ctx.json({
        data: {
            $id: project._id.toString(),
            name: project.name,
            imageUrl: project.imageUrl,
            workspaceId: project.workspaceId.toString()
        },
    });
})
    .patch('/:projectId', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('form', schema_1.updateProjectSchema), async (ctx) => {
    const user = ctx.get('user');
    const { projectId } = ctx.req.param();
    const { name, image } = ctx.req.valid('form');
    await (0, mongoose_1.default)();
    const existingProject = await Project_1.Project.findById(projectId);
    if (!existingProject) {
        return ctx.json({ error: 'Not found.' }, 404);
    }
    const member = await (0, utils_1.getMember)({
        workspaceId: existingProject.workspaceId.toString(),
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({
            error: 'Unauthorized.',
        }, 401);
    }
    let uploadedImageId = undefined;
    if (image instanceof File) {
        const arrayBuffer = await image.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        uploadedImageId = `data:${image.type};base64,${base64}`;
    }
    else {
        uploadedImageId = image;
    }
    const updateData = { name };
    if (uploadedImageId !== undefined) {
        updateData.imageUrl = uploadedImageId;
    }
    const project = await Project_1.Project.findByIdAndUpdate(projectId, updateData, { new: true });
    return ctx.json({ data: { $id: project?._id.toString(), ...project?.toObject() } });
})
    .delete('/:projectId', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { projectId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const existingProject = await Project_1.Project.findById(projectId);
    if (!existingProject) {
        return ctx.json({ error: 'Not found.' }, 404);
    }
    const member = await (0, utils_1.getMember)({
        workspaceId: existingProject.workspaceId.toString(),
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    await Task_1.Task.deleteMany({ projectId });
    await Project_1.Project.findByIdAndDelete(projectId);
    return ctx.json({ data: { $id: projectId, workspaceId: existingProject.workspaceId.toString() } });
})
    .get('/:projectId/analytics', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { projectId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const project = await Project_1.Project.findById(projectId);
    if (!project) {
        return ctx.json({ error: 'Not found.' }, 404);
    }
    const member = await (0, utils_1.getMember)({
        workspaceId: project.workspaceId.toString(),
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    const now = new Date();
    const thisMonthStart = (0, date_fns_1.startOfMonth)(now);
    const thisMonthEnd = (0, date_fns_1.endOfMonth)(now);
    const lastMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
    const lastMonthEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 1));
    const thisMonthTasks = await Task_1.Task.countDocuments({
        projectId,
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthTasks = await Task_1.Task.countDocuments({
        projectId,
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const taskCount = thisMonthTasks;
    const taskDifference = taskCount - lastMonthTasks;
    const thisMonthAssignedTasks = await Task_1.Task.countDocuments({
        projectId,
        assigneeId: member._id,
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthAssignedTasks = await Task_1.Task.countDocuments({
        projectId,
        assigneeId: member._id,
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const assignedTaskCount = thisMonthAssignedTasks;
    const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks;
    const thisMonthIncompleteTasks = await Task_1.Task.countDocuments({
        projectId,
        status: { $ne: types_1.TaskStatus.DONE },
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthIncompleteTasks = await Task_1.Task.countDocuments({
        projectId,
        status: { $ne: types_1.TaskStatus.DONE },
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const incompleteTaskCount = thisMonthIncompleteTasks;
    const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks;
    const thisMonthCompletedTasks = await Task_1.Task.countDocuments({
        projectId,
        status: types_1.TaskStatus.DONE,
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthCompletedTasks = await Task_1.Task.countDocuments({
        projectId,
        status: types_1.TaskStatus.DONE,
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const completedTaskCount = thisMonthCompletedTasks;
    const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks;
    const thisMonthOverdueTasks = await Task_1.Task.countDocuments({
        projectId,
        status: { $ne: types_1.TaskStatus.DONE },
        dueDate: { $lt: now },
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthOverdueTasks = await Task_1.Task.countDocuments({
        projectId,
        status: { $ne: types_1.TaskStatus.DONE },
        dueDate: { $lt: now },
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const overdueTaskCount = thisMonthOverdueTasks;
    const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks;
    return ctx.json({
        data: {
            taskCount,
            taskDifference,
            assignedTaskCount,
            assignedTaskDifference,
            completedTaskCount,
            completedTaskDifference,
            incompleteTaskCount,
            incompleteTaskDifference,
            overdueTaskCount,
            overdueTaskDifference,
        },
    });
});
exports.default = app;
