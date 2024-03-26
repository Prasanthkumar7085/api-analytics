import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

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
      toDate: currentDate,
    };
  }

  async getNewSalesRepsManagersData(managersData) {
    const finalObj = [];

    // fetching all marketing managers id's
    const data = managersData.map((item) => item._id.toString());

    // fetching matching id's from analytics db
    const MatchedIdsResult = await db.execute(
      sql`SELECT ref_id FROM sales_reps WHERE ref_id IN ${data}`,
    );

    // Extracts the 'ref_id' values from the rows returned by the database query and stores them in the values in array
    const refIdValues = MatchedIdsResult.rows.map((obj) => obj.ref_id);

    // finding unmatched IDs
    const unMatchedIds = data.filter((id) => !refIdValues.includes(id));

    // constructing the final object by taking data from lis data
    managersData.forEach((item) => {
      if (unMatchedIds.includes(item._id.toString())) {
        finalObj.push({
          name: item.first_name,
          refId: item._id.toString(),
          roleId: 2,
        });
      }
    });

    return finalObj;
  }

  async getNewSalesRepsData(marketersData) {
    const finalObj = [];
    const managerIds = []

    const data = marketersData.map((item) => item._id.toString());

    const matchedIdsResult = await db.execute(
      sql`SELECT ref_id FROM sales_reps WHERE ref_id IN ${data}`,
    );

    const refIdValues = matchedIdsResult.rows.map((obj) => obj.ref_id);

    // finding unmatched IDs
    const unMatchedIds = data.filter((id) => !refIdValues.includes(id));

    // const marketersData1 = [...marketersData];

    for (let item of marketersData) {
      if (unMatchedIds.includes(item._id.toString())) {
        managerIds.push(item.reporting_to[0].toString())
      }
    }
    const managerData = await db.execute(sql`
            SELECT id, ref_id
            FROM sales_reps
            WHERE ref_id IN ${managerIds}
        `);

    const dataList = marketersData.map(marketer => {
        let reportingTo = 2; // Default reportingTo value

        // Check if hospital_marketing_manager exists and has at least one item
        if (marketer.reporting_to.length > 0) {
            // Find corresponding manager data
            const manager = managerData.rows.find(row => row.ref_id === marketer.reporting_to[0].toString());
            if (manager) {
                reportingTo = manager.id as number;
            }
        }
        finalObj.push({
            name: marketer.first_name,
            refId: marketer._id.toString(),
            reportingTo:reportingTo,
            roleId: 2,
          });
    })

    
    return finalObj;
  }
}
