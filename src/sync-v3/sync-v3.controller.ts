import { Controller, Get, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { PATIENT_CLAIMS_NOT_FOUND, REMOVED_ARCHIVED_CLAIMS, SOMETHING_WENT_WRONG, SUCCESS_SYNC_PATIENT_CLAIMS } from 'src/constants/messageConstants';
import { LisService } from 'src/lis/lis.service';
import { syncHelpers } from 'src/helpers/syncHelper';

@Controller({
  version: '3.0',
  path: 'sync'
})

export class SyncV3Controller {
  constructor(
    private readonly syncV3Service: SyncV3Service,
    private readonly lisService: LisService,
    private readonly syncHelpers: syncHelpers
  ) { }

  @Get('patient-claims')
  async addPatientClaims(@Res() res: any) {
    try {

      const datesObj = this.syncHelpers.getFromAndToDates(7);

      const fromDate = datesObj.fromDate;
      const toDate = datesObj.toDate;

      const cases = await this.syncHelpers.getCases(fromDate, toDate);

      if (cases.length == 0) {
        return res.status(200).json({
          success: true,
          message: PATIENT_CLAIMS_NOT_FOUND
        });
      }

      const analyticsData = await this.syncHelpers.getAllAnalyticsData();

      let modifiedArray = await this.syncHelpers.modifyCasesForPatientClaims(cases, analyticsData);

      if (modifiedArray.length) {

        const seperatedArray = await this.syncHelpers.seperateModifiedArray(modifiedArray);

        this.syncHelpers.insertOrUpdateModifiedClaims(seperatedArray);
      }

      return res.status(200).json({
        success: true,
        message: SUCCESS_SYNC_PATIENT_CLAIMS
      });

    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("patient-claims-remove")
  async removeArchivedClaims(@Res() res: any) {
    try {
      const datesObj = this.syncHelpers.getFromAndToDates(7);

      const fromDate = datesObj.fromDate;
      const toDate = datesObj.toDate;


      const cases = await this.syncHelpers.getArchivedCases(fromDate, toDate);

      if (cases.length == 0) {
        return res.status(200).json({
          success: true,
          message: PATIENT_CLAIMS_NOT_FOUND
        });
      }

      const accessionIds = cases.map((e) => e.accession_id);
      
      this.syncV3Service.removePatientClaims(accessionIds);
      return res.status(200).json({
        success: true,
        message: REMOVED_ARCHIVED_CLAIMS,
        data: accessionIds
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }
}
