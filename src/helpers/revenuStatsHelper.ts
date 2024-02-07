import { FileUploadDataServiceProvider } from "services/fileUploadService";
import { INVALID_FILE, NO_FILE } from "src/constants/messageConstants";
import { CustomError } from "src/middlewares/customValidationMiddleware";
import { Injectable } from "@nestjs/common";
import { LisService } from "src/lis/lis.service";


@Injectable()
export class RevenueStatsHelpers {
    constructor(
        private readonly fileUploadDataServiceProvider: FileUploadDataServiceProvider,
        private readonly lisService: LisService

    ) { }


    async prepareModifyData(file) {
        try {
            if (!file) {
                throw new CustomError(400, NO_FILE)
            }

            if (file.mimetype !== 'text/csv') {
                throw new CustomError(400, INVALID_FILE)
            }

            const csvFileData = await this.fileUploadDataServiceProvider.processCsv(file);
            // console.log("fileRews", csvFileData);
            const modifiedData = await this.modifyRawData(csvFileData)

            return modifiedData;
        } catch (err) {
            throw err;
        }
    }


    modifyRawData(csvFileData) {
        let rawData = csvFileData.map((e) => ({
            accession_id: e['Chart #'],
            date_of_service: e['Service Date'] ? this.modifyDate(e['Service Date']) : null,
            payment_status: e['Status'],
            cpt_codes: e['Procedure/CPT Code'],
            line_item_total: e['Line Item Total'],
            insurance_payment_amount: e['Insurance Payment Amount'],
            insurance_adjustment_amount: e['Insurance Adjustment Amount'],
            insurance_write_of_amount: e['Insurance Write-Off Amount'],
            patient_payment_amount: e['Patient Payment Amount'],
            patient_adjustment_amount: e['Patient Adjustment Amount'],
            patient_write_of_amount: e['Patient Write-Off Amount'],
            line_item_balance: e['Line Item Balance']
        }))


        const modifiedData = this.groupingKeys(rawData);
        return modifiedData;
    }

    modifyDate(date) {
        const originalDate = new Date(date);

        const year = originalDate.getUTCFullYear();
        const month = String(originalDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }


    groupingKeys(data) {
        const result = data.reduce((acc, item) => {
            const key = `${item.accession_id}_${item.date_of_service}`;
            const existingEntry = acc.find((entry) => entry.key === key);

            if (existingEntry) {
                // Entry already exists, add values to arrays
                existingEntry.cpt_codes.push(item.cpt_codes);
                existingEntry.line_item_total.push(item.line_item_total);
                existingEntry.insurance_payment_amount.push(item.insurance_payment_amount);
                existingEntry.insurance_adjustment_amount.push(item.insurance_adjustment_amount);
                existingEntry.insurance_write_of_amount.push(item.insurance_write_of_amount);
                existingEntry.patient_payment_amount.push(item.patient_payment_amount);
                existingEntry.patient_adjustment_amount.push(item.patient_adjustment_amount);
                existingEntry.patient_write_of_amount.push(item.patient_write_of_amount);
                existingEntry.line_item_balance.push(item.line_item_balance);

            } else {
                // Entry doesn't exist, create a new one
                const newEntry = {
                    key,
                    accession_id: item.accession_id,
                    date_of_service: item.date_of_service,
                    payment_status: item.payment_status,
                    cpt_codes: [item.cpt_codes],
                    line_item_total: [item.line_item_total],
                    insurance_payment_amount: [item.insurance_payment_amount],
                    insurance_adjustment_amount: [item.insurance_adjustment_amount],
                    insurance_write_of_amount: [item.insurance_write_of_amount],
                    patient_payment_amount: [item.patient_payment_amount],
                    patient_adjustment_amount: [item.patient_adjustment_amount],
                    patient_write_of_amount: [item.patient_write_of_amount],
                    line_item_balance: [item.line_item_balance],

                };
                acc.push(newEntry);
            }

            return acc;
        }, []);

        result.forEach((object) => {
            delete object["key"];
        });

        const finalResp = this.sumOfRawData(result);

        return finalResp;
    }


    sumOfRawData(data) {
        data.forEach((entry) => {
            entry.total_amount = Math.floor(entry.line_item_total.reduce((sum, value) => sum + Number(value), 0));

            const insurance_payment_amount_sum = entry.insurance_payment_amount.reduce((sum, value) => sum + Number(value), 0);
            const insurance_adjustment_amount_sum = entry.insurance_adjustment_amount.reduce((sum, value) => sum + Number(value), 0);
            const insurance_write_of_amount_sum = entry.insurance_write_of_amount.reduce((sum, value) => sum + Number(value), 0);
            const patient_payment_amount_sum = entry.patient_payment_amount.reduce((sum, value) => sum + Number(value), 0);
            const patient_adjustment_amount_sum = entry.patient_adjustment_amount.reduce((sum, value) => sum + Number(value), 0);
            const patient_write_of_amount_sum = entry.patient_write_of_amount.reduce((sum, value) => sum + Number(value), 0);

            
            entry.paid_amount = Math.floor(insurance_payment_amount_sum + insurance_adjustment_amount_sum + insurance_write_of_amount_sum + patient_payment_amount_sum + patient_adjustment_amount_sum + patient_write_of_amount_sum);

            entry.pending_amount = Math.floor(entry.line_item_balance.reduce((sum, value) => sum + Number(value), 0));
        });


        return data;

    }




    
  async getDataFromLis(modifiedData) {
    const accessionIdsArray = modifiedData.map((e) => e.accession_id);

    const query = {
      accession_id: {
        "$in": accessionIdsArray
      }
    }

    const caseDataArray = await this.lisService.getCaseByAccessionId(query);

    let mergedArray: any = [];
    if (caseDataArray.length) {
      mergedArray = this.mergeArrays(caseDataArray, modifiedData)
    }

    return mergedArray;
  }



  mergeArrays(caseDataArray, modifiedData) {
    // Merge arrays based on hospital_marketer and date
    const mergedArrays = caseDataArray.map(objA => {
      const matchingObjB = modifiedData.find(objB => objB.accession_id === objA.accession_id);

      return {
       case_id: objA._id,
       case_types: objA.case_types,
       hospital: objA.hospital,
       hospital_marketers: objA.hospital_marketers,
       process_status: "PENDING",
       ...matchingObjB
      };
    });

    return mergedArrays;

  }




}