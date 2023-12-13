

export class FilterHelper {
    stats(query) {
        const pendingCases = query.pending_cases;
        const completedCases = query.completed_cases;
        const marketer = query.marketer_id;
        const totalCases = query.total_cases;
        const date = query.date;
        const hospitalsCount = query.hospitals_count;

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

        if(marketer){
            filter.marketer_id = {
                equals: marketer
            }
        }

        if (totalCases) {
            filter.total_cases = {
                equals: parseInt(totalCases)
            }
        }

        if(date){
            filter.date = {
                equals: date
            }
        }

        if (hospitalsCount) {
            filter.hospitals_count = {
                equals: parseInt(hospitalsCount)
            }
        }


        return filter;
    }
}