import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { InsurancesV3Service } from './insurances-v3.service';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_ALL_INSURANCES_DATA, SUCCESS_FETCHED_INSURANCE_CASE_TYPES_DATA, SUCCESS_FETECHED_INSURANCE_TRENDS_VOLUME, SUCCESS_FTECHED_INSURANCE_TRENDS_REVENUE } from 'src/constants/messageConstants';


@Controller({
  version: '3.0',
  path: 'insurances',
})
export class InsurancesV3Controller {
  constructor(private readonly insurancesV3Service: InsurancesV3Service,
    private readonly filterHelper: FilterHelper
    ) {}


  @Get()
  async getAllInsurances(@Res() res:any, @Query() query:any) {
    try {
      const queryString = await this.filterHelper.overviewFilter(query);

      const data = await this.insurancesV3Service.getAllInsurances(queryString);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_ALL_INSURANCES_DATA,
        data        
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      });
    }
  }

  @Get(':id/case-types')
  async getOneInsurancePayorData(@Res() res:any, @Param('id') id:any, @Query() query:any) {
    try {
      const queryString = await this.filterHelper.overviewFilter(query);

      const data = await this.insurancesV3Service.getOneInsurancePayorData(id,queryString);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_INSURANCE_CASE_TYPES_DATA,
        data        
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      });
    }
  }

  
  @Get(':id/trends/revenue')
  async getOneInsurancePayorTrendsRevenue(@Res() res:any, @Param('id') id:any, @Query() query:any) {
    try {
      const queryString = await this.filterHelper.overviewFilter(query);

      const data = await this.insurancesV3Service.getOneInsurancePayorTrendsRevenue(id,queryString);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FTECHED_INSURANCE_TRENDS_REVENUE,
        data        
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      });
    }
  }

  @Get(':id/trends/volume')
  async getOneInsurancePayorTrendsVolume(@Res() res:any, @Param('id') id:any, @Query() query:any) {
    try {
      const queryString = await this.filterHelper.overviewFilter(query);
      
      const data = await this.insurancesV3Service.getOneInsurancePayorTrendsVolume(id,queryString);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETECHED_INSURANCE_TRENDS_VOLUME,
        data        
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      });
    }
  }
}
