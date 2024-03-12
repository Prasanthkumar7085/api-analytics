import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { InsurancesV3Service } from './insurances-v3.service';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';


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
        message: "Insurance Data Fetched Successfully",
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
