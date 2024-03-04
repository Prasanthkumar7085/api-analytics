import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REP, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS,SUCCESS_FETCHED_SALE_VOLUME_MONTH_WISE } from 'src/constants/messageConstants';

@Controller({
  version: '1.0',
  path: 'sales-rep',
})
export class SalesRepController {
  constructor(private readonly salesRepService: SalesRepService) { }

  @Post('')
  async getAllSalesRep(@Res() res: any) {
    try {

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post('stats-revenue')
  async getRevenueStats(@Res() res:any, @Body() salesrepDto:CreateSalesRepDto) {
    try{
      const id=salesrepDto.marketer_id
      const start_date = new Date(salesrepDto.from_date)
      const end_date = new Date(salesrepDto.to_date)

      const {total_amount,paid_amount,pending_amount} = await this.salesRepService.getRevenueSats(id, start_date, end_date)
      return res.status(200).json({
        success:true,
        marketer_id: id,
        message: SUCCESS_FECTED_SALE_REP_REVENUE_STATS,
        data : {
          generated : total_amount,
          collected : paid_amount,
          pending : pending_amount,
        }
      })
    } catch (err) {
      return res.status(500).json({
        success:false,
        message: err
      })
    }
  }

  @Post('stats-volume')
  async getVolumeStats(@Res() res:any, @Body() saleRepDto:CreateSalesRepDto) {
    try {
      const id = saleRepDto.marketer_id
      const start_date = new Date(saleRepDto.from_date)
      const end_date = new Date(saleRepDto.to_date)
      const {total_cases,completed_cases,pending_cases} = await this.salesRepService.getVolumeStats(id,start_date, end_date)
      return res.status(200).json({
        success:true,
        marketer_id: id,
        message: SUCCESS_FECTED_SALE_REP_VOLUME_STATS,
        data : {
          total : total_cases,
          completed:completed_cases,
          pending:pending_cases
        }
      })
    } catch (err) {
      return res.status(500).json({
        success:false,
        message: err
      })
    } 
  }

  @Post('cases-types/volume')
  async getCaseTypesVolumeMonthWise(@Res() res:any, @Body() salesRepDto: CreateSalesRepDto){
    try {
      const id=salesRepDto.marketer_id
      const start = new Date(salesRepDto.from_date)
      const end = new Date(salesRepDto.to_date)
      const data = await this.salesRepService.getCaseTypesVolumeMonthWise(id, start, end)

      return res.status(200).json({
        success:true,
        message:SUCCESS_FETCHED_SALE_VOLUME_MONTH_WISE,
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        success:false,
        message: err
      })
    }
  }
}
