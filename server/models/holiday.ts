import { Document, Model, model, Schema } from 'mongoose';

export interface HolidaySchema extends Document {
    name?: string;
    holidayCode?: number;
    date?: Date;
}

const holidaySchema: Schema<HolidaySchema> = new Schema<HolidaySchema>({
    name: {
        type: String,
        required: true,
    },
    holidayCode: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        require: false,
        default: Date.now,
    },
});

export const HolidayModel: Model<HolidaySchema> = model<HolidaySchema>('holiday_List', holidaySchema);
