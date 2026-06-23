import mongoose from 'mongoose';
export declare enum TaskStatus {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE = "DONE"
}
export declare enum TaskPriority {
    NONE = "NONE",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum TaskComplexity {
    SIMPLE = "SIMPLE",
    MODERATE = "MODERATE",
    COMPLEX = "COMPLEX"
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
export declare const Task: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=Task.d.ts.map