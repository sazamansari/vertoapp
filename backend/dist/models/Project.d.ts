import mongoose from 'mongoose';
export interface IProject extends mongoose.Document {
    name: string;
    imageUrl?: string;
    workspaceId: mongoose.Types.ObjectId;
}
export declare const Project: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=Project.d.ts.map