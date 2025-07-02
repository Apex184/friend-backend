import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const connectDB: () => Promise<void>;
//# sourceMappingURL=userModel.d.ts.map