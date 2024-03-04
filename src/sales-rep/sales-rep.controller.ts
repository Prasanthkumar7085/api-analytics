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

  @Get('stats-revenue/:id')
  async getRevenueStats(@Res() res:any, @Param('id') id:string) {
    try{
      const {total_amount,paid_amount,pending_amount} = await this.salesRepService.getRevenueSats(id)
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

  @Get('stats-volume/:id')
  async getVolumeStats(@Res() res:any, @Param('id') id:string) {
    try {
      const {total_cases,completed_cases,pending_cases} = await this.salesRepService.getVolumeStats(id)
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

  @Get('cases-types/volume/:id')
  async getCaseTypesVolumeMonthWise(@Res() res:any, @Param('id') id:string, @Query() query:string){
    try {
      const start = new Date(query['start'])
      const end = new Date(query['end'])
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
