import { Controller, Get, Res } from '@nestjs/common';
import { MghSyncService } from './mgh-sync.service';
import { SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import mongoose, { ConnectOptions } from 'mongoose';
import { Configuration } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';

@Controller({
  version: '1.0',
  path: 'mgh-sync'
})


export class MghSyncController {
  constructor(
    private readonly mghSyncService: MghSyncService,
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
          message: "Labs Not Found!"
        });
      }

      const modifiedData = labsData.map(item => ({
        refId: item._id,
        name: item.name,
        code: item.lab_code
      }));

      const refIds = modifiedData.map(e => e.refId);

      

      return res.status(200).json({
        success: true,
        message: "Successfully fetched labs",
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

}

