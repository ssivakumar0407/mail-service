import { Document, Model, model, Schema } from 'mongoose';

export interface UserDetailsSchema extends Document {
    userGroupName?: string;
    userGroupCode?: number;
}

const userSchema: Schema<UserDetailsSchema> = new Schema<UserDetailsSchema>({
    userGroupName: {
        type: String,
        required: true,
    },
    userGroupCode: {
        type: Number,
        required: true,
    },
});

export const UserDetailsModel: Model<UserDetailsSchema> = model<UserDetailsSchema>('users_Group', userSchema);
