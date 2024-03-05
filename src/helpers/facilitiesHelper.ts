import * as fs from 'fs';


export class FacilitiesHelper {
    forVolumeFacilityWise(fromDate, toDate) {
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

        volumeResp = volumeResp.map(({ marketer_id, hospital_case_type_wise_counts }) => ({
            marketer_id,
            hospital_case_type_wise_counts
        }));


        const groupedData = volumeResp.reduce((acc, item) => {
            const existingItem = acc.find((groupedItem) => groupedItem.marketer_id === item.marketer_id);

            if (existingItem) {
                existingItem.hospital_case_type_wise_counts.forEach((count) => {
                    const matchingCount = item.hospital_case_type_wise_counts.find(
                        (itemCount) => itemCount.hospital === count.hospital
                    );

                    if (matchingCount) {
                        Object.keys(matchingCount).forEach((key) => {
                            if (key !== 'hospital') {
                                count[key] += matchingCount[key];
                            }
                        });
                    }
                });
            } else {
                acc.push({ ...item });
            }

            return acc;
        }, []);



        const result = [];

        groupedData.forEach((entry) => {
            const { marketer_id, date, hospital_case_type_wise_counts } = entry;

            const total_cases = hospital_case_type_wise_counts.reduce((acc, hospitalEntry) => {
                let total = acc;
                Object.keys(hospitalEntry).forEach((key) => {
                    if (key !== 'hospital') {
                        total += hospitalEntry[key];
                    }
                });
                return total;
            }, 0);

            const hospitalEntry = hospital_case_type_wise_counts[0];
            const hospitalKey = hospitalEntry.hospital;

            const existingHospital = result.find((r) => r.hospital === hospitalKey);

            if (existingHospital) {
                existingHospital.total_cases += total_cases;
            } else {
                result.push({
                    hospital: hospitalKey,
                    marketer_id,
                    date,
                    total_cases,
                });
            }
        });
        return result;
    }


    forRevenueFacilityWise(fromDate, toDate) {
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

        revenueResp = revenueResp.map(({ marketer_id, hospital_wise_counts }) => ({
            marketer_id,
            hospital_wise_counts
        }));


        const result = [];

        revenueResp.forEach((entry) => {
            const { marketer_id, hospital_wise_counts } = entry;

            hospital_wise_counts.forEach((hospitalEntry) => {
                const { hospital, paid_amount, total_amount, pending_amount } = hospitalEntry;
                const existingHospital = result.find((r) => r.hospital === hospital);

                if (existingHospital) {
                    existingHospital.paid_amount += paid_amount;
                    existingHospital.total_amount += total_amount;
                    existingHospital.pending_amount += pending_amount;
                } else {
                    result.push({
                        marketer_id,
                        hospital,
                        paid_amount,
                        total_amount,
                        pending_amount,
                    });
                }
            });
        });

        return result
    }


    getVolumeTrendData(hospitalId, fromDate, toDate) {
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

        volumeResp = volumeResp.map(({ date, hospital_case_type_wise_counts }) => ({
            date,
            hospital_case_type_wise_counts
        }));


        const groupedData = volumeResp.reduce((acc, entry) => {
            const date = new Date(entry.date);

            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();

            const formattedMonth = `${month.toUpperCase()} ${year}`;

            const existingMonth = acc.find((groupedEntry) => groupedEntry.month === formattedMonth);

            if (existingMonth) {
                existingMonth.hospital_case_type_wise_counts.push(...entry.hospital_case_type_wise_counts);
            } else {
                acc.push({
                    month: formattedMonth,
                    hospital_case_type_wise_counts: [...entry.hospital_case_type_wise_counts]
                });
            }

            return acc;
        }, []);

        let updatedData = [];
        groupedData.forEach((entry) => {
            entry.hospital_case_type_wise_counts.forEach((countEntry) => {
                let totalCases = Object.values(countEntry).reduce((acc: any, val) => acc + (typeof val === 'number' ? val : 0), 0);
                let updatedEntry = {
                    "hospital": countEntry.hospital,
                    "month": entry.month,
                    "total_cases": totalCases
                };
                updatedData.push(updatedEntry);
            });
        });


        updatedData = updatedData.filter(item => item.hospital === hospitalId);

        const finalData = updatedData.reduce((result, entry) => {
            const key = entry.month;
            if (!result[key]) {
                result[key] = { month: key, total_cases: 0, hospital: entry.hospital };
            }
            result[key].total_cases += entry.total_cases;
            return result;
        }, {});
    
        const groupedArray = Object.values(finalData);

        return groupedArray;
    }
}