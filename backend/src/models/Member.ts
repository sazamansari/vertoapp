import mongoose from 'mongoose';

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface IMember extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  role: MemberRole;
}

const MemberSchema = new mongoose.Schema<IMember>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    role: { type: String, enum: Object.values(MemberRole), default: MemberRole.MEMBER, required: true },
  },
  { timestamps: true }
);

export const Member = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);
