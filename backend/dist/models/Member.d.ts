import mongoose from 'mongoose';
export declare enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export interface IMember extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    role: MemberRole;
}
export declare const Member: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=Member.d.ts.map