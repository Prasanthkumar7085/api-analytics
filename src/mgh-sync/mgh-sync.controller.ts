import { Controller, Get, Res } from '@nestjs/common';
import { MghSyncService } from './mgh-sync.service';
import { SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import mongoose, { ConnectOptions } from 'mongoose';
import { Configuration } from 'src/config/config.service';

@Controller({
  version: '1.0',
  path: 'mgh-sync'
})

export class MghSyncController {
  constructor(
    private readonly mghSyncService: MghSyncService,
    // private readonly configuration: Configuration
  ) { }

  @Get('patient-claims')
  async addPatientClaims(@Res() res: any) {
    try {

      // const { lis_mgh_db_url } = this.configuration.getConfig();

      // console.log({ lis_mgh_db_url });

      const db = await this.connectDb();
      console.log({ db });

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


  async connectDb() {
    try {
      await mongoose.connect(
        "mongodb+srv://lis_admin:j4tlDF2ThYK7oiae@lispro.yehbl.mongodb.net/lis_db_prod?retryWrites=true&w=majority"
      );
      console.info("Successfully connected mongoose");
      return true;
    } catch (err) {
      console.error("Error while connecting to mongoose", err);
      throw err; // Re-throw error to handle it outside
    }
  }

}

