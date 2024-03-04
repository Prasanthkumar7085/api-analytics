import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { SalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALES_REP_COUNT_AND_VOLUME, SUCCESS_FETCHED_CASE_TYPES_REVENUE } from 'src/constants/messageConstants';
import * as fs from 'fs';



@Controller({
  version: '1.0',
  path: 'sales-rep',
})
export class SalesRepController {
  constructor(private readonly salesRepService: SalesRepService) { }

  @Post()
  async getAllSalesRep(@Res() res: any) {
    try {
      const data = await this.salesRepService.findAll()

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP,
        data: data
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }


  @Post('case-types')
  async getOneSalesRep(
    @Body() salesRepDto: SalesRepDto,
    @Res() res: any,
  ) {
    try {
      const { marketer_id, from_date, to_date } = salesRepDto
      const { totalCounts, total } = await this.salesRepService.findOneVolume(marketer_id, from_date, to_date)
      const revenueData = await this.salesRepService.findOneRevenue(marketer_id, from_date, to_date)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP_COUNT_AND_VOLUME,
        data: {
          volume_data: { total, count: totalCounts },
          revenue_data: { total: revenueData.total_amount, case_wise_revenue: revenueData.totalCaseTypeAmount }
        }
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }




  @Post('case-types/revenue')
  async getOneSalesRepDuration(
    @Body() salesRepDto: SalesRepDto,
    @Res() res: any,
  ) {
    try {
      const { marketer_id, from_date, to_date } = salesRepDto

      const data = await this.salesRepService.getOneSalesRepDuration(marketer_id, new Date(from_date), new Date(to_date))

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_CASE_TYPES_REVENUE,
        data: data
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }
}
