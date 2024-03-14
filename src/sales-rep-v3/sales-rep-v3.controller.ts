import { Controller, Get, Param, Delete, Res, Query } from '@nestjs/common';
import { SOMETHING_WENT_WRONG, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS, SUCCESS_FETCHED_CASE_TYPES_REVENUE, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME, SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS, SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA, SUCCESS_FETCHED_SALES_REP_TREND_REVENUE, SUCCESS_FETCHED_SALES_REP_TREND_VOLUME, SUCCESS_FETCHED_SALES_REP_VOLUME_AND_REVENUE } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepServiceV3 } from './sales-rep-v3.service';

@Controller({
  version: '3.0',
  path: 'sales-reps',
})

export class SalesRepControllerV3 {
  constructor(
    private readonly salesRepService: SalesRepServiceV3,
    private readonly filterHelper: FilterHelper
  ) { }

  @Delete('delete')
  async dropTable() {
    const data = await this.salesRepService.dropTable();
    return data
  }

  @Get('patient-claims')
  async getPatientClaims(@Query() query: any) {
    const queryString = this.filterHelper.salesRep(query);

    const data = await this.salesRepService.getPatientClaims(queryString);

    return data
  }

  @Get()
  async getAll(@Res() res: any, @Query() query: any) {
    try {

      const queryString = this.filterHelper.salesRep(query);

      const salesReps = await this.salesRepService.getAll(queryString);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP,
        data: salesReps
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
        message: SUCCESS_FETCHED_SALES_REP_VOLUME_AND_REVENUE,
        data: salesReps
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
  async getCaseTypesRevenue(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id;
      const queryString = this.filterHelper.salesRep(query);

      const salesReps = await this.salesRepService.getCaseTypesRevenue(id, queryString);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_CASE_TYPES_REVENUE,
        data: salesReps
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
  async getCaseTypesVolume(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id;
      const queryString = this.filterHelper.salesRep(query);

      const salesReps = await this.salesRepService.getCaseTypesVolume(id, queryString);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP_CASE_TYPE_MONTHLY_VOLUME,
        data: salesReps
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
  async getFacilityWise(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id;
      const queryString = this.filterHelper.salesRep(query);

      const salesReps = await this.salesRepService.getFacilityWise(id, queryString);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP_FACILITY_WISE_STATS,
        data: salesReps
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

      const queryString = await this.filterHelper.salesRep(query);

      const data = await this.salesRepService.getStatsRevenue(id, queryString)

      return res.status(200).json({ success: true, message: SUCCESS_FECTED_SALE_REP_REVENUE_STATS, data: data })
    }
    catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: SOMETHING_WENT_WRONG })
    }
  }




  @Get(':id/insurance-payors')
  async getInsurancePayers(
    @Res() res: any, @Param('id') id: number, @Query() query: any
  ) {
    try {

      const queryString = this.filterHelper.salesRep(query);
      const data = await this.salesRepService.getInsurancePayers(id, queryString)

      return res.status(200).json({ success: true, message: SUCCESS_FETCHED_SALES_REP_INSURANCE_PAYORS_DATA, data: data })

    }
    catch (error) {
      console.log({ error });

      return res.status(500).json({ success: false, message: SOMETHING_WENT_WRONG })
    }
  }


  @Get(':id/trends/revenue')
  async getTrendsRevenue(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id
      const queryString = this.filterHelper.salesRep(query);
      const data = await this.salesRepService.getTrendsRevenue(id, queryString)
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP_TREND_REVENUE,
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
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
        message: SUCCESS_FETCHED_SALES_REP_TREND_VOLUME,
        data: data
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(':id/stats-volume')
  async getStatsVolume(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id
      const queryString = this.filterHelper.salesRep(query);
      const data = await this.salesRepService.getStatsVolume(id, queryString)
      return res.status(200).json({
        sucess: true,
        message: SUCCESS_FECTED_SALE_REP_VOLUME_STATS,
        data: data
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      })
    }
  }

}
