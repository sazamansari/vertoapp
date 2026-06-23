"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_validator_1 = require("@hono/zod-validator");
const hono_1 = require("hono");
const zod_1 = require("zod");
const types_1 = require("../types");
const utils_1 = require("../utils");
const session_middleware_1 = require("../../../lib/session-middleware");
const mongoose_1 = __importDefault(require("../../../lib/mongoose"));
const Member_1 = require("../../../models/Member");
const User_1 = require("../../../models/User");
const app = new hono_1.Hono()
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
    const members = await Member_1.Member.find({ workspaceId });
    const userIds = members.map(m => m.userId);
    const users = await User_1.User.find({ _id: { $in: userIds } });
    const populatedMembers = members.map((m) => {
        const userDoc = users.find(u => u._id.toString() === m.userId.toString());
        return {
            $id: m._id.toString(),
            userId: m.userId.toString(),
            workspaceId: m.workspaceId.toString(),
            role: m.role,
            name: userDoc?.name,
            email: userDoc?.email,
        };
    });
    return ctx.json({
        data: {
            documents: populatedMembers,
            total: populatedMembers.length,
        },
    });
})
    .delete('/:memberId', session_middleware_1.sessionMiddleware, async (ctx) => {
    const { memberId } = ctx.req.param();
    const user = ctx.get('user');
    await (0, mongoose_1.default)();
    const memberToDelete = await Member_1.Member.findById(memberId);
    if (!memberToDelete) {
        return ctx.json({ error: 'Not found.' }, 404);
    }
    const allMembersInWorkspace = await Member_1.Member.countDocuments({
        workspaceId: memberToDelete.workspaceId,
    });
    if (allMembersInWorkspace === 1) {
        return ctx.json({
            error: 'Cannot delete the only member.',
        }, 400);
    }
    const member = await (0, utils_1.getMember)({
        workspaceId: memberToDelete.workspaceId.toString(),
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({
            error: 'Unauthorized.',
        }, 401);
    }
    if (member._id.toString() !== memberToDelete._id.toString() && member.role !== types_1.MemberRole.ADMIN) {
        return ctx.json({
            error: 'Unauthorized.',
        }, 401);
    }
    await Member_1.Member.findByIdAndDelete(memberId);
    return ctx.json({ data: { $id: memberId, workspaceId: memberToDelete.workspaceId.toString() } });
})
    .patch('/:memberId', session_middleware_1.sessionMiddleware, (0, zod_validator_1.zValidator)('json', zod_1.z.object({
    role: zod_1.z.nativeEnum(types_1.MemberRole),
})), async (ctx) => {
    const { memberId } = ctx.req.param();
    const { role } = ctx.req.valid('json');
    const user = ctx.get('user');
    await (0, mongoose_1.default)();
    const memberToUpdate = await Member_1.Member.findById(memberId);
    if (!memberToUpdate) {
        return ctx.json({ error: 'Not found.' }, 404);
    }
    const allMembersInWorkspace = await Member_1.Member.countDocuments({
        workspaceId: memberToUpdate.workspaceId,
    });
    if (allMembersInWorkspace === 1) {
        return ctx.json({
            error: 'Cannot downgrade the only member.',
        }, 400);
    }
    const member = await (0, utils_1.getMember)({
        workspaceId: memberToUpdate.workspaceId.toString(),
        userId: user._id.toString(),
    });
    if (!member) {
        return ctx.json({
            error: 'Unauthorized.',
        }, 401);
    }
    if (member.role !== types_1.MemberRole.ADMIN) {
        return ctx.json({
            error: 'Unauthorized.',
        }, 401);
    }
    await Member_1.Member.findByIdAndUpdate(memberId, { role });
    return ctx.json({ data: { $id: memberId, workspaceId: memberToUpdate.workspaceId.toString() } });
});
exports.default = app;
