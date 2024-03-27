import { Injectable } from "@nestjs/common";
import { CaseTypesV3Service } from "src/case-types-v3/case-types-v3.service";
import { ARCHIVED } from "src/constants/lisConstants";
import { FacilitiesV3Service } from "src/facilities-v3/facilities-v3.service";
import { InsurancesV3Service } from "src/insurances-v3/insurances-v3.service";
import { LisService } from "src/lis/lis.service";
import { SyncV3Service } from "src/sync-v3/sync-v3.service";


@Injectable()
export class syncHelpers {

    constructor(
        private readonly lisService: LisService,
        private readonly caseTypesV3Service: CaseTypesV3Service,
        private readonly facilitiesV3Service: FacilitiesV3Service,
        private readonly insurancesV3Service: InsurancesV3Service,
        private readonly syncV3Service: SyncV3Service
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
        const caseTypes = await this.caseTypesV3Service.getAllCaseTypes();

        const facilities = await this.facilitiesV3Service.getAllFacilitiesData();

        const insurancePayers = await this.insurancesV3Service.getAllInsurances();

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

        const alreadyInsertedClaims: any = await this.syncV3Service.getPatientClaims(accessionIds);

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

            this.syncV3Service.updateManyPatientClaims(finalString);
        }

        if (notExistedData.length > 0) {
            this.syncV3Service.insertPatientClaims(notExistedData);
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
}