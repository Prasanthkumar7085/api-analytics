

export class SortHelper{
    stats(orderBy, orderType){
        const sort = {
            [orderBy] : orderType
        }
        return sort;
    }
}