import * as mongoose from 'mongoose';
import { Schema, model } from 'mongoose';




const emailNotifications = new Schema({
    name: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    }
})

const settingsSchema = new Schema({
    email_notifications: {
        type: Boolean,
        default: false
    },
    fax_notifications: {
        type: Boolean,
        default: false
    },
    email_events: [emailNotifications]
}, {
    _id: false,
    versionKey: false,
})



const addressSchema = new Schema({
    line_one: {
        type: String,
    },
    line_two: {
        type: String,
    },
    street: {
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
}, {
    _id: false,
    versionKey: false,
})

const settingSchema = new Schema({
    email_notifications: {
        type: Boolean,
        default: false
    },
    fax_notifications: {
        type: Boolean,
        default: false
    }
}, {
    _id: false,
    versionKey: false,
})

export const UserSchema: any = new mongoose.Schema({
    api_token: {
        type: String
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    fax: {
        type: String
    },
    avatar: {
        type: String,
        default: "default-user.png"
    },
    status: {
        type: String,
        // enum: ACCOUNT_STATUS,
        // default: DEFAULT_ACCOUNT_STATUS
    },
    user_type: {
        type: String,
        // enum: ALL_USERS,
        // default: DEFAULT_USER_TYPE
    },
    allowed_case_types: {
        type: [String]
    },
    permissions: {
        type: [Object],
        default: []
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    password_expired_at: {
        type: Date,
        default: null
    },
    designation: {
        type: String
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER']
    },
    address: addressSchema,
    educational_qualification: {
        type: String,
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: "Hospital"
    },
    hospitals: [{
        type: Schema.Types.ObjectId,
        ref: "Hospital"
    }],
    hospital_marketing_manager: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    lab: {
        type: Schema.Types.ObjectId,
        ref: 'Lab'
    },
    physician: {
        type: Schema.Types.ObjectId,
        ref: 'Physician',
        // // tslint:disable-next-line: object-literal-shorthand
        // required: function () {
        //     return this.user_type === HOSPITAL_PHYSICIAN
        // }
    },
    report_signature: {
        type: String
    },
    digital_signature: {
        type: String
    },
    settings: settingsSchema
}, {
    timestamps: {
        'createdAt': 'created_at',
        'updatedAt': 'updated_at'
    }
})

export const UserModel = mongoose.model<any>('User', UserSchema, 'user');