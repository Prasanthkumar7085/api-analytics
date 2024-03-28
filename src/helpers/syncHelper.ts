import { Injectable } from '@nestjs/common';
import { MARKETER } from 'src/constants/messageConstants';
import { FacilitiesV3Service } from 'src/facilities-v3/facilities-v3.service';
import { LisService } from 'src/lis/lis.service';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';


@Injectable()
export class syncHelpers {
    constructor(
        private readonly salesRepsService : SalesRepServiceV3,
        private readonly facilitiesService : FacilitiesV3Service,
        private readonly lisService : LisService,
    ) {}


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


    async getSalesRepsData(datesFilter){

        const query = {
            user_type: MARKETER,
            created_at: {
                $gte: datesFilter.fromDate,
                $lte: datesFilter.toDate,
            },
        };

        const salesRepsData = await this.lisService.getUsers(query);

        return salesRepsData
    }


    async getNotExistingIds(data){

		// fetching all marketing managers id's
        const mappedSalesRepsIds = data.map((item) => item._id.toString());

        // fetching matching id's from analytics db
        const matchedIds = await this.salesRepsService.getMatchedSalesRepsIds(mappedSalesRepsIds)
        
        // Extracts the 'ref_id' values from the rows returned by the database query and stores them in the values in array
        const refIdValues = matchedIds.rows.map((obj) => obj.ref_id);

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


    async getFinalSalesRepsData(marketersData) {

        const finalArray = [];

		const managersIds = marketersData.map((item) => item.reporting_to[0].toString());

		const managersIdsAndRefIds = await this.salesRepsService.getSalesRepsIdsAndRefIds(managersIds)

		marketersData.map((marketer) => {
			let reportingTo = 2;

			// Check if hospital_marketing_manager exists
			if (marketer.reporting_to.length > 0) {
				// Find corresponding manager data
				const matchedObj = managersIdsAndRefIds.rows.find((row) => row.ref_id === marketer.reporting_to[0].toString());

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

        const matchedFacilitiesIds = await this.facilitiesService.getFacilitiesRefIds(hospitalIds); // fetching matched facilities id from analytics db

		const refIdValues = matchedFacilitiesIds.rows.map((obj) => obj.ref_id);

		const unMatchedFacilitiesIds = hospitalIds.filter((id) => !refIdValues.includes(id)); // fetching un-matched id of facilities

		return unMatchedFacilitiesIds
	}


	async getSalesRepsIdsandRefIds(salesRepsData){

		const salesRepsIds = salesRepsData.map((item) => item.id); // fetching sales reps id's

        const salesRepsIdsAndRefIdsData = await this.salesRepsService.getSalesRepsIdsAndRefIds(salesRepsIds) // fetching sales reps id and ref_id from analytics db

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
