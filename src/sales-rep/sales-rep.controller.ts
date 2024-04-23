import { Controller, Delete, Get, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { EMAIL_CRON_STARTED_SUCCESS, SOMETHING_WENT_WRONG, SUCCESS_DELETED_DATA_IN_TABLE, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS, SUCCESS_FETCHED_CASE_TYPES_STATS_REVENUE, SUCCESS_FETCHED_ONE_SALES_REP, SUCCESS_FETCHED_PATIENT_CLAIMS_COUNT, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALES_REPS, SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME, SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS, SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS_VOLUME, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA_REVENUE, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA_VOLUME, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_MONTH_WISE_DATA, SUCCESS_FETCHED_SALES_REP_OVERALL_REVENUE, SUCCESS_FETCHED_SALES_REP_OVERALL_VOLUME, SUCCESS_FETCHED_SALES_REP_TREND_REVENUE, SUCCESS_FETCHED_SALES_REP_TREND_VOLUME, SUCCESS_VOLUME_TREND } from 'src/constants/messageConstants';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';
import { SortHelper } from 'src/helpers/sortHelper';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { EmailServiceProvider } from 'src/notifications/emailServiceProvider';
import { SalesRepService } from './sales-rep.service';
import axios from 'axios';
import { Configuration } from 'src/config/config.service';
import { SalesRepsTargetsAchivedService } from 'src/sales-reps-targets-achived/sales-reps-targets-achived.service';
import { SalesRepsTargetsService } from 'src/sales-reps-targets/sales-reps-targets.service';


@Controller({
	version: '1.0',
	path: 'sales-reps',
})
export class SalesRepController {
	constructor(
		private readonly salesRepService: SalesRepService,
		private readonly filterHelper: FilterHelper,
		private readonly syncHelper: SyncHelpers,
		private readonly sortHelper: SortHelper,
		private readonly salesRepHelper: SalesRepHelper,
		private readonly emailServiceProvider: EmailServiceProvider,
		private readonly configuration: Configuration,
		private readonly salesRepsTargetsAchivedService: SalesRepsTargetsAchivedService,
		private readonly salesRepsTargetsService: SalesRepsTargetsService


	) { }

	@UseGuards(AuthGuard)
	@Get()
	async getSalesReps(@Res() res: any) {
		try {
			const data = await this.salesRepService.getAllSalesReps();

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REPS,
				data
			});
		} catch (err) {
			console.log({ err });

			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get("stats")
	async getAll(@Res() res: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

			let salesReps = await this.salesRepService.getAll(queryString);

			let targets;
			if (salesReps.length) {
				salesReps = await this.salesRepHelper.manualSortAndAddingSalesReps(query, salesReps);
				salesReps = await this.salesRepHelper.getFacilitiesBySalesRep(salesReps);

				const salesRepIds = salesReps.map(e => e.sales_rep_id);
				query.sales_reps = salesRepIds;
				targets = await this.salesRepHelper.getTargets(query);

				salesReps = this.salesRepHelper.mergeSalesRepAndTargets(salesReps, targets);
			}

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP,
				data: salesReps
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get("ref-id")
	async getSalesRepByRefId(@Res() res: any, @Req() req: any, @Query() query: any) {
		try {
			const refId = req.user.ref_id;
			const mghRefId = req.user.mgh_ref_id;

			const queryString = this.filterHelper.salesRepsByRefIdFilter(refId, mghRefId);

			let salesRepData = await this.salesRepService.getSalesReps(queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_ONE_SALES_REP,
				data: salesRepData
			});
		} catch (err) {
			console.log({ err });
			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get('patient-claims-count')
	async getPatientClaimsTotalCount(@Query() query: any, @Res() res: any) {
		try {

			const queryString = await this.filterHelper.salesRep(query);

			const data = await this.salesRepService.getPatientClaimsTotalCount(queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_PATIENT_CLAIMS_COUNT,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	async getOne(@Param('id') id: number, @Res() res: any) {
		try {

			const data = await this.salesRepService.getOne(id);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_ONE_SALES_REP,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id/stats-revenue')
	async getRevenueStats(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = await this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getRevenueStats(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FECTED_SALE_REP_REVENUE_STATS,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id/stats-volume')
	async getVolumeStats(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getVolumeStats(id, queryString);

			query.sales_reps = [id];

			const salesRepTargetData = await this.salesRepHelper.getTargets(query);

			const targetVolume = salesRepTargetData.reduce((acc, entry) => {
				// Iterate over the months and add the first element value of each month
				Object.values(entry)
					.filter(val => Array.isArray(val)) // Filter out non-array values
					.forEach(month => acc += month[0]); // Add the first element value

				return acc;
			}, 0);

			data[0].target_volume = targetVolume;

			return res.status(200).json({
				success: true,
				message: SUCCESS_FECTED_SALE_REP_VOLUME_STATS,
				data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id/case-types-revenue')
	async getOverAllCaseTypesRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const salesReps = await this.salesRepService.getOverAllCaseTypesRevenue(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_OVERALL_REVENUE,
				data: salesReps
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id/case-types-volume')
	async getOverallCaseTypesVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const salesReps = await this.salesRepService.getOverAllCaseTypesVolume(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_OVERALL_VOLUME,
				data: salesReps
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/case-types-volume-targets')
	async getOverallCaseTypesVolumeTargets(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const [patientClaimsData, targetedData] = await Promise.all([
				this.salesRepService.getOverAllCaseTypesVolume(id, queryString),
				this.salesRepsTargetsService.getTargetsStatsForSingleRep(id)
			]);

			const mergedDataArray = this.salesRepHelper.mergeSalesRepCaseTypeWiseVolumeAndTargets(targetedData, patientClaimsData);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_OVERALL_VOLUME,
				data: mergedDataArray
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/case-types/months/revenue')
	async getCaseTypesRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const salesReps = await this.salesRepService.getCaseTypesRevenue(id, queryString);

			const resultArray = this.syncHelper.modifySalesRepRevenuCaseTypeWise(salesReps);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_CASE_TYPES_STATS_REVENUE,
				data: resultArray
			});

		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id/case-types/months/volume')
	async getCaseTypesVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const salesReps = await this.salesRepService.getCaseTypesVolume(id, queryString);

			const resultsArray = this.syncHelper.modifySalesRepVolumeCaseTypeWise(salesReps);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME,
				data: resultsArray
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/case-types/months/volume-targets')
	async getCaseTypesVolumeMonthlyTargets(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);
			const targetsQueryString = await this.filterHelper.salesRepsMonthlyTargets(query);

			const [salesReps, targetsData] = await Promise.all([
				this.salesRepService.getCaseTypesVolume(id, queryString),
				this.salesRepsTargetsService.getAllTargetsForSalesRep(id, targetsQueryString)
			]);

			const transformedData = this.salesRepHelper.transformCaseTypeTargetsMonthWiseVolume(targetsData);

			// Merge targetsData with salesRepsData and calculate total_targets
			const mergedData = this.salesRepHelper.mergeCaseTypeMonthlyVolumeAndTargets(salesReps, transformedData);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME,
				data: mergedData
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/insurance-payors/revenue')
	async getInsurancePayersRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getInsurancePayersRevenue(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA_REVENUE,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/insurance-payors/volume')
	async getInsurancePayersVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getInsurancePayersVolume(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA_VOLUME,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id/facilities/revenue')
	async getFacilitiesRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			let salesReps: any = await this.salesRepService.getFacilitiesRevenue(id, queryString);

			const salesRepFacilities = await this.salesRepService.getAllFacilitiesBySalesRep(id);

			salesRepFacilities.forEach(facility => {
				if (!this.salesRepHelper.facilityExists(salesReps, facility.id)) {
					salesReps.push({
						facility_id: facility.id,
						facility_name: facility.name,
						generated_amount: 0,
						paid_amount: 0,
						pending_amount: 0,
						total_cases: 0
					});
				}
			});

			salesReps = this.sortHelper.sort(salesReps, "facility_name");

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS,
				data: salesReps
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/facilities/volume')
	async getFacilitiesVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			let salesReps: any = await this.salesRepService.getFacilitiesVolume(id, queryString);

			const salesRepFacilities = await this.salesRepService.getAllFacilitiesBySalesRep(id);

			salesRepFacilities.forEach(facility => {
				if (!this.salesRepHelper.facilityExists(salesReps, facility.id)) {
					salesReps.push({
						facility_id: facility.id,
						facility_name: facility.name,
						total_cases: 0,
						completed_cases: 0,
						pending_cases: 0
					});
				}
			});

			salesReps = this.sortHelper.sort(salesReps, "facility_name");

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS_VOLUME,
				data: salesReps
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/facilities/volume-month-wise')
	async getFacilitiesVolumeMonthWise(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			let salesReps: any = await this.salesRepService.getFacilitiesVolumeMonthWise(id, queryString);

			const salesRepFacilities = await this.salesRepService.getAllFacilitiesBySalesRep(id);

			// step 1: need to add the not existed facilities woth default values
			salesRepFacilities.forEach(facility => {
				if (!this.salesRepHelper.facilityExists(salesReps, facility.id)) {
					salesReps.push({
						facility_id: facility.id,
						facility_name: facility.name,
						total_cases: 0,
						completed_cases: 0,
						pending_cases: 0
					});
				}
			});

			const uniqueMonths = [...new Set(salesReps.map(rep => rep.month))];

			// Step 2: Iterate over each facility in salesReps and each unique month
			salesReps.forEach(rep => {
				uniqueMonths.forEach(month => {
					// Check if the combination of facility and month exists
					const exists = salesReps.some(r => r.facility_id === rep.facility_id && r.month === month);
					if (!exists) {
						// Add default object for missing combination
						salesReps.push({
							facility_id: rep.facility_id,
							facility_name: rep.facility_name,
							month: month,
							total_cases: 0,
							completed_cases: 0,
							pending_cases: 0
						});
					}
				});
			});

			salesReps = salesReps.filter(rep => rep.month);

			salesReps = this.sortHelper.sortOnMonth(salesReps);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS_VOLUME,
				data: salesReps
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/facilities/revenue-month-wise')
	async getFacilitiesRevenueMonthWise(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			let salesReps: any = await this.salesRepService.getFacilitiesRevenueMonthWise(id, queryString);

			const salesRepFacilities = await this.salesRepService.getAllFacilitiesBySalesRep(id);

			salesRepFacilities.forEach(facility => {
				if (!this.salesRepHelper.facilityExists(salesReps, facility.id)) {
					salesReps.push({
						facility_id: facility.id,
						facility_name: facility.name,
						generated_amount: 0,
						paid_amount: 0,
						pending_amount: 0,
						total_cases: 0
					});
				}
			});


			const uniqueMonths = [...new Set(salesReps.map(rep => rep.month))];

			// Step 2: Iterate over each facility in salesReps and each unique month
			salesReps.forEach(rep => {
				uniqueMonths.forEach(month => {
					// Check if the combination of facility and month exists
					const exists = salesReps.some(r => r.facility_id === rep.facility_id && r.month === month);
					if (!exists && !rep.month) {
						// Update the existing object with the month if it doesn't have it already
						rep.month = month;
						rep.generated_amount = 0;
						rep.paid_amount = 0;
						rep.pending_amount = 0;
						rep.total_cases = 0;
					}
				});
			});

			salesReps = this.sortHelper.sort(salesReps, "facility_name");

			salesReps = salesReps.filter(rep => rep.month);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS,
				data: salesReps
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(':id/trends/revenue')
	async getRevenueTrends(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getRevenueTrends(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_TREND_REVENUE,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get(':id/trends/volume')
	async getVolumeTrends(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getVolumeTrends(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_TREND_VOLUME,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Get(":id/trends/volume-targets")
	async getSingleSalesRepTrendsVolume(@Res() res: any, @Param() param: any, @Query() query: any) {
		try {

			const id = param.id;

			const queryString = this.filterHelper.salesRepsMonthlyTargets(query);

			const [achivedData, targetedData] = await Promise.all([
				this.salesRepsTargetsAchivedService.getSingleSalesRepTargetVolume(id, queryString),
				this.salesRepsTargetsService.getSingleSalesRepTargetVolume(id, queryString)
			]);

			const achievedMap = new Map(achivedData.map(item => [item.month, item]));

			// Merge achievedData and targetedData based on month
			let mergedData = targetedData.map(item => ({
				month: item.month,
				total_volume: (achievedMap.get(item.month) || { total_volume: 0 }).total_volume,
				total_target: item.total_target
			}));

			mergedData = this.sortHelper.sortOnMonth(mergedData);

			return res.status(200).json({
				success: true,
				message: SUCCESS_VOLUME_TREND,
				mergedData
			});
		} catch (err) {
			console.log({ err });
			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@UseGuards(AuthGuard)
	@Delete('delete')
	async dropTable(@Res() res: any) {
		try {

			const data = await this.salesRepService.dropTable();

			return res.status(200).json({
				success: true,
				message: SUCCESS_DELETED_DATA_IN_TABLE,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}
	@UseGuards(AuthGuard)
	@Get(':id/insurance-payors/:payor_id')
	async getOneInsuranceRevenue(@Param() param: any, @Res() res: any, @Query() query: any) {
		try {

			const { id, payor_id } = param;

			const queryString = this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getOneInsuranceRevenue(id, payor_id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_MONTH_WISE_DATA,
				data: data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get('target-summary/:sales_repid')
	async getSalesRepsTargetSummary(@Res() res: any, @Param('sales_repid') sales_repid: number, @Query() query: any) {
		try {

			let month;
			let year;
			const queryString = this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getVolumeStats(sales_repid, queryString);

			query.sales_reps = [sales_repid];

			const salesRepTargetData = await this.salesRepHelper.getTargets(query);

			const salesRepData = await this.salesRepService.getOne(sales_repid);

			const targetVolume = salesRepTargetData.reduce((acc, entry) => {
				// Iterate over the months and add the first element value of each month
				Object.values(entry)
					.filter(val => Array.isArray(val)) // Filter out non-array values
					.forEach(month => acc += month[0]); // Add the first element value

				return acc;
			}, 0);

			data[0].target_volume = targetVolume;

			if (query.from_date && query.to_date) {
				const fromDate = new Date(query.from_date);

				month = fromDate.toLocaleString('default', { month: 'long' });
				year = fromDate.getFullYear();

			}
			else {

				const dateObject = new Date();
				month = dateObject.getMonth();
				year = dateObject.getFullYear();

			}

			data[0].sales_rep_name = salesRepData[0].sales_rep;
			data[0].sales_rep_email = salesRepData[0].sales_rep_email;
			data[0].month = month;
			data[0].year = year;

			if (!data[0].sales_rep_email) {
				throw new Error("Sales rep email is empty");
			}

			let emailContent = {
				email: data[0].sales_rep_email,
				subject: 'Volume targets summary'
			};

			await this.emailServiceProvider.sendSalesRepsTargetSummaryReport(emailContent, data[0]);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FECTED_SALE_REP_VOLUME_STATS,
				data
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@Get('target-summary/notify/all')
	async notifyTargetSummaryData(@Res() res: any, @Query() query: any) {
		try {

			const salesReps = await this.salesRepService.getAllSalesReps();

			const currentDate = new Date();

			const from_date = new Date(currentDate);
			const to_date = new Date(currentDate);
			to_date.setDate(to_date.getDate() + 7);

			for (const salesRep of salesReps) {
				const apiUrl = `${this.configuration.getConfig().api_url}/v1.0/sales-reps/target-summary/${salesRep.id}?from_date=${from_date.toISOString()}&to_date=${to_date.toISOString()}`;

				await axios.get(apiUrl);
			}

			return res.status(200).json({
				success: true,
				message: EMAIL_CRON_STARTED_SUCCESS,
			});


		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}
}
