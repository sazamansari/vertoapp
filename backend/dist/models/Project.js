"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ProjectSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String },
    workspaceId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
}, { timestamps: true });
exports.Project = mongoose_1.default.models.Project || mongoose_1.default.model('Project', ProjectSchema);
//# sourceMappingURL=Project.js.map