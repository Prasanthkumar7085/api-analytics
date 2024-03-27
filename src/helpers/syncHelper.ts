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
    const matchedIdsResult = await db.execute(
      sql`SELECT ref_id FROM sales_reps WHERE ref_id IN ${data}`,
    );

    // Extracts the 'ref_id' values from the rows returned by the database query and stores them in the values in array
    const refIdValues = matchedIdsResult.rows.map((obj) => obj.ref_id);

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

    const data = marketersData.map((item) => item._id.toString());

    const matchedIdsResult = await db.execute(
      sql`SELECT ref_id FROM sales_reps WHERE ref_id IN ${data}`,
    );

    const refIdValues = matchedIdsResult.rows.map((obj) => obj.ref_id);

    // finding unmatched IDs
    const unMatchedIds = data.filter((id) => !refIdValues.includes(id));

    if (unMatchedIds.length > 0) {
      const marketersIds = marketersData
        .filter((item) => unMatchedIds.includes(item._id.toString()))
        .map((item) => item.reporting_to[0].toString());

      const managerData = await db.execute(
        sql`SELECT id, ref_id FROM sales_reps WHERE ref_id IN ${marketersIds}`,
      );

      const dataList = marketersData.map((marketer) => {
        let reportingTo = 2; // Default reportingTo value

        // Check if hospital_marketing_manager exists and has at least one item
        if (marketer.reporting_to.length > 0) {
          // Find corresponding manager data
          const manager = managerData.rows.find(
            (row) => row.ref_id === marketer.reporting_to[0].toString(),
          );
          if (manager) {
            reportingTo = manager.id as number;
          }
        }
        finalObj.push({
          name: marketer.first_name,
          refId: marketer._id.toString(),
          reportingTo: reportingTo,
          roleId: 1,
        });
      });
    } else {
      return [];
    }
    return finalObj;
  }

  async getFacilitiesDataFromSalesReps(SalesRepsData) {
    const salesRepsAndFacilityData = [];
    const hospitalsData = new Set();

    // fetching selas rep id and hospitals data from mongo db
    const data = SalesRepsData.map((item) => ({
      hospitals: item.hospitals,
      id: item._id.toString(),
    }));

    data.forEach((item) => {
      item.hospitals.forEach((hospital) => {
        const hospitalId = hospital.toString();
        const itemId = item.id;

        // Check if the hospital has already been added
        if (!hospitalsData.has(hospitalId)) {
          // stoing sales_reps id and facility id
          salesRepsAndFacilityData.push({
            id: itemId,
            hospital: hospitalId,
          });
          hospitalsData.add(hospitalId);
        }
      });
    });
    const hospitalIds = salesRepsAndFacilityData.map((item) => item.hospital); // fetching hospital id's

    const salesRepsIds = salesRepsAndFacilityData.map((item) => item.id); // fetching sales reps id's

    const salesRepsData = await db.execute(
      sql`SELECT id, ref_id FROM sales_reps WHERE ref_id IN ${salesRepsIds}`,
    ); // fetching sales reps id and ref_id from analytics db

    const matchedIdsResult = await db.execute(
      sql`SELECT ref_id FROM facilities WHERE ref_id IN ${hospitalIds}`,
    ); // fetching matched facilities id from analytics db

    const refIdValues = matchedIdsResult.rows.map((obj) => obj.ref_id);

    const unMatchedFacilitiesIds = hospitalIds.filter(
      (id) => !refIdValues.includes(id),
    ); // fetching un-matched id of facilities

    // Storing sales reps IDs related to hospital object
    salesRepsData.rows.forEach((row) => {
      salesRepsAndFacilityData.find((item) => {
        if (item.id === row.ref_id.toString()) {
          item.salesRepsIdsData = row.id;
        }
      });
    });
    return { salesRepsAndFacilityData, unMatchedFacilitiesIds };
  }

  async getFacilitiesIds(data, salesRepsAndFacilityData) {
    const finalObj = [];

    const facilitiesIds = data.map((item) => item._id.toString()); // fetching facilitiec id from hospitals data

    salesRepsAndFacilityData.forEach((item) => {
      if (facilitiesIds.includes(item.hospital)) {
        // Find the corresponding object in data
        const matchingObject = data.find(
          (obj) => obj._id.toString() === item.hospital,
        );
        if (matchingObject) {
          finalObj.push({
            name: matchingObject.name,
            refId: matchingObject._id.toString(),
            salesRepId: item.salesRepsIdsData,
          });
        }
      }
    });

    return finalObj;
  }
}
