import { Controller, Get, Param, Delete, Res, Query, Post } from '@nestjs/common';
import { SOMETHING_WENT_WRONG, SUCCESS_DELETED_DATA_IN_TABLE, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS, SUCCESS_FETCHED_CASE_TYPES_REVENUE, SUCCESS_FETCHED_ONE_SALES_REP, SUCCESS_FETCHED_PATIENT_CLAIMS_COUNT, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME, SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_MONTH_WISE_DATA, SUCCESS_FETCHED_SALES_REP_TREND_REVENUE, SUCCESS_FETCHED_SALES_REP_TREND_VOLUME, SUCCESS_FETCHED_SALES_REP_VOLUME_AND_REVENUE } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepServiceV3 } from './sales-rep-v3.service';


@Controller({
	version: '3.0',
	path: 'sales-reps',
})
export class SalesRepControllerV3 {
	constructor(
		private readonly salesRepService: SalesRepServiceV3,
		private readonly filterHelper: FilterHelper
	) { }


	@Get()
	async getAll(@Res() res: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

			console.log({ queryString });

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


	@Get(':id')
	async getOne(@Param('id') id: any, @Res() res: any) {
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


	@Get(':id/stats-revenue')
	async getRevenueStats(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = await this.filterHelper.salesRep(query);

			const data = await this.salesRepService.getRevenueStats(id, queryString)

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


	@Get(':id/stats-volume')
	async getVolumeStats(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

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
			})
		}
	}


	@Get(':id/case-types')
	async getOverallCaseTypes(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

			const salesReps = await this.salesRepService.getOverAllCaseTypes(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_VOLUME_AND_REVENUE,
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


	@Get(':id/case-types/revenue')
	async getCaseTypesRevenue(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

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


	@Get(':id/case-types/volume')
	async getCaseTypesVolume(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

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


	@Get(':id/insurance-payors')
	async getInsurancePayers(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

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


	@Get(':id/facilities')
	async getFacility(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

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


	@Get(':id/trends/revenue')
	async getRevenueTrends(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

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


	@Get(':id/trends/volume')
	async getVolumeTrends(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

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

	@Get(':id/insurance-payors/:i_id')
	async getOneInsuranceRevenue(@Param() param: any, @Res() res: any, @Query() query: any) {
		try {

			const { id, i_id } = param;

			const queryString = this.filterHelper.salesRep(query);

			const data = await this.salesRepService.getOneInsuranceRevenue(id, i_id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_MONTH_WISE_DATA,
				data: data
			})
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
