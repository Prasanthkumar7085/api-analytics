import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { FacilitiesV3Service } from './facilities-v3.service';
import { SOMETHING_WENT_WRONG, SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_REVENUE, SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_VOLUME, SUCCESS_FETCHED_FACILITIES, SUCCESS_FETCHED_FACILITIES_REVENUE_STATS, SUCCESS_FETCHED_FACILITIES_TRENDS_REVENUE, SUCCESS_FETCHED_FACILITIES_TRENDS_VOLUME, SUCCESS_FETCHED_FACILITIES_VOLUME_STATS, SUCCESS_FETCHED_FACILITY, SUCCESS_FETCHED_FACILITY_CASE_TYPES_OVERALL_REVENUE, SUCCESS_FETCHED_FACILITY_CASE_TYPES_OVERALL_VOLUME, SUCCESS_FETCHED_FACILITY_INSURANCE_PAYORS, SUCCESS_FETCHED_FACILITY_INSURANCE_REVENUE_DATA } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';

@Controller({
	version: '3.0',
	path: 'facilities'
})
export class FacilitiesV3Controller {
	constructor(
		private readonly facilitiesV3Service: FacilitiesV3Service,
		private readonly filterHelper: FilterHelper
	) { }


	@Get()
	async getAllFacilities(@Res() res: any, @Query() query: any) {
		try {

			const queryString = await this.filterHelper.facilitiesDateFilter(query);	// date filter on service data in patient_claims table

			const data = await this.facilitiesV3Service.getAllFacilities(queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITIES,
				data: data
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


	@Get(':id')
	async getFacilityDetails(@Res() res: any, @Param('id') id: number) {
		try {

			const data = await this.facilitiesV3Service.getFacilityDetails(id);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITY,
				data: data
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


	@Get(':id/stats-revenue')
	async getRevenueStats(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = await this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getRevenueStats(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITIES_REVENUE_STATS,
				data: data
			});
		}
		catch (err) {
			console.log(err);

			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get(':id/stats-volume')
	async getVolumeStats(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {
			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getVolumeStats(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITIES_VOLUME_STATS,
				data: data
			});
		}
		catch (err) {
			console.log(err);

			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get(':id/case-types-revenue')
	async getOverAllCaseTypesRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

			const salesReps = await this.facilitiesV3Service.getOverAllCaseTypesRevenue(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITY_CASE_TYPES_OVERALL_REVENUE,
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


	@Get(':id/case-types-volume')
	async getOverAllCaseTypesVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

			const salesReps = await this.facilitiesV3Service.getOverAllCaseTypesVolume(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITY_CASE_TYPES_OVERALL_VOLUME,
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


	@Get(':id/case-types/months/revenue')
	async getCaseTypesRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getCaseTypesRevenue(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_REVENUE,
				data: data
			});
		}
		catch (err) {
			console.log(err);

			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get(':id/case-types/month/volume')
	async getCaseTypesVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getCaseTypesVolume(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_VOLUME,
				data: data
			});
		}
		catch (err) {
			console.log(err);

			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get(':id/insurance-payors')
	async getInsurancePayors(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getInsurancePayors(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITY_INSURANCE_PAYORS,
				data: data
			});
		}
		catch (err) {
			console.log(err);

			return res.status(500).json({
				success: false,
				message: err.message || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get(':id/trends/revenue')
	async getRevenueTrends(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getRevenueTrends(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITIES_TRENDS_REVENUE,
				data: data
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


	@Get(':id/trends/volume')
	async getVolumeTrends(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getVolumeTrends(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITIES_TRENDS_VOLUME,
				data: data
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

	@Get(':id/insurance-payors/:payor_id')
	async getOneInsuranceRevenueGraph(@Param() param: any, @Res() res: any, @Query() query: any) {
		try {
			const facilityId = param.id;

			const payorId = param.payor_id;

			// here filter is used to make a string for date filter.
			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getOneInsuranceRevenueGraph(facilityId, payorId, queryString)

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITY_INSURANCE_REVENUE_DATA,
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

