import { Controller, Get, Post, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { LisService } from 'src/lis/lis.service';
import { SOMETHING_WENT_WRONG, SUCCESS_SYNCED_CASE_TYPES, SUCCESS_SYNCED_INSURANCE_PAYORS } from 'src/constants/messageConstants';
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

      return res.status(200).json({ success: true, message: SUCCESS_SYNCED_INSURANCE_PAYORS, data: result });
    }
    catch (err) {
      console.log({ err });

      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }

  }


  @Get('case-types')
  async syncCaseTypes(@Res() res: any) {
    try {
      // const datesObj = this.synchelpers.getFromAndToDates(365);

      const query = {
        lab: "5fd0f8b70c8b4b71e275a2b7",
        // created_at: {
        //   $gte: datesObj.fromDate,
        //   $lte: datesObj.toDate
        // }
      };

      const data = await this.lisService.getCaseTypes(query);

      const result = await this.synchelpers.insertNewCaseTypesIntoAnalyticsDb(data);

      return res.status(200).json({ success: true, message: SUCCESS_SYNCED_CASE_TYPES, data: result });

    }
    catch (error) {
      console.log({ error });

      return res.status(500).json({ success: false, message: error || SOMETHING_WENT_WRONG });
    }
  }

}
