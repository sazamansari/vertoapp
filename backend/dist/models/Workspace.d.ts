import mongoose from 'mongoose';
export interface IWorkspace extends mongoose.Document {
    name: string;
    imageUrl?: string;
    inviteCode: string;
    userId: mongoose.Types.ObjectId;
}
export declare const Workspace: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=Workspace.d.ts.map