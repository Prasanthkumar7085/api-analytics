import { Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FILE_UPLOAD, PROCESS_SUCCESS, SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { RevenueStatsService } from './revenue-stats.service';

@Controller({
  version: '1.0',
  path: 'revenue-stats',
})
export class RevenueStatsController {
  constructor(
    private readonly revenueStatsService: RevenueStatsService,
    private readonly revenueStatsHelpers: RevenueStatsHelpers,
  ) { }


  @Post("upload")
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      storage: memoryStorage()
    }),
  )
  async processRawCsvFile(@UploadedFile() file, @Res() res: any) {
    try {

      const modifiedData = await this.revenueStatsHelpers.prepareModifyData(file);

      const finalModifiedData = await this.revenueStatsHelpers.getDataFromLis(modifiedData);

      const saveDataInDb = await this.revenueStatsService.saveDataInDb(finalModifiedData);

      return res.status(200).json({
        success: true,
        message: FILE_UPLOAD,
        data: saveDataInDb
      });
    } catch (err) {
      console.log("err", err)
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    }
  }

  @Post("process")
  async revenueStatsProcess(@Req() req: any, @Res() res: any) {
    try {
      const resp = [
        {
          "case_id": "65b2b192d80da9931bb3d543",
          "case_types": [
            "CLINICAL_CHEMISTRY"
          ],
          "hospital": "63dbb884b195feadf04e2c7a",
          "hospital_marketers": [
            "63e21360fefc7c5a58ec791b",
            "643520b3d1161fb300d56195",
            "649d4768db25b39e25e24e0a",
            "658c63b5ae3c1fd6ac94f182",
            "658c63f8ae3c1fd6ac94f216",
            "658f3cd19aac3bf78b38157d",
            "65b92ad048d4b336d86f272d",
            "65b92d31fe812d1ea865f0c2"
          ],
          "accession_id": "MC240125004",
          "date_of_service": "2023-10-22",
          "payment_status": "Settled Encounter",
          "cpt_codes": [
            "36415",
            "84153",
            "85025",
            "82306",
            "80061",
            "80053",
            "84439",
            "82607",
            "84443",
            "83036"
          ],
          "line_item_total": [
            "11",
            "23",
            "3",
            "37",
            "17",
            "14",
            "12",
            "19",
            "21",
            "13"
          ],
          "insurance_payment_amount": [
            "8.4",
            "18.02",
            "2.94",
            "29.01",
            "13.12",
            "10.35",
            "8.84",
            "14.78",
            "16.46",
            "9.52"
          ],
          "insurance_adjustment_amount": [
            "2.6",
            "4.98",
            "0.06",
            "7.99",
            "3.88",
            "3.65",
            "3.16",
            "4.22",
            "4.54",
            "3.48"
          ],
          "insurance_write_of_amount": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_payment_amount": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_adjustment_amount": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_write_of_amount": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "line_item_balance": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "total_amount": 170,
          "paid_amount": 170,
          "pending_amount": 0
        },
        {
          "case_id": "65b2b192d80da9931bb3d543",
          "case_types": [
            "CLINICAL_CHEMISTRY"
          ],
          "hospital": "63dbb884b195feadf04e2c7a",
          "hospital_marketers": [
            "63e21360fefc7c5a58ec791b",
            "643520b3d1161fb300d56195",
            "649d4768db25b39e25e24e0a",
            "658c63b5ae3c1fd6ac94f182",
            "658c63f8ae3c1fd6ac94f216",
            "658f3cd19aac3bf78b38157d",
            "65b92ad048d4b336d86f272d",
            "65b92d31fe812d1ea865f0c2"
          ],
          "accession_id": "MC240125004",
          "date_of_service": "2023-10-21",
          "payment_status": "Settled Encounter",
          "cpt_codes": [
            "36415",
            "84153",
            "85025",
            "82306",
            "80061",
            "80053",
            "84439",
            "82607",
            "84443",
            "83036"
          ],
          "line_item_total": [
            "11",
            "23",
            "3",
            "37",
            "17",
            "14",
            "12",
            "19",
            "21",
            "13"
          ],
          "insurance_payment_amount": [
            "8.4",
            "18.02",
            "2.94",
            "29.01",
            "13.12",
            "10.35",
            "8.84",
            "14.78",
            "16.46",
            "9.52"
          ],
          "insurance_adjustment_amount": [
            "2.6",
            "4.98",
            "0.06",
            "7.99",
            "3.88",
            "3.65",
            "3.16",
            "4.22",
            "4.54",
            "3.48"
          ],
          "insurance_write_of_amount": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_payment_amount": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_adjustment_amount": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_write_of_amount": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "line_item_balance": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "total_amount": 170,
          "paid_amount": 170,
          "pending_amount": 0
        },
        {
          "case_id": "65c20bfa6232164b899d0917",
          "case_types": [
            "TOXICOLOGY"
          ],
          "hospital": "6332725a432285b4629e1424",
          "hospital_marketers": [
            "63e21360fefc7c5a58ec791b",
            "643520b3d1161fb300d56195",
            "649d4768db25b39e25e24e0a",
            "658c63b5ae3c1fd6ac94f182",
            "658c63f8ae3c1fd6ac94f216",
            "658f3cd19aac3bf78b38157d",
            "65b92ad048d4b336d86f272d",
            "65b92d31fe812d1ea865f0c2"
          ],
          "accession_id": "MC240206001",
          "date_of_service": "2023-10-22",
          "payment_status": "New Encounter",
          "cpt_codes": [
            "82607",
            "86141",
            "82627",
            "80053",
            "36415"
          ],
          "line_item_total": [
            "19",
            "17",
            "28",
            "14",
            "11"
          ],
          "insurance_payment_amount": [
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "insurance_adjustment_amount": [
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "insurance_write_of_amount": [
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_payment_amount": [
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_adjustment_amount": [
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "patient_write_of_amount": [
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "line_item_balance": [
            "19",
            "17",
            "28",
            "14",
            "11"
          ],
          "total_amount": 89,
          "paid_amount": 0,
          "pending_amount": 89
        }
      ]


      const processedData = await this.revenueStatsHelpers.processHospitalMarketers(resp);


      return res.status(200).json({
        success: true,
        message: PROCESS_SUCCESS,
        processedData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || "Something Went Wrong"
      })
    }
  }

}
