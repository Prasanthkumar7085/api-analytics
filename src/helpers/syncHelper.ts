import { Injectable } from "@nestjs/common";
import { CaseTypesService } from "src/case-types/case-types.service";
import { ARCHIVED } from "src/constants/lisConstants";
import { MARKETER } from "src/constants/messageConstants";
import { FacilitiesService } from "src/facilities/facilities.service";
import { InsurancesService } from "src/insurances/insurances.service";
import { LisService } from "src/lis/lis.service";
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
        private readonly salesRepsService : SalesRepService,
        private readonly facilitiesService: FacilitiesService

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
                created_at: {
                    $gte: fromDate,
                    $lte: toDate,
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
                status: 1
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

        return { caseTypes, facilities, insurancePayers };
    }


    modifyCasesForPatientClaims(cases, analyticsData) {
        const facilities = analyticsData.facilities;
        const caseTypes = analyticsData.caseTypes;
        const insurancePayers = analyticsData.insurancePayers;

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

            claimData = this.forCaseTypeId(cases[i], caseTypes, claimData);

            modifiedArray.push(claimData);
        }

        return modifiedArray;
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


    insertOrUpdateModifiedClaims(seperatedArray) {

        const existedData = seperatedArray.existedArray;
        const notExistedData = seperatedArray.notExistedArray;

        if (existedData.length > 0) {

            const convertedData = existedData.map(entry => {

                const serviceDate = entry.serviceDate ? new Date(entry.serviceDate).toISOString() : "";
                const collectionDate = entry.collectionDate ? new Date(entry.collectionDate).toISOString() : "";

                const caseTypeId = entry.caseTypeId ? entry.caseTypeId : 0;
                const patientId = entry.patientId || 0;
                const reportsFinalized = entry.reportsFinalized ? entry.reportsFinalized : false;
                const physicianId = entry.physicianId ? entry.physicianId : 0;
                const facilityId = entry.facilityId ? entry.facilityId : 219;
                const salesRepId = entry.salesRepId ? entry.salesRepId : 147;
                const insurancePayerId = entry.insurancePayerId ? entry.insurancePayerId : 694;

                const formattedQueryEntry = `('${entry.accessionId}', '${serviceDate}'::timestamp, '${collectionDate}'::timestamp, ${caseTypeId}, '${patientId}', ${reportsFinalized}, '${physicianId}', ${facilityId}, ${salesRepId}, ${insurancePayerId})`;
                return formattedQueryEntry;
            });

            const finalString = convertedData.join(', ');

            this.SyncService.updateManyPatientClaims(finalString);
        }

        if (notExistedData.length > 0) {
            this.SyncService.insertPatientClaims(notExistedData);
        }

    }


    async getArchivedCases(fromDate, toDate) {
        try {
            let query = {
                created_at: {
                    $gte: fromDate,
                    $lte: toDate,
                },
                status: ARCHIVED
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
            .map(element => ({ name: element.code, displayName: element.code }));

        return modifiedData;
    }


    getHospitalsWithNoManagers(facilitiesData, marketersData) {

        const facilitiesDataArray = facilitiesData.map(item => item._id.toString());

        const result = facilitiesDataArray.filter(item => !marketersData.includes(item));

        return result;
    }


    async getSalesRepsData(datesFilter) {

        const query = {
            user_type: MARKETER,
            created_at: {
                $gte: datesFilter.fromDate,
                $lte: datesFilter.toDate,
            },
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
                    name: item.first_name,
                    refId: item._id.toString(),
                    roleId: 2,
                });
            }
        });

        return finalArray;
    }


    async getFinalSalesRepsData(marketersData) {

        const finalArray = [];

        const managersIds = marketersData.map((item) => item.reporting_to[0].toString());

        const managersIdsAndRefIds = await this.salesRepsService.getSalesRepsIdsAndRefIds(managersIds);

        marketersData.map((marketer) => {
            let reportingTo = 2;

            // Check if hospital_marketing_manager exists
            if (marketer.reporting_to.length > 0) {
                // Find corresponding manager data
                const matchedObj = managersIdsAndRefIds.rows.find((row) => row.ref_id === marketer.reporting_to[0].toString());

                if (matchedObj) {
                    reportingTo = matchedObj.id as number;
                }
            }

            finalArray.push({
                name: marketer.first_name,
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


    async getFacilitiesNotExistingIds(facilitiesData) {

        const hospitalIds = facilitiesData.map((item) => item.hospital);

        const matchedFacilitiesIds = await this.facilitiesService.getFacilitiesRefIds(hospitalIds); // fetching matched facilities id from analytics db

        const refIdValues = matchedFacilitiesIds.rows.map((obj) => obj.ref_id);

        const unMatchedFacilitiesIds = hospitalIds.filter((id) => !refIdValues.includes(id)); // fetching un-matched id of facilities

        return unMatchedFacilitiesIds;
    }


    async getSalesRepsIdsandRefIds(salesRepsData) {

        const salesRepsIds = salesRepsData.map((item) => item.id); // fetching sales reps id's

        const salesRepsIdsAndRefIdsData = await this.salesRepsService.getSalesRepsIdsAndRefIds(salesRepsIds); // fetching sales reps id and ref_id from analytics db

        return salesRepsIdsAndRefIdsData.rows;
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
}
