import { Controller, Get, Post, Param, Res, Query } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_FACILITIES, SUCCESS_FETCHED_FACILITY, SUCCESS_VOLUME_TREND, SUCCESS_FETCHED_FACILITIES_REVENUE_STATS, SUCCESS_FETCHED_FACILITIES_VOLUME_STATS, SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_VOLUME, SUCCESS_FETCHED_CASE_TYPES_REVENUE, SUCCESS_FETCHED_REVENUE_MONTH_WISE_TRENDS, SUCCESS_FETCHED_FACILITY_CASE_TYPE_VOLUME_AND_REVENUE } from 'src/constants/messageConstants';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';


@Controller({
  version: '2.0',
  path: 'facilities',
})
export class FacilitiesController {
  constructor(
    private readonly facilitiesService: FacilitiesService,
    private readonly facilitiesHelper: FacilitiesHelper
  ) { }


  @Get(':id')
  async getHospitalDetails(@Res() res: any, @Param() param: any) {
    try {

      const hospitalId = param.id;

      const hospitalDetails = await this.facilitiesService.getHospital(hospitalId);

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITY,
        data: hospitalDetails
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }


  @Get()
  async getAllFacilities(
    @Res() res: any,
    @Query() query: any
  ) {
    try {

      const fromDate = query.from_date;
      const toDate = query.to_date;

      // for volume facility wise
      const volumeData = this.facilitiesHelper.forVolumeFacilityWise(fromDate, toDate);


      // for revenue facility wise
      const revenueData = this.facilitiesHelper.forRevenueFacilityWise(fromDate, toDate);

      const combinedData = [];

      revenueData.forEach((revenueEntry) => {
        const volumeEntry = volumeData.find((v) => v.marketer_id === revenueEntry.marketer_id && v.hospital === revenueEntry.hospital);

        if (volumeEntry) {
          combinedData.push({
            marketer_id: revenueEntry.marketer_id,
            hospital: revenueEntry.hospital,
            paid_amount: revenueEntry.paid_amount,
            total_amount: revenueEntry.total_amount,
            pending_amount: revenueEntry.pending_amount,
            total_cases: volumeEntry.total_cases
          });
        }
      });


      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITIES,
        combinedData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }


  @Get(':id/trends/volume')
  async getVolumeTrend(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const hospitalId = param.id;
      const fromDate = query.from_date;
      const toDate = query.to_date;

      const volumeData = this.facilitiesHelper.getVolumeTrendData(hospitalId, fromDate, toDate);

      return res.status(200).json({
        success: true,
        message: SUCCESS_VOLUME_TREND,
        volumeData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }


  @Get(':id/stats-revenue')
  async getRevenuestatsData(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id;
      const from_date = new Date(query.from_date)
      const to_date = new Date(query.to_date)

      const { total_amount, paid_amount, pending_amount } = await this.facilitiesHelper.getFacilityRevenueStats(id, from_date, to_date)
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITIES_REVENUE_STATS,
        data: {
          billed: total_amount,
          collected: paid_amount,
          pending: pending_amount
        }
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
  async getVolumeStatsData(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id
      const from_date = new Date(query.from_date)
      const to_date = new Date(query.to_date)

      const { total_cases, completed_cases, pending_cases } = await this.facilitiesHelper.getFacilityVolumeStats(id, from_date, to_date)
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITIES_VOLUME_STATS,
        data: {
          total: total_cases,
          completed: completed_cases,
          pending: pending_cases
        }
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(':id/case-types/volume')
  async caseTypesVolumeMonthWise(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id;
      const from_date = new Date(query.from_date);
      const to_date = new Date(query.to_date);
      const data = await this.facilitiesHelper.facilityCaseTypesVolumeMonthWise(id, from_date, to_date);
      return res.status(200).json({
        success: true,
        message: SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_VOLUME,
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

  @Get(':id/case-types')
  async facilityCaseTypeWiseData(
    @Query() query: any,
    @Param() param: any,
    @Res() res: any
  ) {
    try {
      const { from_date, to_date } = query;
      const hospital_id = param.id;
      const volumeData = await this.facilitiesHelper.findOneVolumeBasedOnFacility(hospital_id, from_date, to_date);
      const revenueData = await this.facilitiesHelper.findOneRevenueBasedOnFacility(hospital_id, from_date, to_date);

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITY_CASE_TYPE_VOLUME_AND_REVENUE,
        data: {
          volume_data: {
            total_count: volumeData.total_count,
            case_type_wise_count: volumeData.case_type_wise_counts
          },
          revenue_data: {
            total_revenue: revenueData.total_revenue,
            case_type_wise_revenue: revenueData.case_type_wise_revenue
          }
        }
      })

    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(':id/case-types/revenue')
  async facilityCaseTypeWiseRevenueData(
    @Query() query: any,
    @Param() param: any,
    @Res() res: any
  ) {
    try {
      const { from_date, to_date } = query;
      const hospital_id = param.id
      const data = await this.facilitiesHelper.findOneRevenueBasedOnFacilityMonthWise(hospital_id, from_date, to_date)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_CASE_TYPES_REVENUE,
        data: data
      })

    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      })
    }

  }


  @Get(':id/trends/revenue')
  async getRevenueMonthWiseTrends(
    @Query() query: any,
    @Param() param: any,
    @Res() res: any
  ) {
    try {
      const { from_date, to_date } = query;
      const hospital_id = param.id;
      const data = await this.facilitiesHelper.findRevenueMonthWiseStats(hospital_id, from_date, to_date)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_REVENUE_MONTH_WISE_TRENDS,
        data: data
      })

    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      })
    }
  }
}
