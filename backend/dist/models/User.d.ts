import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password?: string;
}
export declare const User: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=User.d.ts.map