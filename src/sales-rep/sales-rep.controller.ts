import { Controller, Get, Post, Body, Patch, Param, Delete, Res, NotFoundException, Query } from '@nestjs/common';
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

  @Get(':id/stats-revenue')
  async getStatsRevenue(@Res() res: any, @Param('id') id: any, @Query() query: any) {
    try {
      const data = await this.salesRepService.getStatsRevenue(id, query)

      return res.status(200).json({ success: true, message: 'Stats revenue Fetched Successfully', data: data })
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ success: false, message: error.message })

      }
      return res.status(500).json({ success: false, error: error.message })
    }
  }




  @Get(':id/insurance-payors')
  async getInsurancePayers(
    @Res() res: any, @Param('id') id: number, @Query() query: any
  ) {
    try {

      const data = await this.salesRepService.getInsurancePayers(id, query)

      return res.status(200).json({ success: true, message: 'Insurance payers data Fetched Successfully', data: data })

    }
    catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ success: false, message: error.message })

      }
      return res.status(500).json({ success: false, error: error.message })
    }
  }



  @Get('case-types/:id')
  async getCaseTypes(@Res() res: any, @Param() param: any) {
    try {
      const salesRespId = param.id
      const data = await this.salesRepService.getCaseTypes(salesRespId)
      return res.status(200).json({
        sucess: true,
        data: data
      })
    }
    catch (err) {
      return res.status(500).json({
        success: true,
        message: err
      })
    }
  }

  @Get(':id/trends/revenue')
  async getTrendsRevenue(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id
      const queryString = this.filterHelper.salesRep(query);
      const data = await this.salesRepService.getTrendsRevenue(id, queryString)
      return res.status(200).json({
        sucess: true,
        message: 'Sales Reps Trends Revenue Fetched Successfully',
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        success: true,
        message: err
      })
    }
  }

  @Get(':id/trends/volume')
  async getTrendsVolume(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id
      const queryString = this.filterHelper.salesRep(query);
      const data = await this.salesRepService.getTrendsVolume(id, queryString)
      return res.status(200).json({
        sucess: true,
        message: 'Sales Reps Trends Volume Fetched Successfully',
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        success: true,
        message: err
      })
    }
  }

  @Get(':id/stats-volume')
  async getStatsVolume(@Res() res:any, @Param() param:any, @Query() query:any){
    try {
      const id = param.id
      const queryString = this.filterHelper.salesRep(query);
      const data = await this.salesRepService.getStatsVolume(id,queryString)
      return res.status(200).json({
        sucess: true,
        message: 'Sales Reps Stats Volume Fetched Successfully',
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        success: true,
        message: err
      })
    }
  }

}
