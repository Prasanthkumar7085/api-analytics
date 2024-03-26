import { Schema, model, Document } from "mongoose";


export interface ITestPanel extends Document {
    name: string;
    tests?: ITest[];
    lab: string;
    code: string;
    status?: string;
}

export interface ITest extends Document {
    name: string;
    category?: string;
    category_code?: string;
    description?: string;
    case_type_code?: string;
    case_type?: string;
    status?: string;
}
const orderableTestsSchema = new Schema({
    name: {
        type: String,
    },
});

const labTestDataSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    parent_category: {
        type: String,
    },
    parent_category_code: {
        type: String,
    },
    category: {
        type: String,
    },
    category_code: {
        type: String,
        uppercase: true,
    },
    description: {
        type: String,
    },
    case_type_code: {
        type: String,
        uppercase: true,
    },
    case_type: {
        type: String,
    },
    group_name: {
        type: String,
    },
    orderable_tests: {
        type: [orderableTestsSchema],
        default: [],
    },
    status: {
        type: String,
        default: "ACTIVE",
        enum: ["INACTIVE", "ACTIVE", "ARCHIVED"],
    },
});
const categoryDataSchema = new Schema({
    category: {
        type: String,
    },
    category_code: {
        type: String,
        uppercase: true,
    },
});


export const testPanelsDataSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            uppercase: true,
        },
        tests: {
            type: [labTestDataSchema],
            default: [],
        },
        categories: {
            type: [categoryDataSchema],
            default: [],
        },
        case_type_letter_code: {
            type: String,
            required: true,
            uppercase: true,
        },
        lab: {
            type: Schema.Types.ObjectId,
            ref: "Lab",
            required: true,
        },
        status: {
            type: String,
            default: "ACTIVE",
            enum: ["INACTIVE", "ACTIVE", "ARCHIVED"],
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);
testPanelsDataSchema.index(
    {
        lab: 1,
        code: 1,
    },
    {
        background: true,
    }
);
export const LabTestPanelModel = model<ITestPanel>(
    "Test_Panels",
    testPanelsDataSchema,
    "test_panels"
);