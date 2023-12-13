

export class SortHelper{
    stats(orderBy, orderType){
        const sort = {
            [orderBy] : orderType
        }
        return sort;
    }

    hospitalWise(orderBy, orderType, dataArray){
        if(orderType == "desc"){
            dataArray.sort((a, b) => b[orderBy] - a[orderBy]);
        }
        if(orderType == "asc"){
            dataArray.sort((a, b) => a[orderBy] - b[orderBy]);
        }

        return dataArray;
    }
}