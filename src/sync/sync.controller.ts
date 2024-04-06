import { Controller, Get, NotFoundException, Post, Res } from '@nestjs/common';
import { SyncService } from './sync.service';
import { LisService } from 'src/lis/lis.service';
import {
	PATIENT_CLAIMS_NOT_FOUND, REMOVED_ARCHIVED_CLAIMS, SUCCESS_SYNC_PATIENT_CLAIMS, CASE_TYPES_NOT_FOUND_IN_LIS_DATABASE, INSURANCE_PAYORS_NOT_FOUND_IN_LIS_DATABASE, CASE_TYPES_NOT_FOUND, INSURANCE_PAYORS_NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS_SYNCED_CASE_TYPES, SUCCESS_SYNCED_INSURANCE_PAYORS,
	HOSPITAL_MARKETING_MANAGER, FACILITIES_NOT_FOUND, SALES_REPS_NOT_FOUND, SUCCUSS_INSERTED_MARKETING_MANAGERS, SUCCUSS_INSERTED_SALES_REPS, SUCCESS_INSERTED_FACILICES, LIS_FACILITIES_NOT_FOUND, MARKETER,
	SUCCESS_SYNC_LABS,
	LABS_NOT_FOUND
} from 'src/constants/messageConstants';
import { SyncHelpers } from 'src/helpers/syncHelper';
import * as fs from 'fs';
import { Configuration } from 'src/config/config.service';
import { InsurancesService } from "src/insurances/insurances.service";
import { CaseTypesService } from 'src/case-types/case-types.service';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { FacilitiesService } from 'src/facilities/facilities.service';

@Controller({
	version: '1.0',
	path: 'sync'
})

export class SyncController {
	constructor(
		private readonly SyncService: SyncService,
		private readonly lisService: LisService,
		private readonly syncHelpers: SyncHelpers,
		private readonly configuration: Configuration,
		private readonly caseTypesService: CaseTypesService,
		private readonly insurancesService: InsurancesService,
		private readonly salesRepService: SalesRepService,
		private readonly faciliticesService: FacilitiesService,
	) { }

	@Get('patient-claims')
	async addPatientClaims(@Res() res: any) {
		try {

			const datesObj = this.syncHelpers.getFromAndToDates(7);

			const fromDate = datesObj.fromDate;
			const toDate = datesObj.toDate;

			const cases = await this.syncHelpers.getCases(fromDate, toDate);

			if (cases.length == 0) {
				return res.status(200).json({
					success: true,
					message: PATIENT_CLAIMS_NOT_FOUND
				});
			}

			const analyticsData = await this.syncHelpers.getAllAnalyticsData();

			let modifiedArray = this.syncHelpers.modifyCasesForPatientClaims(cases, analyticsData);

			if (modifiedArray.length) {

				const seperatedArray = await this.syncHelpers.seperateModifiedArray(modifiedArray);

				this.syncHelpers.insertOrUpdateModifiedClaims(seperatedArray);
			}

			return res.status(200).json({
				success: true,
				message: SUCCESS_SYNC_PATIENT_CLAIMS,
				cases
			});

		} catch (err) {
			console.log({ err });
			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get("patient-claims-remove")
	async removeArchivedClaims(@Res() res: any) {
		try {
			const datesObj = this.syncHelpers.getFromAndToDates(7);

			const fromDate = datesObj.fromDate;
			const toDate = datesObj.toDate;


			const cases = await this.syncHelpers.getArchivedCases(fromDate, toDate);

			if (cases.length == 0) {
				return res.status(200).json({
					success: true,
					message: PATIENT_CLAIMS_NOT_FOUND
				});
			}

			const accessionIds = cases.map((e) => e.accession_id);

			this.SyncService.removePatientClaims(accessionIds);
			return res.status(200).json({
				success: true,
				message: REMOVED_ARCHIVED_CLAIMS,
				data: accessionIds
			});
		} catch (err) {
			console.log({ err });
			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get('insurance-payors')
	async syncInsurancePayors(@Res() res: any) {
		try {
			const query = {};

			const projection = { _id: 1, name: 1 };

			const insurancePayorsData = await this.lisService.getInsurancePayors(query, projection);

			if (insurancePayorsData.length == 0) {
				return res.status(200).json({
					success: true,
					message: INSURANCE_PAYORS_NOT_FOUND_IN_LIS_DATABASE
				});
			}

			const modifiedData = await this.syncHelpers.modifyInsurancePayors(insurancePayorsData);

			if (modifiedData.length == 0) {
				return res.status(200).json({
					success: true,
					message: INSURANCE_PAYORS_NOT_FOUND
				});
			}
			// Inserting data into analytics db
			this.insurancesService.insertInsurancePayors(modifiedData);

			return res.status(200).json({
				success: true,
				message: SUCCESS_SYNCED_INSURANCE_PAYORS
			});
		}
		catch (err) {
			console.log({ err });

			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}

	}


	@Get('case-types')
	async syncCaseTypes(@Res() res: any) {
		try {

			const { lab_id } = this.configuration.getConfig();

			const datesObj = this.syncHelpers.getFromAndToDates(10);

			const query = {
				lab: lab_id,
				created_at: {
					$gte: datesObj.fromDate,
					$lte: datesObj.toDate
				}
			};

			const projection = { name: 1, code: 1 };

			const caseTypesData = await this.lisService.getCaseTypes(query, projection);

			if (caseTypesData.length == 0) {
				return res.status(200).json({
					success: true,
					message: CASE_TYPES_NOT_FOUND_IN_LIS_DATABASE
				});
			}

			const modifiedData = await this.syncHelpers.modifyCaseTypes(caseTypesData);

			if (modifiedData.length == 0) {
				return res.status(200).json({
					success: true,
					message: CASE_TYPES_NOT_FOUND
				});
			}

			// Inserting data into analytics db
			this.caseTypesService.insertCaseTypes(modifiedData);

			return res.status(200).json({
				success: true,
				message: SUCCESS_SYNCED_CASE_TYPES
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({ success: false, message: error || SOMETHING_WENT_WRONG });
		}
	}


	@Get('managers')
	async syncSalesRepsManagers(@Res() res: any) {
		try {

			const datesFilter = this.syncHelpers.getFromAndToDates(7);

			const salesRepsManagersData = await this.syncHelpers.getSalesRepsData(HOSPITAL_MARKETING_MANAGER, datesFilter);

			if (salesRepsManagersData.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			const finalManagersData = await this.syncHelpers.getFinalManagersData(salesRepsManagersData);

			if (finalManagersData.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			await this.salesRepService.insertSalesRepsManagers(finalManagersData);

			this.salesRepService.updateSalesRepsManagersData();

			return res.status(200).json({ success: true, message: SUCCUSS_INSERTED_MARKETING_MANAGERS });
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({ success: false, message: error.message || SOMETHING_WENT_WRONG });
		}
	}


	@Get('marketers')
	async syncSalesRepsMarketers(@Res() res: any) {
		try {

			const datesFilter = this.syncHelpers.getFromAndToDates(7);

			const salesRepsData = await this.syncHelpers.getSalesRepsData(MARKETER, datesFilter);

			if (salesRepsData.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			const unMatchedSalesRepsIds = await this.syncHelpers.getNotExistingIds(salesRepsData);

			if (unMatchedSalesRepsIds.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			const salesRepsQuery = { _id: { $in: unMatchedSalesRepsIds } };

			const salesRepsDataToInsert = await this.lisService.getUsers(salesRepsQuery);


			this.syncHelpers.getFinalSalesRepsData(salesRepsDataToInsert);

			return res.status(200).json({ success: true, message: SUCCUSS_INSERTED_SALES_REPS });
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({ success: false, message: error.message || SOMETHING_WENT_WRONG });
		}
	}


	@Get('facilities-marketers')
	async getFacilitiesWithNoMarketers(@Res() res: any) {
		try {
			const query = {};

			const projection = { _id: 1, name: 1 };

			const facilitiesData = await this.lisService.getFacilities(query, projection);

			const marketersDataJson = fs.readFileSync('sales_reps_hospitalsIds.json', 'utf-8');

			const marketersData = JSON.parse(marketersDataJson);

			const data = await this.syncHelpers.getHospitalsWithNoManagers(facilitiesData, marketersData);

			return res.status(200).json({ success: true, message: 'Success Fetched facilities', data: data });
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({ success: false, message: error || SOMETHING_WENT_WRONG });
		}
	}


	@Get('facilities')
	async syncFacilities(@Res() res: any) {
		try {

			const datesFilter = this.syncHelpers.getFromAndToDates(7);

			// const query = {
			// 	_id: {
			// 		$in: [
			// 			"65cf5a20cd2c7ce54e7177a5",
			// 			"65cf71d0e01fdcd8a23cf1de",
			// 			"65cfa4566cd21ee4e3ffcb89",
			// 			"65cfa4c6a2c4dce5a0007592",
			// 			"65cfa7bf6cd21ee4e3ffce74",
			// 			"65cfa081112d60e565b73da3",
			// 			"65cfa19966fab7e5b9f45a47",
			// 			"65cfa7ebf64af7e58b43e158",
			// 			"65cfab8744ae7ae53bda0d5c"
			// 		]
			// 	}
			// };

			// const select = {
			// 	_id: 1, hospitals: 1
			// };
			// const salesReps = await this.lisService.getUsers(query, select);

			// const hospitalsArray = salesReps.map(e => e.hospitals).flat();

			// const hospitals = [...new Set(hospitalsArray)];


			const hospitalQuery = {
				status: 'ACTIVE',
				updated_at: {
					$gte: datesFilter.fromDate,
					$lte: datesFilter.toDate,
				},
				// _id: {
				// 	$in: hospitals
				// }
			};

			const projection = { _id: 1, name: 1 };

			const facilitiesData = await this.lisService.getFacilities(hospitalQuery, projection);


			if (facilitiesData.length === 0) {
				return res.status(200).json({ success: true, message: LIS_FACILITIES_NOT_FOUND });
			}

			const unMatchedFacilities: any = await this.syncHelpers.getFacilitiesNotExisting(facilitiesData);

			if (unMatchedFacilities.length === 0) {
				return res.status(200).json({ success: true, message: FACILITIES_NOT_FOUND });
			}

			const unMatchedFacilitiesIds = unMatchedFacilities.map((e) => e._id);

			const salesRepsData = await this.syncHelpers.getSalesRepsByFacilites(unMatchedFacilitiesIds);

			// Assign names to transformedArray based on facilitiesMap
			let transformedArray = this.syncHelpers.transformFacilities(salesRepsData, unMatchedFacilities);

			const updatedFacilities = await this.syncHelpers.modifyFacilitiesData(transformedArray);

			this.faciliticesService.insertfacilities(updatedFacilities);

			return res.status(200).json({
				success: true,
				message: SUCCESS_INSERTED_FACILICES
			});
		}
		catch (error) {
			console.log({ error });
			return res.status(500).json({ success: false, message: error.message || SOMETHING_WENT_WRONG });
		}
	}


	@Get("labs")
	async SyncLabs(@Res() res: any) {
		try {

			const query = {
				lab_code: { $in: ["DLW-TX", "DLW"] }
			};

			const select = {
				_id: 1,
				name: 1,
				lab_code: 1,
			};

			const labsData = await this.lisService.getLabs(query, select);

			if (!labsData.length) {
				return res.status(200).json({
					success: false,
					message: LABS_NOT_FOUND
				});
			}

			const modifiedData = this.syncHelpers.modifyLabs(labsData);

			const refIds = modifiedData.map(e => e.refId);

			this.syncHelpers.insertOrUpdateLabs(modifiedData, refIds);

			return res.status(200).json({
				success: true,
				message: SUCCESS_SYNC_LABS,
				data: modifiedData
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}
}
