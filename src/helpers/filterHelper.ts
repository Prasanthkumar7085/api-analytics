

export class FilterHelper {
    stats(query, fromDate, toDate) {
        const pendingCases = query.pending_cases;
        const completedCases = query.completed_cases;
        const marketer = query.marketer_id;
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

        if (marketer) {
            filter.marketer_id = {
                equals: marketer
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

        if (hospitalMarketers) {
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
            console.log(123);
            filter.case_type_wise_counts = {
                path: ['case_type'],
                equals: 'Claudine',
            }
        }

        return filter;
    }

    hospitalWiseMarketers(fromDate, toDate, marketer) {
        let filter: any = {}

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

        return filter;
    }
}