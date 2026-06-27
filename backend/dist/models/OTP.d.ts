import mongoose from 'mongoose';
export interface IOTP extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    otp: string;
    expiresAt: Date;
    attempts: number;
    createdAt: Date;
}
export declare const OTP: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=OTP.d.ts.map