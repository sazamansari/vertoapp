import mongoose from 'mongoose';

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskComplexity {
  SIMPLE = 'SIMPLE',
  MODERATE = 'MODERATE',
  COMPLEX = 'COMPLEX',
}

export interface ITask extends mongoose.Document {
  name: string;
  status: TaskStatus;
  workspaceId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  position: number;
  dueDate?: Date;
  assigneeId: mongoose.Types.ObjectId;
  description?: string;
  // PredictFlow AI fields
  priority?: TaskPriority;
  complexity?: TaskComplexity;
  storyPoints?: number;
  labels?: string[];
  subtasks?: string[];
  watchers?: mongoose.Types.ObjectId[];
  dependencies?: mongoose.Types.ObjectId[];
  estimatedHours?: number;
  loggedHours?: number;
  completionPrediction?: number;
  riskScore?: number;
  customFields?: Record<string, any>;
}

const TaskSchema = new mongoose.Schema<ITask>(
  {
    name: { type: String, required: true },
    status: { type: String, enum: Object.values(TaskStatus), required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    position: { type: Number, required: true },
    dueDate: { type: Date },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    description: { type: String },
    // PredictFlow AI fields
    priority: { type: String, enum: Object.values(TaskPriority), default: TaskPriority.NONE },
    complexity: { type: String, enum: Object.values(TaskComplexity) },
    storyPoints: { type: Number, min: 0 },
    labels: [{ type: String }],
    subtasks: [{ type: String }],
    watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    estimatedHours: { type: Number, min: 0 },
    loggedHours: { type: Number, min: 0, default: 0 },
    completionPrediction: { type: Number, min: 0, max: 100 },
    riskScore: { type: Number, min: 0, max: 100 },
    customFields: { type: Map, of: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes for performance
TaskSchema.index({ workspaceId: 1, status: 1 });
TaskSchema.index({ workspaceId: 1, projectId: 1 });
TaskSchema.index({ workspaceId: 1, assigneeId: 1 });
TaskSchema.index({ dueDate: 1, status: 1 });

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
