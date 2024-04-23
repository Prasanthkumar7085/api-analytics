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
    private readonly salesRepsTargetsAchivedService: SalesRepsTargetsAchivedService
  ) { }
}
