import { FileUploadDataServiceProvider } from "services/fileUploadService";
import { INVALID_FILE, NO_FILE } from "src/constants/messageConstants";
import { CustomError } from "src/middlewares/customValidationMiddleware";
import { Injectable } from "@nestjs/common";
import { LisService } from "src/lis/lis.service";
import { RevenueStatsService } from "src/revenue-stats/revenue-stats.service";
import { SortHelper } from "./sortHelper";
import { caseTypes } from "src/constants/lisConstants";
import * as fs from 'fs'


@Injectable()
export class RevenueStatsHelpers {
    constructor(
        private readonly fileUploadDataServiceProvider: FileUploadDataServiceProvider,
        private readonly lisService: LisService,
        private readonly revenueStatsService: RevenueStatsService,
        private readonly sortHelper: SortHelper
    ) { }


    async prepareModifyData(file) {
        try {
            if (!file) {
                throw new CustomError(400, NO_FILE)
            }

            if (file.mimetype !== 'text/csv') {
                throw new CustomError(400, INVALID_FILE)
            }

            // Get the data from CSV
            const csvFileData = await this.fileUploadDataServiceProvider.processCsv(file);

            // modify raw data from csvFileData
            const modifiedData = await this.modifyRawData(csvFileData)

            return modifiedData;
        } catch (err) {
            throw err;
        }
    }


    async modifyRawData(csvFileData) {
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
            line_item_balance: e['Line Item Balance'],
            insurance_name: e['Primary Insurance']
        }))
        // Need to Group the Raw Data
        const modifiedData = this.groupingKeys(rawData);

        return modifiedData;
    }

    modifyDate(dateString) {

        const originalDate = new Date(dateString);

        const year = originalDate.getFullYear();
        const month = originalDate.getMonth();
        const day = originalDate.getDate();

        // Constructing the formattedDateObject without using UTC functions
        const formattedDateObject = new Date(0);  // Epoch time
        formattedDateObject.setUTCFullYear(year);
        formattedDateObject.setUTCMonth(month);
        formattedDateObject.setUTCDate(day);

        return formattedDateObject;
    }


    groupingKeys(data) {
        // Need ti push the data into an array based on the key(accesion_id and date_of_service)
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
                    insurance_name: item.insurance_name,
                    ordering_provider: item.ordering_provider
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
            const lineItemTotal = entry.line_item_total.reduce((sum, value) => sum + parseFloat(value), 0);
            entry.line_item_total = lineItemTotal;
            entry.total_amount = lineItemTotal;

            const insurance_payment_amount_sum = entry.insurance_payment_amount.reduce((sum, value) => sum + parseFloat(value), 0);
            const insurance_adjustment_amount_sum = entry.insurance_adjustment_amount.reduce((sum, value) => sum + parseFloat(value), 0);
            const insurance_write_of_amount_sum = entry.insurance_write_of_amount.reduce((sum, value) => sum + parseFloat(value), 0);
            const patient_payment_amount_sum = entry.patient_payment_amount.reduce((sum, value) => sum + parseFloat(value), 0);
            const patient_adjustment_amount_sum = entry.patient_adjustment_amount.reduce((sum, value) => sum + parseFloat(value), 0);
            const patient_write_of_amount_sum = entry.patient_write_of_amount.reduce((sum, value) => sum + parseFloat(value), 0);
            const line_item_balance = entry.line_item_balance.reduce((sum, value) => sum + parseFloat(value), 0);


            entry.paid_amount = insurance_payment_amount_sum + insurance_adjustment_amount_sum + insurance_write_of_amount_sum + patient_payment_amount_sum + patient_adjustment_amount_sum + patient_write_of_amount_sum;

            entry.pending_amount = entry.total_amount - entry.paid_amount;

            entry.insurance_payment_amount = insurance_payment_amount_sum;
            entry.insurance_adjustment_amount = insurance_adjustment_amount_sum;
            entry.insurance_write_of_amount = insurance_write_of_amount_sum;
            entry.patient_payment_amount = patient_payment_amount_sum;
            entry.patient_adjustment_amount = patient_adjustment_amount_sum;
            entry.patient_write_of_amount = patient_write_of_amount_sum;
            entry.line_item_balance = line_item_balance;
        });


        return data;

    }





    async getDataFromLis(modifiedData) {
        // Get the accession_id's from modified data
        const accessionIdsArray = modifiedData.map((e) => e.accession_id);

        const query = {
            accession_id: {
                "$in": accessionIdsArray
            }
        }

        // Get the hospital, marketers and case_type based on the accession_ids from modified data
        const caseDataArray = await this.lisService.getCaseByAccessionId(query);

        let mergedArray: any = [];
        if (caseDataArray.length) {
            // Merging the hospitals, marketers and case_type based the accession_id which is from LIS, merging with modified data
            mergedArray = this.mergeArrays(caseDataArray, modifiedData)
        }

        return mergedArray;
    }



    mergeArrays(caseDataArray, modifiedData) {
        // Merge arrays based on hospital_marketer and date
        const mergedArrays = caseDataArray.map(objA => {
            const patientId = objA.patient_info ? objA.patient_info._id.toString() : null;

            const patientInfo = this.forPatientInfo(objA.patient_info);

            const matchingObjB = modifiedData.find(objB => objB.accession_id === objA.accession_id);
            return {
                case_id: objA._id,
                case_types: objA.case_types,
                hospital: objA.hospital,
                hospital_marketers: objA.hospital_marketers,
                process_status: "PENDING",
                ...matchingObjB,
                patient_id: patientId,
                patient_info: patientInfo
            };
        });

        return mergedArrays;

    }

    forPatientInfo(patientInfo){
        const firstName = patientInfo ? patientInfo.first_name : "";
        const middleName = patientInfo ? patientInfo.middle_name : "";
        const lastName = patientInfo ? patientInfo.last_name : ""

        const patientDetails = {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName
        }

        return patientDetails;
    }


    processData(data) {
        let processedData = {};

        data.forEach(entry => {
            entry.hospital_marketers.forEach(marketer => {
                if (!processedData[entry.date_of_service]) {
                    processedData[entry.date_of_service] = {};
                }

                // Seperating the values based on the marketers
                const forMarketerResp = this.forMarketersAndCountsSeperation(processedData, entry, marketer);

                processedData = forMarketerResp.processedData
                entry = forMarketerResp.entry;

                //  Initialize counts for case_types wise
                const caseTypeWiseResp = this.forCaseTypeWiseCounts(processedData, entry, marketer);

                processedData = caseTypeWiseResp.processedData;
                entry = caseTypeWiseResp.entry;

                // Initialize counts for hospital-wise-case_type counts
                const hospitalId = entry.hospital;
                const hospitalData = processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId);

                const hospitalWiseResp = this.forHospitalWiseCounts(processedData, entry, marketer, hospitalId, hospitalData);

                processedData = hospitalWiseResp.processedData;
                entry = hospitalWiseResp.entry;
            });
        });

        // Re assigin the above prepared data based on marketer_id and date
        const result = [];
        for (const date in processedData) {
            for (const marketerId in processedData[date]) {
                const marketerData = processedData[date][marketerId];
                marketerData.hospitals = marketerData.hospitals_data.size;
                delete marketerData.hospitals_data;
                result.push(marketerData);
            }
        }

        return result;
    }


    forMarketersAndCountsSeperation(processedData, entry, marketer) {
        if (!processedData[entry.date_of_service][marketer]) {
            processedData[entry.date_of_service][marketer] = {
                raw_id: entry.id,
                marketer_id: marketer,
                date: this.modifyDate(entry.date_of_service),
                total_amount: 0,
                paid_amount: 0,
                pending_amount: 0,
                hospitals_data: new Set(),
                case_type_wise_counts: [], // Updated to use an array
                hospital_wise_counts: []
            };

            // Initialize counts for all case_types
            caseTypes.forEach(caseType => {
                processedData[entry.date_of_service][marketer].case_type_wise_counts.push({
                    case_type: caseType.toLowerCase(),
                    total_amount: 0,
                    paid_amount: 0,
                    pending_amount: 0
                });
            });
        }

        if (entry.values_changed === true) {
            processedData[entry.date_of_service][marketer].total_amount += entry.difference_values.total_amount_difference || 0;
            processedData[entry.date_of_service][marketer].paid_amount += entry.difference_values.paid_amount_difference || 0;
            processedData[entry.date_of_service][marketer].pending_amount += entry.difference_values.pending_amount_difference || 0;
        } else {
            processedData[entry.date_of_service][marketer].total_amount += entry.total_amount || 0;
            processedData[entry.date_of_service][marketer].paid_amount += entry.paid_amount || 0;
            processedData[entry.date_of_service][marketer].pending_amount += entry.pending_amount || 0;
        }
        processedData[entry.date_of_service][marketer].hospitals_data.add(entry.hospital);

        const resp = { processedData, entry };
        return resp;
    }


    forCaseTypeWiseCounts(processedData, entry, marketer) {
        entry.case_types.forEach(caseType => {
            let lowercaseCaseType: any = caseType.toLowerCase();
            lowercaseCaseType = this.updateCaseTypeInCsv(lowercaseCaseType)

            const caseTypeData = processedData[entry.date_of_service][marketer].case_type_wise_counts.find(item => item.case_type === lowercaseCaseType);
            if (entry.values_changed === true) {

                caseTypeData.total_amount += entry.difference_values.total_amount_difference || 0;
                caseTypeData.paid_amount += entry.difference_values.paid_amount_difference || 0;
                caseTypeData.pending_amount += entry.difference_values.pending_amount_difference || 0;
            } else {

                caseTypeData.total_amount += entry.total_amount || 0;
                caseTypeData.paid_amount += entry.paid_amount || 0;
                caseTypeData.pending_amount += entry.pending_amount || 0;
            }
        });

        const resp = { processedData, entry };
        return resp;
    }


    forHospitalWiseCounts(processedData, entry, marketer, hospitalId, hospitalData) {
        if (!hospitalData) {
            processedData[entry.date_of_service][marketer].hospital_wise_counts.push({
                hospital: hospitalId,
                total_amount: 0,
                paid_amount: 0,
                pending_amount: 0,
                case_type_wise_counts: []
            });

            // Initialize counts for all case_types within hospital
            caseTypes.forEach(caseType => {
                processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId).case_type_wise_counts.push({
                    case_type: caseType.toLowerCase(),
                    total_amount: 0,
                    paid_amount: 0,
                    pending_amount: 0
                });
            });
        }

        if (entry.values_changed === true) {
            processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId).total_amount += entry.difference_values.total_amount_difference || 0;
            processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId).paid_amount += entry.difference_values.paid_amount_difference || 0;
            processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId).pending_amount += entry.difference_values.pending_amount_difference || 0;
        } else {
            processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId).total_amount += entry.total_amount || 0;
            processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId).paid_amount += entry.paid_amount || 0;
            processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId).pending_amount += entry.pending_amount || 0;
        }

        entry.case_types.forEach(caseType => {
            let lowercaseCaseType: any = caseType.toLowerCase();

            lowercaseCaseType = this.updateCaseTypeInCsv(lowercaseCaseType)

            const caseTypeData = processedData[entry.date_of_service][marketer].hospital_wise_counts.find(hospital => hospital.hospital === hospitalId).case_type_wise_counts.find(item => item.case_type === lowercaseCaseType);

            if (entry.values_changed === true) {
                caseTypeData.total_amount += entry.difference_values.total_amount_difference || 0;
                caseTypeData.paid_amount += entry.difference_values.paid_amount_difference || 0;
                caseTypeData.pending_amount += entry.difference_values.pending_amount_difference || 0;
            } else {
                caseTypeData.total_amount += entry.total_amount || 0;
                caseTypeData.paid_amount += entry.paid_amount || 0;
                caseTypeData.pending_amount += entry.pending_amount || 0;
            }
        });

        const resp = { processedData, entry };
        return resp;
    }


    async forHospitalWiseData(orderBy, orderType, statsQuery) {
        let revenueStatsData: any = await this.revenueStatsService.findAll(statsQuery)
        const result = {};

        revenueStatsData.forEach((entry) => {
            const marketerId = entry.marketer_id;

            // Iterate over hospital wise counts for each entry
            entry.hospital_wise_counts.forEach((hospitalData) => {
                const hospitalId = hospitalData.hospital;

                // If the hospital entry does not exist in result, initialize it
                if (!result[hospitalId]) {
                    result[hospitalId] = {
                        marketer_id: marketerId,
                        hospital: hospitalId,
                        paid_amount: 0,
                        total_amount: 0,
                        pending_amount: 0,
                        case_type_wise_counts: {} // Initialize case_type_wise_counts
                    };
                }

                // Sum values for paid_amount, total_amount, and pending_amount
                result[hospitalId].paid_amount += hospitalData.paid_amount;
                result[hospitalId].total_amount += hospitalData.total_amount;
                result[hospitalId].pending_amount += hospitalData.pending_amount;

                // Sum values for case_type_wise_counts
                hospitalData.case_type_wise_counts.forEach((caseTypeData) => {
                    const caseType = caseTypeData.case_type;
                    if (!result[hospitalId].case_type_wise_counts[caseType]) {
                        result[hospitalId].case_type_wise_counts[caseType] = {
                            paid_amount: 0,
                            total_amount: 0,
                            pending_amount: 0
                        };
                    }
                    result[hospitalId].case_type_wise_counts[caseType].paid_amount += caseTypeData.paid_amount;
                    result[hospitalId].case_type_wise_counts[caseType].total_amount += caseTypeData.total_amount;
                    result[hospitalId].case_type_wise_counts[caseType].pending_amount += caseTypeData.pending_amount;
                });
            });
        });


        let dataArray = Object.values(result);

        dataArray = this.sortHelper.hospitalWise(orderBy, orderType, dataArray);
        return dataArray;
    }



    async checkAlreadyExisted(modifiedData) {
        // Get the accession_id and date_of_service from midified data
        const someData = modifiedData.map(obj => {
            // Using object destructuring to extract only the specified fields
            const { accession_id, date_of_service, case_types } = obj;
            return { accession_id, date_of_service, case_types };
        })


        const queryString: any = {
            OR: someData.map(item => ({
                AND: [
                    { accession_id: item.accession_id },
                    { date_of_service: new Date(item.date_of_service) }, // Assuming 'date' is stored as a Date in the database
                    // { case_types: item.case_types }
                ]
            }))
        }

        // Find the existed raw stats from our raw collection in our db
        const existedData = await this.revenueStatsService.getRevenueRawData(queryString);

        // Based on our db eisted raw stats, seperating the modified data into matched and not-matched
        const { matchedObjects, notMatchedObjects } = await this.seperateExistedAndNotExistedData(modifiedData, existedData);

        if (existedData.length > 0) {
            // When the stat is already eisted in our collection 
            // but that stat is uploaded once again then we need to prepare the differences of amounts
            this.checkDifference(matchedObjects, existedData);
        }

        return { matchedObjects, notMatchedObjects };
    }


    checkDifference(matchedObjects, existedData) {
        for (const finalData of matchedObjects) {

            // Finding the matched or existed index from our DB
            const matchingExistedDataIndex = existedData.findIndex(
                (existedData) =>
                    existedData.accession_id === finalData.accession_id &&
                    new Date(existedData.date_of_service).toISOString() === new Date(finalData.date_of_service).toISOString()
            );

            // Based on the above finded index finding the differences[total_amount_difference, paid_amount_difference, pending_amount_difference]
            if (matchingExistedDataIndex !== -1) {
                const matchingExistedData = existedData[matchingExistedDataIndex];

                const total_amount_difference = finalData.total_amount - matchingExistedData.total_amount;
                const paid_amount_difference = finalData.paid_amount - matchingExistedData.paid_amount;
                const pending_amount_difference = finalData.pending_amount - matchingExistedData.pending_amount;

                if (total_amount_difference !== 0 && paid_amount_difference !== 0 && pending_amount_difference !== 0) {
                    // Update the difference_values property
                    finalData.difference_values = {
                        total_amount_difference: total_amount_difference,
                        paid_amount_difference: paid_amount_difference,
                        pending_amount_difference: pending_amount_difference,
                    };
                    finalData.values_changed = true;
                    finalData.process_status = "PENDING";
                } else {
                    finalData.difference_values = {
                        total_amount_difference: 0,
                        paid_amount_difference: 0,
                        pending_amount_difference: 0,
                    };
                    finalData.values_changed = false;
                }
            }
        }
    }


    async seperateExistedAndNotExistedData(body, existedData) {
        const matchedObjects = [];
        const notMatchedObjects = body.filter(objOne => {
            const matchingObj = existedData.find(objTwo =>
                objOne.accession_id === objTwo.accession_id &&
                new Date(objOne.date_of_service).toISOString() === new Date(objTwo.date_of_service).toISOString()
            );

            if (matchingObj) {
                matchedObjects.push({ ...objOne });
                return false; // Filter out the matched object
            } else {
                return true; // Keep the not matched object
            }
        });

        return { matchedObjects, notMatchedObjects };
    }

    async toInsertStats(notMatchedObjects) {
        if (notMatchedObjects.length > 0) {
            await this.revenueStatsService.insertStats(notMatchedObjects);
        }
    }

    async toUpdateStats(matchedObjects, revenueStatsData) {
        if (matchedObjects.length > 0) {

            // Function for findning the matched obj
            const findMatch = (arr, marketerId, date) => {
                return arr.find(obj =>
                    obj.marketer_id === marketerId && new Date(obj.date).toISOString() === new Date(date).toISOString()
                );
            };


            matchedObjects.forEach(objeData => {
                const matchingObj = findMatch(revenueStatsData, objeData.marketer_id, objeData.date);

                if (matchingObj) {
                    // Need to merge the new stats and already existed stats
                    this.mergeNewStatsAndExistedStatsAmounts(matchingObj, objeData);
                }
            });

            // Update the existed revenue stats
            this.updateExistedStats(matchedObjects);
        }
    }


    async mergeNewStatsAndExistedStatsAmounts(matchingObj, objeData) {
        // for Hospital Wise Counts merge
        this.mergeForHospitalWiseCounts(matchingObj, objeData);

        // For case type wise counts merge
        this.mergeForCaseTypeWiseCounts(matchingObj, objeData);

        // for final totals
        objeData.total_amount += matchingObj.total_amount;
        objeData.paid_amount += matchingObj.paid_amount;
        objeData.pending_amount += matchingObj.pending_amount;

    }

    async mergeForHospitalWiseCounts(matchingObj, objeData) {
        matchingObj.hospital_wise_counts.forEach((matchingItem) => {
            // Check if the hospital is not present in arrayOne
            const existingHospital = objeData.hospital_wise_counts.find((item) => item.hospital === matchingItem.hospital);

            if (!existingHospital) {
                // If the hospital is not present, push the matchingObj.hospital_wise_counts into objeData.hospital_wise_counts
                objeData.hospital_wise_counts.push(matchingItem);
            } else {
                // If the hospital is present, combine values
                existingHospital.total_amount += matchingItem.total_amount;
                existingHospital.paid_amount += matchingItem.paid_amount;
                existingHospital.pending_amount += matchingItem.pending_amount;

                // Iterate through case_type_wise_counts and combine values
                existingHospital.case_type_wise_counts.forEach((existingCase, index) => {
                    existingCase.total_amount += matchingItem.case_type_wise_counts[index].total_amount;
                    existingCase.paid_amount += matchingItem.case_type_wise_counts[index].paid_amount;
                    existingCase.pending_amount += matchingItem.case_type_wise_counts[index].pending_amount;
                });
            }
        });
    }

    async mergeForCaseTypeWiseCounts(matchingObj, objeData) {
        objeData.case_type_wise_counts.forEach(obje => {
            // Find the matching object in matchingObj
            const matchingObject = matchingObj.case_type_wise_counts.find(matching => matching.case_type === obje.case_type);

            // If a matching object is found, update the values in objeData
            if (matchingObject) {
                obje.total_amount += matchingObject.total_amount;
                obje.paid_amount += matchingObject.paid_amount;
                obje.pending_amount += matchingObject.pending_amount;
            }
        });
    }

    async updateExistedStats(matchedObjects) {

        // Need to prepeare the SQl raw query to bulk update revenue stats based on the marketer_id and date
        const convertedData = matchedObjects.map(entry => {
            const formattedDate = new Date(entry.date).toISOString();
            return `(
                    '${entry.marketer_id}',
                    '${formattedDate}'::timestamp,
                    ${entry.total_amount},
                    ${entry.paid_amount},
                    ${entry.pending_amount},
                    ARRAY[${entry.case_type_wise_counts.map(item => `'{"case_type":"${item.case_type}","total_amount":${item.total_amount},"paid_amount":${item.paid_amount},"pending_amount":${item.pending_amount}}'`)}]::jsonb[],  
                    ARRAY[${entry.hospital_wise_counts.map(item => `
                      jsonb_build_object(
                        'hospital', '${item.hospital}',
                        'total_amount', ${item.total_amount},
                        'paid_amount', ${item.paid_amount},
                        'pending_amount', ${item.pending_amount},
                        'case_type_wise_counts', ARRAY[${item.case_type_wise_counts.map(e => `
                          jsonb_build_object(
                            'case_type', '${e.case_type}',
                            'total_amount', ${e.total_amount},
                            'paid_amount', ${e.paid_amount},
                            'pending_amount', ${e.pending_amount}
                          )::jsonb`)}]
                      )::jsonb`
            )}]
                  )`;
        });
        const finalString = convertedData.join(',');

        await this.revenueStatsService.updateManyStats(finalString);
    }

    async updateRawStats(matchedObjects) {
        if (matchedObjects.length > 0) {

            // Preparing the SQL raw query for bulk updating the raw stats based on the accession_id and date_of_service
            const convertedData = matchedObjects.map(entry => {
                const formattedCptCodes = entry.cpt_codes.map(code => `('${code}'::jsonb)`).join(', ');
                const formattedLineItemTotal = entry.line_item_total.map(total => `'${total}'::jsonb`).join(', ');
                const formattedInsurancePaymentAmount = entry.insurance_payment_amount.map(total => `'${total}'::jsonb`).join(', ');
                const formattedInsuranceAdjustmentAmount = entry.insurance_adjustment_amount.map(total => `'${total}'::jsonb`).join(', ');
                const formattedInsuranceWriteOfAmount = entry.insurance_write_of_amount.map(total => `'${total}'::jsonb`).join(', ');
                const formattedPatientPaymentAmount = entry.patient_payment_amount.map(total => `'${total}'::jsonb`).join(', ');
                const formattedPatientAdjustmentAmount = entry.patient_adjustment_amount.map(total => `'${total}'::jsonb`).join(', ');
                const formattedPatientWriteOfAmount = entry.patient_write_of_amount.map(total => `'${total}'::jsonb`).join(', ');
                const formattedLineItemBalance = entry.line_item_balance.map(total => `'${total}'::jsonb`).join(', ');

                const formattedDate = new Date(entry.date_of_service).toISOString();
                const formattedMarketers = entry.hospital_marketers.map(m => `('${JSON.stringify(m)}'::jsonb)`).join(', ');

                const formattedQueryEntry = `('${entry.case_id}', '${entry.hospital}', '${entry.accession_id}', ARRAY[${formattedCptCodes}]::jsonb[], ARRAY[${formattedLineItemTotal}]::jsonb[], ARRAY[${formattedInsurancePaymentAmount}]::jsonb[], ARRAY[${formattedInsuranceAdjustmentAmount}]::jsonb[], ARRAY[${formattedInsuranceWriteOfAmount}]::jsonb[], ARRAY[${formattedPatientPaymentAmount}]::jsonb[], ARRAY[${formattedPatientAdjustmentAmount}]::jsonb[], ARRAY[${formattedPatientWriteOfAmount}]::jsonb[], ARRAY[${formattedLineItemBalance}]::jsonb[], '${entry.insurance_name}', ${entry.total_amount}, ${entry.paid_amount}, ${entry.pending_amount}, '{"total_amount_difference":${entry.difference_values.total_amount_difference},"paid_amount_difference":${entry.difference_values.paid_amount_difference},"pending_amount_difference":${entry.difference_values.pending_amount_difference}}'::jsonb, ${entry.values_changed}, '${entry.process_status}', '${entry.payment_status}', '${formattedDate}'::timestamp, ARRAY[${formattedMarketers}]::jsonb[], '${entry.patient_id}')`;
                return formattedQueryEntry;
            });

            const finalString = convertedData.join(',');

            await this.revenueStatsService.updateManyRaw(finalString);
        }
    }

    updateCaseTypeInCsv(lowercaseCaseType) {
        if (lowercaseCaseType === "pad_alzheimers") {
            lowercaseCaseType = "pad"
        }
        else if (lowercaseCaseType === "pulmonary_panel") {
            lowercaseCaseType = "pulmonary"
        }
        else if (lowercaseCaseType === "cgx_panel") {
            lowercaseCaseType = "cgx"
        }
        else if (lowercaseCaseType === "pgx_test") {
            lowercaseCaseType = "pgx"
        }
        return lowercaseCaseType
    }

    mergedStatsData(revenueStatsData, volumeStatsData) {

        let mergedStats = [];

        // Merge the arrays based on marketer_id
        mergedStats = volumeStatsData.map(volumeStat => {
            const matchingRevenueStat = revenueStatsData.find(revenueStat => revenueStat.marketer_id === volumeStat.marketer_id);

            if (matchingRevenueStat) {
                return {
                    _sum: { ...volumeStat._sum, ...matchingRevenueStat._sum },
                    marketer_id: volumeStat.marketer_id
                };
            } else {
                return volumeStat;
            }
        });

        // Check for unmatched revenueStatsData and add them to the mergedStats
        revenueStatsData.forEach(revenueStat => {
            const existingStat = mergedStats.find(mergedStat => mergedStat.marketer_id === revenueStat.marketer_id);
            if (!existingStat) {
                mergedStats.push(revenueStat);
            }
        });

        return mergedStats;
    }


    async groupRevenueStatsData(statsData) {
        const groupedData = statsData.reduce((result, item) => {
            // Increment the total_cases for each case_type_wise_counts
            item.case_type_wise_counts.forEach((caseType) => {
                const { case_type, paid_amount, total_amount, pending_amount } = caseType;

                // If the case_type doesn't exist in the result object, create a new entry
                if (!result[case_type]) {
                    result[case_type] = {
                        case_type: case_type,
                        paid_amount: 0,
                        pending_amount: 0,
                        total_amount: 0,
                    };
                }

                // Increment the counts for the specific case_type
                result[case_type].pending_amount += pending_amount;
                result[case_type].paid_amount += paid_amount;
                result[case_type].total_amount += total_amount;
            });

            return result;
        }, {});


        // Convert the groupedData object back to an array
        const groupedArray = Object.values(groupedData);

        return groupedArray;
    }

    mergeIndividualVolumeAndRevenueStats(revenueStatsData, volumeStatsData) {
        const mergedData = revenueStatsData.map(revenueItem => {
            const matchingVolumeItem = volumeStatsData.find(volumeItem =>
                volumeItem.marketer_id === revenueItem.marketer_id && volumeItem.hospital === revenueItem.hospital
            );

            return {
                marketer_id: revenueItem.marketer_id,
                hospital: revenueItem.hospital,
                revenue_stats: {
                    paid_amount: revenueItem.paid_amount,
                    total_amount: revenueItem.total_amount,
                    pending_amount: revenueItem.pending_amount,
                    case_type_wise_counts: { ...revenueItem.case_type_wise_counts }
                },
                volume_stats: { ...matchingVolumeItem }
            };

        });


        return mergedData;
    }

}