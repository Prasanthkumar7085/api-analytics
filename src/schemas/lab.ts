
import { Schema, model, Document } from 'mongoose'

export interface ILab extends Document {
    name: string,
    phone?: string,
    email?: string,
    address_line_1?: string,
    address_line_2?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
    status?: string,
    lab_code?: string,
    address?: string,
    logo?: string,
    report_logo?: string,
    director?: string,
    clia_id?: string,
    website?: string,
    fax?: string,
    labsquire_services_api_key?: string,
    settings?: any,
    timezone?: string,
    supply_request_form_email?: string
    accession_letter?: string
}


const integrationServices = new Schema({
    truemed: {
        type: Boolean,
        default: false
    },
    tsi: {
        type: Boolean,
        default: false
    },
    gened: {
        type: Boolean,
        default: false
    },
}, {
    _id: false
})
const amdDataSchema = new Schema({
    platform: {
        type: String,
        enum: ["API", "WEB"],
        default: "API"
    },
    status: {
        type: Boolean,
        default: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    office_key: {
        type: String
    },
    app_name: {
        type: String
    },
    provider_id: {
        type: String
    },
    timezone: {
        type: Schema.Types.Mixed
    }
})

const billingInfo = new Schema({
    integrations: {
        type: Boolean
    },
    amd: amdDataSchema,
}, {
    _id: false
})

const reportingService = new Schema({
    case_type: {
        type: String
    },
    service: {
        type: String
    },
    credentials: {
        type: Schema.Types.Mixed
    },
    allow_chop_targets: {
        type: Boolean,
        default: false
    },
    report_template_name: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    _id: false
})


const reportingSettings = new Schema({
    barcode_in_reports: [{
        type: String
    }],
    services: [reportingService]
}, {
    _id: false
})

const notificationSettings = new Schema({
    auto_fax: {
        status: {
            type: Boolean
        },
        service: {
            type: String
        },
        credentials: {
            type: Schema.Types.Mixed
        }
    },
    email_notifications: {
        status: {
            type: Boolean
        }
    },
    patient_email: {
        status: {
            type: Boolean
        },
        email_service: {
            type: String
        },
        email_service_key: {
            type: String
        },
        from_email: {
            type: String
        },
        to_email: {
            type: String
        },
        cc: [{
            type: String
        }],
        bcc: [{
            type: String
        }]
    },
    patient_sms: {
        status: {
            type: Boolean
        }
    }
})

const rxntSettings = new Schema({
    facility: {
        type: String
    },
    billing_provider: {
        type: String
    },
    provider: {
        type: String
    },
}, {
    _id: false
})

const labSettingsDataSchema = new Schema({
    billing_info: billingInfo,
    reporting: reportingSettings,
    notifications: notificationSettings,
    integration_services: integrationServices,
    covid_drive_bot_api_key: {
        type: String
    },
    covid_drive_bot_status: {
        type: Boolean,
        default: false
    },
    rxnt_configuration: rxntSettings
}, {
    _id: false
})

export const labConstantFields = {
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    address_line_1: {
        type: String
    },

    address_line_2: {
        type: String
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    },
    country: {
        type: String
    },
    status: {
        type: String
    },
    lab_code: {
        type: String
    },
    address: {
        type: String
    },
    logo: {
        type: String
    },
    report_logo: {
        type: String
    },
    director: {
        type: String
    },
    clia_id: {
        type: String
    },
    website: {
        type: String
    },
    fax: {
        type: String
    },
    accession_letter: {
        type: String
    },
    accession_format: {
        type: String,
        enum: ['FORMATONE', 'FORMATTWO']
    }
}

export const labDataSchema = new Schema({
    ...labConstantFields,
    labsquire_services_api_key: {
        type: String
    },
    bigrock_api_key: {
        type: String
    },
    bigrock_api_secret: {
        type: String
    },
    bigrock_base_url: {
        type: String
    },
    settings: labSettingsDataSchema,
    timezone: {
        type: String
    },
    supply_request_form_email: {
        type: String
    },
    multi_locations: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: {
            'createdAt': 'created_at',
            'updatedAt': 'updated_at'
        }
    })

labDataSchema.index({
    lab_code: 1,
}, {
    background: true,
    unique: true,
})


export const LabModel = model<ILab>('Lab', labDataSchema, 'labs')