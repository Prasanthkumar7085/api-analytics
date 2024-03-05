import { Injectable } from "@nestjs/common";
import * as fs from 'fs';


@Injectable()
export class SalesRepHelper {

    getsingleRepVolumeFacilityWise(marketerId, fromDate, toDate) {
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(volumeResponse);
        let volumeData = finalVolumeResp.filter(item => item.marketer_id === marketerId);

        if (fromDate && toDate) {
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            // Filter the array based on the date range
            volumeData = volumeData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= fromDateObj && itemDate <= toDateObj;
            });
        }


        const hospitalWiseData = {};

        volumeData.forEach(item => {
            item.hospital_case_type_wise_counts.forEach(hospitalEntry => {
                const hospitalID = hospitalEntry.hospital;

                if (!hospitalWiseData[hospitalID]) {
                    hospitalWiseData[hospitalID] = {
                        uti: 0,
                        nail: 0,
                        covid: 0,
                        wound: 0,
                        gastro: 0,
                        cardiac: 0,
                        gti_sti: 0,
                        diabetes: 0,
                        pgx_test: 0,
                        cgx_panel: 0,
                        covid_flu: 0,
                        toxicology: 0,
                        urinalysis: 0,
                        pad_alzheimers: 0,
                        pulmonary_panel: 0,
                        gti_womens_health: 0,
                        clinical_chemistry: 0,
                        respiratory_pathogen_panel: 0,
                    };
                }

                // Accumulate counts for each case type
                Object.keys(hospitalEntry).forEach(caseType => {
                    if (caseType !== 'hospital') {
                        hospitalWiseData[hospitalID][caseType] += hospitalEntry[caseType];
                    }
                });

            });
        });

        const totalCasesPerHospital = Object.keys(hospitalWiseData).map(hospitalID => {
            const totalCases = Object.values(hospitalWiseData[hospitalID]).reduce((sum: number, count: number) => sum + count, 0);
            return {
                hospital: hospitalID,
                total_cases: totalCases,
            };
        });

        return totalCasesPerHospital;
    }


    getsingleRepRevenueFacilityWise(marketerId, fromDate, toDate) {
        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");

        let finalRevenueResp = JSON.parse(revenueResponse);

        let revenueData = finalRevenueResp.filter(item => item.marketer_id === marketerId);

        if (fromDate && toDate) {
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            // Filter the array based on the date range
            revenueData = revenueData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= fromDateObj && itemDate <= toDateObj;
            });
        }

        const aggregatedData = [];

        revenueData.forEach(entry => {
            entry.hospital_wise_counts.forEach(hospitalEntry => {
                const hospitalId = hospitalEntry.hospital;

                // Find existing entry in the aggregatedData array
                const existingEntry = aggregatedData.find(item => item.hospital === hospitalId);

                if (existingEntry) {
                    existingEntry.paid_amount += hospitalEntry.paid_amount;
                    existingEntry.total_amount += hospitalEntry.total_amount;
                    existingEntry.pending_amount += hospitalEntry.pending_amount;
                } else {
                    // If the entry does not exist, create a new one
                    aggregatedData.push({
                        hospital: hospitalId,
                        paid_amount: hospitalEntry.paid_amount,
                        total_amount: hospitalEntry.total_amount,
                        pending_amount: hospitalEntry.pending_amount,
                    });
                }
            });
        });

        return aggregatedData;
    }



    async getRevenueStatsData(id: string, start_date: Date, end_date: Date) {

        const RevenueStatsData = fs.readFileSync('RevenueStatsData.json', "utf-8")
        const finalRevenueResp = JSON.parse(RevenueStatsData)

        let total_amount = 0;
        let paid_amount = 0;
        let pending_amount = 0;

        for (let i = 0; i < finalRevenueResp.length; i++) {
            const date = new Date(finalRevenueResp[i].date)

            if (start_date < end_date) {

                if (date >= start_date && date <= end_date) {
                    if (finalRevenueResp[i].marketer_id == id) {

                        total_amount = total_amount + finalRevenueResp[i].total_amount,
                            paid_amount = paid_amount + finalRevenueResp[i].paid_amount
                        pending_amount = pending_amount + finalRevenueResp[i].pending_amount
                    }
                }
            }

        }
        return ({ total_amount: total_amount, paid_amount: paid_amount, pending_amount: pending_amount })
    }



    async getVolumeStatsData(id: string, start_date: Date, end_date: Date) {
        const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8")
        const finalVolumeResp = JSON.parse(VolumeStatsData)

        let total_cases = 0;
        let completed_cases = 0;
        let pending_cases = 0;

        for (let i = 0; i < finalVolumeResp.length; i++) {
            const date = new Date(finalVolumeResp[i].date)
            if (start_date < end_date) {
                if (date >= start_date && date <= end_date) {

                    if (finalVolumeResp[i].marketer_id == id) {
                        total_cases = total_cases + finalVolumeResp[i].total_cases,
                            completed_cases = completed_cases + finalVolumeResp[i].completed_cases,
                            pending_cases = pending_cases + finalVolumeResp[i].pending_cases

                    }
                }
            }
        }
        return ({ total_cases: total_cases, completed_cases: completed_cases, pending_cases: pending_cases })
    }



    async caseTypesVolumeMonthWise(id, start, end) {
        const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(VolumeStatsData);

        let totalCounts = {};
        let count = 0

        const startDate = new Date(start);
        const endDate = new Date(end);
        while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            totalCounts[monthYear] = { count: 0, case_type_wise_counts: {} };
            startDate.setMonth(startDate.getMonth() + 1);
        }

        for (let i = 0; i < finalVolumeResp.length; i++) {

            if (finalVolumeResp[i].marketer_id == id) {

                let date = new Date(finalVolumeResp[i].date);
                if (date >= start && date <= end) {

                    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                    finalVolumeResp[i].case_type_wise_counts.forEach(caseType => {
                        const { case_type, pending, completed } = caseType;
                        totalCounts[monthYear]['case_type_wise_counts'][case_type] = (totalCounts[monthYear]['case_type_wise_counts'][case_type] || 0) + pending + completed;
                        totalCounts[monthYear]['count'] += (pending + completed);
                    });
                }
            }
        }
        return totalCounts;
    }

    async getOverviewRevenueStatsData(start_date: Date, end_date: Date) {
        const RevenueStatsData = fs.readFileSync('RevenueStatsData.json', "utf-8")
        const finalRevenueResp = JSON.parse(RevenueStatsData)

        let total_amount = 0;
        let paid_amount = 0;
        let pending_amount = 0;

        for (let i = 0; i < finalRevenueResp.length; i++) {
            const date = new Date(finalRevenueResp[i].date)
            if (start_date < end_date) {

                if (date >= start_date && date <= end_date) {
                    total_amount = total_amount + finalRevenueResp[i].total_amount,
                        paid_amount = paid_amount + finalRevenueResp[i].paid_amount
                    pending_amount = pending_amount + finalRevenueResp[i].pending_amount
                }
            }

        }
        return ({ total_amount: total_amount, paid_amount: paid_amount, pending_amount: pending_amount })
    }

    async getOverViewVolumeStatsData(start_date: Date, end_date: Date) {
        const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8")
        const finalVolumeResp = JSON.parse(VolumeStatsData)

        let total_cases = 0;
        let completed_cases = 0;
        let pending_cases = 0;

        for (let i = 0; i < finalVolumeResp.length; i++) {
            const date = new Date(finalVolumeResp[i].date)
            if (start_date < end_date) {

                if (date >= start_date && date <= end_date) {
                    total_cases = total_cases + finalVolumeResp[i].total_cases,
                        completed_cases = completed_cases + finalVolumeResp[i].completed_cases,
                        pending_cases = pending_cases + finalVolumeResp[i].pending_cases
                }
            }
        }
        return ({ total_cases: total_cases, completed_cases: completed_cases, pending_cases: pending_cases })
    }

    async getRevenueGraph(from_date: Date, to_date: Date) {
        const RevenueStatsData = fs.readFileSync('RevenueStatsData.json', "utf-8")
        const finalRevenueResp = JSON.parse(RevenueStatsData)

        let total_counts = {}
        const startDate = new Date(from_date)
        const endDate = new Date(to_date)

        while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            total_counts[monthYear] = {
                total_revenue_billed: 0,
                total_revenue_collected: 0,
            };
            startDate.setMonth(startDate.getMonth() + 1);
        }
        for (const item of finalRevenueResp) {

            let date = new Date(item.date);
            if (date >= from_date && date <= to_date) {
                const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })
                item.case_type_wise_counts.forEach(caseType => {
                    const { total_amount, paid_amount } = caseType;

                    total_counts[monthYear]['total_revenue_billed'] += total_amount
                    total_counts[monthYear]['total_revenue_collected'] += paid_amount
                })
            }
        }
        return total_counts
    }

    async findAll() {
        // from Volume
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");

        const finalVolumeResp = JSON.parse(volumeResponse);

        return finalVolumeResp
    }



    async findOneVolume(id: string, start_date: Date, end_date: Date) {
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(volumeResponse);

        let totalCounts = {};
        let total: number = 0;

        for (let i = 0; i < finalVolumeResp.length; i++) {
            if (finalVolumeResp[i].marketer_id == id) {
                let date = finalVolumeResp[i].date
                if (date >= start_date && date <= end_date) {

                    total += finalVolumeResp[i].total_cases

                    finalVolumeResp[i].case_type_wise_counts.forEach(caseType => {
                        const { case_type, pending, completed } = caseType;
                        totalCounts[case_type] = (totalCounts[case_type] || 0) + pending + completed;
                    });

                }
            }

        }
        return { totalCounts, total }
    }





    async findOneRevenue(id: string, start_date: Date, end_date: Date) {

        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const revenue = JSON.parse(revenueResponse);

        let totalCaseTypeAmount = {};
        let total_amount: number = 0;


        for (const item of revenue) {
            if (item.marketer_id == id) {
                if (item.date >= start_date && item.date <= end_date) {



                    total_amount += item.total_amount

                    item.case_type_wise_counts.forEach(caseType => {
                        const { case_type, total_amount } = caseType;
                        totalCaseTypeAmount[case_type] = (totalCaseTypeAmount[case_type] || 0) + total_amount
                    })
                }
            }
        }
        return { totalCaseTypeAmount, total_amount }
        // throw new NotFoundException('Revenue data not found for the specified marketer ID');
    }



    async getCaseTypeRevenueMonthWise(id, start_date, end_date) {
        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const revenue = JSON.parse(revenueResponse);


        let total_counts = {}
        const startDate = new Date(start_date)
        const endDate = new Date(end_date)

        while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            total_counts[monthYear] = {
                total_revenue: 0,
                case_type_wise: {
                    "covid": 0,
                    "respiratory_pathogen_panel": 0,
                    "toxicology": 0,
                    "clinical_chemistry": 0,
                    "uti": 0,
                    "urinalysis": 0,
                    "pgx": 0,
                    "wound": 0,
                    "nail": 0,
                    "covid_flu": 0,
                    "cgx": 0,
                    "cardiac": 0,
                    "diabetes": 0,
                    "gastro": 0,
                    "pad": 0,
                    "pulmonary": 0,
                    "gti_sti": 0,
                    "gti_womens_health": 0
                }
            };
            startDate.setMonth(startDate.getMonth() + 1);
        }

        for (const item of revenue) {
            if (item.marketer_id == id) {

                let date = new Date(item.date);

                if (date >= start_date && date <= end_date) {
                    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })
                    item.case_type_wise_counts.forEach(caseType => {
                        const { case_type, total_amount } = caseType;

                        total_counts[monthYear]['case_type_wise'][case_type] = (total_counts[monthYear]['case_type_wise'][case_type] || 0) + total_amount
                        total_counts[monthYear]['total_revenue'] += total_amount
                    })
                }
            }
        }
        return total_counts
    }


    async getOverviewCaseTypesVolumeData(from_date, to_date) {
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(volumeResponse);

        let totalCounts = {};
        let total: number = 0;

        for (const item of finalVolumeResp) {
            let date = item.date
            if (date >= from_date && date <= to_date) {

                total += item.total_cases

                item.case_type_wise_counts.forEach(caseType => {
                    const { case_type, pending, completed } = caseType;
                    totalCounts[case_type] = (totalCounts[case_type] || 0) + pending + completed
                });
            }
        }
        return { totalCounts, total }
    }


    async getOverviewCaseTypesRevenueData(from_date, to_date) {
        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const revenue = JSON.parse(revenueResponse);



        let totalCaseTypeAmount = {};
        let total_amount: number = 0;


        for (const item of revenue) {

            if (item.date >= from_date && item.date <= to_date) {
                total_amount += item.total_amount

                item.case_type_wise_counts.forEach(caseType => {
                    const { case_type, total_amount } = caseType;
                    totalCaseTypeAmount[case_type] = (totalCaseTypeAmount[case_type] || 0) + total_amount
                })
            }

        }
        return { totalCaseTypeAmount, total_amount }


    }
}