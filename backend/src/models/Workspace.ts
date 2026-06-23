import mongoose from 'mongoose';

export interface IWorkspace extends mongoose.Document {
  name: string;
  imageUrl?: string;
  inviteCode: string;
  userId: mongoose.Types.ObjectId;
}

const WorkspaceSchema = new mongoose.Schema<IWorkspace>(
  {
    name: { type: String, required: true },
    imageUrl: { type: String },
    inviteCode: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Workspace = mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
