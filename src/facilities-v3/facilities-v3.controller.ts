import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { FacilitiesV3Service } from './facilities-v3.service';
import { SOMETHING_WENT_WRONG, SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_REVENUE, SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_VOLUME, SUCCESS_FETCHED_FACILITIES, SUCCESS_FETCHED_FACILITIES_REVENUE_STATS, SUCCESS_FETCHED_FACILITIES_TRENDS_REVENUE, SUCCESS_FETCHED_FACILITIES_TRENDS_VOLUME, SUCCESS_FETCHED_FACILITIES_VOLUME_STATS, SUCCESS_FETCHED_FACILITY, SUCCESS_FETCHED_FACILITY_CASE_TYPE_VOLUME_AND_REVENUE, SUCCESS_FETCHED_FACILITY_INSURANCE_PAYORS } from 'src/constants/messageConstants';
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

			const queryString = await this.filterHelper.facilitiesDateFilter(query);

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
	async getFacilityDetails(@Res() res: any, @Param('id') id: any) {
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
	async getRevenuestats(@Res() res: any, @Param('id') id: any, @Query() query: any) {
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
	async getVolumeStats(@Res() res: any, @Param('id') id: any, @Query() query: any) {
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


	@Get(':id/case-types')
	async getOverAllCaseTypes(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {
			const queryString = await this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getOverAllCaseTypes(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITY_CASE_TYPE_VOLUME_AND_REVENUE,
				data: data
			});

		}
		catch (err) {
			console.log({ err });

			return res.status(500).json({
				success: false,
				message: err.message || SOMETHING_WENT_WRONG
			});
		}
	}


	@Get(':id/case-types/revenue')
	async getCaseTypesRevenue(@Res() res: any, @Param('id') id: any, @Query() query: any) {
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


	@Get(':id/case-types/volume')
	async getCaseTypesVolume(@Res() res: any, @Param('id') id: any, @Query() query: any) {
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
	async getInsurancePayers(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getInsurancePayers(id, queryString);

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
	async getRevenueTrends(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getTrendsRevenue(id, queryString);

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
	async getVolumeTrends(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesV3Service.getTrendsVolume(id, queryString);

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

}

