/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { compare, genSalt, hash } from 'bcrypt';
import { NextFunction } from 'express';
import { Document, Model, model, Schema } from 'mongoose';

export interface EmployeeSchema extends Document {
    name?: string;
    designation?: string;
    password?: string;
    employeeId?: string;
    phone?: string;
    email?: string;
    dob?: Date;
    address?: string;
    gender?: string;
    skills?: string;
    educationInformation?: string;
    experience?: string;
}

const employeeSchema: Schema<EmployeeSchema> = new Schema<EmployeeSchema>({
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    dob: {
        type: Date,
        require: true,
    },
    address: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['MALE', 'FEMALE'],
        default: 'MALE',
    },
    skills: {
        type: String,
    },
    educationInformation: {
        type: String,
    },
    experience: {
        type: String,
    },
});

employeeSchema.pre('save', async function (next: NextFunction) {
    try {
        if (this.isNew) {
            const salt: string = await genSalt(10);
            const hashedPassword: string = await hash((this as any).password, salt);
            (this as any).password = hashedPassword;
        }
        next();
    } catch (error: any) {
        next(error);
    }
});

employeeSchema.methods.isValidPassword = async function (password: any) {
    try {
        return await compare(password, (this as any).password);
    } catch (error: any) {
        throw error;
    }
};

export const EmployeeModel: Model<EmployeeSchema> = model<EmployeeSchema>('employee_List', employeeSchema);
