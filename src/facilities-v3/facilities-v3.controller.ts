import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { FacilitiesV3Service } from './facilities-v3.service';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_FACILITIES_REVENUE_STATS, SUCCESS_FETCHED_FACILITIES_VOLUME_STATS, SUCCESS_FETCHED_FACILITY } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';

@Controller({
  version: '3.0',
  path: 'facilities'
})
export class FacilitiesV3Controller {
  constructor(
    private readonly facilitiesV3Service: FacilitiesV3Service,
    private readonly filterHelper: FilterHelper
  ) { }



  @Get(':id/stats-revenue')
  async getRevenuestatsData(@Res() res: any, @Param('id') id: any, @Query() query: any) {
    try {
      const queryString = await this.filterHelper.facilitiesDateFilter(query);

      const data = await this.facilitiesV3Service.getStatsRevenue(id, queryString)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITIES_REVENUE_STATS,
        data: data
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }



  @Get(':id/stats-volume')
  async getStatsVolume(@Res() res: any, @Param('id') id: any, @Query() query: any) {
    try {
      const queryString = this.filterHelper.facilitiesDateFilter(query)

      const data = await this.facilitiesV3Service.getStatsVolume(id, queryString)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITIES_VOLUME_STATS,
        data: data
      })
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      })
    }
  }



  @Get(':id/trends/revenue')
  async getTrendsRevenue(@Res() res: any, @Param('id') id: any, @Query() query: any) {
    try {
      const queryString = this.filterHelper.facilitiesDateFilter(query);
      const data = await this.facilitiesV3Service.getTrendsRevenue(id, queryString)

      return res.status(200).json({
        success: true,
        message: 'Facility Trends Revenue Fetched Successfully',
        data: data
      })
    } catch (err) {
      console.log({ err })
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }



  @Get(':id/trends/volume')
  async getTrendsVolume(@Res() res: any, @Param('id') id: any, @Query() query: any) {

    try {

      const queryString = this.filterHelper.facilitiesDateFilter(query);

      const data = await this.facilitiesV3Service.getTrendsVolume(id, queryString);

      return res.status(200).json({
        success: true,
        message: 'Facility Trends Volume Fetched Successfully',
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }


  @Get(':id/case-types/volume')
  async getCaseTypesVolume(@Res() res: any, @Param('id') id: any, @Query() query: any) {

    try {

      const queryString = this.filterHelper.facilitiesDateFilter(query);

      const data = await this.facilitiesV3Service.getCaseTypesVolume(id, queryString);

      return res.status(200).json({
        success: true,
        message: 'Facility Case Types Volume Fetched Successfully',
        data: data
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }



  @Get(':id/case-types/revenue')
  async getCaseTypesRevenue(@Res() res: any, @Param('id') id: any, @Query() query: any) {

    try {

      const queryString = this.filterHelper.facilitiesDateFilter(query);

      const data = await this.facilitiesV3Service.getCaseTypesRevenue(id, queryString);

      return res.status(200).json({
        success: true,
        message: 'Facility Case Types Revenue Fetched Successfully',
        data: data
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }




  @Get(':id/insurance-payors')
  async getInsurancePayers(@Res() res: any, @Param('id') id: any, @Query() query: any) {

    try {

      const queryString = this.filterHelper.facilitiesDateFilter(query);

      const data = await this.facilitiesV3Service.getInsurancePayers(id, queryString);

      return res.status(200).json({
        success: true,
        message: 'Facility Insurance Payors data Fetched Successfully',
        data: data
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }



  @Get(':id/case-types')
  async getOverAllCaseTypes(@Res() res: any, @Param('id') id: any, @Query() query: any) {

    try {
      const queryString = await this.filterHelper.facilitiesDateFilter(query)

      const data = await this.facilitiesV3Service.getOverAllCaseTypes(id, queryString)

      return res.status(200).json({
        success: true,
        message: "Facilities Case Types Fetched Successfully",
        data: data
      });

    }
    catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    }
  }




  @Get(':id')
  async GetFacilityDetails(@Res() res: any, @Param('id') id: any, @Query() query: any) {
    try {

      const data = await this.facilitiesV3Service.getFacilityDetails(id)

      return res.status(200).json({
        success: true,
        message: "Facilities Details Fetched Successfully",
        data
      });

    }
    catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: SOMETHING_WENT_WRONG
      });
    }
  }

}
