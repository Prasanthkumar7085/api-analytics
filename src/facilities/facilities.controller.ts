import { Controller, Get, Post, Param, Res, Query, UseGuards } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_FACILITIES, SUCCESS_FETCHED_FACILITY, SUCCESS_VOLUME_TREND, SUCCESS_FETCHED_FACILITIES_REVENUE_STATS, SUCCESS_FETCHED_FACILITIES_VOLUME_STATS, SUCCESSS_FETCHED_FACILITIES_CASES_TYPES_VOLUME, SUCCESS_FETCHED_CASE_TYPES_REVENUE, SUCCESS_FETCHED_REVENUE_MONTH_WISE_TRENDS, SUCCESS_FETCHED_FACILITY_CASE_TYPE_VOLUME_AND_REVENUE } from 'src/constants/messageConstants';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';
import { AuthGuard } from 'src/guards/auth.guard';


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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get(':id/stats-revenue')
  async getRevenuestatsData(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id;
      const from_date = query.from_date
      const to_date = query.to_date

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

  @UseGuards(AuthGuard)
  @Get(':id/stats-volume')
  async getVolumeStatsData(@Res() res: any, @Param() param: any, @Query() query: any) {
    try {
      const id = param.id
      const from_date = query.from_date
      const to_date = query.to_date

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
  @UseGuards(AuthGuard)
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
      console.log({ error });
      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      })
    }
  }
}
