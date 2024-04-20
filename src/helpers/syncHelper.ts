import { Injectable } from "@nestjs/common";
import { CaseTypesService } from "src/case-types/case-types.service";
import { ARCHIVED, CASE_TYPE_MAPPING, keyMapping } from "src/constants/lisConstants";
import { FacilitiesService } from "src/facilities/facilities.service";
import { InsurancesService } from "src/insurances/insurances.service";
import { LabsService } from "src/labs/labs.service";
import { LisService } from "src/lis/lis.service";
import { MghSyncService } from "src/mgh-sync/mgh-sync.service";
import { SalesRepService } from "src/sales-rep/sales-rep.service";
import { SyncService } from "src/sync/sync.service";
import { SalesRepsTargetsAchivedService } from 'src/sales-reps-targets-achived/sales-reps-targets-achived.service';


@Injectable()
export class SyncHelpers {

    constructor(
        private readonly lisService: LisService,
        private readonly caseTypesService: CaseTypesService,
        private readonly facilitiesService: FacilitiesService,
        private readonly insurancesService: InsurancesService,
        private readonly SyncService: SyncService,
        private readonly salesRepsService: SalesRepService,
        private readonly labsService: LabsService,
        private readonly mghLisService: MghSyncService,
        private readonly salesRepsTargetsAchivedService: SalesRepsTargetsAchivedService

    ) { }


    getFromAndToDates(days: number) {
        const currentDate = new Date();
        const previousDate = new Date(currentDate);

        previousDate.setDate(currentDate.getDate() - days);

        // Set the time to the start of the day (00:00:00)
        previousDate.setUTCHours(0, 0, 0, 0);

        return {
            fromDate: previousDate,
            toDate: currentDate
        };
    }


    async getCases(fromDate, facilities) {
        try {
            let query = {
                status: { $nin: ["ARCHIVE", "ARCHIVED"] },
                created_at: {
                    $gte: "2023-10-01",
                    // $lte: toDate
                },
                hospital: {
                    $in: facilities
                }
            };

            const select = {
                accession_id: 1,
                case_types: 1,
                ordering_physician: 1,
                hospital: 1,
                hospital_marketers: 1,
                "billing_info.insurance.primary_insurance.payor": 1,
                received_date: 1,
                collection_date: 1,
                'patient_info._id': 1,
                status: 1,
                lab: 1
            };

            const cases = await this.lisService.getCases(query, select);

            return cases;
        } catch (err) {
            throw err;
        }
    }


    async getAllAnalyticsData() {
        const caseTypes = await this.caseTypesService.getAllCaseTypes();

        const facilities = await this.facilitiesService.getAllFacilitiesData();

        const insurancePayers = await this.insurancesService.getAllInsurances();

        const labs = await this.labsService.getAllLabs();

        return { caseTypes, facilities, insurancePayers, labs };
    }


    modifyCasesForPatientClaims(cases, analyticsData) {
        const facilities = analyticsData.facilities;
        const caseTypes = analyticsData.caseTypes;
        const insurancePayers = analyticsData.insurancePayers;
        const labs = analyticsData.labs;

        let modifiedArray = [];

        for (let i = 0; i < cases.length; i++) {
            const insurancePayer = cases[i].billing_info?.insurance?.primary_insurance?.payor;
            let claimData: any = {};


            claimData.accessionId = cases[i].accession_id;
            claimData.serviceDate = cases[i].received_date;
            claimData.collectionDate = cases[i].collection_date;
            claimData.patientId = cases[i].patient_info._id.toString();

            if (cases[i].status == "COMPLETE" || cases[i].status == "COMPLETED") claimData.reportsFinalized = true;

            if (cases[i].ordering_physician) claimData.physicianId = cases[i].ordering_physician.toString();

            if (cases[i].hospital) claimData = this.forFacilityAndSalesRep(cases[i], facilities, claimData);

            if (insurancePayer) claimData = this.forInsurancePayerId(insurancePayer, insurancePayers, claimData);

            if (cases[i].lab) claimData = this.forLabId(cases[i], labs, claimData);

            claimData = this.forCaseTypeId(cases[i], caseTypes, claimData);

            modifiedArray.push(claimData);
        }


        return modifiedArray;
    }


    modifyMghCasesForPatientClaims(cases, analyticsData) {
        const facilities = analyticsData.facilities;
        const caseTypes = analyticsData.caseTypes;
        const insurancePayers = analyticsData.insurancePayers;
        const labs = analyticsData.labs;

        let modifiedArray = [];

        for (let i = 0; i < cases.length; i++) {
            const insurancePayer = cases[i].billing_info?.insurance?.primary_insurance?.payor;
            let claimData: any = {};


            claimData.accessionId = cases[i].accession_id;
            claimData.serviceDate = cases[i].received_date;
            claimData.collectionDate = cases[i].collection_date;
            claimData.patientId = cases[i].patient_info._id.toString();

            if (cases[i].status == "COMPLETE" || cases[i].status == "COMPLETED") claimData.reportsFinalized = true;

            if (cases[i].ordering_physician) claimData.physicianId = cases[i].ordering_physician.toString();

            if (cases[i].hospital) claimData = this.forMghFacilityAndSalesRep(cases[i], facilities, claimData);

            if (insurancePayer) claimData = this.forInsurancePayerId(insurancePayer, insurancePayers, claimData);

            if (cases[i].lab) claimData = this.forLabId(cases[i], labs, claimData);

            claimData = this.forCaseTypeId(cases[i], caseTypes, claimData);

            modifiedArray.push(claimData);
        }


        return modifiedArray;
    }


    async insertPatientClaims(cases) {
        const analyticsData = await this.getAllAnalyticsData();

        let modifiedArray = this.modifyCasesForPatientClaims(cases, analyticsData);

        let data;
        if (modifiedArray.length) {

            const seperatedArray = await this.seperateModifiedArray(modifiedArray);

            data = this.insertOrUpdateModifiedClaims(seperatedArray);
        }
        return data;
    }


    async insertMghPatientClaims(cases) {
        const analyticsData = await this.getAllAnalyticsData();

        let modifiedArray = this.modifyMghCasesForPatientClaims(cases, analyticsData);

        let data;
        if (modifiedArray.length) {

            const seperatedArray = await this.seperateModifiedArray(modifiedArray);

            data = this.insertOrUpdateModifiedClaims(seperatedArray);
        }
        return data;
    }


    forLabId(cases, labs, claimData) {
        const lab = labs.find(lab => lab.refId === cases.lab.toString());

        if (lab) {
            claimData.labId = lab.id;
        }
        return claimData;
    }


    forCaseTypeId(cases, caseTypes, claimData) {
        const caseType = caseTypes.find(type => type.name === cases.case_types[0]);

        if (caseType) {
            claimData.caseTypeId = caseType.id;
        }

        return claimData;
    }


    forFacilityAndSalesRep(cases, facilities, claimData) {
        const facility = facilities.find(facility => facility.refId === cases.hospital.toString());

        if (facility) {
            claimData.facilityId = facility.id;
            claimData.salesRepId = facility.salesRepId;
        }

        return claimData;
    }


    forMghFacilityAndSalesRep(cases, facilities, claimData) {
        const facility = facilities.find(facility => facility.mghRefId === cases.hospital.toString());

        if (facility) {
            claimData.facilityId = facility.id;
            claimData.salesRepId = facility.salesRepId;
        }

        return claimData;
    }


    forInsurancePayerId(insurancePayer, insurancePayers, claimData) {
        const insurancePayerName = insurancePayer.trim().toLowerCase();

        const insurance = insurancePayers.find(payer => payer.name.trim().toLowerCase() === insurancePayerName);

        if (insurance) {
            claimData.insurancePayerId = insurance.id;
        }

        return claimData;
    }


    async seperateModifiedArray(modifiedArray) {
        const accessionIds = modifiedArray.map((e) => e.accessionId);

        const alreadyInsertedClaims: any = await this.SyncService.getPatientClaims(accessionIds);

        let notExistedArray = [];
        let existedArray = [];

        if (alreadyInsertedClaims.length === 0) {

            notExistedArray = modifiedArray;

        } else {

            const existedAccessionIds = alreadyInsertedClaims.map((e) => e.accession_id);


            const matched = [];
            const notMatched = [];

            modifiedArray.forEach(item => {
                if (existedAccessionIds.includes(item.accessionId)) {
                    matched.push(item);
                } else {
                    notMatched.push(item);
                }
            });

            notExistedArray = notMatched;
            existedArray = matched;
        }


        return {
            existedArray, notExistedArray
        };
    }


    async insertOrUpdateModifiedClaims(seperatedArray) {
        const batchSize = 2000;

        const existedData = seperatedArray.existedArray;
        const notExistedData = seperatedArray.notExistedArray;

        if (existedData.length > 0) {

            for (let i = 0; i < existedData.length; i += batchSize) {
                const batch = existedData.slice(i, i + batchSize);

                const convertedData = batch.map(entry => {

                    const serviceDate = entry.serviceDate ? new Date(entry.serviceDate).toISOString() : "";
                    const collectionDate = entry.collectionDate ? new Date(entry.collectionDate).toISOString() : "";

                    const caseTypeId = entry.caseTypeId ? entry.caseTypeId : null;
                    const patientId = entry.patientId || 0;
                    const reportsFinalized = entry.reportsFinalized ? entry.reportsFinalized : false;
                    const physicianId = entry.physicianId ? entry.physicianId : null;
                    const facilityId = entry.facilityId ? entry.facilityId : null;
                    const salesRepId = entry.salesRepId ? entry.salesRepId : null;
                    const insurancePayerId = entry.insurancePayerId ? entry.insurancePayerId : null;
                    const labId = entry.labId ? entry.labId : null;

                    const formattedQueryEntry = `('${entry.accessionId}', '${serviceDate}'::timestamp, '${collectionDate}'::timestamp, ${caseTypeId}, '${patientId}', ${reportsFinalized}, '${physicianId}', ${facilityId}, ${salesRepId}, ${insurancePayerId}, ${labId})`;
                    return formattedQueryEntry;
                });

                const finalString = convertedData.join(', ');

                console.log({ Updated: i });
                this.SyncService.updateManyPatientClaims(finalString);
            }
        }

        if (notExistedData.length > 0) {

            for (let i = 0; i < notExistedData.length; i += batchSize) {
                console.log({ Inserted: i });
                const batch = notExistedData.slice(i, i + batchSize);
                this.SyncService.insertPatientClaims(batch);
            }
        }

        return { existedData, notExistedData };

    }


    async getArchivedCases(fromDate, toDate) {
        try {
            let query = {
                // updated_at: {
                //     $gte: fromDate,
                //     $lte: toDate,
                // },
                status: { $in: ["ARCHIVE", ARCHIVED] }
            };

            const select = {
                accession_id: 1,
                status: 1
            };

            const cases = await this.lisService.getCases(query, select);

            return cases;
        } catch (err) {
            throw err;
        }
    }


    async modifyInsurancePayors(data) {
        // Extracting _id values from data
        const lisInsurancePayorsIdsArray = data.map(item => item._id.toString());

        // Fetching matching data from analytics db
        const matchingData = await this.insurancesService.getrefIdsFromInsurancePayors(lisInsurancePayorsIdsArray);

        const AnalyticsInsurancePayorsIdsArray = matchingData.rows.map(item => item.ref_id);

        // Finding the new insurances Ids from labsquire database
        const result = lisInsurancePayorsIdsArray.filter(item => !AnalyticsInsurancePayorsIdsArray.includes(item));

        const modifiedData = data
            .filter(element => result.includes(element._id.toString()))
            .map(element => ({ name: element.name, refId: element._id.toString() }));

        return modifiedData;
    }


    async modifyCaseTypes(data) {

        //need to check if case-type code is in the analytics db or not
        const lisCaseTypeCodesArray = data.map(item => item.code);

        // Fetching matching data from analytics db
        const matchingData = await this.caseTypesService.getCaseTypes(lisCaseTypeCodesArray);

        const AnalyticsCasetypesArray = matchingData.rows.map(item => item.name);

        // Finding the new case-types from labsquire database
        const result = lisCaseTypeCodesArray.filter(item => !AnalyticsCasetypesArray.includes(item));

        const modifiedData = data
            .filter(element => result.includes(element.code))
            .map(element => ({ name: element.code, displayName: element.name }));

        return modifiedData;
    }


    getHospitalsWithNoManagers(facilitiesData, marketersData) {

        const facilitiesDataArray = facilitiesData.map(item => item._id.toString());

        const result = facilitiesDataArray.filter(item => !marketersData.includes(item));

        return result;
    }


    async getSalesRepsData(userType, datesFilter) {

        const query = {
            user_type: userType,
            status: "ACTIVE",
            // updated_at: {
            //     $gte: datesFilter.fromDate,
            //     $lte: datesFilter.toDate,
            // },
        };


        const salesRepsData = await this.lisService.getUsers(query);

        return salesRepsData;
    }


    async getNotExistingIds(data) {

        // fetching all marketing managers id's
        const mappedSalesRepsIds = data.map((item) => item._id.toString());

        // fetching matching id's from analytics db
        const matchedIds = await this.salesRepsService.getMatchedSalesRepsIds(mappedSalesRepsIds);

        // Extracts the 'ref_id' values from the rows returned by the database query and stores them in the values in array
        const refIdValues = matchedIds.rows.map((obj) => obj.ref_id);

        const unMatchedIds = mappedSalesRepsIds.filter((id) => !refIdValues.includes(id)); // finding unmatched IDs

        return unMatchedIds;
    }


    async getFinalManagersData(managersData) {

        const finalArray = [];

        const notExistedIds = await this.getNotExistingIds(managersData);

        // constructing the final object by taking data from lis data
        managersData.forEach((item) => {

            if (notExistedIds.includes(item._id.toString())) {

                finalArray.push({
                    name: item.first_name + " " + item.last_name,
                    refId: item._id.toString(),
                    roleId: 2,
                });
            }
        });

        return finalArray;
    }


    async getFinalSalesRepsData(marketersData) {

        let finalArray = [];


        const withReportingTo = marketersData.filter(obj => obj.reporting_to && obj.reporting_to.length > 0);
        const withoutReportingTo = marketersData.filter(obj => !obj.reporting_to || obj.reporting_to.length === 0);

        if (withoutReportingTo.length) {
            finalArray = await this.getFinalManagersData(withoutReportingTo);

            if (finalArray.length) {
                let insertedData = await this.salesRepsService.insertSalesRepsManagers(finalArray);

                if (insertedData.length) {
                    const ids = insertedData.map((e) => e.id);
                    this.salesRepsService.updateSalesRepsManagersData(ids);
                }

            }
        }

        if (withReportingTo.length) {
            finalArray = await this.containsReportingTo(withReportingTo);

            this.salesRepsService.insertSalesReps(finalArray);

        }
    }

    async containsReportingTo(marketersData) {
        const finalArray = [];

        const managersIds = marketersData.map((item) => item.reporting_to[0].toString());

        const managersIdsAndRefIds = await this.salesRepsService.getSalesRepsIdsAndRefIds(managersIds);

        marketersData.map((marketer) => {
            let reportingTo = 2;

            // Check if hospital_marketing_manager exists
            if (marketer.reporting_to.length > 0) {
                // Find corresponding manager data
                const matchedObj = managersIdsAndRefIds.find((row) => row.ref_id === marketer.reporting_to[0].toString());

                if (matchedObj) {
                    reportingTo = matchedObj.id as number;
                }
            }

            finalArray.push({
                name: marketer.first_name + " " + marketer.last_name,
                refId: marketer._id.toString(),
                reportingTo: reportingTo,
                roleId: 1,
            });
        });


        return finalArray;
    }


    async getFacilitiesData(salesRepsData) {

        const salesRepsAndFacilitiesData = [];
        const hospitalsData = new Set();

        const idsArray = salesRepsData.map((item) => ({
            hospitals: item.hospitals,
            id: item._id.toString(),
        }));

        idsArray.forEach((item) => {
            item.hospitals.forEach((hospital) => {
                const hospitalId = hospital.toString();
                const itemId = item.id;

                if (!hospitalsData.has(hospitalId)) { // Check if the hospital has already been added

                    salesRepsAndFacilitiesData.push({
                        id: itemId,
                        hospital: hospitalId,
                    });
                    hospitalsData.add(hospitalId);
                }
            });
        });

        return salesRepsAndFacilitiesData;
    }


    async getFacilitiesNotExisting(facilitiesData) {

        const hospitalIds = facilitiesData.map((item) => item._id);

        const matchedFacilitiesIds = await this.facilitiesService.getFacilitiesRefIds(hospitalIds); // fetching matched facilities id from analytics db

        const refIdValues = matchedFacilitiesIds.rows.map((obj) => obj.ref_id);

        const unMatchedFacilities = facilitiesData.filter((id) => !refIdValues.includes(id)); // fetching un-matched id of facilities

        if (unMatchedFacilities.length) {
            unMatchedFacilities.forEach(rep => {
                rep._id = rep._id.toString();
            });
        }
        return unMatchedFacilities;
    }


    async getSalesRepsIdsandRefIds(salesRepsData) {

        const salesRepsIds = salesRepsData.map((item) => item.id); // fetching sales reps id's

        const salesRepsIdsAndRefIdsData = await this.salesRepsService.getSalesRepsIdsAndRefIds(salesRepsIds); // fetching sales reps id and ref_id from analytics db

        return salesRepsIdsAndRefIdsData;
    }


    async getSalesRepsAndFacilitiesIds(salesRepsIdsAndRefIds, salesRepsAndFacilitiesData) {

        salesRepsIdsAndRefIds.forEach((row) => {

            salesRepsAndFacilitiesData.find((item) => {

                if (item.id === row.ref_id.toString()) {

                    item.salesRepsId = row.id;
                }
            });
        });
        return salesRepsAndFacilitiesData;
    }


    async getFinalArray(data, salesRepsAndFacilityData) {

        const finalArray = [];

        const facilitiesIds = data.map((item) => item._id.toString()); // fetching facilitiec id from hospitals data

        salesRepsAndFacilityData.forEach((item) => {

            if (facilitiesIds.includes(item.hospital)) {

                // Find the corresponding object in data
                const matchingObject = data.find(
                    (obj) => obj._id.toString() === item.hospital,
                );

                if (matchingObject) {
                    finalArray.push({
                        name: matchingObject.name,
                        refId: matchingObject._id.toString(),
                        salesRepId: item.salesRepsId,
                    });
                }

            }
        });

        return finalArray;
    }

    async getSalesRepsByFacilites(facilities) {
        const query = {
            user_type: { $in: ["MARKETER", "HOSPITAL_MARKETING_MANAGER"] },
            status: "ACTIVE",
            hospitals: {
                $in: facilities
            }
        };


        const select = {
            _id: 1,
            hospitals: 1
        };

        const salesRepsData = await this.lisService.getUsers(query, select);

        if (salesRepsData.length) {
            salesRepsData.forEach(rep => {
                rep._id = rep._id.toString();
                rep.hospitals = rep.hospitals.map(hospitalId => hospitalId.toString());
            });

        }

        return salesRepsData;
    }


    transformFacilities(salesRepsData, unMatchedFacilities) {
        unMatchedFacilities.forEach(facility => {
            // Check if the facility _id is included in any hospital in salesRepsData
            const matchedRep = salesRepsData.find(rep =>
                rep.hospitals.includes(facility._id)
            );

            // If a match is found, add the _id from salesRepsData to the facility object
            if (matchedRep) {
                facility.salesRepId = matchedRep._id;
            }
        });

        return unMatchedFacilities;
    }


    async modifyFacilitiesData(transformedArray) {

        const salesRepsIdsAndRefIdsData = await this.getuniqueSalesReps(transformedArray);

        const updatedFacilities = transformedArray.map(facility => {
            const salesRep = salesRepsIdsAndRefIdsData.find(rep => rep.ref_id.toString() === facility.salesRepId);
            return {
                name: facility.name,
                refId: facility._id,
                salesRepId: salesRep ? salesRep.id : 9
            };
        });

        return updatedFacilities;
    }


    async modifyMghFacilitiesData(transformedArray) {

        const salesRepsIdsAndRefIdsData = await this.getuniqueMghSalesReps(transformedArray);
        console.log({ salesRepsIdsAndRefIdsData: salesRepsIdsAndRefIdsData[0] });
        console.log({ transformedArray: transformedArray[0] });

        const updatedFacilities = transformedArray.map(facility => {
            const salesRep = salesRepsIdsAndRefIdsData.find(rep => rep.ref_id.toString() === facility.salesRepId);
            return {
                name: facility.name,
                mghRefId: facility.mghRefId,
                salesRepId: salesRep ? salesRep.id : 9
            };
        });

        return updatedFacilities;
    }

    async getuniqueSalesReps(transformedArray) {
        const salesRepsIds = transformedArray.map((e) => e.salesRepId);



        const uniqueSalesRepsIds = [...new Set(salesRepsIds)];


        const salesRepsIdsAndRefIdsData = await this.salesRepsService.getSalesRepsIdsAndRefIds(uniqueSalesRepsIds);
        return salesRepsIdsAndRefIdsData;
    }


    async getuniqueMghSalesReps(transformedArray) {
        const salesRepsIds = transformedArray.map((e) => e.salesRepId);



        const uniqueSalesRepsIds = [...new Set(salesRepsIds)];


        const salesRepsIdsAndRefIdsData = await this.salesRepsService.getMghSalesRepsIdsAndRefIds(uniqueSalesRepsIds);
        return salesRepsIdsAndRefIdsData;
    }


    modifySalesRepRevenuCaseTypeWise(salesReps) {
        // Extract unique months and case types
        let uniqueMonths = Array.from(new Set(salesReps.map(item => item.month)));
        let uniqueCaseTypes = Array.from(new Set(salesReps.map(item => item.case_type_name)));

        // Create result array
        let resultArray = [];

        // Iterate over unique case types
        uniqueCaseTypes.forEach(caseType => {
            // Iterate over unique months
            uniqueMonths.forEach(month => {
                // Find the entry in salesReps for the current case type and month
                let entry = salesReps.find(item => item.case_type_name === caseType && item.month === month);

                if (entry) {
                    // If the entry exists, push it to the result array
                    resultArray.push(entry);
                } else {
                    // If the entry doesn't exist, push a new object with total_cases: 0
                    resultArray.push({
                        case_type_id: salesReps.find(item => item.case_type_name === caseType).case_type_id,
                        case_type_name: caseType,
                        month: month,
                        paid_amount: 0
                    });
                }
            });
        });

        return resultArray;
    }


    modifySalesRepVolumeCaseTypeWise(salesReps) {
        // Extract unique months and case types
        let uniqueMonths = Array.from(new Set(salesReps.map(item => item.month)));
        let uniqueCaseTypes = Array.from(new Set(salesReps.map(item => item.case_type_name)));

        // Create result array
        let resultArray = [];

        // Iterate over unique case types
        uniqueCaseTypes.forEach(caseType => {
            // Iterate over unique months
            uniqueMonths.forEach(month => {
                // Find the entry in salesReps for the current case type and month
                let entry = salesReps.find(item => item.case_type_name === caseType && item.month === month);

                if (entry) {
                    // If the entry exists, push it to the result array
                    resultArray.push(entry);
                } else {
                    // If the entry doesn't exist, push a new object with total_cases: 0
                    resultArray.push({
                        case_type_id: salesReps.find(item => item.case_type_name === caseType).case_type_id,
                        case_type_name: caseType,
                        month: month,
                        total_cases: 0
                    });
                }
            });
        });

        return resultArray;
    }


    modifyLabs(labsData) {
        const modifiedData = labsData.map(item => ({
            refId: item._id.toString(),
            name: item.name,
            code: item.lab_code
        }));

        return modifiedData;
    }

    async insertOrUpdateLabs(modifiedData, refIds) {
        try {
            const existedLabs = await this.labsService.getLabsByRefIds(refIds);

            const existedLabsRefIds = existedLabs.map(e => e.ref_id);

            const notExisted = modifiedData.filter(obj => !existedLabsRefIds.includes(obj.refId));

            if (notExisted.length) {
                this.labsService.insertLabs(notExisted);
            }
        } catch (err) {
            throw err;
        }
    }

    async getMghSalesReps(query) {


        const select = {
            _id: 1,
            name: { $concat: ["$first_name", " ", "$last_name"] },
            user_type: 1
        };

        const salesRepsData = await this.mghLisService.getUsers(query, select);

        return salesRepsData;
    }


    async getExistedAndNotExistedReps(salesReps) {
        const analyticsSalesReps = await this.salesRepsService.getAllSalesReps();

        const existed = [];
        const notExisted = [];

        salesReps.forEach(modifiedRep => {
            const existingRep = analyticsSalesReps.find(rep => rep.name.toLowerCase() === modifiedRep.name.toLowerCase());
            if (existingRep) {
                existed.push({ mghRefId: modifiedRep.mghRefId, id: existingRep.id });
            } else {
                notExisted.push(modifiedRep);
            }
        });

        if (existed.length) {
            const convertedData = existed.map(entry => {

                const formattedQueryEntry = `(${entry.id}, '${entry.mghRefId}')`;
                return formattedQueryEntry;
            });

            const finalString = convertedData.join(', ');

            this.salesRepsService.updateSalesReps(finalString);

        }

        if (notExisted.length) {
            this.salesRepsService.insertSalesReps(notExisted);
        }

        return { existed, notExisted };
    }


    async insertOrUpdateMghFacilities(modifiedData) {
        const analyticsFacilities = await this.facilitiesService.getAllFacilitiesData();
        const existed = [];
        let notExisted = [];

        modifiedData.forEach(modifiedRep => {
            const existingRep = analyticsFacilities.find(rep => rep.name.toLowerCase() === modifiedRep.name.toLowerCase());
            if (existingRep) {
                existed.push({ mghRefId: modifiedRep.mghRefId.toString(), id: existingRep.id });
            } else {
                notExisted.push({ mghRefId: modifiedRep.mghRefId.toString(), name: modifiedRep.name });
            }
        });

        if (existed) {
            const convertedData = existed.map(entry => {

                const formattedQueryEntry = `(${entry.id}, '${entry.mghRefId}')`;
                return formattedQueryEntry;
            });

            const finalString = convertedData.join(', ');

            // this.facilitiesService.updateMghFacilities(finalString);

        }

        if (notExisted.length) {
            this.toInsertMghFacilities(notExisted);
        }

        return { existed, notExisted };

    }

    async toInsertMghFacilities(notExisted) {
        const notExistedFacilities = notExisted.map(e => e.mghRefId);

        const query = {
            status: "ACTIVE",
            user_type: { $in: ["MARKETER", "HOSPITAL_MARKETING_MANAGER"] },
            hospitals: {
                $in: notExistedFacilities
            }
        };


        const select = {
            _id: 1,
            hospitals: 1
        };

        const salesRepsData = await this.mghLisService.getUsers(query, select);


        let finalSalesReps = salesRepsData.map(item => {
            let newItem = { ...item }; // Create a copy of the object
            newItem._id = item._id.toString();
            newItem.hospitals = item.hospitals.map(objectId => objectId.toString());
            return newItem;
        });

        const transformedData = this.transformMghFacilities(finalSalesReps, notExisted);

        const salesReps = await this.getuniqueMghSalesReps(transformedData);

        const updatedFacilities = transformedData.map(facility => {
            const salesRep = salesReps.find(rep => rep.mgh_ref_id.toString() === facility.salesRepId);
            return {
                name: facility.name,
                mghRefId: facility.mghRefId,
                salesRepId: salesRep ? salesRep.id : null
            };
        });


        this.facilitiesService.insertfacilities(updatedFacilities);
    }


    transformMghFacilities(salesRepsData, unMatchedFacilities) {
        unMatchedFacilities.forEach(facility => {
            // Check if the facility _id is included in any hospital in salesRepsData
            const matchedRep = salesRepsData.find(rep =>
                rep.hospitals.includes(facility.mghRefId)
            );

            // If a match is found, add the _id from salesRepsData to the facility object
            if (matchedRep) {
                facility.salesRepId = matchedRep._id;
            }
        });

        return unMatchedFacilities;
    }


    async modifyMghInsurancePayors(payorsData) {
        const analyticsPayors = await this.insurancesService.getAllInsurances();

        const existed = [];
        const notExisted = [];

        payorsData.forEach(payor => {
            const existingRep = analyticsPayors.find(rep => rep.name.toLowerCase() === payor.name.toLowerCase());
            if (existingRep) {
                existed.push({ mghRefId: payor._id.toString(), id: existingRep.id });
            } else {
                notExisted.push(payor);
            }
        });

        if (existed.length) {
            const convertedData = existed.map(entry => {

                const formattedQueryEntry = `(${entry.id}, '${entry.mghRefId}')`;
                return formattedQueryEntry;
            });

            const finalString = convertedData.join(', ');

            this.insurancesService.updateMghSalesReps(finalString);
        }

        if (notExisted.length) {
            const modifiedData = notExisted.map(e => ({
                name: e.name,
                mghRefId: e._id.toString()
            }));

            this.insurancesService.insertInsurancePayors(modifiedData);
        }

        return { existed, notExisted };

    }

    async getMghCases(fromDate, facilities) {
        try {
            let query = {
                status: { $nin: ["ARCHIVE", "ARCHIVED"] },
                created_at: {
                    $gte: "2023-10-01",
                    // $lte: toDate
                },
                hospital: {
                    $in: facilities
                }
            };

            const select = {
                accession_id: 1,
                case_types: 1,
                ordering_physician: 1,
                hospital: 1,
                hospital_marketers: 1,
                "billing_info.insurance.primary_insurance.payor": 1,
                received_date: 1,
                collection_date: 1,
                'patient_info._id': 1,
                status: 1,
                lab: 1
            };

            const cases = await this.mghLisService.getCases(query, select);

            return cases;
        } catch (err) {
            throw err;
        }
    }


    parseMonth(monthString) {
        const [month, year] = monthString.split(' ');
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0); // Last day of the month

        // Format dates as YYYY-MM-DD
        const formattedStartDate = `${startDate.getFullYear()}-${('0' + (startDate.getMonth() + 1)).slice(-2)}-01`;
        const formattedEndDate = `${endDate.getFullYear()}-${('0' + (endDate.getMonth() + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;

        return { start_date: formattedStartDate, end_date: formattedEndDate };
    }


    targetsAchivedGrouping(data) {
        const groupedData = data.reduce((acc, curr) => {
            const key = `${curr.sales_rep_id}_${curr.start_date}_${curr.end_date}`;
            if (!acc[key]) {
                acc[key] = {
                    salesRepId: curr.sales_rep_id,
                    startDate: curr.start_date,
                    endDate: curr.end_date,
                    month: this.formateMonth(curr.month),
                    cases: []
                };
            }
            acc[key].cases.push({
                case_type: curr.case_type,
                facility_count: curr.facility_count,
                total_cases: curr.total_cases
            });
            return acc;
        }, {});

        const result = Object.values(groupedData);

        return result;
    }


    formateMonth(monthString) {
        const [month, year] = monthString.split(' ');
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
        const formattedMonth = ('0' + (monthIndex + 1)).slice(-2);
        return `${formattedMonth}-${year}`;
    }


    modifyTargetsAchived(claimsData) {
        const result = claimsData.map(item => {

            const casesObject = {};
            let totalA = 0; // Initialize totalA to 0
            let newFacilitiesA = 0;

            item.cases.forEach(({ case_type, total_cases, facility_count }) => {
                const key = CASE_TYPE_MAPPING[case_type];
                if (key) {
                    casesObject[key] = total_cases;
                    totalA += total_cases; // Add total_cases to totalA
                    newFacilitiesA += facility_count;
                }
            });
            delete item.cases;
            return { ...item, ...casesObject, totalA, newFacilitiesA };
        });

        return result;
    }


    async getExistedAndNotExistedTargetsAchived(result) {
        const repsAndMonthsData = result.map((e) => ({
            sales_rep_id: e.salesRepId,
            month: e.month
        }));

        const matchedData = await this.salesRepsTargetsAchivedService.findAchivedTargets(repsAndMonthsData);

        let existed = [];
        let notExisted = [];
        if (matchedData.length) {
            const matchedIdsAndMonths = matchedData.map(({ sales_rep_id, month }) => ({
                salesRepId: sales_rep_id,
                month
            }));

            // Filter the results array
            existed = result.filter(result =>
                matchedIdsAndMonths.find(({ salesRepId, month }) =>
                    result.salesRepId === salesRepId && result.month === month
                )
            );

            // need to add the existed key valies in existedData
            existed.forEach(existItem => {
                const matchedItem = matchedData.find(({ sales_rep_id, month }) =>
                    existItem.salesRepId === sales_rep_id && existItem.month === month
                );
                if (matchedItem) {
                    const convertedData = {};
                    for (let key in matchedItem) {
                        if (key !== 'sales_rep_id' && key !== 'start_date' && key !== 'end_date' && key !== 'month') {
                            const newKey = keyMapping[key] || key;
                            convertedData[newKey] = matchedItem[key];
                        }
                    }

                    // Update properties of existItem with convertedData values
                    for (let key in convertedData) {
                        if (existItem.hasOwnProperty(key)) {
                            existItem[key] = existItem[key] + convertedData[key];
                        }
                    }

                }
            });

            notExisted = result.filter(result =>
                !matchedIdsAndMonths.find(({ salesRepId, month }) =>
                    result.salesRepId === salesRepId && result.month === month
                )
            );
        } else {
            notExisted = [...result];
        }

        return { existed, notExisted };
    }


    async insertOrUpdateTargetsAchived(existed, notExisted) {

        if (notExisted.length) {
            console.log(123);
            await this.salesRepsTargetsAchivedService.insert(notExisted);
        }

        if (existed.length) {
            console.log(1234);
            const convertedData = existed.map(entry => {

                const startDate = entry.startDate ? new Date(entry.startDate).toISOString() : "";
                const endDate = entry.endDate ? new Date(entry.endDate).toISOString() : "";
                const month = entry.month ? entry.month : null;
                const covidA = entry.covidA || 0;
                const covidFluA = entry.covidFluA || 0;
                const clinicalA = entry.clinicalA || 0;
                const nailA = entry.nailA || 0;
                const pgxA = entry.pgxA || 0;
                const rppA = entry.rppA || 0;
                const toxA = entry.toxA || 0;
                const uaA = entry.uaA || 0;
                const utiA = entry.utiA || 0;
                const woundA = entry.woundA || 0;
                const cgxA = entry.cgxA || 0;
                const diabetesA = entry.diabetesA || 0;
                const padA = entry.padA || 0;
                const pulA = entry.pulA || 0;
                const gastroA = entry.gastroA || 0;
                const cardA = entry.cardA || 0;


                const formattedQueryEntry = `(${entry.salesRepId}, '${startDate}'::timestamp, '${endDate}'::timestamp, '${month}', ${covidA}, ${covidFluA}, ${clinicalA}, ${nailA}, ${pgxA}, ${rppA}, ${toxA}, ${uaA}, ${utiA}, ${woundA}, ${cgxA}, ${diabetesA}, ${padA}, ${pulA}, ${gastroA}, ${cardA})`;

                return formattedQueryEntry;
            });

            const finalString = convertedData.join(', ');

            this.salesRepsTargetsAchivedService.updateTargetAchieves(finalString);
        }
    }
    modifySalesRepTargetData(salesRepsTargetData) {
        const modifiedData = salesRepsTargetData.map(item => ({
            salesRepId: item.sales_rep_id,
            startDate: this.formatDate(new Date(item.start_date)),
            endDate: this.formatDate(new Date(item.end_date)),
            month: this.convertMonth(new Date(item.start_date)),
            covid: item.covid,
            covidFlu: item.covid_flu,
            clinical: item.clinical,
            gastro: item.gastro,
            nail: item.nail,
            pgx: item.pgx,
            rpp: item.rpp,
            tox: item.tox,
            ua: item.ua,
            uti: item.uti,
            wound: item.wound,
            card: item.card,
            cgx: item.cgx,
            diabetes: item.diabetes,
            pad: item.pad,
            pul: item.pul,
            total: item.total,
            newFacilities: item.new_facilities
        }));

        return modifiedData;
    }

    formatDate(date) {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    convertMonth(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${month}-${year}`;
    }

}

