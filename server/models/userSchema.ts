import { Document, Model, model, Schema } from 'mongoose';

export interface UserSchema extends Document {
    firstName: string;
    lastName: string;
    registeredTime?: Date;
}

const userSchema: Schema<UserSchema> = new Schema<UserSchema>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    registeredTime: {
        type: Date,
        require: false,
        default: Date.now,
    },
});

export const UserModel: Model<UserSchema> = model<UserSchema>('users', userSchema);
