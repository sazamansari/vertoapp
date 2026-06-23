"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.TaskComplexity = exports.TaskPriority = exports.TaskStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["BACKLOG"] = "BACKLOG";
    TaskStatus["TODO"] = "TODO";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["IN_REVIEW"] = "IN_REVIEW";
    TaskStatus["DONE"] = "DONE";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["NONE"] = "NONE";
    TaskPriority["LOW"] = "LOW";
    TaskPriority["MEDIUM"] = "MEDIUM";
    TaskPriority["HIGH"] = "HIGH";
    TaskPriority["URGENT"] = "URGENT";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskComplexity;
(function (TaskComplexity) {
    TaskComplexity["SIMPLE"] = "SIMPLE";
    TaskComplexity["MODERATE"] = "MODERATE";
    TaskComplexity["COMPLEX"] = "COMPLEX";
})(TaskComplexity || (exports.TaskComplexity = TaskComplexity = {}));
const TaskSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: Object.values(TaskStatus), required: true },
    workspaceId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    projectId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Project', required: true },
    position: { type: Number, required: true },
    dueDate: { type: Date },
    assigneeId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Member', required: true },
    description: { type: String },
    // PredictFlow AI fields
    priority: { type: String, enum: Object.values(TaskPriority), default: TaskPriority.NONE },
    complexity: { type: String, enum: Object.values(TaskComplexity) },
    storyPoints: { type: Number, min: 0 },
    labels: [{ type: String }],
    subtasks: [{ type: String }],
    watchers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    dependencies: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Task' }],
    estimatedHours: { type: Number, min: 0 },
    loggedHours: { type: Number, min: 0, default: 0 },
    completionPrediction: { type: Number, min: 0, max: 100 },
    riskScore: { type: Number, min: 0, max: 100 },
    customFields: { type: Map, of: mongoose_1.default.Schema.Types.Mixed },
}, { timestamps: true });
// Indexes for performance
TaskSchema.index({ workspaceId: 1, status: 1 });
TaskSchema.index({ workspaceId: 1, projectId: 1 });
TaskSchema.index({ workspaceId: 1, assigneeId: 1 });
TaskSchema.index({ dueDate: 1, status: 1 });
exports.Task = mongoose_1.default.models.Task || mongoose_1.default.model('Task', TaskSchema);
//# sourceMappingURL=Task.js.map