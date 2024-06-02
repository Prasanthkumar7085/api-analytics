import { Controller, Get, Query, Res } from '@nestjs/common';
import * as fs from 'fs';
import { CaseTypesService } from 'src/case-types/case-types.service';
import { Configuration } from 'src/config/config.service';
import { DLW_TIMEZONE, HOSPITAL_MARKETING_MANAGER, MARKETER, SALES_DIRECTOR } from 'src/constants/lisConstants';
import {
	CASE_TYPES_NOT_FOUND,
	CASE_TYPES_NOT_FOUND_IN_LIS_DATABASE,
	FACILITIES_NOT_FOUND,
	INSURANCE_PAYORS_NOT_FOUND,
	INSURANCE_PAYORS_NOT_FOUND_IN_LIS_DATABASE,
	LABS_NOT_FOUND,
	LIS_FACILITIES_NOT_FOUND,
	PATIENT_CLAIMS_NOT_FOUND, REMOVED_ARCHIVED_CLAIMS,
	SALES_REPS_NOT_FOUND,
	SOMETHING_WENT_WRONG,
	SUCCESS_INSERTED_FACILICES,
	SUCCESS_SALES_REPS_SYNC,
	SUCCESS_SYNCED_CASE_TYPES, SUCCESS_SYNCED_INSURANCE_PAYORS,
	SUCCESS_SYNC_LABS,
	SUCCESS_SYNC_PATIENT_CLAIMS,
	SUCCESS_SYNC_SALES_REPS_MONTHLY_TARGETS,
	SUCCUSS_INSERTED_MARKETING_MANAGERS, SUCCUSS_INSERTED_SALES_REPS,
	TARGETS_ACHIVED_NOT_FOUND,
	TARGETS_ACHIVED_SYNCED_SUCCESS
} from 'src/constants/messageConstants';
import { FacilitiesService } from 'src/facilities/facilities.service';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { InsurancesService } from "src/insurances/insurances.service";
import { LisService } from 'src/lis/lis.service';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { SyncService } from './sync.service';

import { SalesRepsTargetsService } from 'src/sales-reps-targets/sales-reps-targets.service';
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
		private readonly facilitiesService: FacilitiesService,
		private readonly salesrepTargetService: SalesRepsTargetsService
	) { }

	@Get('patient-claims')
	async addPatientClaims(@Res() res: any) {
		try {

			const datesObj = this.syncHelpers.getFromAndToDatesInEST(1, DLW_TIMEZONE);

			const fromDate = datesObj.fromDate;
			const toDate = datesObj.toDate;

			console.log({ fromDate, toDate });

			const facilitiesArray = await this.facilitiesService.getAllFacilitiesData();

			let facilities = facilitiesArray.map(e => e.refId);

			facilities = facilities.filter(item => item !== null);

			const cases = await this.syncHelpers.getCases(fromDate, toDate, facilities);

			if (cases.length == 0) {
				return res.status(200).json({
					success: true,
					message: PATIENT_CLAIMS_NOT_FOUND
				});
			}

			console.log({ cases: cases.length });

			this.syncHelpers.insertPatientClaims(cases);

			return res.status(200).json({
				success: true,
				message: SUCCESS_SYNC_PATIENT_CLAIMS,
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
			const datesObj = this.syncHelpers.getFromAndToDatesInEST(7, DLW_TIMEZONE);

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

			const datesFilter = this.syncHelpers.getFromAndToDatesInEST(1, DLW_TIMEZONE);

			const salesRepsManagersData = await this.syncHelpers.getSalesRepsData(HOSPITAL_MARKETING_MANAGER, datesFilter);

			if (salesRepsManagersData.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			const finalManagersData = await this.syncHelpers.getFinalManagersData(salesRepsManagersData);

			if (finalManagersData.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			let insertedData: any = await this.salesRepService.insertSalesRepsManagers(finalManagersData);

			if (insertedData.length) {
				const ids = insertedData.map((e) => e.id);
				this.salesRepService.updateSalesRepsManagersData(ids);
			}

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

			const datesFilter = this.syncHelpers.getFromAndToDatesInEST(1, DLW_TIMEZONE);

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

			const datesFilter = this.syncHelpers.getFromAndToDatesInEST(7, DLW_TIMEZONE);

			const salesRepsData = await this.salesRepService.getSalesReps("");
			const salesReps = salesRepsData.map((e) => e.ref_id).filter((ref_id) => ref_id !== null);

			const query = {
				_id: {
					$in: salesReps
				},
				status: "ACTIVE"
			};

			const select = {
				_id: 1, hospitals: 1
			};
			const salesRepsDataFromLis = await this.lisService.getUsers(query, select);

			const hospitalsArray = salesRepsDataFromLis.map(e => e.hospitals).flat();

			const hospitals = [...new Set(hospitalsArray)];


			const hospitalQuery = {
				status: 'ACTIVE',
				// updated_at: {
				// 	$gte: datesFilter.fromDate,
				// 	$lte: datesFilter.toDate,
				// },
				_id: {
					$in: hospitals
				}
			};

			const projection = { _id: 1, name: 1 };

			const facilitiesData = await this.lisService.getFacilities(hospitalQuery, projection);


			if (facilitiesData.length === 0) {
				return res.status(200).json({ success: true, message: LIS_FACILITIES_NOT_FOUND });
			}

			const { notExistedFacilities, existedFacilities } = await this.syncHelpers.getFacilitiesNotExisting(facilitiesData);

			this.syncHelpers.insertOrUpdatedFacilities(notExistedFacilities, existedFacilities);

			return res.status(200).json({
				success: true,
				message: SUCCESS_INSERTED_FACILICES,
				notExistedFacilities, existedFacilities
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


	@Get("targets-achived")
	async syncTargetsAchived(@Res() res: any) {
		try {

			const currentDate = new Date();

			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month index
			const day = String(currentDate.getDate()).padStart(2, '0');

			const formattedDate = `${year}-${month}-${day}`;

			let claimsData: any = await this.SyncService.getCaseTypesVolume(formattedDate);

			if (claimsData.length === 0) {
				return res.status(200).json({
					success: true,
					message: TARGETS_ACHIVED_NOT_FOUND
				});
			}

			// get the start date and end date by using month
			claimsData = claimsData.map(item => {
				const { start_date, end_date } = this.syncHelpers.parseMonth(item.month);
				return { ...item, start_date, end_date };
			});


			claimsData = this.syncHelpers.targetsAchivedGrouping(claimsData);

			const result = this.syncHelpers.modifyTargetsAchived(claimsData);

			const { existed, notExisted } = await this.syncHelpers.getExistedAndNotExistedTargetsAchived(result);

			this.syncHelpers.insertOrUpdateTargetsAchived(existed, notExisted);

			return res.status(200).json({
				success: true,
				message: TARGETS_ACHIVED_SYNCED_SUCCESS,
				existed, notExisted
			});
		} catch (err) {
			console.log({ err });
		}
	}

	@Get("sales-reps-targets")
	async syncSalesRepsTargets(@Res() res: any, @Query('month') month?: string) {
		try {
			let modifiedData;

			// Use the provided month or default to the current month
			const currentDate = new Date();
			const currentMonth = await formateMonth(currentDate);
			const queryMonth = month || currentMonth;

			// Construct the query to fetch data for the specified month
			let query = `month='${queryMonth}'`;

			// Fetch data for the specified month
			let salesRepsTargetData = await this.salesrepTargetService.getAllSalesRepsTargets(query);

			// If no data found for the provided month, fallback to the previous month
			if (!salesRepsTargetData.length) {
				const lastMonth = await getLastMonth(currentDate);
				query = `month='${lastMonth}'`;

				salesRepsTargetData = await this.salesrepTargetService.getAllSalesRepsTargets(query);

				if (salesRepsTargetData.length) {
					modifiedData = this.syncHelpers.modifySalesRepTargetData(salesRepsTargetData);

					const newMonth = queryMonth; // Or specify the new month if different from queryMonth

					const [year, month] = newMonth.split('-').map(Number);

					const newStartDate = new Date(year, month - 1, 1); // Corrected month index (0-based)
					const newEndDate = new Date(year, month, 0); // Corrected last day of the month

					modifiedData = await Promise.all(modifiedData.map(async (item) => ({
						...item,
						startDate: await formatDate(newStartDate),
						endDate: await formatDate(newEndDate),
						month: await formateMonth(newStartDate),
					})));

					console.log("modifiedData", modifiedData);

					await this.salesrepTargetService.insertSalesRepsTargets(modifiedData);
				}
			}

			return res.status(200).json({
				success: true,
				message: SUCCESS_SYNC_SALES_REPS_MONTHLY_TARGETS,
				modifiedData
			});

		} catch (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				message: err.message || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get("sales-directors")
	async syncSalesDirectors(@Res() res: any) {
		try {

			const select = {
				user_type: 1,
				first_name: 1,
				last_name: 1,
				email: 1
			};

			const directorsData = await this.syncHelpers.getRepsFromLis(SALES_DIRECTOR, select);

			if (directorsData.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			const { existedReps: existedDirectors, notExistedReps: notExistedDirectors } = await this.syncHelpers.seperateExistedAndNotExistedRepsByRefId(directorsData);

			this.syncHelpers.insertOrUpdateSalesDirectors(existedDirectors, notExistedDirectors);

			return res.status(200).json({
				success: true,
				message: SUCCESS_SALES_REPS_SYNC,
				existedDirectors, notExistedDirectors
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get("sales-managers")
	async syncSalesManagers(@Res() res: any) {
		try {

			const select = {
				user_type: 1,
				first_name: 1,
				last_name: 1,
				email: 1,
				reporting_to: 1
			};

			let managersData: any = await this.syncHelpers.getRepsFromLis(HOSPITAL_MARKETING_MANAGER, select);

			if (managersData.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			const { existedReps: existedManagers, notExistedReps: notExistedManagers } = await this.syncHelpers.seperateExistedAndNotExistedManagersByRefId(managersData);

			this.syncHelpers.insertOrUpdateSalesManagers(existedManagers, notExistedManagers, 2);

			return res.status(200).json({
				success: true,
				message: SUCCESS_SALES_REPS_SYNC,
				existedManagers, notExistedManagers
			});
		} catch (err) {
			console.log({ err });
			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get("sales-marketers")
	async syncSalesMarketers(@Res() res: any) {
		try {

			const select = {
				user_type: 1,
				first_name: 1,
				last_name: 1,
				email: 1,
				reporting_to: 1
			};

			let marketersData: any = await this.syncHelpers.getRepsFromLis(MARKETER, select);

			if (marketersData.length === 0) {
				return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
			}

			const { existedReps: existedMarketers, notExistedReps: notExistedMarketers } = await this.syncHelpers.seperateExistedAndNotExistedManagersByRefId(marketersData);

			this.syncHelpers.insertOrUpdateSalesManagers(existedMarketers, notExistedMarketers, 1);

			return res.status(200).json({
				success: true,
				message: SUCCESS_SALES_REPS_SYNC,
				existedMarketers, notExistedMarketers
			});
		} catch (err) {
			console.log({ err });
			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}

}

async function formateMonth(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${month}-${year}`;
}


async function getLastMonth(date: Date) {
	const year = date.getFullYear();
	let month = date.getMonth() + 1; // Get current month

	console.log(month);

	const formattedMonth = String(month).padStart(2, '0');
	const lastMonth = `${formattedMonth}-${year}`;

	return lastMonth;
}


async function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}


