import * as mongoose from 'mongoose';
import { Schema, model } from 'mongoose';



const primaryInsuranceSchema = new Schema(
    {
      relationship: {
        type: String
      },
      plan_type: {
        type: String
      },
      payor: {
        type: String,
      },
      insurance_code: {
        type: String,
      },
      policy_id: {
        type: String,
        required: true,
      },
      group_or_plan: {
        type: String,
      },
      group: {
        type: String,
      },
      patient_policy: {
        type: String,
      },
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      middle_name: {
        type: String,
      },
      gender: {
        type: String,
      },
      date_of_birth: {
        type: Date,
      },
      address_line_1: {
        type: String,
      },
      address_line_2: {
        type: String,
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
      insurance_carrier_code: {
        type: String,
      },
      insurance_verification_code: {
        type: String
      }
    },
    {
      _id: false,
    }
  );
  
  const guarantorSchema = new Schema(
    {
      relationship: {
        type: String
      },
      home_phone: {
        type: String,
      },
      work_phone: {
        type: String,
      },
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      middle_name: {
        type: String,
      },
      gender: {
        type: String,
      },
      date_of_birth: {
        type: Date,
      },
  
      address_line_1: {
        type: String,
      },
      address_line_2: {
        type: String,
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
    },
    {
      _id: false,
    }
  );
  
  const insuranceDatSchema = new Schema({
    primary_insurance: primaryInsuranceSchema,
    secondary_insurance: primaryInsuranceSchema,
    tertiary_insurance: primaryInsuranceSchema,
    guarantor: guarantorSchema,
  });
  
  const billingInfoDataSchema = new Schema(
    {
      insurance: insuranceDatSchema,
    },
    {
      _id: false,
    }
  );
  
  const internalCaseNotes = new Schema({
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
    },
  });
  
  const fileInfoDataSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
    metadata: {
      type: Object,
    },
    created_by: {
      type: Schema.Types.ObjectId,
    },
    category: {
      type: String
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  });
  
  const testPerformedBy = new Schema(
    {
      case_type: {
        type: String
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      _id: true,
    }
  );
  
  const testResultDataSchema = new Schema(
    {
      test: {
        type: Schema.Types.ObjectId,
        ref: "LabTest",
        required: true,
      },
      name: {
        type: String,
      },
      value: {
        type: Number,
      },
      flags: {
        type: String,
      },
      short_name: {
        type: String,
      },
      units: {
        type: String,
      },
      reference_range: {
        type: String,
      },
      instrument_code: {
        type: String,
      },
      instrument: {
        type: String,
      },
      decimal_places: {
        type: String,
      },
      lod: {
        type: String,
      },
      comments: {
        type: String,
      },
      reportable_range: {
        type: String,
      },
      display_range: {
        type: String,
      },
      ref_range_female: {
        type: String,
      },
      ref_range_male: {
        type: String,
      },
    },
    {
      _id: false,
    }
  );
  
  export const patientInfoDataSchema = new Schema({
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      //  required:true
    },
    last_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHERS"],
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    emr: {
      type: String,
    },
    pms_or_pws: {
      type: String,
    },
    home_phone: {
      type: String,
      required: true,
    },
    work_phone: {
      type: String,
    },
    address_line_1: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
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
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
    },
    county: {
      type: String,
    },
    race: {
      type: String,
    },
    ethnicity: {
      type: String,
    },
    pregnant: {
      type: Boolean,
      default: false,
    },
  });
  
  const supplementalReportData = new Schema({
    report_title: {
      type: String,
    },
    report_source: {
      type: String,
    },
    order: {
      type: Number,
    },
    download_ready: {
      type: Boolean,
    },
  });
  
  const additionalReportData = new Schema({
    report_title: {
      type: String,
    },
    report_source: {
      type: String,
    },
    order: {
      type: Number,
    },
    download_ready: {
      type: Boolean,
    },
  });
  
  const downloadLogSchema = new Schema({
    type: {
      type: String,
    },
    user_id: {
      type: String,
    },
    user_type: {
      type: String,
    },
    time: [
      {
        type: Date,
        default: Date.now(),
      },
    ],
  });
  
  export const testReportsDataSchema: any = new Schema(
    {
      is_amendement: {
        type: Boolean,
      },
      amendment_data: {
        type: Object,
      },
      time: {
        type: Date,
        default: Date.now,
      },
      test_report_source: {
        type: String,
      },
      mark_for_physician: {
        type: Boolean,
        default: false,
      },
      email_sent: {
        type: Boolean,
      },
      fax_sent: {
        type: Boolean,
      },
      email_sent_time: {
        type: Date,
      },
      fax_sent_time: {
        type: Date,
      },
      title: {
        type: String,
      },
  
      download_ready: {
        type: Boolean,
        default: false,
      },
      coriell_report_id: {
        type: String,
      },
      case_type: {
        type: String
      },
      covid_status: {
        type: String,
      },
      result_status: {
        type: String,
      },
      is_covid: {
        type: Boolean,
      },
      recent_downloaded_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      recent_downloaded_at: {
        type: Date,
      },
  
      result_file_id: {
        type: Schema.Types.ObjectId,
        ref: "ResultFile",
      },
  
      report_id: {
        type: Schema.Types.ObjectId,
        ref: "CovidTestResultLogs",
      },
      test_results_id: {
        type: Schema.Types.ObjectId,
        ref: "CovidTestResults",
      },
      uploaded_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      is_manually: {
        type: Boolean,
      },
      accession_id: {
        type: String,
      },
      is_supplemental_report: {
        type: Boolean,
      },
      reference_by: {
        type: String,
      },
      additional_report_merged: {
        type: Boolean,
        default: false,
      },
      additional_report_already_merged: {
        type: Boolean,
        default: false,
      },
      additional_reports: [additionalReportData],
      template_report_merged: {
        type: Boolean,
        default: false,
      },
      supplemental_report_notes: {
        type: String,
      },
      supplemental_report_source: {
        type: String,
      },
      supplemental_report_title: {
        type: String,
      },
      supplemental_reports: [supplementalReportData],
      is_multiple: {
        type: Boolean,
      },
      total_supplemental_reports: {
        type: Number,
      },
      is_blood: {
        type: Boolean,
      },
      is_urine: {
        type: Boolean,
      },
      is_toxic: {
        type: Boolean,
      },
      template_generated: {
        type: Boolean,
        default: false,
      },
      template_report_url: {
        type: String,
      },
      is_finalized: {
        type: Boolean,
      },
      finalized_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      is_synced_report: {
        type: Boolean,
      },
      synced_report_report_file_id: {
        type: Schema.Types.ObjectId,
        ref: "CardiacReportFile",
      },
      emr_order: {
        type: Schema.Types.ObjectId,
        ref: "EMROrder",
      },
      emr_result_sent_status: {
        type: String,
        enum: ["PENDING", "QUEUED", "SENT", "ERROR"],
        default: "PENDING",
      },
      emr_result_sent_on: {
        type: Date,
      },
      emr_result_sent_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      patient_email_sent: {
        type: Boolean,
      },
      download_logs: [downloadLogSchema],
      toxic_report_id: {
        type: Schema.Types.ObjectId,
        ref: "ToxicologyTestResults",
      },
    },
    {
      _id: true,
    }
  );
  
  const amendmentDetailsSchema = new Schema(
    {
      amendment_revision_notes: {
        type: String,
      },
      amendment_time: {
        type: Date,
      },
      amendment_by: {
        type: String,
      },
      amendment_report: {
        type: Boolean,
      },
    },
    {
      _id: false,
      versionKey: false,
    }
  );
  
  const correctedDetailsSchema = new Schema(
    {
      corrected_revison_notes: {
        type: String,
      },
      corrected_time: {
        type: Date,
      },
      corrected_by: {
        type: String,
      },
      corrected_report: {
        type: Boolean,
      },
    },
    {
      _id: false,
      versionKey: false,
    }
  );
  
  export const toxicologyMedicalSchema = new Schema({
    patient_name: {
      type: String,
    },
    patient_dob: {
      type: Date,
    },
    date_of_service: {
      type: Date,
    },
    provider_id: {
      type: Schema.Types.ObjectId,
    },
    provider_name: {
      type: String,
    },
    check_list: {
      type: [String],
    },
    please_explain: {
      type: String,
    },
    name_of_practice: {
      type: String,
    },
    name_of_clinician: {
      type: String,
    },
    clinician_npi: {
      type: String,
    },
    ordering_clinician_signature: {
      type: String,
    },
    date: {
      type: Date,
    },
  });
  
  export const urinaryTractMedicalSchema = new Schema({
    patient_name: {
      type: String,
    },
    patient_dob: {
      type: Date,
    },
    date_of_service: {
      type: Date,
    },
    icd_codes: {
      type: [String],
    },
    check_list: {
      type: [String],
    },
    others: {
      type: String,
    },
    name_of_practice: {
      type: String,
    },
    name_of_clinician: {
      type: String,
    },
    clinician_npi: {
      type: String,
    },
    ordering_clinician_signature: {
      type: String,
    },
    date: {
      type: Date,
    },
  });
  
  export const medicalNecessitySchema = new Schema({
    check_list: {
      type: [String],
    },
    others: {
      type: String,
    },
  });
  
  export const medicalNecessityWithCaseTypeSchema = new Schema({
    medical_necessity: {
      type: medicalNecessitySchema,
      default: null,
    },
    case_type: {
      type: String,
    },
  });
  
  export const signatureSettings = new Schema({
    patient_signature: {
      type: Boolean,
    },
    physician_signature: {
      type: Boolean,
    },
    guardian_signature: {
      type: Boolean,
    },
    patient_sign: {
      type: String,
    },
    physician_sign: {
      type: String,
    },
    guardian_sign: {
      type: String,
    },
  });
  
  export const cptCodingDetails = new Schema({
    cpt_code: {
      type: String,
      required: true
    },
    test_name: {
      type: String,
    },
    m1: {
      type: String
    },
    m2: {
      type: String
    },
    m3: {
      type: String
    },
    m4: {
      type: String
    },
    icd_1: {
      type: String
    },
    icd_2: {
      type: String
    },
    icd_3: {
      type: String
    },
    icd_4: {
      type: String
    },
    unit: {
      type: Number
    },
    charge: {
      type: Number
    },
    total: {
      type: Number
    },
    remarks: {
      type: String
    }
  });
  
  export const CaseSchema = new Schema(
    {
      case_types: {
        type: [String]
      },
      lab: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Lab",
      },
      emr_order: {
        type: Schema.Types.ObjectId,
        ref: "EMROrder",
      },
      collection_date: {
        type: Date,
        required: true,
      },
      sample_types: [
        {
          case_type: {
            type: String,
          },
          sample_types: [
            {
              type: String,
            },
          ],
        },
      ],
      received_date: {
        type: Date,
        required: true,
      },
      hospital: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Hospital",
      },
      hospital_branch: {
        type: Schema.Types.ObjectId,
        ref: "HospitalLocation",
      },
      ordering_physician: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Physician",
      },
      referring_physician: {
        type: Schema.Types.ObjectId,
        ref: "Physician",
      },
      icd_10_codes: {
        type: [String],
        required: true,
      },
      medication: {
        type: [String],
        uppercase: true,
      },
      accession_id: {
        type: String,
        required: true,
        index: true,
      },
      billing_type: {
        type: String
      },
      created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      patient_info: patientInfoDataSchema,
      auto_approved: {
        type: Boolean,
        default: false,
      },
      tests_info: [
        {
          type: Schema.Types.ObjectId,
          ref: "LabTest",
        },
      ],
      test_performed_by: [testPerformedBy],
      test_results: [testResultDataSchema],
      test_reports: [testReportsDataSchema],
      billing_info: billingInfoDataSchema,
      attachments: [fileInfoDataSchema],
  
      internal_documents: [fileInfoDataSchema],
      internal_notes: [internalCaseNotes],
      attachments_count: {
        type: Number,
      },
      coriell_test_panels: [
        {
          case_type: {
            type: String,
          },
          test_panels: [
            {
              type: String,
            },
          ],
        },
      ],
      toxicology_ereq_form: {
        type: [String]
      },
      barcode_source: {
        type: String,
        required: false,
      },
      billing_notes: {
        type: String
      },
      barcode_print: {
        type: String,
        required: false,
      },
      order: {
        // _id of order
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
      order_id: {
        // order_id which we generated in order
        type: String,
      },
      pending_case: {
        type: Schema.Types.ObjectId,
        ref: "PendingCase",
      },
      pending_case_id: {
        type: String,
      },
      patient_order_id: {
        type: Schema.Types.ObjectId,
        ref: "PatientTests",
      },
      requisition_order_id: {
        type: String,
      },
      status: {
        type: String
      },
      covid_status: {
        type: String,
      },
      sendout: {
        type: Schema.Types.ObjectId,
        ref: "Sendout",
      },
      sendout_id: {
        type: String,
      },
      reported_at: {
        type: Date,
      },
      deleted_on: {
        type: Date,
      },
      deleted_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      finalized_date: {
        type: Date,
      },
      cpt_codes: {
        type: [String],
        def: "81001",
      },
      specimen_collector: {
        type: String,
      },
      marketer_details: {
        type: String,
      },
      hospital_marketer: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      hospital_marketers: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      billing_status: {
        type: String,
        default: "Unbilled",
      },
      billing_sub_status: {
        type: String,
      },
      billing_moved_date: {
        type: Date,
      },
      billing_error: {
        type: String,
      },
      patient_order: {
        type: Boolean,
        default: false,
      },
      source: {
        type: String,
        default: null,
      },
      toxicology_order_medical_necessity_fields: {
        type: toxicologyMedicalSchema,
        default: null,
      },
      urinary_tract_infectious_medical_necessity_fields: {
        type: urinaryTractMedicalSchema,
        default: null,
      },
      urinalysis_order_medical_necessity_fields: {
        type: toxicologyMedicalSchema,
        default: null,
      },
      medical_necessities: {
        type: [medicalNecessityWithCaseTypeSchema],
        default: null,
      },
      specimen_types: [
        {
          case_type: {
            type: String,
          },
          specimen: {
            type: String,
          },
        },
      ],
      bulk_accession_file_id: {
        type: Schema.Types.ObjectId,
        ref: "bulkAccession",
        require: false,
      },
      is_amendement: {
        type: Boolean,
      },
      is_sendout: {
        type: Boolean,
      },
      requisite: {
        type: String,
      },
      is_labdaq_order: {
        type: Boolean,
      },
      labdaq_order_status: {
        type: String,
      },
      labdaq_report_status: {
        type: String,
      },
      labdaq_report_message: {
        type: String,
      },
      is_corrected: {
        type: Boolean,
      },
      labdaq_time: {
        type: Date,
      },
      amendement_details: amendmentDetailsSchema,
      corrected_details: correctedDetailsSchema,
      additional_fax: [String],
      additional_fax_requisite: String,
      signature_settings: signatureSettings,
      inhouse_tests: {
        type: Boolean,
      },
      sendout_tests: {
        type: Boolean,
      },
      physician_notes: {
        type: String,
      },
      is_fasting: {
        type: Boolean
      },
      toxic_types: [
        {
          type: String,
        },
      ],
      custom_test_panels: [
        {
          test_panel_name: {
            type: String,
          },
          case_types: {
            type: [String]
          }
        },
      ],
      billing_application_sent_status: {
        type: Boolean,
      },
      billing_application_sent_on: {
        type: Date,
      },
      report_result_status: {
        type: String
      },
      units: {
        type: String
      },
      cpt_coding_details: [cptCodingDetails],
      internal_patient_id: {
        type: String
      },
      cpt_coding_charges_final_sum: {
        type: Number
      },
      is_validation_purpose: {
        type: Boolean,
        default: false
      },
      custom_test_profiles: [
        {
          type: Schema.Types.ObjectId,
          ref: "HospitalTestProfile",
        },
      ],
      billing_status_notes: {
        type: String
      },
      insurance_eligibility_verified: {
        type: Boolean,
        default: false
      },
      insurance_eligibility_verified_at: {
        type: Date
      },
      insurance_eligibility_verified_details: {
        type: Schema.Types.Mixed
      }
    },
  
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );
  
  export const CaseModel = mongoose.model<any>('Case', CaseSchema, 'cases');  
  