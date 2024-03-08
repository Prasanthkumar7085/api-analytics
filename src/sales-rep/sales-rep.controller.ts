import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';


@Controller({
  version:'3.0',
  path:'sales-reps'
})
export class SalesRepController {
  constructor(private readonly salesRepService: SalesRepService) {}


  @Get('case-types/:id')
  async getCaseTypes(@Res() res:any, @Param() param:any){
    try {
      const salesRespId = param.id
      const data = await this.salesRepService.getCaseTypes(salesRespId)
      return res.status(200).json({
        sucess:true,
        data:data
      })
    }
    catch (err) {
      return res.status(500).json({
        success:true,
        message:err
      })
    }
  }

  @Get(':id/trends/revenue')
  async getTrendsRevenue(@Res() res:any, @Param() param:any, @Query() query:any){
    try {
      const id = param.id
      const fromDate = query.from_date
      const toDate = query.to_date
      const data = await this.salesRepService.getTrendsRevenue(id,fromDate,toDate)
      return res.status(200).json({
        sucess:true,
        data:data
      })
    } catch (err) {
      return res.status(500).json({
        success:true,
        message:err
      })
    }
  }


  @Get(':id/trends/volume')
  async getTrendsVolume(@Res() res:any, @Param() param:any, @Query() query:any){
    try {
      const id = param.id
      const fromDate = query.from_date
      const toDate = query.to_date
      const data = await this.salesRepService.getTrendsVolume(id,fromDate,toDate)
      return res.status(200).json({
        sucess:true,
        data:data
      })
    } catch (err) {
      return res.status(500).json({
        success:true,
        message:err
      })
    }
  }
}
