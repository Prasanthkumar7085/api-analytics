import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { InsurancesV3Service } from './insurances-v3.service';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_ALL_INSURANCES_DATA, SUCCESS_FETCHED_INSURANCE_CASE_TYPES_DATA, SUCCESS_FETCHED_INSURANCE_PAYORS_DETAILS, SUCCESS_FETECHED_INSURANCE_TRENDS_VOLUME, SUCCESS_FTECHED_INSURANCE_TRENDS_REVENUE } from 'src/constants/messageConstants';


@Controller({
	version: '3.0',
	path: 'insurances',
})
export class InsurancesV3Controller {
	constructor(
		private readonly insurancesV3Service: InsurancesV3Service,
		private readonly filterHelper: FilterHelper
		) {}


	@Get()
	async getAllInsurancesData(@Res() res:any, @Query() query:any) {
		try {

			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.overviewFilter(query);

			const data = await this.insurancesV3Service.getAllInsurancesData(queryString);
			
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


	@Get(':id')
	async getOneInsurancePayorDetails(@Res() res:any, @Param('id') id:any){
		try {
			
			const data = await this.insurancesV3Service.getOneInsurancePayorDetails(id)
			
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


	@Get(':id/case-types')
	async getInsurancePayorCaseTypeWiseData(@Res() res:any, @Param('id') id:any, @Query() query:any) {
		try {

			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.overviewFilter(query);

			const data = await this.insurancesV3Service.getInsurancePayorCaseTypeWiseData(id,queryString);
			
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

	
	@Get(':id/trends/revenue')
	async getInsurancePayorRevenueTrends(@Res() res:any, @Param('id') id:any, @Query() query:any) {
		try {

			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.overviewFilter(query);

			const data = await this.insurancesV3Service.getInsurancePayorRevenueTrends(id,queryString);
			
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


	@Get(':id/trends/volume')
	async getInsurancePayorVolumeTrends(@Res() res:any, @Param('id') id:any, @Query() query:any) {
		try {
		
			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.overviewFilter(query);
			
			const data = await this.insurancesV3Service.getInsurancePayorVolumeTrends(id,queryString);
			
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
}
