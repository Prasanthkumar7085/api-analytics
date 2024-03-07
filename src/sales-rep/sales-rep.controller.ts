import { Controller, Get, Body, Param, Res, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { SINGLE_REP_FACILITY_WISE, SOMETHING_WENT_WRONG, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS, SUCCESS_FETCHED_CASE_TYPES_REVENUE, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALES_REP_VOLUME_AND_REVENU, SUCCESS_FETCHED_SALE_VOLUME_MONTH_WISE, SUCCESS_FETCHED_TREND_REVENUE, SUCCESS_MARKETER, SUCCESS_FETCHED_SALE_TREND_VOLUME, SUCCESS_FETCHED_INSURANCE_STATS } from 'src/constants/messageConstants';
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



  @Get()
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

  @Get(':id/facilities')
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

  @Get(':id/stats-revenue')
  async getRevenueStats(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {
      const id = param.id
      const start_date = query.from_date
      const end_date = query.to_date

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


  @Get(':id/case-types')
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
        data: [
          {
            "case_type": "COVID",
            "paid_revenue": 11638,
            "total_cases": 770
          },
          {
            "case_type": "RESPIRATORY_PATHOGEN_PANEL",
            "paid_revenue": 4419,
            "total_cases": 304
          },
          {
            "case_type": "TOXICOLOGY",
            "paid_revenue": 42301,
            "total_cases": 2205
          },
          {
            "case_type": "CLINICAL_CHEMISTRY",
            "paid_revenue": 5799,
            "total_cases": 287
          },
          {
            "case_type": "UTI",
            "paid_revenue": 10371,
            "total_cases": 429
          },
          {
            "case_type": "URINALYSIS",
            "paid_revenue": 5957,
            "total_cases": 197
          },
          {
            "case_type": "PGX",
            "paid_revenue": 2008
          },
          {
            "case_type": "WOUND",
            "paid_revenue": 1717,
            "total_cases": 105
          },
          {
            "case_type": "NAIL",
            "paid_revenue": 1048,
            "total_cases": 47
          },
          {
            "case_type": "COVID_FLU",
            "paid_revenue": 5181,
            "total_cases": 251
          },
          {
            "case_type": "CGX",
            "paid_revenue": 5076
          },
          {
            "case_type": "CARDIAC",
            "paid_revenue": 6618,
            "total_cases": 367
          },
          {
            "case_type": "DIABETES",
            "paid_revenue": 3162,
            "total_cases": 165
          },
          {
            "case_type": "GASTRO",
            "paid_revenue": 1225,
            "total_cases": 111
          },
          {
            "case_type": "PAD",
            "paid_revenue": 1082
          },
          {
            "case_type": "PULMONARY",
            "paid_revenue": 1311
          },
          {
            "case_type": "GTI_STI",
            "paid_revenue": 640,
            "total_cases": 33
          },
          {
            "case_type": "GTI_WOMENS_HEALTH",
            "paid_revenue": 610,
            "total_cases": 36
          }
        ]
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(':id/stats-volume')
  async getVolumeStats(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {
      const id = param.id
      const start_date = query.from_date
      const end_date = query.to_date
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

  @Get(':id/case-types/volume')
  async getCaseTypesVolumeMonthWise(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {
      const id = param.id
      const start = query.from_date
      const end = query.to_date
      const data = await this.salesRepHelper.caseTypesVolumeMonthWise(id, start, end)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALE_VOLUME_MONTH_WISE,
        data: {
          "January 2024": {
            "count": 406,
            "case_type_wise_counts": {
              "COVID": 57,
              "RESPIRATORY_PATHOGEN_PANEL": 25,
              "TOXICOLOGY": 145,
              "CLINICAL_CHEMISTRY": 28,
              "UTI": 8,
              "URINALYSIS": 15,
              "PGX_TEST": 10,
              "WOUND": 3,
              "NAIL": 4,
              "COVID_FLU": 29,
              "CGX_PANEL": 25,
              "CARDIAC": 18,
              "DIABETES": 18,
              "GASTRO": 4,
              "PAD_ALZHEIMERS": 4,
              "PULMONARY_PANEL": 7,
              "GTI_STI": 3,
              "GTI_WOMENS_HEALTH": 3
            }
          },
          "February 2024": {
            "count": 36,
            "case_type_wise_counts": {
              "COVID": 4,
              "RESPIRATORY_PATHOGEN_PANEL": 1,
              "TOXICOLOGY": 11,
              "CLINICAL_CHEMISTRY": 3,
              "UTI": 6,
              "URINALYSIS": 1,
              "PGX_TEST": 1,
              "WOUND": 1,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 3,
              "CARDIAC": 1,
              "DIABETES": 2,
              "GASTRO": 1,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 1,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "March 2024": {
            "count": 1,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 1,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "April 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "May 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "June 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "July 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "August 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "September 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "October 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "November 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "December 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          }
        }
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }

  @Get(':id/case-types/revenue')
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
        data: {
          "January 2024": {
            "count": 406,
            "case_type_wise_counts": {
              "COVID": 57,
              "RESPIRATORY_PATHOGEN_PANEL": 25,
              "TOXICOLOGY": 145,
              "CLINICAL_CHEMISTRY": 28,
              "UTI": 8,
              "URINALYSIS": 15,
              "PGX_TEST": 10,
              "WOUND": 3,
              "NAIL": 4,
              "COVID_FLU": 29,
              "CGX_PANEL": 25,
              "CARDIAC": 18,
              "DIABETES": 18,
              "GASTRO": 4,
              "PAD_ALZHEIMERS": 4,
              "PULMONARY_PANEL": 7,
              "GTI_STI": 3,
              "GTI_WOMENS_HEALTH": 3
            }
          },
          "February 2024": {
            "count": 36,
            "case_type_wise_counts": {
              "COVID": 4,
              "RESPIRATORY_PATHOGEN_PANEL": 1,
              "TOXICOLOGY": 11,
              "CLINICAL_CHEMISTRY": 3,
              "UTI": 6,
              "URINALYSIS": 1,
              "PGX_TEST": 1,
              "WOUND": 1,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 3,
              "CARDIAC": 1,
              "DIABETES": 2,
              "GASTRO": 1,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 1,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "March 2024": {
            "count": 1,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 1,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "April 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "May 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "June 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "July 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "August 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "September 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "October 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "November 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          },
          "December 2024": {
            "count": 0,
            "case_type_wise_counts": {
              "COVID": 0,
              "RESPIRATORY_PATHOGEN_PANEL": 0,
              "TOXICOLOGY": 0,
              "CLINICAL_CHEMISTRY": 0,
              "UTI": 0,
              "URINALYSIS": 0,
              "PGX_TEST": 0,
              "WOUND": 0,
              "NAIL": 0,
              "COVID_FLU": 0,
              "CGX_PANEL": 0,
              "CARDIAC": 0,
              "DIABETES": 0,
              "GASTRO": 0,
              "PAD_ALZHEIMERS": 0,
              "PULMONARY_PANEL": 0,
              "GTI_STI": 0,
              "GTI_WOMENS_HEALTH": 0
            }
          }
        }
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(':id/trends/revenue')
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
        data: {
          "January 2024": {
            "revenue": 35
          },
          "February 2024": {
            "revenue": 26
          },
          "March 2024": {
            "revenue": 0
          },
          "April 2024": {
            "revenue": 0
          },
          "May 2024": {
            "revenue": 0
          },
          "June 2024": {
            "revenue": 0
          },
          "July 2024": {
            "revenue": 0
          },
          "August 2024": {
            "revenue": 0
          },
          "September 2024": {
            "revenue": 0
          },
          "October 2024": {
            "revenue": 0
          },
          "November 2024": {
            "revenue": 0
          },
          "December 2024": {
            "revenue": 0
          }
        }
      })
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }


  @Get(':id/trends/volume')
  async getTrendVolume(@Res() res: any, @Query() query: any, @Param() param: any) {
    try {
      const id = param.id
      const start_date = new Date(query.from_date)
      const end_date = new Date(query.to_date)

      const data = await this.salesRepHelper.getSalesTrendsVolumeData(id, start_date, end_date)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALE_TREND_VOLUME,
        data: {
          "January 2024": {
              "revenue": 35
          },
          "February 2024": {
              "revenue": 26
          },
          "March 2024": {
              "revenue": 0
          },
          "April 2024": {
              "revenue": 0
          },
          "May 2024": {
              "revenue": 0
          },
          "June 2024": {
              "revenue": 0
          },
          "July 2024": {
              "revenue": 0
          },
          "August 2024": {
              "revenue": 0
          },
          "September 2024": {
              "revenue": 0
          },
          "October 2024": {
              "revenue": 0
          },
          "November 2024": {
              "revenue": 0
          },
          "December 2024": {
              "revenue": 0
          }
      }
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }


  @Get(':id/insurance')
  async getInsuranceWiseStats(@Res() res: any){
    try {
      const insuranceStats = [
        {
            "name": "1199 SEIU Nat Benefit & Pension Fndd",
            "total_amount": 1000,
            "total_paid": 510,
            "total_pending": 490
        },
        {
            "name": "AARP - UHC Ovations Ins Solution",
            "total_amount": 1000,
            "total_paid": 500,
            "total_pending":500
        },
        {
            "name": "Absolute Total Care - Centene",
            "total_amount": 490,
            "total_paid": 490,
            "total_pending": 0
        },
        {
            "name": "Acclaim",
            "total_amount": 700,
            "total_paid": 480,
            "total_pending": 220
        },
        {
            "name": "ACS BENEFIT SERVICES",
            "total_amount": 800,
            "total_paid": 470,
            "total_pending": 330
        },
        {
            "name": "Administrative Concepts, Inc.",
            "total_amount": 1000,
            "total_paid": 460,
            "total_pending": 540
        },
        {
            "name": "Administrative Services, Inc",
            "total_amount": 1000,
            "total_paid": 450,
            "total_pending": 550
        },
        {
            "name": "Advantage by Bridgeway Health Solutions",
            "total_amount": 500,
            "total_paid": 440,
            "total_pending": 60
        },
        {
            "name": "Advantage by Buckeye Comm",
            "total_amount": 600,
            "total_paid": 430,
            "total_pending": 170
        },
        {
            "name": "Advantage by Superior Health",
            "total_amount": 1000,
            "total_paid": 420,
            "total_pending": 580
        },
        {
            "name": "Aetna",
            "total_amount": 1000,
            "total_paid": 410,
            "total_pending": 590
        },
        {
            "name": "Aetna Admin Medicare Supp",
            "total_amount": 400,
            "total_paid": 400,
            "total_pending": 0
        },
        {
            "name": "Aetna Better Health - PA Medicaid",
            "total_amount": 390,
            "total_paid": 390,
            "total_pending": 0
        },
        {
            "name": "Aetna Better Health of California",
            "total_amount": 1000,
            "total_paid": 380,
            "total_pending": 620
        },
        {
            "name": "Aetna Better Health of Kansas",
            "total_amount": 1000,
            "total_paid": 370,
            "total_pending": 630
        },
        {
            "name": "Aetna Better Health of Kentucky",
            "total_amount": 400,
            "total_paid": 360,
            "total_pending": 40
        },
        {
            "name": "Aetna Better Health of Louisiana",
            "total_amount": 500,
            "total_paid": 350,
            "total_pending": 150
        },
        {
            "name": "Aetna Better Health of Maryland",
            "total_amount": 1000,
            "total_paid": 340,
            "total_pending": 660
        },
        {
            "name": "Aetna Better Health of Michigan",
            "total_amount": 330,
            "total_paid": 330,
            "total_pending": 0
        },
        {
            "name": "Aetna Better Health of New Jersey",
            "total_amount": 320,
            "total_paid": 320,
            "total_pending": 0
        },
        {
            "name": "Aetna Better Health of New York",
            "total_amount": 200,
            "total_paid": 200,
            "total_pending": 0
        },
        {
            "name": "Aetna Better Health of Ohio",
            "total_amount": 700,
            "total_paid": 300,
            "total_pending": 400
        },
        {
            "name": "Aetna Better Health of Texas",
            "total_amount": 300,
            "total_paid": 290,
            "total_pending": 10
        },
        {
            "name": "Aetna Better Health of Virginia",
            "total_amount": 400,
            "total_paid": 280,
            "total_pending": 120
        },
        {
            "name": "Aetna Better Health of WV",
            "total_amount": 300,
            "total_paid": 270,
            "total_pending": 30
        },
        {
            "name": "Aetna Long Term Care",
            "total_amount": 300,
            "total_paid": 260,
            "total_pending": 40
        },
        {
            "name": "Aetna Senior Supplemental Insurance",
            "total_amount": 350,
            "total_paid": 250,
            "total_pending": 100
        },
        {
            "name": "Aetna TX Medicaid & CHIP",
            "total_amount": 250,
            "total_paid": 240,
            "total_pending": 10
        },
        {
            "name": "Affinity Health Plan",
            "total_amount": 250,
            "total_paid": 230,
            "total_pending": 20
        },
        {
            "name": "AFLAC",
            "total_amount": 700,
            "total_paid": 220,
            "total_pending": 480
        },
        {
            "name": "AFLAC Medicare Supplemental",
            "total_amount": 500,
            "total_paid": 210,
            "total_pending": 290
        },
        {
            "name": "AgeWell New York",
            "total_amount": 250,
            "total_paid": 200,
            "total_pending": 50
        },
        {
            "name": "AGIA, Inc",
            "total_amount": 350,
            "total_paid": 190,
            "total_pending": 160
        },
        {
            "name": "All Savers LIfe Insurance Co",
            "total_amount": 200,
            "total_paid": 180,
            "total_pending": 20
        },
        {
            "name": "Allegiance Benefit Plan Management, Inc.",
            "total_amount": 200,
            "total_paid": 170,
            "total_pending": 30
        },
        {
            "name": "Alliant Health Plans of Georgia",
            "total_amount": 200,
            "total_paid": 160,
            "total_pending": 40
        },
        {
            "name": "Allied Benefits Systems, Inc",
            "total_amount": 150,
            "total_paid": 150,
            "total_pending": 0
        },
        {
            "name": "AlohaCare Advantage",
            "total_amount": 150,
            "total_paid": 140,
            "total_pending": 10
        },
        {
            "name": "Alternative Insurance Resources",
            "total_amount": 150,
            "total_paid": 130,
            "total_pending": 20
        },
        {
            "name": "Ambetter of AR",
            "total_amount": 150,
            "total_paid": 120,
            "total_pending": 30
        }
    ]

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_INSURANCE_STATS,
        data: insuranceStats
      })

    } catch(err){
      console.log({err});
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }
}
