import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { OverviewV3Service } from './overview-v3.service';
import { SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';


@Controller({
  version: '3.0',
  path: 'overview',
})
export class OverviewV3Controller {
  constructor(private readonly overviewV3Service: OverviewV3Service,
    private readonly filterHelper: FilterHelper
    ) {}

  @Get('stats-revenue')
  async getStatsRevenue(@Res() res:any, @Query() query:any){
    try {
      const queryString = await this.filterHelper.overviewFilter(query)
      const data = await this.overviewV3Service.getStatsrevenue(queryString)
      return res.status(200).json({
        success: true,
        message: "Overview Stats Revenue Fetched Successfully",
        data        
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }

  @Get('stats-volume')
  async getStatsVOlume(@Res() res:any, @Query() query:any) {
    try {
      const queryString = await this.filterHelper.overviewFilter(query)
      const data = await this.overviewV3Service.getStatsVolume(queryString)
      return res.status(200).json({
        success: true,
        message: "Overview Stats volume Fetched Successfully",
        data        
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }


  @Get('case-types')
  async getOverallCaseTypes(@Res() res:any, @Query() query:any) {
    try {
      const queryString = await this.filterHelper.overviewFilter(query)
      const data = await this.overviewV3Service.getOverallCaseTypes(queryString)
      return res.status(200).json({
        success: true,
        message: "Overview Case Types Fetched Successfully",
        data        
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }


  @Get('revenue')
  async getRevenue(@Res() res:any, @Query() query:any){
    try {
      const queryString = await this.filterHelper.overviewFilter(query)
      const data = await this.overviewV3Service.getRevenue(queryString)
      return res.status(200).json({
        success: true,
        message: "Overview Revenue Fetched Successfully",
        data        
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }
}
