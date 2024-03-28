import { Controller, Get, NotFoundException, Post, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { LisService } from 'src/lis/lis.service';
import { PATIENT_CLAIMS_NOT_FOUND, REMOVED_ARCHIVED_CLAIMS, SUCCESS_SYNC_PATIENT_CLAIMS, CASE_TYPES_NOT_FOUND_IN_LIS_DATABASE, INSURANCE_PAYORS_NOT_FOUND_IN_LIS_DATABASE, CASE_TYPES_NOT_FOUND, INSURANCE_PAYORS_NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS_SYNCED_CASE_TYPES, SUCCESS_SYNCED_INSURANCE_PAYORS } from 'src/constants/messageConstants';
import { SyncHelpers } from 'src/helpers/syncHelper';
import * as fs from 'fs';
import { Configuration } from 'src/config/config.service';
import { InsurancesV3Service } from "src/insurances-v3/insurances-v3.service";
import { CaseTypesV3Service } from 'src/case-types-v3/case-types-v3.service';

@Controller({
	version: '3.0',
	path: 'sync'
})

export class SyncV3Controller {
	constructor(
		private readonly syncV3Service: SyncV3Service,
		private readonly lisService: LisService,
		private readonly syncHelpers: SyncHelpers,
		private readonly configuration: Configuration,
		private readonly caseTypesV3Service: CaseTypesV3Service,
		private readonly insurancesV3Service: InsurancesV3Service,
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

			let modifiedArray = await this.syncHelpers.modifyCasesForPatientClaims(cases, analyticsData);

			if (modifiedArray.length) {

				const seperatedArray = await this.syncHelpers.seperateModifiedArray(modifiedArray);

				this.syncHelpers.insertOrUpdateModifiedClaims(seperatedArray);
			}

			return res.status(200).json({
				success: true,
				message: SUCCESS_SYNC_PATIENT_CLAIMS
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

			this.syncV3Service.removePatientClaims(accessionIds);
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
			this.insurancesV3Service.insertInsurancePayors(modifiedData);

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
			this.caseTypesV3Service.insertCaseTypes(modifiedData);

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


	@Get('facilities')
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

}
