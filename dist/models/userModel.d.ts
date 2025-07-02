import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, any>;
export declare const connectDB: () => Promise<void>;
//# sourceMappingURL=userModel.d.ts.map