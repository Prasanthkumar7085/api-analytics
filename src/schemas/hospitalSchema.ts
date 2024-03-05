import { Schema, model } from "mongoose";
import { HOSPITAL_STATUS } from "src/constants/lisConstants";


const reportingSettings = new Schema(
    {
        case_type: {
            type: String,
        },
        service: {
            type: String,
        },
        report_template: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const sentStatus = new Schema(
    {
        status: {
            type: Boolean,
        },
        for_all_case_types: {
            type: Boolean,
        },
        for_specific_case_types: [
            {
                type: String,
            },
        ],
    },
    {
        _id: false,
    }
);
const patientReportSettings = new Schema(
    {
        send_finalized_report_to_patient: {
            type: Boolean,
        },
        sms_sending_data: sentStatus,
        email_sending_data: sentStatus,
    },
    {
        _id: false,
    }
);
const hospitalSettings = new Schema(
    {
        auto_fax: {
            type: Boolean,
        },
        email_notifications: {
            type: Boolean,
        },
        daily_statistics: {
            type: Boolean,
            default: false,
        },
        is_labdaq: {
            type: Boolean,
        },
        patient_report_settings: patientReportSettings,
        reporting_settings: [reportingSettings],
    },
    {
        _id: false,
    }
);

export const HospitalSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
        },
        address_line_1: {
            type: String,
        },

        address_line_2: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
        country: {
            type: String,
        },
        status: {
            type: String,
            default: "ACTIVE",
            enum: HOSPITAL_STATUS,
        },
        npi: {
            type: String,
            required: true,
        },
        physicians: {
            type: [Schema.Types.ObjectId],
            ref: "Physician",
        },
        patients: {
            type: [Schema.Types.ObjectId],
            ref: "Patients",
        },
        locations: {
            type: [Schema.Types.ObjectId],
            ref: "HospitalLocation",
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        updated_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        deleted_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        fax: {
            type: String,
        },
        marketers_count: {
            type: String,
        },
        lab: {
            type: Schema.Types.ObjectId,
            ref: "Lab",
        },
        labdaq_code: {
            type: String,
        },
        settings: hospitalSettings,
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        versionKey: false,
    }
);

HospitalSchema.index(
    {
        lab: 1,
    },
    {
        background: true,
    }
);
export const HospitalModel = model("Hospital", HospitalSchema, "hospitals");
