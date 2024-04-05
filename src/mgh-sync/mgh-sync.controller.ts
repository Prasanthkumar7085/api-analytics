import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { Configuration } from 'src/config/config.service';
import { LABS_NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS_SYNC_LABS, SUCCUSS_INSERTED_MARKETING_MANAGERS } from 'src/constants/messageConstants';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { LabsService } from 'src/labs/labs.service';
import { MghSyncService } from './mgh-sync.service';
import { InternetModule } from '@faker-js/faker';

@Controller({
  version: '1.0',
  path: 'mgh-sync'
})


export class MghSyncController {
  constructor(
    private readonly mghSyncService: MghSyncService,
    private readonly labsService: LabsService,
    private readonly syncHelpers: SyncHelpers
  ) { }


  @Get('patient-claims')
  async addPatientClaims(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());

      const { lis_mgh_db_url } = configuration.getConfig();

      await mongoose.connect(lis_mgh_db_url);

      const query = {
        accession_id: "MT240404122"
      };

      const caseData = await this.mghSyncService.getCases(query);

      return res.status(200).json({
        success: true,
        message: "Success",
        caseData
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("labs")
  async SyncLabs(@Res() res: any) {
    try {

      const configuration = new Configuration(new ConfigService());

      const { lis_mgh_db_url } = configuration.getConfig();

      await mongoose.connect(lis_mgh_db_url);

      const query = {
        lab_code: "MICROGEN"
      };

      const select = {
        _id: 1,
        name: 1,
        lab_code: 1,
      };

      const labsData = await this.mghSyncService.getlabs(query, select);

      if (!labsData.length) {
        return res.status(200).json({
          success: false,
          message: LABS_NOT_FOUND
        });
      }

      const modifiedData = this.syncHelpers.modifyLabs(labsData);

      const refIds = modifiedData.map(e => e.refId);

      this.syncHelpers.insertOrUpdateLabs(modifiedData, refIds);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SYNC_LABS,
        data: modifiedData
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("managers")
  async syncManagers(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());

      const { lis_mgh_db_url } = configuration.getConfig();

      await mongoose.connect(lis_mgh_db_url);

      const datesFilter = this.syncHelpers.getFromAndToDates(7);

      const salesRepsData = await this.syncHelpers.getMghSalesReps(datesFilter);

      const modifiedSalesReps = salesRepsData.map(item => ({
        mghRefId: item._id.toString(),
        name: item.name,
        roleId: item.user_type === "MARKETER" ? 1 : (item.user_type === "HOSPITAL_MARKETING_MANAGER" ? 2 : null)
      }));


      const data = await this.syncHelpers.getExistedAndNotExistedReps(modifiedSalesReps);



      return res.status(200).json({
        success: true,
        message: SUCCUSS_INSERTED_MARKETING_MANAGERS,
        data,
        modifiedSalesReps
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

