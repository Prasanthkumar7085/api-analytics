import { Injectable } from "@nestjs/common";
import { CaseTypesService } from "src/case-types/case-types.service";
import { ARCHIVED } from "src/constants/lisConstants";
import { HOSPITAL_MARKETING_MANAGER, MARKETER } from "src/constants/messageConstants";
import { FacilitiesService } from "src/facilities/facilities.service";
import { InsurancesService } from "src/insurances/insurances.service";
import { LabsService } from "src/labs/labs.service";
import { LisService } from "src/lis/lis.service";
import { MghSyncService } from "src/mgh-sync/mgh-sync.service";
import { SalesRepService } from "src/sales-rep/sales-rep.service";
import { SyncService } from "src/sync/sync.service";


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
        private readonly mghLisService: MghSyncService

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


    async getCases(fromDate, toDate) {
        try {
            let query = {
                status: { $nin: ["ARCHIVE", "ARCHIVED"] },
                // updated_at: {
                //     $gte: fromDate,
                //     $lte: toDate
                // }
                hospital: {
                    $in: [
                        "6542b44b61003880354a7c5b",
                        "6542b44b61003880354a7c83",
                        "6542b44b61003880354a7cde",
                        "6542b44b61003880354a7ce3",
                        "6542b44b61003880354a7cf0",
                        "6542b44b61003880354a7d05",
                        "6542b44b61003880354a7d14",
                        "6542b44b61003880354a7d57",
                        "6542b44b61003880354a7d5b",
                        "6542b44b61003880354a7dd1",
                        "6542b44b61003880354a7dd2",
                        "6542b44b61003880354a7ddb",
                        "6542b44b61003880354a7de0",
                        "6542b44b61003880354a7e5f",
                        "6542b44b61003880354a7e60",
                        "6542b44b61003880354a7e69",
                        "6542b44b61003880354a7e7b",
                        "6542b44b61003880354a7ea3",
                        "6542b44b61003880354a7ea7",
                        "6542b44b61003880354a7eed",
                        "6542b44b61003880354a7f0e",
                        "6542b44b61003880354a7f0f",
                        "6542b44b61003880354a7f11",
                        "6542b44b61003880354a7f18",
                        "6542b44b61003880354a7f3a",
                        "6542b44b61003880354a7f3c",
                        "6543caa32745ccd610988adf",
                        "65442a432a8cb7633892f5c0",
                        "6545346082eac5036736e0c2",
                        "654ac0a375594f1d7e0464bb",
                        "654ac10d0ebb8a1d964499ce",
                        "6553d63adbb8c7545302bdcd",
                        "65905bd2cf65322ab3af8c82",
                        "659da608233407bb984bd8d8",
                        "65c3d6c44d7e316bedca6ce6",
                        "65ce4dcdefa4ece5e422e8fc",
                        "6542b44b61003880354a7cf9",
                        "6542b44b61003880354a7f39",
                        "6542b44b61003880354a7f3d",
                        "65442a432a8cb7633892f5b7",
                        "65442a432a8cb7633892f5bc",
                        "654430230f52345f0848ba13",
                        "654430230f52345f0848ba14",
                        "654430230f52345f0848ba15",
                        "6546ca63ddced41d2a3a51a8",
                        "6549520075594f1d7e040413",
                        "654abfef0faea61cfbe28d97",
                        "6553d3a58966f853db6a2f1b",
                        "6553d4e7d4114c5410dd6b1d",
                        "6553e98c207a13540a9f741c",
                        "6555300ec10a4be6a5b58bc1",
                        "6567bf508ae6d75ed6d0076a",
                        "659da7cc6a50fbbaf04525e2"
                    ]
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


    async insertPatientClaims(cases) {
        const analyticsData = await this.getAllAnalyticsData();

        let modifiedArray = this.modifyCasesForPatientClaims(cases, analyticsData);

        if (modifiedArray.length) {

            const seperatedArray = await this.seperateModifiedArray(modifiedArray);

            this.insertOrUpdateModifiedClaims(seperatedArray);
        }
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
            _id: {
                $in: [
                    "65cfa081112d60e565b73da3",
                    "65cfa19966fab7e5b9f45a47",
                    "65cf5a20cd2c7ce54e7177a5",
                    "65cfa4c6a2c4dce5a0007592",
                    "65cfa7ebf64af7e58b43e158",
                    "65cfa4566cd21ee4e3ffcb89",
                    "65cfab8744ae7ae53bda0d5c",
                    "65cf71d0e01fdcd8a23cf1de",
                    "65cfa7bf6cd21ee4e3ffce74"
                ]
            }
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
                await this.salesRepsService.insertSalesRepsManagers(finalArray);

                this.salesRepsService.updateSalesRepsManagersData();
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


    async getuniqueSalesReps(transformedArray) {
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

    async getMghSalesReps(datesFilter) {

        const query = {
            status: "ACTIVE",
            user_type: { $in: [HOSPITAL_MARKETING_MANAGER, MARKETER] },
            // updated_at: {
            //     $gte: datesFilter.fromDate,
            //     $lte: datesFilter.toDate,
            // },
            _id: {
                $in: [
                    "640b822542b30768cb575699",
                    "65301618d78bd4eaa12f281c",
                    "611fcb57b16f85217cf80d12",
                    "64b707d286f7f57a60b5a622",
                    "65301691d78bd4eaa12f2845",
                    "65d76ccf871d317cf358f1bd",
                    "651d7c490f68d73ac39a64b4",
                    "64a5a5acead06a14f9c10625",
                    "645bc32c04f62b2b3fdf788f"
                ]
            }
        };


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
        const notExisted = [];

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

            this.facilitiesService.updateMghFacilities(finalString);

        }

        if (notExisted.length) {
            this.toInsertMghFacilities(notExisted);
        }

    }

    async toInsertMghFacilities(notExisted) {
        const notExistedFacilities = notExisted.map(e => e.mghRefId);

        const query = {
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

        const salesReps = await this.getuniqueSalesReps(transformedData);

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
}
