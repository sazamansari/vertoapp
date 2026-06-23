"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMember = exports.deleteMember = exports.getMembers = void 0;
const mongoose_1 = __importDefault(require("../lib/mongoose"));
const Member_1 = require("../models/Member");
const User_1 = require("../models/User");
const types_1 = require("../features/members/types");
const getMember = async (workspaceId, userId) => Member_1.Member.findOne({ workspaceId, userId });
// GET /api/members?workspaceId=
const getMembers = async (req, res) => {
    try {
        const { workspaceId } = req.query;
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
        const members = await Member_1.Member.find({ workspaceId }).lean();
        const users = await User_1.User.find({ _id: { $in: members.map((m) => m.userId) } }).lean();
        const populated = members.map((m) => {
            const u = users.find((u) => u._id.toString() === m.userId.toString());
            return { $id: m._id.toString(), userId: m.userId.toString(), workspaceId: m.workspaceId.toString(), role: m.role, name: u?.name, email: u?.email };
        });
        res.json({ data: { documents: populated, total: populated.length } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getMembers = getMembers;
// DELETE /api/members/:memberId
const deleteMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        await (0, mongoose_1.default)();
        const memberToDelete = await Member_1.Member.findById(memberId);
        if (!memberToDelete) {
            res.status(404).json({ error: 'Not found.' });
            return;
        }
        const total = await Member_1.Member.countDocuments({ workspaceId: memberToDelete.workspaceId });
        if (total === 1) {
            res.status(400).json({ error: 'Cannot delete the only member.' });
            return;
        }
        const requestingMember = await getMember(memberToDelete.workspaceId.toString(), req.user._id.toString());
        if (!requestingMember) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        if (requestingMember._id.toString() !== memberToDelete._id.toString() && requestingMember.role !== types_1.MemberRole.ADMIN) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        await Member_1.Member.findByIdAndDelete(memberId);
        res.json({ data: { $id: memberId, workspaceId: memberToDelete.workspaceId.toString() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.deleteMember = deleteMember;
// PATCH /api/members/:memberId
const updateMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { role } = req.body;
        await (0, mongoose_1.default)();
        const memberToUpdate = await Member_1.Member.findById(memberId);
        if (!memberToUpdate) {
            res.status(404).json({ error: 'Not found.' });
            return;
        }
        const total = await Member_1.Member.countDocuments({ workspaceId: memberToUpdate.workspaceId });
        if (total === 1) {
            res.status(400).json({ error: 'Cannot downgrade the only member.' });
            return;
        }
        const requestingMember = await getMember(memberToUpdate.workspaceId.toString(), req.user._id.toString());
        if (!requestingMember || requestingMember.role !== types_1.MemberRole.ADMIN) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        await Member_1.Member.findByIdAndUpdate(memberId, { role });
        res.json({ data: { $id: memberId, workspaceId: memberToUpdate.workspaceId.toString() } });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.updateMember = updateMember;
//# sourceMappingURL=member.controller.js.map