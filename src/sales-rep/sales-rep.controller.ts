import { Controller, Get, Post, Body, Param, Res, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { SINGLE_REP_FACILITY_WISE, SOMETHING_WENT_WRONG, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS, SUCCESS_FETCHED_CASE_TYPES_REVENUE, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALES_REP_VOLUME_AND_REVENU, SUCCESS_FETCHED_SALE_VOLUME_MONTH_WISE, SUCCESS_FETCHED_TREND_REVENUE, SUCCESS_MARKETER, SUCCESS_FETCHED_SALE_TREND_VOLUME } from 'src/constants/messageConstants';
import * as fs from 'fs';
import { FacilityWiseDto } from './dto/facility-wise.dto';
import { SalesRepDto } from './dto/sales-rep.dto';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';

@Controller({
  version: '2.0',
  path: 'sales-reps',
})
export class SalesRepController {
  constructor(
    private readonly salesRepService: SalesRepService,
    private readonly salesRepHelper: SalesRepHelper
  ) { }


  @Get(':id')
  async getMarketer(@Res() res: any, @Param() param: any) {
    try {
      const marketerid = param.id;

      const marketerDetails = await this.salesRepService.getMarketer(marketerid);
      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETER,
        data: marketerDetails
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }



  @Post()
  async getAllSalesRep(@Res() res: any, @Body() body: SalesRepDto) {
    try {
      const fromDate = body.from_date;
      const toDate = body.to_date;



      // from Volume
      const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");

      let finalVoumeResp = JSON.parse(volumeResponse);


      if (fromDate && toDate) {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        // Filter the array based on the date range
        finalVoumeResp = finalVoumeResp.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= fromDateObj && itemDate <= toDateObj;
        });
      }

      const groupedVolumeData = finalVoumeResp.reduce((acc, item) => {
        const { marketer_id, total_cases, hospital_case_type_wise_counts } = item;

        if (!acc[marketer_id]) {
          acc[marketer_id] = {
            marketer_id,
            total_cases: 0,
            hospitals_count: 0
          };
        }

        let uniqueHospitals = new Set();

        const uniqueHospitalIds = new Set(
          hospital_case_type_wise_counts.map((hospital) => hospital.hospital)
        );

        uniqueHospitalIds.forEach((hospitalId) => {
          uniqueHospitals.add(hospitalId);
        });

        acc[marketer_id].hospitals_count += uniqueHospitalIds.size;
        acc[marketer_id].total_cases += total_cases;

        return acc;
      }, {});

      const volumeResult: any = Object.values(groupedVolumeData);


      // from revenue
      const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");

      let finalRevenueResp = JSON.parse(revenueResponse);

      if (fromDate && toDate) {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        // Filter the array based on the date range
        finalRevenueResp = finalRevenueResp.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= fromDateObj && itemDate <= toDateObj;
        });
      }

      const groupedRevenueData = finalRevenueResp.reduce((acc, item) => {
        const { marketer_id, total_amount, pending_amount, paid_amount } = item;

        if (!acc[marketer_id]) {
          acc[marketer_id] = {
            marketer_id,
            total_amount: 0,
            pending_amount: 0,
            paid_amount: 0,
            targeted_amount: 5000,
            target_reached: false,
          };
        }

        acc[marketer_id].total_amount += total_amount;
        acc[marketer_id].pending_amount += pending_amount;
        acc[marketer_id].paid_amount += paid_amount;

        if (acc[marketer_id].paid_amount >= acc[marketer_id].targeted_amount) {
          acc[marketer_id].target_reached = true;
        }

        return acc;
      }, {});

      const revenueResult: any = Object.values(groupedRevenueData);


      // combine both results
      const combinedData = revenueResult.map((revneuItem) => {
        const volumeItem = volumeResult.find((volumeItem) => volumeItem.marketer_id === revneuItem.marketer_id);

        return {
          ...revneuItem,
          ...(volumeItem && { total_cases: volumeItem.total_cases, total_hospitals: volumeItem.hospitals_count })
        };
      });

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP,
        data: combinedData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post(':id/facilities')
  async getFacilityWiseForSingleRep(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {

      const marketerId = param.id;
      const fromDate = query.from_date;
      const toDate = query.to_date;

      // from volume
      const volumeData = this.salesRepHelper.getsingleRepVolumeFacilityWise(marketerId, fromDate, toDate);


      const revenueData = this.salesRepHelper.getsingleRepRevenueFacilityWise(marketerId, fromDate, toDate);

      const combinedArray = revenueData.map(revenueEntry => {
        const matchingVolumeEntry = volumeData.find(volumeEntry => volumeEntry.hospital === revenueEntry.hospital);

        if (matchingVolumeEntry) {
          return {
            hospital: revenueEntry.hospital,
            paid_amount: revenueEntry.paid_amount,
            total_amount: revenueEntry.total_amount,
            pending_amount: revenueEntry.pending_amount,
            total_cases: matchingVolumeEntry.total_cases
          };
        } else {
          return revenueEntry;
        }
      });

      return res.status(200).json({
        success: true,
        message: SINGLE_REP_FACILITY_WISE,
        combinedArray
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post(':id/stats-revenue')
  async getRevenueStats(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {
      const id = param.id
      const start_date = new Date(query.from_date)
      const end_date = new Date(query.to_date)

      const { total_amount, paid_amount, pending_amount } = await this.salesRepHelper.getRevenueStatsData(id, start_date, end_date)
      return res.status(200).json({
        success: true,
        marketer_id: id,
        message: SUCCESS_FECTED_SALE_REP_REVENUE_STATS,
        data: {
          generated: total_amount,
          collected: paid_amount,
          pending: pending_amount,
        }
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }


  @Post(':id/case-types')
  async getOneSalesRep(
    @Query() query: any,
    @Param() param: any,
    @Res() res: any,
  ) {
    try {
      const marketer_id = param.id;
      const { from_date, to_date } = query;
      const { totalCounts, total } = await this.salesRepHelper.findOneVolume(marketer_id, from_date, to_date)
      const revenueData = await this.salesRepHelper.findOneRevenue(marketer_id, from_date, to_date)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP_VOLUME_AND_REVENU,
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

  @Post(':id/stats-volume')
  async getVolumeStats(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {
      const id = param.id
      const start_date = new Date(query.from_date)
      const end_date = new Date(query.to_date)
      const { total_cases, completed_cases, pending_cases } = await this.salesRepHelper.getVolumeStatsData(id, start_date, end_date)
      return res.status(200).json({
        success: true,
        marketer_id: id,
        message: SUCCESS_FECTED_SALE_REP_VOLUME_STATS,
        data: {
          total: total_cases,
          completed: completed_cases,
          pending: pending_cases
        }
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }

  @Post(':id/case-types/volume')
  async getCaseTypesVolumeMonthWise(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {
      const id = param.id
      const start = new Date(query.from_date)
      const end = new Date(query.to_date)
      const data = await this.salesRepHelper.caseTypesVolumeMonthWise(id, start, end)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALE_VOLUME_MONTH_WISE,
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }

  @Post(':id/case-types/revenue')
  async getOneSalesRepDuration(
    @Query() query: any,
    @Param() param: any,
    @Res() res: any,
  ) {
    try {
      const marketer_id = param.id;
      const { from_date, to_date } = query;

      const data = await this.salesRepHelper.getCaseTypeRevenueMonthWise(marketer_id, new Date(from_date), new Date(to_date))

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_CASE_TYPES_REVENUE,
        data: data
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post(':id/trends/revenue')
  async getOneSalesRepDurationTrend(
    @Query() query: any,
    @Param() param: any,
    @Res() res: any,
  ) {
    try {
      const marketer_id = param.id;
      const { from_date, to_date } = query;

      const data = await this.salesRepHelper.getOneSalesRepDurationTrend(marketer_id, new Date(from_date), new Date(to_date))
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_TREND_REVENUE,
        data: data
      })
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }


  @Post(':id/trends/volume')
  async getTrendVolume(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {
      const id = param.id
      const start_date = new Date(query.from_date)
      const end_date = new Date(query.to_date)

      const data = await this.salesRepHelper.getSalesTrendsVolumeData(id, start_date, end_date)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALE_TREND_VOLUME,
        data: data
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }
}
