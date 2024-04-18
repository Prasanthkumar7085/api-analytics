import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { SalesRepService } from "src/sales-rep/sales-rep.service";
import { FilterHelper } from "./filterHelper";
import { SortHelper } from "./sortHelper";


@Injectable()
export class SalesRepHelper {
    constructor(
        private readonly salesRepService: SalesRepService,
        private readonly filterHelper: FilterHelper,
        private readonly sortHelper: SortHelper
    ) { }

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



    async getRevenueStatsData(id: string, startDate: Date, endDate: Date) {

        const RevenueStatsData = fs.readFileSync('RevenueStatsData.json', "utf-8");
        const finalRevenueResp = JSON.parse(RevenueStatsData);

        let total_amount = 0;
        let paid_amount = 0;
        let pending_amount = 0;

        for (let i = 0; i < finalRevenueResp.length; i++) {
            const date = new Date(finalRevenueResp[i].date);

            if (startDate && endDate) {
                if (startDate < endDate) {

                    const start_date = new Date(startDate);
                    const end_date = new Date(endDate);

                    if (date >= start_date && date <= end_date) {
                        if (finalRevenueResp[i].marketer_id == id) {

                            total_amount += finalRevenueResp[i].total_amount,
                                paid_amount += finalRevenueResp[i].paid_amount;
                            pending_amount += finalRevenueResp[i].pending_amount;
                        }
                    }
                }
            } else {
                total_amount += finalRevenueResp[i].total_amount,
                    paid_amount += finalRevenueResp[i].paid_amount;
                pending_amount += finalRevenueResp[i].pending_amount;
            }

        }
        return ({ total_amount: total_amount, paid_amount: paid_amount, pending_amount: pending_amount });
    }



    async getVolumeStatsData(id: string, start_date: Date, end_date: Date) {
        const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(VolumeStatsData);

        let total_cases = 0;
        let completed_cases = 0;
        let pending_cases = 0;

        for (let i = 0; i < finalVolumeResp.length; i++) {
            const date = new Date(finalVolumeResp[i].date);
            if (start_date && end_date) {
                const startDate = new Date(start_date);
                const endDate = new Date(end_date);
                if (startDate < endDate) {

                    const start_date = new Date(startDate);
                    const end_date = new Date(endDate);
                    if (date >= start_date && date <= end_date) {

                        if (finalVolumeResp[i].marketer_id == id) {
                            total_cases += finalVolumeResp[i].total_cases,
                                completed_cases += finalVolumeResp[i].completed_cases,
                                pending_cases += finalVolumeResp[i].pending_cases;

                        }
                    }
                }
            } else {
                total_cases += finalVolumeResp[i].total_cases,
                    completed_cases += finalVolumeResp[i].completed_cases,
                    pending_cases += finalVolumeResp[i].pending_cases;
            }
        }
        return ({ total_cases: total_cases, completed_cases: completed_cases, pending_cases: pending_cases });
    }



    async caseTypesVolumeMonthWise(id, start, end) {
        const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(VolumeStatsData);

        let totalCounts = {};
        let count = 0;

        const startDate = new Date(start);
        const endDate = new Date(end);
        while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            totalCounts[monthYear] = {
                count: 0, case_type_wise_counts: {
                    "COVID": 0,
                    "RESPIRATORY_PATHOGEN_PANEL": 0,
                    "TOXICOLOGY": 0,
                    "CLINICAL_CHEMISTRY": 0,
                    "UTI": 0,
                    "URINALYSIS": 0,
                    "PGX_TEST": 0,
                    "WOUND": 0,
                    "NAIL": 0,
                    "COVID_FLU": 0,
                    "CGX_PANEL": 0,
                    "CARDIAC": 0,
                    "DIABETES": 0,
                    "GASTRO": 0,
                    "PAD_ALZHEIMERS": 0,
                    "PULMONARY_PANEL": 0,
                    "GTI_STI": 0,
                    "GTI_WOMENS_HEALTH": 0
                }
            };
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
        const RevenueStatsData = fs.readFileSync('RevenueStatsData.json', "utf-8");
        const finalRevenueResp = JSON.parse(RevenueStatsData);

        let total_amount = 0;
        let paid_amount = 0;
        let pending_amount = 0;

        for (let i = 0; i < finalRevenueResp.length; i++) {
            const date = new Date(finalRevenueResp[i].date);
            if (start_date && end_date) {
                if (start_date < end_date) {

                    if (date >= start_date && date <= end_date) {
                        total_amount = total_amount + finalRevenueResp[i].total_amount,
                            paid_amount = paid_amount + finalRevenueResp[i].paid_amount;
                        pending_amount = pending_amount + finalRevenueResp[i].pending_amount;
                    }
                }
            } else {
                total_amount = total_amount + finalRevenueResp[i].total_amount,
                    paid_amount = paid_amount + finalRevenueResp[i].paid_amount;
                pending_amount = pending_amount + finalRevenueResp[i].pending_amount;
            }

        }
        return ({ total_amount: total_amount, paid_amount: paid_amount, pending_amount: pending_amount });
    }

    async getOverViewVolumeStatsData(start_date: Date, end_date: Date) {
        const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(VolumeStatsData);

        let total_cases = 0;
        let completed_cases = 0;
        let pending_cases = 0;

        for (let i = 0; i < finalVolumeResp.length; i++) {
            const date = new Date(finalVolumeResp[i].date);

            if (start_date && end_date) {
                if (start_date < end_date) {

                    if (date >= start_date && date <= end_date) {
                        total_cases = total_cases + finalVolumeResp[i].total_cases,
                            completed_cases = completed_cases + finalVolumeResp[i].completed_cases,
                            pending_cases = pending_cases + finalVolumeResp[i].pending_cases;
                    }
                }
            } else {
                total_cases = total_cases + finalVolumeResp[i].total_cases,
                    completed_cases = completed_cases + finalVolumeResp[i].completed_cases,
                    pending_cases = pending_cases + finalVolumeResp[i].pending_cases;
            }

        }
        return ({ total_cases: total_cases, completed_cases: completed_cases, pending_cases: pending_cases });
    }

    async getRevenueGraph(from_date: Date, to_date: Date) {
        const RevenueStatsData = fs.readFileSync('RevenueStatsData.json', "utf-8");
        const finalRevenueResp = JSON.parse(RevenueStatsData);

        let total_counts = {};
        const startDate = new Date(from_date);
        const endDate = new Date(to_date);

        if (startDate && endDate) {
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
                    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    item.case_type_wise_counts.forEach(caseType => {
                        const { total_amount, paid_amount } = caseType;

                        total_counts[monthYear]['total_revenue_billed'] += total_amount;
                        total_counts[monthYear]['total_revenue_collected'] += paid_amount;
                    });
                }
            }
        } else {
            const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            total_counts[monthYear] = {
                total_revenue_billed: 0,
                total_revenue_collected: 0,
            };

            for (const item of finalRevenueResp) {

                let date = new Date(item.date);
                const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                item.case_type_wise_counts.forEach(caseType => {
                    const { total_amount, paid_amount } = caseType;

                    total_counts[monthYear]['total_revenue_billed'] += total_amount;
                    total_counts[monthYear]['total_revenue_collected'] += paid_amount;
                });

            }


        }

        return total_counts;
    }

    async findAll() {
        // from Volume
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");

        const finalVolumeResp = JSON.parse(volumeResponse);

        return finalVolumeResp;
    }



    async findOneVolume(id: string, start_date: Date, end_date: Date) {
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(volumeResponse);

        let totalCounts = {};
        let total: number = 0;

        for (let i = 0; i < finalVolumeResp.length; i++) {
            if (finalVolumeResp[i].marketer_id == id) {
                let date = finalVolumeResp[i].date;
                if (date >= start_date && date <= end_date) {

                    total += finalVolumeResp[i].total_cases;

                    finalVolumeResp[i].case_type_wise_counts.forEach(caseType => {
                        const { case_type, pending, completed } = caseType;
                        totalCounts[case_type] = (totalCounts[case_type] || 0) + pending + completed;
                    });

                }
            }

        }
        return { totalCounts, total };
    }





    async findOneRevenue(id: string, start_date: Date, end_date: Date) {

        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const revenue = JSON.parse(revenueResponse);

        let totalCaseTypeAmount = {};
        let total_amount: number = 0;


        for (const item of revenue) {
            if (item.marketer_id == id) {
                if (item.date >= start_date && item.date <= end_date) {



                    total_amount += item.total_amount;

                    item.case_type_wise_counts.forEach(caseType => {
                        const { case_type, total_amount } = caseType;
                        totalCaseTypeAmount[case_type] = (totalCaseTypeAmount[case_type] || 0) + total_amount;
                    });
                }
            }
        }
        return { totalCaseTypeAmount, total_amount };
        // throw new NotFoundException('Revenue data not found for the specified marketer ID');
    }



    async getCaseTypeRevenueMonthWise(id, start_date, end_date) {
        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const revenue = JSON.parse(revenueResponse);


        let total_counts = {};
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

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
                    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    item.case_type_wise_counts.forEach(caseType => {
                        const { case_type, total_amount } = caseType;

                        total_counts[monthYear]['case_type_wise'][case_type] = (total_counts[monthYear]['case_type_wise'][case_type] || 0) + total_amount;
                        total_counts[monthYear]['total_revenue'] += total_amount;
                    });
                }
            }
        }
        return total_counts;
    }


    async getOverviewCaseTypesVolumeData(from_date, to_date) {
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(volumeResponse);

        let totalCounts = {};
        let total: number = 0;

        for (const item of finalVolumeResp) {
            let date = item.date;
            if (from_date && to_date) {
                if (date >= from_date && date <= to_date) {

                    total += item.total_cases;

                    item.case_type_wise_counts.forEach(caseType => {
                        const { case_type, pending, completed } = caseType;
                        totalCounts[case_type] = (totalCounts[case_type] || 0) + pending + completed;
                    });
                }
            } else {
                console.log(234);
                total += item.total_cases;

                item.case_type_wise_counts.forEach(caseType => {
                    const { case_type, pending, completed } = caseType;
                    totalCounts[case_type] = (totalCounts[case_type] || 0) + pending + completed;
                });
            }
        }
        return { totalCounts, total };
    }


    async getOverviewCaseTypesRevenueData(from_date, to_date) {
        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const revenue = JSON.parse(revenueResponse);



        let totalCaseTypeAmount = {};
        let total_amount: number = 0;


        for (const item of revenue) {

            if (from_date && to_date) {
                total_amount += item.total_amount;

                item.case_type_wise_counts.forEach(caseType => {
                    const { case_type, total_amount } = caseType;
                    totalCaseTypeAmount[case_type] = (totalCaseTypeAmount[case_type] || 0) + total_amount;
                });
            } else {
                total_amount += item.total_amount;

                item.case_type_wise_counts.forEach(caseType => {
                    const { case_type, total_amount } = caseType;
                    totalCaseTypeAmount[case_type] = (totalCaseTypeAmount[case_type] || 0) + total_amount;
                });
            }

        }
        return { totalCaseTypeAmount, total_amount };


    }

    async getOneSalesRepDurationTrend(id, from_date, to_date) {
        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const revenue = JSON.parse(revenueResponse);

        let total_counts = {};
        const startDate = new Date(from_date);
        const endDate = new Date(to_date);

        while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            total_counts[monthYear] = { total_revenue: 0 };
            startDate.setMonth(startDate.getMonth() + 1);
        }



        for (const item of revenue) {
            if (item.marketer_id == id) {

                let date = new Date(item.date);

                if (date >= from_date && date <= to_date) {
                    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                    total_counts[monthYear]['total_revenue'] += item.total_amount;
                }
            }
        }
        return total_counts;
    }

    async getSalesTrendsVolumeData(id, start, end) {
        const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(VolumeStatsData);

        let totalCounts = {};

        const startDate = new Date(start);
        const endDate = new Date(end);
        while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            totalCounts[monthYear] = { count: 0 };
            startDate.setMonth(startDate.getMonth() + 1);
        }
        for (let i = 0; i < finalVolumeResp.length; i++) {

            if (finalVolumeResp[i].marketer_id == id) {
                let date = new Date(finalVolumeResp[i].date);

                if (date >= start && date <= end) {
                    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    totalCounts[monthYear]['count'] += finalVolumeResp[i].total_cases;
                }
            }
        }
        return totalCounts;
    }


    facilityExists(finalResp, id) {
        return finalResp.some(facility => facility.facility_id === id);
    }


    salesRepExists(finalResp, id) {
        return finalResp.some(rep => rep.sales_rep_id === id);
    }


    async manualSortAndAddingSalesReps(query, salesReps) {
        const salesRepsQueryString = this.filterHelper.salesRepsFilter(query);

        const salesRepsData = await this.salesRepService.getSalesReps(salesRepsQueryString);

        salesRepsData.forEach(rep => {
            if (!this.salesRepExists(salesReps, rep.id)) {
                salesReps.push({
                    sales_rep_id: rep.id,
                    sales_rep_name: rep.name,
                    email: rep.email,
                    active_facilities: 0,
                    expected_amount: 0,
                    generated_amount: 0,
                    paid_amount: 0,
                    pending_amount: 0,
                    total_cases: 0,
                    pending_cases: 0
                });
            }
        });

        salesReps = this.sortHelper.sort(salesReps, "sales_rep_name");

        return salesReps;
    }


    async getFacilitiesBySalesRep(salesReps) {
        const salesRepIds = salesReps.map(e => e.sales_rep_id);

        const facilities = await this.salesRepService.getAllFacilitiesCountBySalesRep(salesRepIds);

        for (const rep of salesReps) {
            const facility: any = facilities.find(fac => fac.sales_rep_id === rep.sales_rep_id);
            if (facility) {
                rep.total_facilities = parseInt(facility.total_facilities);
            } else {
                rep.total_facilities = 0; // If no facilities found, set to 0 or handle as needed
            }
        }

        return salesReps;

    }


    async getTargets(query) {
        const queryString = this.filterHelper.salesRepsTargets(query);

        const targets: any = await this.salesRepService.getSalesRepTargets(queryString);

        const groupedData = targets.reduce((acc, item) => {
            const { sales_rep_id, ...rest } = item;
            if (!acc[sales_rep_id]) {
                acc[sales_rep_id] = { sales_rep_id, ...rest };
            } else {
                Object.keys(rest).forEach(key => {
                    if (Array.isArray(acc[sales_rep_id][key])) {
                        acc[sales_rep_id][key] = acc[sales_rep_id][key].map((val, index) => val + rest[key][index]);
                    }
                });
            }
            return acc;
        }, {});

        // Convert groupedData object to array
        const result = Object.values(groupedData).map(({ id, year, ...rest }) => rest);

        const mergedResult = result.map(item => {
            const total = Object.values(item)
                .filter(val => Array.isArray(val)) // Filter out arrays
                .reduce((acc, curr) => {
                    return acc.map((num, i) => num + curr[i]); // Sum corresponding elements
                });

            const respData: any = {
                sales_rep_id: item.sales_rep_id,
                target_volume: total[0],
                target_facilities: total[1],
                target_achived_volume: total[2],
                target_achived_facilites: total[3]
            };

            if (respData.target_achived_volume >= respData.target_volume && respData.target_achived_facilites >= respData.target_facilities) {
                respData.target_reached = true;
            } else {
                respData.target_reached = false;
            }

            return respData;
        });

        return mergedResult;
    }

    mergeSalesRepAndTargets(salesReps, targets) {
        return salesReps.map(salesRep => {
            const target = targets.find(target => target.sales_rep_id === salesRep.sales_rep_id);
            if (target) {
                salesRep.target_volume = target.target_volume;
                salesRep.target_facilities = target.target_facilities;
                salesRep.target_reached = target.target_reached;
            }
            return salesRep;
        });
    }

}