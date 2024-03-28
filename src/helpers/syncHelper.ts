import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { facilities } from 'src/drizzle/schemas/facilities';
import { sales_reps } from 'src/drizzle/schemas/salesReps';
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


    async getNotExistingIds(data){

		// fetching all marketing managers id's
        const mappedSalesRepsIds = data.map((item) => item._id.toString());

        // fetching matching id's from analytics db
        const matchedIdsIds = await db.execute(sql`SELECT ref_id FROM sales_reps WHERE ref_id IN ${mappedSalesRepsIds}`);

        // Extracts the 'ref_id' values from the rows returned by the database query and stores them in the values in array
        const refIdValues = matchedIdsIds.rows.map((obj) => obj.ref_id);

        const unMatchedIds = mappedSalesRepsIds.filter((id) => !refIdValues.includes(id)); // finding unmatched IDs

        return unMatchedIds
    }


    async getFinalManagersData(managersData) {

        const finalArray = [];

        const notExistedIds =  await this.getNotExistingIds(managersData)

        // constructing the final object by taking data from lis data
        managersData.forEach((item) => {

            if (notExistedIds.includes(item._id.toString())) {

				finalArray.push({
						name: item.first_name,
						refId: item._id.toString(),
						roleId: 2,
					});
            }
        });

        return finalArray;
    }


    updateSalesRepsManagersData(){		

		const updatedData = db.execute(sql`UPDATE sales_reps SET reporting_to = id WHERE reporting_to != id AND role_id = 2;`);
		
		return updatedData
    }


    async getFinalSalesRepsData(marketersData) {

        const finalArray = [];

		const marketersIds = marketersData
			.filter((item) => marketersData.includes(item._id.toString()))
			.map((item) => item.reporting_to[0].toString());

		const salesRepsData = await db.execute(sql`SELECT id, ref_id FROM sales_reps WHERE ref_id IN ${marketersIds}`);

		marketersData.map((marketer) => {
			let reportingTo = 2;

			// Check if hospital_marketing_manager exists
			if (marketer.reporting_to.length > 0) {
				// Find corresponding manager data
				const matchedObj = salesRepsData.rows.find((row) => row.ref_id === marketer.reporting_to[0].toString());

				if (matchedObj) {
					reportingTo = matchedObj.id as number;
				}
			}

			finalArray.push({
				name: marketer.first_name,
				refId: marketer._id.toString(),
				reportingTo: reportingTo,
				roleId: 1,
			});
		});

        return finalArray;
    }


	async getFacilitiesData(salesRepsData){

		const salesRepsAndFacilitiesData = [];
        const hospitalsData = new Set();

		const idsArray = salesRepsData.map((item) => ({
            hospitals: item.hospitals,
            id: item._id.toString(),
        }));

		idsArray.forEach((item) => {
            item.hospitals.forEach((hospital) => {
                const hospitalId = hospital.toString();
                const itemId = item.id;

                if (!hospitalsData.has(hospitalId)) { // Check if the hospital has already been added
                    
                    salesRepsAndFacilitiesData.push({
                        id: itemId,
                        hospital: hospitalId,
					});
					hospitalsData.add(hospitalId);
                }
            });
        });

		return salesRepsAndFacilitiesData
	}


	async getFacilitiesNotExistingIds(facilitiesData){

		const hospitalIds = facilitiesData.map((item) => item.hospital);

		const matchedIdsResult = await db.execute(sql`SELECT ref_id FROM facilities WHERE ref_id IN ${hospitalIds}`); // fetching matched facilities id from analytics db

		const refIdValues = matchedIdsResult.rows.map((obj) => obj.ref_id);

		const unMatchedFacilitiesIds = hospitalIds.filter((id) => !refIdValues.includes(id)); // fetching un-matched id of facilities

		return unMatchedFacilitiesIds
	}


	async getSalesRepsIdsandRefIds(salesRepsData){

		const salesRepsIds = salesRepsData.map((item) => item.id); // fetching sales reps id's

		const salesRepsIdsAndRefIdsData = await db.execute(sql`SELECT id, ref_id FROM sales_reps WHERE ref_id IN ${salesRepsIds}`); // fetching sales reps id and ref_id from analytics db

		return salesRepsIdsAndRefIdsData.rows
	}


    async getSalesRepsAndFacilitiesIds(salesRepsIdsAndRefIds, salesRepsAndFacilitiesData) {
        
        salesRepsIdsAndRefIds.forEach((row) => {

            salesRepsAndFacilitiesData.find((item) => {

                if (item.id === row.ref_id.toString()) {

                    item.salesRepsId = row.id;
                }
            });
        });
        return salesRepsAndFacilitiesData;
    }


    async getFinalArray(data, salesRepsAndFacilityData) {

        const finalArray = [];

        const facilitiesIds = data.map((item) => item._id.toString()); // fetching facilitiec id from hospitals data

        salesRepsAndFacilityData.forEach((item) => {

            if (facilitiesIds.includes(item.hospital)) {

                // Find the corresponding object in data
                const matchingObject = data.find(
                    (obj) => obj._id.toString() === item.hospital,
                );

                if (matchingObject) {
                    finalArray.push({
                        name: matchingObject.name,
                        refId: matchingObject._id.toString(),
                        salesRepId: item.salesRepsId,
                    });
                }

            }
        });

        return finalArray;
    }
}
