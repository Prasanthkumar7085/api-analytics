import { Controller, Get, Param, Res, Query, UseGuards } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { SOMETHING_WENT_WRONG, SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_REVENUE, SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_VOLUME, SUCCESS_FETCHED_FACILITIES, SUCCESS_FETCHED_FACILITIES_REVENUE_STATS, SUCCESS_FETCHED_FACILITIES_TRENDS_REVENUE, SUCCESS_FETCHED_FACILITIES_TRENDS_VOLUME, SUCCESS_FETCHED_FACILITIES_VOLUME_STATS, SUCCESS_FETCHED_FACILITY, SUCCESS_FETCHED_FACILITY_CASE_TYPES_OVERALL_REVENUE, SUCCESS_FETCHED_FACILITY_CASE_TYPES_OVERALL_VOLUME, SUCCESS_FETCHED_FACILITY_INSURANCE_PAYORS, SUCCESS_FETCHED_FACILITY_INSURANCE_PAYORS_REVENUE, SUCCESS_FETCHED_FACILITY_INSURANCE_PAYORS_VOLUME, SUCCESS_FETCHED_FACILITY_INSURANCE_REVENUE_DATA } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { AuthGuard } from 'src/guards/auth.guard';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { SortHelper } from 'src/helpers/sortHelper';

@Controller({
	version: '1.0',
	path: 'facilities'
})
export class FacilitiesController {
	constructor(
		private readonly facilitiesService: FacilitiesService,
		private readonly filterHelper: FilterHelper,
		private readonly syncHelper: SyncHelpers,
		private readonly sortHelper: SortHelper
	) { }

	@UseGuards(AuthGuard)
	@Get()
	async getAllFacilities(@Res() res: any, @Query() query: any) {
		try {

			const queryString = await this.filterHelper.facilitiesFilter(query);	// date filter on service data in patient_claims table

			let data = await this.facilitiesService.getAllFacilities(queryString);

			if (data.length) {

				data.forEach(e => {
					if (!this.facilityExists(data, e.facility_id)) {
						data.push({
							facility_id: e.facility_id,
							facility_name: e.facility_name,
							sales_rep_id: e.sales_rep_id,
							sales_rep_name: e.sales_rep_name,
							generated_amount: 0,
							paid_amount: 0,
							pending_amount: 0,
							total_cases: 0
						});
					}
				});

				data = this.sortHelper.sort(data, "facility_name");
			}

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


	@UseGuards(AuthGuard)
	@Get(':id')
	async getFacilityDetails(@Res() res: any, @Param('id') id: number) {
		try {

			const data = await this.facilitiesService.getFacilityDetails(id);

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

	@UseGuards(AuthGuard)
	@Get(':id/stats-revenue')
	async getRevenueStats(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = await this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getRevenueStats(id, queryString);

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

	@UseGuards(AuthGuard)
	@Get(':id/stats-volume')
	async getVolumeStats(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {
			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getVolumeStats(id, queryString);

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

	@UseGuards(AuthGuard)
	@Get(':id/case-types-revenue')
	async getOverAllCaseTypesRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

			const salesReps = await this.facilitiesService.getOverAllCaseTypesRevenue(id, queryString);

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

	@UseGuards(AuthGuard)
	@Get(':id/case-types-volume')
	async getOverAllCaseTypesVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.salesRep(query);

			const salesReps = await this.facilitiesService.getOverAllCaseTypesVolume(id, queryString);

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

	@UseGuards(AuthGuard)
	@Get(':id/case-types/months/revenue')
	async getCaseTypesRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getCaseTypesRevenue(id, queryString);

			const reultsArray = this.syncHelper.modifySalesRepRevenuCaseTypeWise(data);

			return res.status(200).json({
				success: true,
				message: SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_REVENUE,
				data: reultsArray
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

	@UseGuards(AuthGuard)
	@Get(':id/case-types/months/volume')
	async getCaseTypesVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getCaseTypesVolume(id, queryString);

			const resultsArray = this.syncHelper.modifySalesRepVolumeCaseTypeWise(data);

			return res.status(200).json({
				success: true,
				message: SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_VOLUME,
				data: resultsArray
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


	@UseGuards(AuthGuard)
	@Get(':id/insurance-payors/revenue')
	async getInsurancePayersRevenue(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getInsurancePayersRevenue(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITY_INSURANCE_PAYORS_REVENUE,
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

	@UseGuards(AuthGuard)
	@Get(':id/insurance-payors/volume')
	async getInsurancePayersVolume(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getInsurancePayersVolume(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_FACILITY_INSURANCE_PAYORS_VOLUME,
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


	@UseGuards(AuthGuard)
	@Get(':id/insurance-payors/:payor_id')
	async getOneInsuranceRevenueMonthWiseData(@Param() param: any, @Res() res: any, @Query() query: any) {
		try {

			const facilityId = param.id;

			const payorId = param.payor_id;

			// here filter is used to make a string for date filter.
			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getOneInsuranceRevenueMonthWiseData(facilityId, payorId, queryString);

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

	@UseGuards(AuthGuard)
	@Get(':id/trends/revenue')
	async getRevenueTrends(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getRevenueTrends(id, queryString);

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

	@UseGuards(AuthGuard)
	@Get(':id/trends/volume')
	async getVolumeTrends(@Res() res: any, @Param('id') id: number, @Query() query: any) {
		try {

			const queryString = this.filterHelper.facilitiesDateFilter(query);

			const data = await this.facilitiesService.getVolumeTrends(id, queryString);

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

	facilityExists(finalResp, id) {
		return finalResp.some(rep => rep.facility_id === id);
	}
}

