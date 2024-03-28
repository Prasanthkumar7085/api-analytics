import { CaseTypesV3Service } from 'src/case-types-v3/case-types-v3.service';
import { InsurancesV3Service } from 'src/insurances-v3/insurances-v3.service';
import { Injectable } from "@nestjs/common";



@Injectable()
export class syncHelpers {

    constructor(
        private readonly insuranceV3Service: InsurancesV3Service,
        private readonly caseTypesV3Service: CaseTypesV3Service
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


    async modifyInsurancePayors(data) {
        // Extracting _id values from data
        const lisInsurancePayorsIdsArray = data.map(item => item._id.toString());

        // Fetching matching data from analytics db
        const matchingData = await this.insuranceV3Service.getrefIdsFromInsurancePayors(lisInsurancePayorsIdsArray)

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
        const matchingData = await this.caseTypesV3Service.getCaseTypes(lisCaseTypeCodesArray);

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

}