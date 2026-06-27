import mongoose from 'mongoose';
export interface INotification extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
}
export declare const Notification: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=Notification.d.ts.map