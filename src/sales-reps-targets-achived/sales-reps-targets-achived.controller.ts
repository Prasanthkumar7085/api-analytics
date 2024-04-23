import { Controller } from '@nestjs/common';
import { SalesRepsTargetsAchivedService } from './sales-reps-targets-achived.service';


@Controller({
  version: '1.0',
  path: 'sales-reps-monthly-achieves',
})
export class SalesRepsTargetsAchivedController {
  constructor(
    private readonly salesRepsTargetsAchivedService: SalesRepsTargetsAchivedService
  ) { }
}
