import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { SalesRepsTargetsAchivedService } from './sales-reps-targets-achived.service';
import { SALES_REP_MONTHLY_ACHIVES_SUCCESS, SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { TargetsAchivedHelper } from 'src/helpers/targetsAchivedHelper';
import { SalesRepsTargetsService } from 'src/sales-reps-targets/sales-reps-targets.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterHelper } from 'src/helpers/filterHelper';


@Controller({
  version: '1.0',
  path: 'sales-reps-monthly-achieves',
})
export class SalesRepsTargetsAchivedController {
  constructor(
    private readonly salesRepsTargetsAchivedService: SalesRepsTargetsAchivedService,
    private readonly targetsAchivedHelper: TargetsAchivedHelper,
    private readonly salesRepsTargetsService: SalesRepsTargetsService,
    private readonly filterHelper: FilterHelper
  ) { }


  @UseGuards(AuthGuard)
  @Get()
  async getSalesRepsMonthlyAchives(@Res() res: any, @Query() query: any) {
    try {

      const queryString = await this.filterHelper.salesRepsMonthlyTargets(query);

      const [achivedData, targetedData] = await Promise.all([
        this.salesRepsTargetsAchivedService.findAll(queryString),
        this.salesRepsTargetsService.getAllTargets(queryString)
      ]);

      const result = this.targetsAchivedHelper.mergeResults(targetedData, achivedData);

      return res.status(200).json({
        success: true,
        message: SALES_REP_MONTHLY_ACHIVES_SUCCESS,
        data: result
        // achivedData, targetedData
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        succes: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }
}
