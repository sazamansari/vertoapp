"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspace = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const WorkspaceSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String },
    inviteCode: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.Workspace = mongoose_1.default.models.Workspace || mongoose_1.default.model('Workspace', WorkspaceSchema);
//# sourceMappingURL=Workspace.js.map