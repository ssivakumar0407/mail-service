import { Document, Model, model, Schema } from 'mongoose';

export interface CompanySchema extends Document {
    company_name?: string;
    address?: string;
    country?: string;
    city?: string;
    email?: string;
    mobile?: string;
    websiteUrl?: string;
    contactPerson?: string;
    state?: string;
    postalCode?: string;
    phoneNo?: string;
}

const companySchema: Schema<CompanySchema> = new Schema<CompanySchema>({
    company_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    websiteUrl: {
        type: String,
        required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
});

export const CompanyModel: Model<CompanySchema> = model<CompanySchema>('company_details', companySchema);
