

export class SortHelper {
    stats(orderBy, orderType) {
        const sort = {
            [orderBy]: orderType
        };
        return sort;
    }

    hospitalWise(orderBy, orderType, dataArray) {
        if (orderType == "desc") {
            dataArray.sort((a, b) => b[orderBy] - a[orderBy]);
        }
        if (orderType == "asc") {
            dataArray.sort((a, b) => a[orderBy] - b[orderBy]);
        }

        return dataArray;
    }

    singleMarkterWise(orderBy, orderType, dataArray) {
        if (orderType == "desc") {
            dataArray.sort((a, b) => b.counts[orderBy] - a.counts[orderBy]);
        }
        if (orderType == "asc") {
            dataArray.sort((a, b) => a.counts[orderBy] - b.counts[orderBy]);
        }

        return dataArray;
    }

    sort(salesReps, key) {
        salesReps.sort((a, b) => {
            const nameA = a[`${key}`].toUpperCase();
            const nameB = b[`${key}`].toUpperCase();

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        return salesReps;
    }

    sortOnMonth(salesReps) {
        salesReps.sort((a, b) => {
            const monthA: any = new Date(a.month);
            const monthB: any = new Date(b.month);
            return monthA - monthB;
        });
        return salesReps;
    }
}