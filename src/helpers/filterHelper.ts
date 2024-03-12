

export class FilterHelper {
    stats(query, fromDate, toDate) {
        const pendingCases = query.pending_cases;
        const completedCases = query.completed_cases;
        const totalCases = query.total_cases;
        const hospitalsCount = query.hospitals_count;
        const hospitalMarketers = query.hospital_marketers;

        let filter: any = {}
        if (pendingCases) {
            filter.pending_cases = {
                equals: parseInt(pendingCases)
            }
        }

        if (completedCases) {
            filter.completed_cases = {
                equals: parseInt(completedCases)
            }
        }

        if (totalCases) {
            filter.total_cases = {
                equals: parseInt(totalCases)
            }
        }

        if (fromDate && toDate) {
            filter.date = {
                gte: fromDate,
                lte: toDate
            }
        }

        if (hospitalsCount) {
            filter.hospitals_count = {
                equals: parseInt(hospitalsCount)
            }
        }

        if (hospitalMarketers.length) {
            filter.marketer_id = { in: hospitalMarketers }
        }


        return filter;
    }

    caseWiseMarketers(query) {
        let filter: any = {}

        const date = query.date;
        const marketer = query.marketer_id;
        const caseType = query.case_type;


        if (date) {
            filter.date = {
                equals: date
            }
        }

        if (marketer) {
            filter.marketer_id = {
                equals: marketer
            }
        }

        if (caseType) {
            filter.case_type_wise_counts = {
                path: ['case_type'],
                equals: 'Claudine',
            }
        }

        return filter;
    }

    hospitalWiseMarketers(fromDate, toDate, marketer, marketerIdsArray = []) {
        let filter: any = {}

        if (fromDate && toDate) {
            filter.date = {
                gte: fromDate,
                lte: toDate
            }
        }

        if (marketerIdsArray.length > 0) {
            filter.marketer_id = {
                in: marketerIdsArray
            }
        }

        return filter;
    }


    marketerPaymentWiseCounts(query) {
        let filter: any = {}

        let fromDate = query.from_date
        let toDate = query.to_date
        let marketer = query.marketer_id

        if (fromDate && toDate) {
            filter.date = {
                gte: fromDate,
                lte: toDate
            }
        }

        if (marketer) {
            filter.marketer_id = {
                equals: marketer
            }
        }

        return filter
    }


    revenueStats(query, fromDate, toDate) {
        const pendingAmount = query.pending_amount;
        const paidAmount = query.paid_amount;
        const totalAmount = query.totla_amount;
        const hospitalMarketers = query.hospital_marketers;

        let filter: any = {}
        if (pendingAmount) {
            filter.pending_amount = {
                equals: parseInt(pendingAmount)
            }
        }

        if (totalAmount) {
            filter.totla_amount = {
                equals: parseInt(totalAmount)
            }
        }

        if (paidAmount) {
            filter.paid_amount = {
                equals: parseInt(paidAmount)
            }
        }

        if (fromDate && toDate) {
            filter.date = {
                gte: fromDate,
                lte: toDate
            }
        }

        if (hospitalMarketers.length) {
            filter.marketer_id = { in: hospitalMarketers }
        }


        return filter;
    }


    salesRep(query) {

        let filter = []
        const {
            from_date: fromDate,
            to_date: toDate
        } = query;

        if (fromDate && toDate) {
            filter.push(`service_date BETWEEN '${fromDate}' AND '${toDate}'`)
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ")
        }
        return queryString;

    }

    overviewFilter(query) {
        let filter = []
        const {
            from_date: fromDate,
            to_date: toDate
        } = query;

        if (fromDate && toDate) {
            filter.push(`service_date BETWEEN '${fromDate}' AND '${toDate}'`)
        }

        let queryString;
        if (filter.length > 0) {
            queryString = filter.join("AND ")
        }
        return queryString;
    }

}