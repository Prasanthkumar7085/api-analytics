import * as fs from 'fs';


export class CaseTypesHelper {
    forVolumeCaseTypeWise(fromDate, toDate) {
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
        let volumeResp = JSON.parse(volumeResponse);

        if (fromDate && toDate) {
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            // Filter the array based on the date range
            volumeResp = volumeResp.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= fromDateObj && itemDate <= toDateObj;
            });
        }

        volumeResp = volumeResp.map(({ hospital_case_type_wise_counts }) => ({
            hospital_case_type_wise_counts
        }));

        const groupedData = volumeResp.map(entry => {
            const hospitalKey = entry.hospital_case_type_wise_counts[0].hospital;
            const counts = entry.hospital_case_type_wise_counts[0];

            return {
                hospital: hospitalKey,
                counts: {
                    uti: counts.uti,
                    nail: counts.nail,
                    covid: counts.covid,
                    wound: counts.wound,
                    gastro: counts.gastro,
                    cardiac: counts.cardiac,
                    gti_sti: counts.gti_sti,
                    diabetes: counts.diabetes,
                    pgx_test: counts.pgx_test,
                    cgx_panel: counts.cgx_panel,
                    covid_flu: counts.covid_flu,
                    toxicology: counts.toxicology,
                    urinalysis: counts.urinalysis,
                    pad_alzheimers: counts.pad_alzheimers,
                    pulmonary_panel: counts.pulmonary_panel,
                    gti_womens_health: counts.gti_womens_health,
                    clinical_chemistry: counts.clinical_chemistry,
                    respiratory_pathogen_panel: counts.respiratory_pathogen_panel
                }
            };
        });


        const mergedCounts = {};

        groupedData.forEach(entry => {
            const hospitalKey = entry.hospital;
            const counts = entry.counts;

            if (!mergedCounts[hospitalKey]) {
                // If the hospital doesn't exist in mergedCounts, create a new entry
                mergedCounts[hospitalKey] = { hospital: hospitalKey, counts: { ...counts } };
            } else {
                // If the hospital already exists, add the counts
                Object.keys(counts).forEach(countKey => {
                    mergedCounts[hospitalKey].counts[countKey] += counts[countKey];
                });
            }
        });

        const mergeArray: any = Object.values(mergedCounts);

        const keyWiseData = [];

        Object.keys(mergeArray[0].counts).forEach(caseType => {
            const count = mergeArray.reduce((total, entry) => total + entry.counts[caseType], 0);
            const hospitalsCount = mergeArray.reduce((total, entry) => (entry.counts[caseType] > 0 ? total + 1 : total), 0);

            keyWiseData.push({
                case_type: caseType.toUpperCase(),
                total_cases: count,
                hospitals_count: hospitalsCount
            });
        });

        return keyWiseData;
    }


    forRevenueCaseTypeWise(fromDate, toDate) {
        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");

        let revenueResp = JSON.parse(revenueResponse);


        if (fromDate && toDate) {
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            // Filter the array based on the date range
            revenueResp = revenueResp.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= fromDateObj && itemDate <= toDateObj;
            });
        }


        revenueResp = revenueResp.map(({ case_type_wise_counts }) => ({
            case_type_wise_counts
        }));


        let groupedData = {};
        revenueResp.forEach((entry) => {
            entry.case_type_wise_counts.forEach((countEntry) => {
                let caseType = countEntry.case_type;
                if (!groupedData[caseType]) {
                    groupedData[caseType] = {
                        paid_amount: 0,
                        total_amount: 0,
                        pending_amount: 0
                    };
                }
                groupedData[caseType].paid_amount += countEntry.paid_amount;
                groupedData[caseType].total_amount += countEntry.total_amount;
                groupedData[caseType].pending_amount += countEntry.pending_amount;
            });
        });
    
        // Convert the grouped data into an array
        let resultArray = Object.keys(groupedData).map((caseType) => {
            return {
                case_type: caseType.toUpperCase(),
                paid_amount: groupedData[caseType].paid_amount,
                total_amount: groupedData[caseType].total_amount,
                pending_amount: groupedData[caseType].pending_amount
            };
        });

        return resultArray;
    }
}