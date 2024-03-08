import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';

@Controller({
  version: '3.0',
  path: 'sales-reps',
})

export class SalesRepController {
  constructor(
    private readonly salesRepService: SalesRepService,
    private readonly filterHelper: FilterHelper
  ) { }

  @Get()
  async getAll(@Res() res: any, @Query() query: any) {
    try {

      const queryString = this.filterHelper.salesRep(query);

      const salesReps = await this.salesRepService.getAll(queryString);
      return res.status(200).json({
        success: true,
        message: "Sales Reps Stats Fetched Successfully",
        salesReps
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }


  @Get(':id/case-types')
  async getOverallCaseTypes(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id;
      const queryString = this.filterHelper.salesRep(query);
      const salesReps = await this.salesRepService.getOverAllCaseTypes(id, queryString);
      return res.status(200).json({
        success: true,
        message: "Sales Reps Stats Fetched Successfully",
        salesReps
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(':id/case-types/revenue')
  async getCaseTypesRevenue(@Res() res: any, @Param() param: any) {
    try {
      const id = param.id;
      const salesReps = await this.salesRepService.getCaseTypesRevenue(id);
      return res.status(200).json({
        success: true,
        message: "Sales Reps Stats Fetched Successfully",
        salesReps
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }


  @Get(':id/case-types/volume')
  async getCaseTypesVolume(@Res() res: any, @Param() param: any) {
    try {
      const id = param.id;
      const salesReps = await this.salesRepService.getCaseTypesVolume(id);
      return res.status(200).json({
        success: true,
        message: "Sales Reps Stats Fetched Successfully",
        salesReps
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }


  @Get(':id/facilities')
  async getFacilityWise(@Res() res: any, @Param() param: any) {
    try {
      const id = param.id;
      const salesReps = await this.salesRepService.getFacilityWise(id);
      return res.status(200).json({
        success: true,
        message: "Sales Reps Stats Fetched Successfully",
        salesReps
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
