"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = exports.MemberRole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var MemberRole;
(function (MemberRole) {
    MemberRole["ADMIN"] = "ADMIN";
    MemberRole["MEMBER"] = "MEMBER";
})(MemberRole || (exports.MemberRole = MemberRole = {}));
const MemberSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    role: { type: String, enum: Object.values(MemberRole), default: MemberRole.MEMBER, required: true },
}, { timestamps: true });
exports.Member = mongoose_1.default.models.Member || mongoose_1.default.model('Member', MemberSchema);
//# sourceMappingURL=Member.js.map