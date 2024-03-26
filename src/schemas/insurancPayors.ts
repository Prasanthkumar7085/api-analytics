import { Schema, model } from 'mongoose'

export const insurancePayorsSchema = new Schema({
    payor_electronic_id: {
        type: String
    },
    insurance_verification_code: {
        type: String
    },
    name: {
        type: String
    },
    health_insurance_type: {
        type: String
    },
    primary_claim_filling_method: {
        type: String
    },
    secondary_claim_filling_method: {
        type: String
    },
    status: {
        type: String,
        default: 'ACTIVE'
    }
})

export const InsurancePayorsModel = model('Insurance_Payors', insurancePayorsSchema, 'insurance_payors')