import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REP } from 'src/constants/messageConstants';
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


  @Post('case-types/:id')
  async getOneSalesRep(
    @Param('id') id: any, @Res() res: any,
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
  ) {
    try {

      const { totalCounts, total } = await this.salesRepService.findOneVolume(id, start_date, end_date)
      const revenueData = await this.salesRepService.findOneRevenue(id, start_date, end_date)

      return res.status(200).json({
        success: true,
        message: 'case types wise count',
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




  @Post('case-types/revenue/:id')
  async getOneSalesRepDuration(
    @Param('id') id: string,
    @Query('start_date') start_date: any, //lets assume its jan 1st 2023
    @Query('end_date') end_date: any, //lets assume its dec 31st 2023
    @Res() res: any) {
    try {

      const data = await this.salesRepService.getOneSalesRepDuration(id, new Date(start_date), new Date(end_date))

      return res.status(200).json({
        success: true,
        message: 'Successfully fetched data',
        data: data
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      })
    }
  }


}
