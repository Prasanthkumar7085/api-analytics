import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { SalesRepService } from "src/sales-rep/sales-rep.service";
import { FilterHelper } from "./filterHelper";
import { SortHelper } from "./sortHelper";
import { SalesRepsTargetsService } from "src/sales-reps-targets/sales-reps-targets.service";
import { SalesRepsTargetsAchivedService } from "src/sales-reps-targets-achived/sales-reps-targets-achived.service";


@Injectable()
export class SalesRepHelper {
    constructor(
        private readonly salesRepService: SalesRepService,
        private readonly filterHelper: FilterHelper,
        private readonly sortHelper: SortHelper,
        private readonly salesRepsTargetsService: SalesRepsTargetsService,
        private readonly salesRepsTargetsAchivedService: SalesRepsTargetsAchivedService,

    ) { }

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

        let targets: any = await this.salesRepsTargetsService.getSalesRepTargets(queryString);
        console.log({ targets });

        const fromDate = query.from_date;
        const toDate = query.to_date;

        if (fromDate && toDate) {
            targets = this.getFilteredTargets(targets, fromDate, toDate);

            targets = this.calculateTargetsRatio(targets, fromDate, toDate);
        }
        return targets;
    }




    getFilteredTargets(targets, fromDate, toDate) {
        const monthsAndYears = this.getMonthsAndYears(fromDate, toDate);

        let result = [];

        // Iterate through each target
        targets.forEach(target => {
            // Check if the target's year matches with any year in monthsAndYears
            const matchedYear = monthsAndYears.find(yearObj => yearObj.year === target.year);
            if (matchedYear) {
                // Construct the response object
                const responseObj = {
                    sales_rep_id: target.sales_rep_id,
                    year: target.year
                };
                // Filter the monthsAndYears array to include only months for the current year
                const monthsForYear = monthsAndYears.filter(yearObj => yearObj.year === target.year);
                // Iterate through the filtered monthsAndYears array and extract the data
                monthsForYear.forEach(monthYear => {
                    const monthKey = monthYear.month.toLowerCase();
                    if (target.hasOwnProperty(monthKey)) {
                        responseObj[monthKey] = target[monthKey];
                    }
                });
                // Push the response object to the result array
                result.push(responseObj);
            }
        });

        return result;

    }


    getMonthsAndYears(fromDate, toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        const monthsAndYears = [];
        let currentMonth = from;

        while (currentMonth <= to) {
            const year = currentMonth.getFullYear();
            const monthName = currentMonth.toLocaleString('default', { month: 'short' }); // Get month name
            monthsAndYears.push({ year, month: monthName });

            // Move to the next month
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }

        return monthsAndYears;
    }


    mergeSalesRepAndTargets(salesReps, targets) {
        salesReps.forEach(rep => {
            const target = targets.find(t => t.sales_rep_id === rep.sales_rep_id);
            if (target) {
                rep.total_targets = target.total_targets;
            }
        });

        // merge the salesRep with target

        const finalResponse = salesReps.map(salesRep => {
            if (salesRep.total_cases >= salesRep.total_targets) {

                salesRep.target_reached = true;
            } else {
                salesRep.target_reached = false;
            }

            return salesRep;
        });

        return finalResponse;
    }


    calculateTargetsRatio(data, fromDate, toDate) {
        // Convert from_date and to_date to Date objects
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        const fromDateMonth = fromDateObj.toLocaleString('en-US', { month: 'short' });
        const fromDateYear = fromDateObj.getFullYear();

        const toDateMonth = toDateObj.toLocaleString('en-US', { month: 'short' });
        const toDateYear = toDateObj.getFullYear();

        // Loop through each object in the data array
        for (let i = 0; i < data.length; i++) {
            const obj = data[i];
            // Loop through each month in the object
            for (const month in obj) {
                // Skip sales_rep_id and year properties
                if (month === 'sales_rep_id' || month === 'year') {
                    continue;
                }

                const target = obj[month][0];

                if (fromDateMonth.toLowerCase() === month.toLowerCase() && obj["year"] === fromDateYear) {
                    // Get the sales value for the month
                    const adjustedSales = this.getAdjustedtargets(fromDateObj, month, obj, target);

                    // Update data
                    obj[month][0] = adjustedSales;
                }

                if (toDateMonth.toLowerCase() === month.toLowerCase() && obj["year"] === toDateYear) {
                    const adjustedSalesToDate = this.getAdjustedtargets(toDateObj, month, obj, target);
                    obj[month][0] = adjustedSalesToDate;
                }
            }
        }
        return data;

    }


    getAdjustedtargets(dateObj, month, obj, targets) {
        // Get the number of days in the month
        const daysInMonth = new Date(dateObj.getFullYear(), new Date(Date.parse(month + ' 1,' + obj.year)).getMonth() + 1, 0).getDate();

        // Calculate the ratio for the month
        const ratio = dateObj.getMonth() === new Date(Date.parse(month + ' 1,' + obj.year)).getMonth() ? ((daysInMonth - dateObj.getDate() + 1) / daysInMonth) : 1;

        // Apply ratio and round the value
        const adjustedTargets = Math.round(targets * ratio);
        return adjustedTargets;
    }


    mergeSalesRepCaseTypeWiseVolumeAndTargets(targetedData, patientClaimsData) {
        const mergedDataMap = new Map();

        // Merge data from targetedData into the map
        targetedData.forEach(target => {
            mergedDataMap.set(target.case_type_name, {
                case_type_name: target.case_type_name,
                total_targets: target.total_targets,
                total_cases: 0 // Initialize total_cases to 0
            });
        });

        // Merge data from patientClaimsData into the map
        patientClaimsData.forEach(claim => {
            const existingData = mergedDataMap.get(claim.case_type_name);
            if (existingData) {
                existingData.total_cases = claim.total_cases;
                mergedDataMap.set(claim.case_type_name, existingData);
            } else {
                mergedDataMap.set(claim.case_type_name, {
                    case_type_name: claim.case_type_name,
                    total_targets: 0, // Initialize total_targets to 0
                    total_cases: claim.total_cases
                });
            }
        });

        // Convert the map values to an array
        const mergedDataArray = Array.from(mergedDataMap.values());
        return mergedDataArray;
    }

    transformCaseTypeTargetsMonthWiseVolume(targetsData) {
        const transformedData = [];
        targetsData.map(row => {
            return Object.entries(row).map(([key, value]) => {
                if (key !== 'month') {
                    // Modify the key to match the desired format
                    const case_type_name = key.replace(/_/g, ' ').toUpperCase();
                    transformedData.push({
                        case_type_name,
                        month: this.convertMonthFormat(row.month),
                        total_cases: value
                    });
                }
            });
        }).flat();

        return transformedData;
    }

    convertMonthFormat(month) {
        const [monthNum, year] = month.split('-');
        const date = new Date(`${monthNum}-01-${year}`);
        return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }


    mergeCaseTypeMonthlyVolumeAndTargets(salesReps, targetsData) {

        const salesRepsMap = salesReps.reduce((map, item) => {
            const key = `${item.month}-${item.case_type_name}`;
            map[key] = item;
            return map;
        }, {});

        // Merge targetsData with salesRepsData and calculate total_targets
        const mergedData = targetsData.map(target => {
            const key = `${target.month}-${target.case_type_name}`;
            const salesData = salesRepsMap[key];
            if (salesData) {
                return {
                    case_type_name: target.case_type_name,
                    month: target.month,
                    total_cases: salesData.total_cases,
                    total_targets: target.total_cases
                };
            } else {
                return {
                    case_type_name: target.case_type_name,
                    month: target.month,
                    total_cases: 0,
                    total_targets: target.total_cases
                };
            }
        });
        return mergedData;
    }


    tranformeOverViewTargetsVolume(targetData) {
        const transformedTargetData = targetData.map((entry: any) => {
            // Extract month and year from the month string
            const [month, year] = entry.month.split('-');
            // Format the month and year into a human-readable format
            const formattedMonth = `${new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year}`;

            // Calculate the total cases for the current entry
            const totalCases = Object.values(entry)
                .filter((value: any) => !isNaN(Number(value)))
                .reduce((acc: number, value: string) => acc + Number(value), 0);

            // Return an object with the month and the total cases
            return {
                month: formattedMonth,
                target_cases: totalCases
            };
        });

        return transformedTargetData;
    }

    async getSalesRepsTargets(query) {
        const queryString = this.filterHelper.salesRepsMonthlyTargets(query);

        let targets: any = await this.salesRepsTargetsService.getTotalTargets(queryString);

        return targets;
    }


    async getSalesRepsMonthWiseTargets(query) {
        const queryString = this.filterHelper.salesRepsMonthlyTargets(query);

        let targets: any = await this.salesRepsTargetsService.getTotalTargetsMonthWise(queryString);

        return targets;
    }

    async getSalesRepsMonthWiseAchievements(query) {
        const queryString = this.filterHelper.salesRepsMonthlyAchievedTargets(query);

        let targets: any = await this.salesRepsTargetsAchivedService.getTotalTargetAchievementsMonthWise(queryString);

        return targets;
    }


    async getActiveSalesReps() {
        const idsData = await this.salesRepService.getActiveSalesReps();

        const ids = idsData.map(e => e.id);

        return ids;
    }
}