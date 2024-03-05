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
        data: {
          volume_data: { total: volumeData.total, case_type_wise_count: volumeData.totalCounts },
          revenue_data: { total: revenueData.total_amount, case_type_wise_count: revenueData.totalCaseTypeAmount }
        }
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
          generated: total_amount,
          collected: paid_amount,
          pending: pending_amount,
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
          total: total_cases,
          completed: completed_cases,
          pending: pending_cases
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
        data: data
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
