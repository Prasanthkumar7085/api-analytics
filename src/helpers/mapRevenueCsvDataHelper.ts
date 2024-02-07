export class MapRevenueCsvDataHelper {

    async modifyDate(date) {
        var finalDate = date.split(" ")[0].split("-");
        var fdate =
            finalDate[2] +
            "-" +
            finalDate[1] +
            "-" +
            finalDate[0];
        console.log("date", typeof new Date(fdate))
        return new Date(fdate)
    }

    async mapCsvDataForDb(csvFileData) {
        let mappedCsvData = csvFileData.map((e) => ({
            encounter_id: e['Encounter ID'],
            patient_code: e['Patient Code'] ? e['Patient Code'] : '',
            accession_id: e['Chart #'],
            patient: e['Patient'],
            patient_id: e['Patient Id'],
            case_type: e['Case Name'],
            billing_npi: e['Billing NPI'],
            referring_provider: e['Referring Provider'],
            referring_npi: e['Referring NPI'],
            total_charges: Math.floor(e['Total Charges']),
            date_of_service: e['Service Date'] ? this.modifyDate(e['Service Date']) : null,
            date_of_birth: e['DOB'] ? this.modifyDate(e['DOB']) : null,
            icd_codes: e['Encounter ICD Type'],
            primary_insurance: e['Primary Insurance'],
            payor_id: e['Payer ID'],
            primary_policy_number: e['Primary Policy Number'],
            payment_status: e['Status'],
            initial_billed_date: this.modifyDate(e['Initial Billed Date']),
            last_claim_status: e['Last Claim Status'],
            created_date: this.modifyDate(e['Created Date']),
            created_by: e['Created By'],
            modified_date: e['Modified Date'] ? this.modifyDate(e['Modified Date']) : null,
            modified_by: e['Modified By'] ? e['Modified By'] : '',
            cpt_codes: e['Procedure/CPT Code'],
            line_item_units: Math.floor(e['Line Item Units']),
            line_item_charge: Math.floor(e['Line Item Charge']),
            line_item_total: Math.floor(e['Line Item Total']),
            expected_rate: Math.floor(e['Expected Rate']),
            insurance_payment_amount: Math.floor(e['Insurance Payment Amount']),
            insurance_adjustment_amount: Math.floor(e['Insurance Adjustment Amount']),
            insurance_write_of_amount: Math.floor(e['Insurance Write-Off Amount']),
            patient_payment_amount: Math.floor(e['Patient Payment Amount']),
            patient_adjustment_amount: Math.floor(e['Patient Adjustment Amount']),
            patient_write_of_amount: Math.floor(e['Patient Write-Off Amount']),
            line_item_balance: Math.floor(e['Line Item Balance']),
            line_item_rendering_provider: e['Line Item Rendering Provider'],
            line_item_status: e['Line Item Status'],
            modifiedBy: ''
        }))
        return mappedCsvData
    }
}