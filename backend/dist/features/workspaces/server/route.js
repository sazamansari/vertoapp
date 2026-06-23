"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_validator_1 = require("@hono/zod-validator");
const date_fns_1 = require("date-fns");
const hono_1 = require("hono");
const zod_1 = require("zod");
const types_1 = require("../../members/types");
const utils_1 = require("../../members/utils");
const types_2 = require("../../tasks/types");
const schema_1 = require("../schema");
const session_middleware_1 = require("../../../lib/session-middleware");
const utils_2 = require("../../../lib/utils");
const mongoose_1 = __importDefault(require("../../../lib/mongoose"));
const Workspace_1 = require("../../../models/Workspace");
const Member_1 = require("../../../models/Member");
const Project_1 = require("../../../models/Project");
const Task_1 = require("../../../models/Task");
const app = new hono_1.Hono()
    .get('/', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    await (0, mongoose_1.default)();
    const members = await Member_1.Member.find({ userId: user._id });
    if (members.length === 0)
        return ctx.json({ data: { documents: [], total: 0 } });
    const workspaceIds = members.map((member) => member.workspaceId);
    const workspaces = await Workspace_1.Workspace.find({ _id: { $in: workspaceIds } }).sort({ createdAt: -1 });
    return ctx.json({
        data: {
            documents: workspaces.map(w => ({
                $id: w._id.toString(),
                name: w.name,
                imageUrl: w.imageUrl,
                inviteCode: w.inviteCode,
                userId: w.userId.toString()
            })),
            total: workspaces.length,
        },
    });
})
    .post('/', (0, zod_validator_1.zValidator)('form', schema_1.createWorkspaceSchema), session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { name, image } = ctx.req.valid('form');
    let uploadedImageId = undefined;
    if (image instanceof File) {
        const arrayBuffer = await image.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        uploadedImageId = `data:${image.type};base64,${base64}`;
    }
    else {
        uploadedImageId = image;
    }
    await (0, mongoose_1.default)();
    const workspace = await Workspace_1.Workspace.create({
        name,
        userId: user._id,
        imageUrl: uploadedImageId,
        inviteCode: (0, utils_2.generateInviteCode)(6),
    });
    await Member_1.Member.create({
        userId: user._id,
        workspaceId: workspace._id,
        role: types_1.MemberRole.ADMIN,
    });
    return ctx.json({ data: { $id: workspace._id.toString(), ...workspace.toObject() } });
})
    .get('/:workspaceId', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({
            error: 'Unauthorized.',
        }, 401);
    }
    const workspace = await Workspace_1.Workspace.findById(workspaceId);
    if (!workspace) {
        return ctx.json({ error: 'Not found.' }, 404);
    }
    return ctx.json({
        data: {
            $id: workspace._id.toString(),
            name: workspace.name,
            imageUrl: workspace.imageUrl,
            inviteCode: workspace.inviteCode,
            userId: workspace.userId.toString()
        },
    });
})
    .get('/:workspaceId/info', session_middleware_1.sessionMiddleware, async (ctx) => {
    const { workspaceId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const workspace = await Workspace_1.Workspace.findById(workspaceId);
    if (!workspace) {
        return ctx.json({ error: 'Not found.' }, 404);
    }
    return ctx.json({
        data: {
            $id: workspace._id.toString(),
            name: workspace.name,
            imageUrl: workspace.imageUrl,
        },
    });
})
    .patch('/:workspaceId', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('form', schema_1.updateWorkspaceSchema), async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();
    const { name, image } = ctx.req.valid('form');
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member || member.role !== types_1.MemberRole.ADMIN) {
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
    const workspace = await Workspace_1.Workspace.findByIdAndUpdate(workspaceId, updateData, { new: true });
    return ctx.json({ data: { $id: workspace?._id.toString(), ...workspace?.toObject() } });
})
    .delete('/:workspaceId', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member || member.role !== types_1.MemberRole.ADMIN) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    await Member_1.Member.deleteMany({ workspaceId });
    await Project_1.Project.deleteMany({ workspaceId });
    await Task_1.Task.deleteMany({ workspaceId });
    await Workspace_1.Workspace.findByIdAndDelete(workspaceId);
    return ctx.json({ data: { $id: workspaceId } });
})
    .post('/:workspaceId/resetInviteCode', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (!member || member.role !== types_1.MemberRole.ADMIN) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
    }
    const workspace = await Workspace_1.Workspace.findByIdAndUpdate(workspaceId, {
        inviteCode: (0, utils_2.generateInviteCode)(6),
    }, { new: true });
    return ctx.json({ data: { $id: workspace?._id.toString(), ...workspace?.toObject() } });
})
    .post('/:workspaceId/join', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('json', zod_1.z.object({
    code: zod_1.z.string(),
})), async (ctx) => {
    const { workspaceId } = ctx.req.param();
    const { code } = ctx.req.valid('json');
    const user = ctx.get('user');
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
        userId: user._id.toString(),
    });
    if (member) {
        return ctx.json({ error: 'Already a member.' }, 400);
    }
    const workspace = await Workspace_1.Workspace.findById(workspaceId);
    if (!workspace || workspace.inviteCode !== code) {
        return ctx.json({ error: 'Invalid invite code.' }, 400);
    }
    await Member_1.Member.create({
        workspaceId,
        userId: user._id,
        role: types_1.MemberRole.MEMBER,
    });
    return ctx.json({ data: { $id: workspace._id.toString(), ...workspace.toObject() } });
})
    .get('/:workspaceId/analytics', session_middleware_1.sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();
    await (0, mongoose_1.default)();
    const member = await (0, utils_1.getMember)({
        workspaceId,
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
        workspaceId,
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthTasks = await Task_1.Task.countDocuments({
        workspaceId,
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const taskCount = thisMonthTasks;
    const taskDifference = taskCount - lastMonthTasks;
    const thisMonthAssignedTasks = await Task_1.Task.countDocuments({
        workspaceId,
        assigneeId: member._id,
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthAssignedTasks = await Task_1.Task.countDocuments({
        workspaceId,
        assigneeId: member._id,
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const assignedTaskCount = thisMonthAssignedTasks;
    const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks;
    const thisMonthIncompleteTasks = await Task_1.Task.countDocuments({
        workspaceId,
        status: { $ne: types_2.TaskStatus.DONE },
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthIncompleteTasks = await Task_1.Task.countDocuments({
        workspaceId,
        status: { $ne: types_2.TaskStatus.DONE },
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const incompleteTaskCount = thisMonthIncompleteTasks;
    const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks;
    const thisMonthCompletedTasks = await Task_1.Task.countDocuments({
        workspaceId,
        status: types_2.TaskStatus.DONE,
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthCompletedTasks = await Task_1.Task.countDocuments({
        workspaceId,
        status: types_2.TaskStatus.DONE,
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const completedTaskCount = thisMonthCompletedTasks;
    const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks;
    const thisMonthOverdueTasks = await Task_1.Task.countDocuments({
        workspaceId,
        status: { $ne: types_2.TaskStatus.DONE },
        dueDate: { $lt: now },
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd }
    });
    const lastMonthOverdueTasks = await Task_1.Task.countDocuments({
        workspaceId,
        status: { $ne: types_2.TaskStatus.DONE },
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
