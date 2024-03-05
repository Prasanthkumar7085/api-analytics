import { Controller, Get, Res, Query } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';
import { SUCCESS_FETCHED_OVERVIEW_REVENUE_STATS, SUCCESS_FETCHED_OVERVIEW_VOLUME_STATS, SUCCESS_FETCHED_OVERVIEW_REVENUE, SUCCESS_FETCHED_OVERVIEW_VOLUME_AND_REVENUE } from 'src/constants/messageConstants';



@Controller({
  version: '2.0',
  path: 'overview',
})
export class OverviewController {
  constructor(
    private readonly overviewService: OverviewService,
    private readonly salesRepHelper: SalesRepHelper,

  ) { }

  @Get('case-types')
  async getOverViewCaseTypes(@Query() query: any, @Res() res: any) {
    try {

      const { from_date, to_date } = query;

      const volumeData = await this.salesRepHelper.getOverviewCaseTypesVolumeData(from_date, to_date);
      const revenueData = await this.salesRepHelper.getOverviewCaseTypesRevenueData(from_date, to_date);

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_OVERVIEW_VOLUME_AND_REVENUE,
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
      });
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }



  @Get('stats-revenue')
  async getRevenueStats(@Res() res: any, @Query() query: any) {
    try {
      const start_date = new Date(query.from_date);
      const end_date = new Date(query.to_date);

      const { total_amount, paid_amount, pending_amount } = await this.salesRepHelper.getOverviewRevenueStatsData(start_date, end_date);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_OVERVIEW_REVENUE_STATS,
        data: {
          "generated": 50000,
          "collected": 20000,
          "pending": 30000
        }
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  }

  @Get('stats-volume')
  async getVolumeStats(@Res() res: any, @Query() query: any) {
    try {
      const start_date = new Date(query.from_date);
      const end_date = new Date(query.to_date);
      const { total_cases, completed_cases, pending_cases } = await this.salesRepHelper.getOverViewVolumeStatsData(start_date, end_date);
      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_OVERVIEW_VOLUME_STATS,
        data: {
          total: 5000,
          completed: 3000,
          pending: 2000
        }
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }
  }

  @Get('revenue')
  async revenuGraph(@Res() res: any, @Query() query: any) {
    try {
      const from_date = new Date(query.from_date);
      const to_date = new Date(query.to_date);
      const data = await this.salesRepHelper.getRevenueGraph(from_date, to_date);
      return res.status(200).json({
        success: true,
        messgae: SUCCESS_FETCHED_OVERVIEW_REVENUE,
        data: {
          "January 2023": {
            "total_revenue_billed": 53887,
            "total_revenue_collected": 6396
          },
          "February 2023": {
            "total_revenue_billed": 0,
            "total_revenue_collected": 0
          },
          "March 2023": {
            "total_revenue_billed": 8809,
            "total_revenue_collected": 4396
          },
          "April 2023": {
            "total_revenue_billed": 7909,
            "total_revenue_collected": 6396
          },
          "May 2023": {
            "total_revenue_billed": 0,
            "total_revenue_collected": 0
          },
          "June 2023": {
            "total_revenue_billed": 0,
            "total_revenue_collected": 0
          },
          "July 2023": {
            "total_revenue_billed": 42909,
            "total_revenue_collected": 6396
          },
          "August 2023": {
            "total_revenue_billed": 17862,
            "total_revenue_collected": 15074
          },
          "September 2023": {
            "total_revenue_billed": 12210,
            "total_revenue_collected": 10842
          },
          "October 2023": {
            "total_revenue_billed": 111624,
            "total_revenue_collected": 77851
          },
          "November 2023": {
            "total_revenue_billed": 7000,
            "total_revenue_collected": 1396
          },
          "December 2023": {
            "total_revenue_billed": 0,
            "total_revenue_collected": 0
          }
        }
      });
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }
  }
}
