import { Controller, Get, Param, Delete, Res, Query, Post, UseGuards, Req } from '@nestjs/common';
import { HOSPITAL_MARKETING_MANAGER, SOMETHING_WENT_WRONG, SUCCESS_DELETED_DATA_IN_TABLE, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS, SUCCESS_FETCHED_CASE_TYPES_REVENUE, SUCCESS_FETCHED_ONE_SALES_REP, SUCCESS_FETCHED_PATIENT_CLAIMS_COUNT, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME, SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_MONTH_WISE_DATA, SUCCESS_FETCHED_SALES_REP_OVERALL_REVENUE, SUCCESS_FETCHED_SALES_REP_OVERALL_VOLUME, SUCCESS_FETCHED_SALES_REP_TREND_REVENUE, SUCCESS_FETCHED_SALES_REP_TREND_VOLUME, SUCCESS_FETCHED_SALES_REP_VOLUME_AND_REVENUE } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepService } from './sales-rep.service';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller({
	version: '1.0',
	path: 'sales-reps',
})
export class SalesRepController {
	constructor(
		private readonly salesRepService: SalesRepService,
		private readonly filterHelper: FilterHelper
	) { }

	@Get("all")
	async getSalesReps(@Res() res: any) {
		try {
			const data = await this.salesRepService.getAllSalesReps();

			return res.status(200).json({
				success: true,
				message: "Success",
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
	@Get()
	async getAll(@Res() res: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

			const salesReps = await this.salesRepService.getAll(queryString);
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
					salesRepData = await this.salesRepService.findSingleManagerSalesReps(salesRepData[0].reportingTo);

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

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_CASE_TYPES_REVENUE,
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
	@Get(':id/case-types/months/volume')
	async getCaseTypesVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const salesReps = await this.salesRepService.getCaseTypesVolume(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME,
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
	@Get(':id/insurance-payors')
	async getInsurancePayers(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const data = await this.salesRepService.getInsurancePayers(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA,
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
	@Get(':id/facilities')
	async getFacility(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRepFacilities(query);

			const salesReps = await this.salesRepService.getFacility(id, queryString);

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

}
