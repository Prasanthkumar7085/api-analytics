import { Controller, Delete, Get, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SOMETHING_WENT_WRONG, SUCCESS_DELETED_DATA_IN_TABLE, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS, SUCCESS_FETCHED_CASE_TYPES_STATS_REVENUE, SUCCESS_FETCHED_ONE_SALES_REP, SUCCESS_FETCHED_PATIENT_CLAIMS_COUNT, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALES_REPS, SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME, SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS, SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS_VOLUME, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA_REVENUE, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA_VOLUME, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_MONTH_WISE_DATA, SUCCESS_FETCHED_SALES_REP_OVERALL_REVENUE, SUCCESS_FETCHED_SALES_REP_OVERALL_VOLUME, SUCCESS_FETCHED_SALES_REP_TREND_REVENUE, SUCCESS_FETCHED_SALES_REP_TREND_VOLUME } from 'src/constants/messageConstants';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { SalesRepService } from './sales-rep.service';
import { SortHelper } from 'src/helpers/sortHelper';
import { HOSPITAL_MARKETING_MANAGER } from 'src/constants/lisConstants';


@Controller({
	version: '1.0',
	path: 'sales-reps',
})
export class SalesRepController {
	constructor(
		private readonly salesRepService: SalesRepService,
		private readonly filterHelper: FilterHelper,
		private readonly syncHelper: SyncHelpers,
		private readonly sortHelper: SortHelper
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

			if (salesReps.length) {
				salesReps = await this.manualSortAndAddingSalesReps(query, salesReps);
				salesReps = await this.getFacilitiesBySalesRep(salesReps);
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
	async getSalesRepByRefId(@Res() res: any, @Req() req: any) {
		try {
			const refId = req.user._id.toString();

			let salesRepData = await this.salesRepService.findOneSalesRep(refId);

			if (req.user.user_type === HOSPITAL_MARKETING_MANAGER) {
				if (salesRepData.length > 0) {
					salesRepData = await this.salesRepService.getSalesRepsByManager(salesRepData[0].reportingTo);
				}
			}

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_ONE_SALES_REP,
				data: salesRepData
			});
		} catch (err) {
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

			return res.status(200).json({
				success: true,
				message: SUCCESS_FECTED_SALE_REP_VOLUME_STATS,
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
				if (!this.facilityExists(salesReps, facility.id)) {
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
				if (!this.facilityExists(salesReps, facility.id)) {
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


	facilityExists(finalResp, id) {
		return finalResp.some(facility => facility.facility_id === id);
	}


	salesRepExists(finalResp, id) {
		return finalResp.some(rep => rep.sales_rep_id === id);
	}


	async manualSortAndAddingSalesReps(query, salesReps) {
		const salesRepsQueryString = this.filterHelper.salesRepsFilter(query);

		const salesRepsData = await this.salesRepService.getSalesReps(salesRepsQueryString);

		salesRepsData.forEach(rep => {
			if (!this.salesRepExists(salesReps, rep.id)) {
				salesReps.push({
					sales_rep_id: rep.id,
					sales_rep_name: rep.name,
					email: rep.email,
					no_of_facilities: 0,
					expected_amount: 0,
					generated_amount: 0,
					paid_amount: 0,
					pending_amount: 0,
					total_cases: 0,
					pending_cases: 0
				});
			}
		});

		salesReps = this.sortHelper.sort(salesReps, "sales_rep_name");

		return salesReps;
	}


	async getFacilitiesBySalesRep(salesReps) {
		const salesRepIds = salesReps.map(e => e.sales_rep_id);

		const facilities = await this.salesRepService.getAllFacilitiesCountBySalesRep(salesRepIds);

		for (const rep of salesReps) {
			const facility: any = facilities.find(fac => fac.sales_rep_id === rep.sales_rep_id);
			if (facility) {
				rep.total_facilities = parseInt(facility.total_facilities);
			} else {
				rep.total_facilities = 0; // If no facilities found, set to 0 or handle as needed
			}
		}

		return salesReps;

	}

}
