import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SOMETHING_WENT_WRONG, TARGETS_ACHIEVED_DATA_FETCH_SUCCESS } from 'src/constants/messageConstants';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';
import { SortHelper } from 'src/helpers/sortHelper';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';


@Controller({
  version: '1.0',
  path: 'sales-reps-monthly-achieves',
})
export class SalesRepsTargetsAchivedController {
  constructor(
    private readonly filterHelper: FilterHelper,
    private readonly salesRepService: SalesRepService,
    private readonly salesRepHelper: SalesRepHelper,
    private readonly sortHelper: SortHelper


  ) { }


  @UseGuards(AuthGuard)
  @Get()
  async getAll(
    @Res() res: any,
    @Req() req: Request,
    @Query() query: any) {
    try {

      const queryString = this.filterHelper.salesRep(query);

      let salesReps = await this.salesRepService.getAll(queryString);

      const salesRepIds = salesReps.map(e => e.sales_rep_id);
      query.sales_reps = salesRepIds;

      const [salesRepsMonthlytargets, salesrRepsMonthlyAchieves] = await Promise.all([
        this.salesRepHelper.getSalesRepsMonthWiseTargets(query),
        this.salesRepHelper.getSalesRepsMonthWiseAchievements(query)
      ]);

      let combinedData = salesRepsMonthlytargets.map(target => {
        const achieve = salesrRepsMonthlyAchieves.find(achieve =>
          achieve.sales_rep_id === target.sales_rep_id && achieve.month === target.month
        );

        return {
          sales_rep_id: target.sales_rep_id,
          sales_rep_name: target.sales_rep_name,
          total_targets: target.total_targets || 0,
          total_achievements: achieve ? achieve.total_achieves : 0,
          month: this.formateMonth(target.month)
        };
      });

      combinedData = this.sortHelper.sortOnMonth(combinedData);

      return res.status(200).json({
        success: true,
        message: TARGETS_ACHIEVED_DATA_FETCH_SUCCESS,
        data: combinedData
      });
    }
    catch (error) {
      console.log({ error });

      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      });
    }
  }

  formateMonth(monthString) {
    const [month, year] = monthString.split('-');
    const monthIndex = parseInt(month) - 1; // Adjusting month index
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[monthIndex];
    return `${monthName} ${year}`;
  }


}

