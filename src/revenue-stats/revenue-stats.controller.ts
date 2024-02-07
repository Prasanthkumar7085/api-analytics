import { FileUploadDataServiceProvider } from '../../services/fileUploadService';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RevenueStatsService } from './revenue-stats.service';
import { memoryStorage } from 'multer'
import * as XLSX from 'xlsx'
import { UpdateRevenueStatDto } from './dto/update-revenue-stat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_UPLOAD, INVALID_FILE, NO_FILE, SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { S3Service } from './s3Service';
import { UploadFileHelper } from 'src/helpers/uploadFileHelper';
import { MapRevenueCsvDataHelper } from 'src/helpers/mapRevenueCsvDataHelper';
import { CustomError } from 'src/middlewares/customValidationMiddleware';

@Controller({
  version: '1.0',
  path: 'revenue-stats',
})
export class RevenueStatsController {
  constructor(
    private readonly revenueStatsService: RevenueStatsService,
    private readonly s3Service: S3Service,
    private readonly fileUploadDataServiceProvider: FileUploadDataServiceProvider,
    private readonly mapRevenueCsvDataHelper: MapRevenueCsvDataHelper,
  ) { }


  @Post('/save-revenue-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      storage: memoryStorage()
    }),
  )
  async processRawCsvFile(@UploadedFile() file, @Req() req: any, @Res() res: any) {
    try {

      if (!file) {
        throw new CustomError(400, NO_FILE)
      }

      if (file.mimetype !== 'text/csv') {
        throw new CustomError(400, INVALID_FILE)
      }

      const csvFileData = await this.fileUploadDataServiceProvider.processCsv(file);
      // console.log("fileRews", csvFileData);
      const MappedRevenueCsvData = await this.mapRevenueCsvDataHelper.mapCsvDataForDb(csvFileData)
      // console.log("MappedRevenueCsvData", MappedRevenueCsvData)
      let saveRevenueData = await this.revenueStatsService.insertRevenueData(MappedRevenueCsvData)
      // Process the fileRows array as needed
      // ...
      console.log("saveRevenueData", saveRevenueData)

      return res.status(200).json({
        success: true,
        message: FILE_UPLOAD,
        // data: saveRevenueData
      });
    } catch (err) {
      console.log("err", err)
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG,
      });
    }
  }


}
