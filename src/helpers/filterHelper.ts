

export class FilterHelper {
    stats(query, fromDate, toDate) {
        const pendingCases = query.pending_cases;
        const completedCases = query.completed_cases;
        const totalCases = query.total_cases;
        const hospitalsCount = query.hospitals_count;
        const hospitalMarketers = query.hospital_marketers;

        let filter: any = {};
        if (pendingCases) {
            filter.pending_cases = {
                equals: parseInt(pendingCases)
            };
        }

        if (completedCases) {
            filter.completed_cases = {
                equals: parseInt(completedCases)
            };
        }

        if (totalCases) {
            filter.total_cases = {
                equals: parseInt(totalCases)
            };
        }

        if (fromDate && toDate) {
            filter.date = {
                gte: fromDate,
                lte: toDate
            };
        }

        if (hospitalsCount) {
            filter.hospitals_count = {
                equals: parseInt(hospitalsCount)
            };
        }

        if (hospitalMarketers.length) {
            filter.marketer_id = { in: hospitalMarketers };
        }


        return filter;
    }

    caseWiseMarketers(query) {
        let filter: any = {};

        const date = query.date;
        const marketer = query.marketer_id;
        const caseType = query.case_type;


        if (date) {
            filter.date = {
                equals: date
            };
        }

        if (marketer) {
            filter.marketer_id = {
                equals: marketer
            };
        }

        if (caseType) {
            filter.case_type_wise_counts = {
                path: ['case_type'],
                equals: 'Claudine',
            };
        }

        return filter;
    }

    hospitalWiseMarketers(fromDate, toDate, marketer, marketerIdsArray = []) {
        let filter: any = {};

        if (fromDate && toDate) {
            filter.date = {
                gte: fromDate,
                lte: toDate
            };
        }

        if (marketerIdsArray.length > 0) {
            filter.marketer_id = {
                in: marketerIdsArray
            };
        }

        return filter;
    }


    marketerPaymentWiseCounts(query) {
        let filter: any = {};

        let fromDate = query.from_date;
        let toDate = query.to_date;
        let marketer = query.marketer_id;

        if (fromDate && toDate) {
            filter.date = {
                gte: fromDate,
                lte: toDate
            };
        }

        if (marketer) {
            filter.marketer_id = {
                equals: marketer
            };
        }

        return filter;
    }


    revenueStats(query, fromDate, toDate) {
        const pendingAmount = query.pending_amount;
        const paidAmount = query.paid_amount;
        const totalAmount = query.totla_amount;
        const hospitalMarketers = query.hospital_marketers;

        let filter: any = {};
        if (pendingAmount) {
            filter.pending_amount = {
                equals: parseInt(pendingAmount)
            };
        }

        if (totalAmount) {
            filter.totla_amount = {
                equals: parseInt(totalAmount)
            };
        }

        if (paidAmount) {
            filter.paid_amount = {
                equals: parseInt(paidAmount)
            };
        }

        if (fromDate && toDate) {
            filter.date = {
                gte: fromDate,
                lte: toDate
            };
        }

        if (hospitalMarketers.length) {
            filter.marketer_id = { in: hospitalMarketers };
        }


        return filter;
    }


    salesRep(query) {

        let filter = [];
        const {
            from_date: fromDate,
            to_date: toDate,
            sales_reps: salesReps
        } = query;

        if (fromDate && toDate) {
            filter.push(`service_date BETWEEN '${fromDate}' AND '${toDate}'`);
        }

        if (salesReps) {
            filter.push(`sales_rep_id IN (${salesReps})`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }
        return queryString;

    }

    salesRepFacilities(query) {

        let filter = [];
        const {
            from_date: fromDate,
            to_date: toDate,
            case_type: caseType
        } = query;

        if (fromDate && toDate) {
            filter.push(`service_date BETWEEN '${fromDate}' AND '${toDate}'`);
        }

        if (caseType) {
            filter.push(`case_type_id=${caseType}`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }
        return queryString;

    }

    facilitiesDateFilter(query) {
        let filter = [];

        const { from_date, to_date } = query;

        if (from_date && to_date) {
            filter.push(`service_date BETWEEN '${from_date}' AND '${to_date}'`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }
        return queryString;
    }

    facilitiesFilter(query) {
        let filter = [];

        const { from_date, to_date, sales_reps } = query;

        if (from_date && to_date) {
            filter.push(`service_date BETWEEN '${from_date}' AND '${to_date}'`);
        }

        if (sales_reps) {
            filter.push(`p.sales_rep_id IN (${sales_reps})`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }
        return queryString;
    }


    listFacilitis(query) {
        let filter = [];

        const { sales_reps } = query;

        if (sales_reps) {
            filter.push(`sales_rep_id IN (${sales_reps})`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }

        return queryString;
    }


    overviewFilter(query) {
        let filter = [];
        const {
            from_date: fromDate,
            to_date: toDate,
            sales_reps: salesReps
        } = query;

        if (fromDate && toDate) {
            filter.push(`service_date BETWEEN '${fromDate}' AND '${toDate}'`);
        }

        if (salesReps) {
            filter.push(`sales_rep_id IN (${salesReps})`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }

        return queryString;
    }


    salesRepsFilter(query) {
        let filter = [];
        const {
            sales_reps: salesReps
        } = query;

        if (salesReps) {
            filter.push(`id IN (${salesReps})`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }

        return queryString;
    }


    salesRepsByRefIdFilter(refId, mghRefId) {
        let filter = [];

        if (refId) {
            filter.push(`ref_id = '${refId}'`);
        }

        if (mghRefId) {
            filter.push(`mgh_ref_id = '${mghRefId}'`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }

        return queryString;
    }

    salesRepsTargets(query) {
        let filter = [];
        const {
            sales_reps: salesReps,
            from_date: fromDate,
            to_date: toDate
        } = query;

        if (salesReps) {
            filter.push(`sales_rep_id IN (${salesReps})`);
        }

        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);

            // Getting years without using for loops
            const yearRange = Array.from({ length: to.getFullYear() - from.getFullYear() + 1 }, (_, index) => from.getFullYear() + index);

            filter.push(`year IN (${yearRange})`);
        }

        if (query.month) {

            filter.push(`month='${query.month}'`);

        }


        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ");
        }

        return queryString;
    }


    salesRepsMonthlyTargets(query) {
        let filter = [];
        const {
            sales_rep: salesRep,
            sales_reps: salesReps,
            from_date: fromDate,
            to_date: toDate
        } = query;

        if (salesRep) {
            filter.push(`sales_rep_id = ${salesRep}`);
        }

        if (salesReps) {
            filter.push(`sales_rep_id IN (${salesReps})`);
        }

        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            const monthRange = [];

            // Loop through each month between from and to dates
            for (let current = new Date(from); current <= to; current.setMonth(current.getMonth() + 1)) {
                const monthYear = `${('0' + (current.getMonth() + 1)).slice(-2)}-${current.getFullYear()}`;
                monthRange.push(`'${monthYear}'`);
            }

            filter.push(`month IN (${monthRange.join(", ")})`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join(" AND ");
        }

        return queryString;
    }


    singleSalesRepMonthlyTargets(query) {
        let filter = [];
        const {
            sales_rep: salesRep,
            from_date: fromDate,
            to_date: toDate
        } = query;

        if (salesRep) {
            filter.push(`sales_rep_id = ${salesRep}`);
        }

        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            const monthRange = [];

            // Loop through each month between from and to dates
            for (let current = new Date(from); current <= to; current.setMonth(current.getMonth() + 1)) {
                const monthYear = `${('0' + (current.getMonth() + 1)).slice(-2)}-${current.getFullYear()}`;
                monthRange.push(`'${monthYear}'`);
            }

            filter.push(`month IN (${monthRange.join(", ")})`);
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join(" AND ");
        }

        return queryString;
    }
}