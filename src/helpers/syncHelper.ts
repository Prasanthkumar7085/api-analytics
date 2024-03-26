import { Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { db } from "src/seeders/db";


@Injectable()
export class syncHelpers {

    getFromAndToDates(days: number) {
        const currentDate = new Date();
        const previousDate = new Date(currentDate);

        previousDate.setDate(currentDate.getDate() - days);

        // Set the time to the start of the day (00:00:00)
        previousDate.setUTCHours(0, 0, 0, 0);

        return {
            fromDate: previousDate,
            toDate: currentDate
        };
    }
    

    async getNewSalesRepsManagersData(managersData) {

        const finalObj = []
        
        // fetching all marketing managers id's
        const data = managersData.map(item => item._id.toString())

        // fetching matching id's from analytics db
        const MatchedIdsResult = await db.execute(sql`SELECT ref_id FROM sales_reps WHERE ref_id IN ${data}`);  

        // Extracts the 'ref_id' values from the rows returned by the database query and stores them in the values in array
        const refIdValues = MatchedIdsResult.rows.map(obj => obj.ref_id);

        // finding unmatched IDs
        const unMatchedIds = data.filter(id => !refIdValues.includes(id));

        // constructing the final object by taking data from lis data
        managersData.forEach(item => {
            if (unMatchedIds.includes(item._id.toString())) {

                finalObj.push({ 
                    name: item.first_name,
                    refId:item._id.toString(),
                    roleId:2
                });
            }
        });

        return finalObj
    }

}