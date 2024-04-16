import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_ALL_INSURANCES_DATA, SUCCESS_FETCHED_INSURANCE_CASE_TYPES_DATA, SUCCESS_FETCHED_INSURANCE_PAYORS_DETAILS, SUCCESS_FETECHED_INSURANCE_TRENDS_VOLUME, SUCCESS_FTECHED_INSURANCE_TRENDS_REVENUE } from 'src/constants/messageConstants';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterHelper } from 'src/helpers/filterHelper';
import { InsurancesService } from './insurances.service';
import { SortHelper } from 'src/helpers/sortHelper';


@Controller({
	version: '1.0',
	path: 'insurances',
})
export class InsurancesController {
	constructor(
		private readonly insurancesService: InsurancesService,
		private readonly filterHelper: FilterHelper,
		private readonly sortHelper: SortHelper
	) { }

	@UseGuards(AuthGuard)
	@Get()
	async getAllInsurancesData(@Res() res: any, @Query() query: any) {
		try {

			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.overviewFilter(query);

			let data = await this.insurancesService.getAllInsurancesData(queryString);

			const insurances = await this.insurancesService.getAllInsurances();

			insurances.forEach(insurance => {
				if (!this.insuranceExists(data, insurance.id)) {
					data.push({
						insurance_payor_id: insurance.id,
						insurance_payor_name: insurance.name,
						no_of_facilities: 0,
						total_cases: 0,
						generated_amount: 0,
						paid_amount: 0,
						pending_amount: 0
					});
				}
			});

			data = this.sortHelper.sort(data, "insurance_payor_name");

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_ALL_INSURANCES_DATA,
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
	async getOneInsurancePayorDetails(@Res() res: any, @Param('id') id: any) {
		try {

			const data = await this.insurancesService.getOneInsurancePayorDetails(id);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_INSURANCE_PAYORS_DETAILS,
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
	@Get(':id/case-types')
	async getInsurancePayorCaseTypeWiseData(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.overviewFilter(query);

			const data = await this.insurancesService.getInsurancePayorCaseTypeWiseData(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_INSURANCE_CASE_TYPES_DATA,
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
	async getInsurancePayorRevenueTrends(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.overviewFilter(query);

			const data = await this.insurancesService.getInsurancePayorRevenueTrends(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FTECHED_INSURANCE_TRENDS_REVENUE,
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
	async getInsurancePayorVolumeTrends(@Res() res: any, @Param('id') id: any, @Query() query: any) {
		try {

			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.overviewFilter(query);

			const data = await this.insurancesService.getInsurancePayorVolumeTrends(id, queryString);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETECHED_INSURANCE_TRENDS_VOLUME,
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


	insuranceExists(finalResp, id) {
		return finalResp.some(rep => rep.insurance_payor_id === id);
	}
}
