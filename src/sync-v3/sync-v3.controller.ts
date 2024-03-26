import { Controller, Get, Post, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { LisService } from 'src/lis/lis.service';
import { SOMETHING_WENT_WRONG, SUCCESS_SYNCED_INSURANCE_PAYORS } from 'src/constants/messageConstants';
import { syncHelpers } from 'src/helpers/syncHelper';

@Controller({
  version: '3.0',
  path: 'sync'
})

export class SyncV3Controller {
  constructor(
    private readonly syncV3Service: SyncV3Service,
    private readonly lisService: LisService,
    private readonly synchelpers: syncHelpers,
  ) { }

  @Get('insurance-payors')
  async syncInsurancePayors(@Res() res: any) {

    try {
      const data = await this.lisService.getInsurancePayors();

      const result = await this.synchelpers.insertNewInsurancePayorsIntoAnalyticsDb(data);

      return res.status(200).json({ success: true, message: SUCCESS_SYNCED_INSURANCE_PAYORS, data: result })
    }
    catch (err) {
      console.log({ err });

      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }

  }


  @Post('insert')
  async insertInsurancePayor(@Res() res: any) {
    try {
      const result = await this.lisService.insertInsurancePayors();

      return res.status(200).json({ success: true, message: 'success', data: result });

    }
    catch (error) {
      return res.status(500).json({ success: false, message: error || SOMETHING_WENT_WRONG })
    }
  }
}
