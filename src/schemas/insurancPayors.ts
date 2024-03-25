import * as mongoose from 'mongoose';
import { Schema, model } from 'mongoose';


const InsuranceSchema = new Schema(
    {
        _id: { type: String },
        name: { type: String }
    }
)

export const InsuranceModel = mongoose.model<any>('Insurance', InsuranceSchema, 'insurance_payors')