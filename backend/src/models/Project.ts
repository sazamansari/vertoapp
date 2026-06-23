import mongoose from 'mongoose';

export interface IProject extends mongoose.Document {
  name: string;
  imageUrl?: string;
  workspaceId: mongoose.Types.ObjectId;
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    name: { type: String, required: true },
    imageUrl: { type: String },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
