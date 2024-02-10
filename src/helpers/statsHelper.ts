import { Injectable } from "@nestjs/common";
import { CARDIAC, CGX, CLINICAL_CHEMISTRY, COVID, COVID_FLU, DIABETES, GASTRO, GTISTI, GTIWOMENSHEALTH, NAIL, PAD, PGX, PULMONARY, RESPIRATORY_PATHOGEN_PANEL, TOXICOLOGY, URINALYSIS, UTI, WOUND, prepareHospitalWiseCounts } from "src/constants/statsConstants";
import { LisService } from "src/lis/lis.service";
import { StatsService } from "src/stats/stats.service";
import { FilterHelper } from "./filterHelper";
import { SortHelper } from "./sortHelper";


@Injectable()
export class StatsHelper {
    constructor(
        private readonly statsService: StatsService,
        private readonly lisService: LisService,
        private readonly sortHelper: SortHelper,
        private readonly filterHelper: FilterHelper
    ) { }

    async prepareDateForPending(notExistedMarketers, existedDataMarketerIds, existedData, reqBody) {
        const hospitalId = reqBody.hospital_id;
        const date = reqBody.date;
        const caseType = reqBody.case_type;

        let modifiedDataArray = [];
        if (notExistedMarketers.length > 0) {
            for (let i = 0; i < notExistedMarketers.length; i++) {
                let toInsertData = {
                    marketer_id: notExistedMarketers[i],
                    hospital_id: hospitalId,
                    date: date,
                    case_type: caseType
                }

                const modifiedData = this.prepareToInsertData(toInsertData)

                modifiedDataArray.push({ ...modifiedData });
            }


            JSON.stringify(modifiedDataArray);


            if (modifiedDataArray.length > 0) {
                await this.statsService.createMany(modifiedDataArray)
            }
        }



        if (existedDataMarketerIds.length > 0) {
            let existedModifiedArray = []
            for (let i = 0; i < existedDataMarketerIds.length; i++) {

                const marketerObject = existedData.find((item) => item.marketer_id === existedDataMarketerIds[i]);

                const modifiedData = this.prepareDataToUpdate(marketerObject, reqBody);

                existedModifiedArray.push(modifiedData)
            }

            if (existedModifiedArray.length > 0) {
                const convertedData = existedModifiedArray.map(entry => {
                    return `(${entry.id}, '${entry.marketer_id}', ${entry.total_cases}, ${entry.pending_cases}, ${entry.completed_cases}, ${entry.hospitals_count}, ARRAY[${entry.case_type_wise_counts.map(item => `'{"pending":${item.pending},"case_type":"${item.case_type}","completed":${item.completed}}'`)}]::jsonb[], ARRAY[${entry.hospital_case_type_wise_counts.map(item => `'{"cgx_panel":${item.cgx_panel},"pad_alzheimers":${item.pad_alzheimers},"pgx_test":${item.pgx_test},"uti":${item.uti},"nail":${item.nail},"covid":${item.covid},"wound":${item.wound},"gastro":${item.gastro},"cardiac":${item.cardiac},"diabetes":${item.diabetes},"hospital":"${item.hospital}","covid_flu":${item.covid_flu},"pulmonary_panel":${item.pulmonary_panel},"toxicology":${item.toxicology},"urinalysis":${item.urinalysis},"clinical_chemistry":${item.clinical_chemistry},"respiratory_pathogen_panel":${item.respiratory_pathogen_panel},"gti_sti":${item.gti_sti},"gti_womens_health":${item.gti_womens_health}}'`)}]::jsonb[])`
                });

                const finalString = convertedData.join(',');

                await this.statsService.updateMany(finalString)
            }

        }
        return modifiedDataArray;
    }


    prepareToInsertData(toInsertData) {
        let prepareNewData: any = {
            marketer_id: toInsertData.marketer_id,
            date: toInsertData.date,
            pending_cases: 0,
            completed_cases: 0,
            total_cases: 0,
            case_type_wise_counts: [
                { ...COVID },
                { ...RESPIRATORY_PATHOGEN_PANEL },
                { ...TOXICOLOGY },
                { ...CLINICAL_CHEMISTRY },
                { ...UTI },
                { ...URINALYSIS },
                { ...PGX },
                { ...WOUND },
                { ...NAIL },
                { ...COVID_FLU },
                { ...CGX },
                { ...COVID_FLU },
                { ...CGX },
                { ...CARDIAC },
                { ...DIABETES },
                { ...GASTRO },
                { ...PAD },
                { ...PULMONARY },
                { ...CGX },
                { ...GTISTI },
                { ...GTIWOMENSHEALTH }
            ],
            hospital_case_type_wise_counts: [{ ...prepareHospitalWiseCounts }]
        }

        const indexToUpdate = prepareNewData.case_type_wise_counts.findIndex(
            (item) => item.case_type === toInsertData.case_type.toUpperCase()
        );


        // If the case type is found, increment the counts
        if (indexToUpdate !== -1) {
            prepareNewData.case_type_wise_counts[indexToUpdate].pending++; // You can adjust the increment as needed
        }


        const caseTypeObject = prepareNewData.hospital_case_type_wise_counts.find(obj => obj.hasOwnProperty(toInsertData.case_type.toLowerCase()));
        if (caseTypeObject) {
            caseTypeObject[toInsertData.case_type.toLowerCase()]++;
            caseTypeObject["hospital"] = toInsertData.hospital_id
        }

        prepareNewData.pending_cases++;
        prepareNewData.total_cases = prepareNewData.pending_cases + prepareNewData.completed_cases;


        prepareNewData.hospitals_count = prepareNewData.hospital_case_type_wise_counts.length

        return prepareNewData;
    }

    prepareDataToUpdate(existedData, reqBody) {

        const indexToUpdate = existedData.case_type_wise_counts.findIndex(
            (item) => item.case_type === reqBody.case_type.toUpperCase()
        );

        // If the case type is found, increment the counts
        if (indexToUpdate !== -1) {
            existedData.case_type_wise_counts[indexToUpdate].pending++; // You can adjust the increment as needed
        }

        const hospitalObject = existedData.hospital_case_type_wise_counts.find(obj => obj.hospital === reqBody.hospital_id);

        if (hospitalObject) {
            hospitalObject[reqBody.case_type.toLowerCase()]++; // Increment the "covid" count by 1
        } else {
            let hospitalData = { ...prepareHospitalWiseCounts }
            hospitalData[reqBody.case_type.toLowerCase()]++;
            hospitalData["hospital"] = reqBody.hospital_id;
            existedData.hospital_case_type_wise_counts.push(hospitalData)
        }

        existedData.total_cases++;
        existedData.pending_cases++;

        existedData.hospitals_count = existedData.hospital_case_type_wise_counts.length

        return existedData;

    }

    prepareToUpdateComplete(existedData, reqBody) {
        const indexToUpdate = existedData.case_type_wise_counts.findIndex(
            (item) => item.case_type === reqBody.case_type.toUpperCase()
        );

        // If the case type is found, increment the counts
        if (indexToUpdate !== -1) {
            existedData.case_type_wise_counts[indexToUpdate].completed++; // You can adjust the increment as needed
            existedData.case_type_wise_counts[indexToUpdate].pending--;
        }

        existedData.pending_cases--;
        existedData.completed_cases++;

        existedData.total_cases = existedData.pending_cases + existedData.completed_cases;

        return existedData;

    }

    prepareToUpdateRetrive(existedData, reqBody) {
        const indexToUpdate = existedData.case_type_wise_counts.findIndex(
            (item) => item.case_type === reqBody.case_type.toUpperCase()
        );

        // If the case type is found, increment the counts
        if (indexToUpdate !== -1) {
            existedData.case_type_wise_counts[indexToUpdate].completed--; // You can adjust the increment as needed
            existedData.case_type_wise_counts[indexToUpdate].pending++;
        }

        existedData.pending_cases++;
        existedData.completed_cases--;

        existedData.total_cases = existedData.pending_cases + existedData.completed_cases;

        return existedData;

    }


    async getUsersData(managerId, projection = {}) {

        let query = {
            hospital_marketing_manager: { $in: [managerId] },
            user_type: "MARKETER"
        }
        let marketersData = await this.lisService.getUsers(query)

        let finalArray = [];

        if (marketersData.length) {
            const marketersIdsArray = marketersData.map((e: any) => e._id.toString());
            finalArray = [...marketersIdsArray, managerId];

        } else {
            finalArray = [managerId];

        };

        return finalArray;
    }


    async forHospitalWiseData(orderBy, orderType, statsQuery) {

        let statsData: any = await this.statsService.findAll(statsQuery);

        const result = {};

        statsData.forEach((entry) => {

            entry.hospital_case_type_wise_counts.forEach((hospitalData) => {
                const hospitalId = hospitalData.hospital;

                if (!result[hospitalId]) {
                    // Initialize if not exists
                    result[hospitalId] = { hospital: hospitalId, ...hospitalData };
                } else {
                    // Sum values
                    Object.keys(hospitalData).forEach((key) => {
                        if (key !== 'hospital') {
                            result[hospitalId][key] += hospitalData[key];
                        }
                    });
                }
            });
        });

        let dataArray = Object.values(result);

        dataArray = this.sortHelper.hospitalWise(orderBy, orderType, dataArray);

        return dataArray;
    }

}