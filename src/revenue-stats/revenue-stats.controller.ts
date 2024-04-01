import { Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FILE_UPLOAD, SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { SortHelper } from 'src/helpers/sortHelper';
import { RevenueStatsService } from './revenue-stats.service';

@Controller({
  version: '1.0',
  path: 'revenue',
})
export class RevenueStatsController {
  constructor(
    private readonly revenueStatsHelpers: RevenueStatsHelpers
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

      // To prepare the raw data which was came from file
      const modifiedData = await this.revenueStatsHelpers.prepareModifyData(file);

      // Need to get the Data from LIS based on the above modified data
      const finalModifiedData = await this.revenueStatsHelpers.getDataFromLis(modifiedData);


      // Need to seperate the existed raw stats and not existed raw stats
      const { matchedObjects, notMatchedObjects } = await this.revenueStatsHelpers.checkAlreadyExisted(finalModifiedData);

      // // Newly obtained stats will inserting into our db
      // if (notMatchedObjects.length > 0) {

      //   await this.revenueStatsService.saveDataInDb(notMatchedObjects);
      // } else {
      //   // Already existed stats will be updating with differences
      //   await this.revenueStatsHelpers.updateRawStats(matchedObjects);
      // }

      return res.status(200).json({
        success: true,
        message: FILE_UPLOAD,
        finalModifiedData

      });
    } catch (err) {
      console.log("err", err)
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    }
  }


  // @Post("process")
  // async revenueStatsProcess(@Req() req: any, @Res() res: any) {
  //   try {
  //     const query = {
  //       process_status: {
  //         equals: PENDING
  //       }
  //     }

  //     // Getting the PENDING raw stats from db
  //     const pendingRawData = await this.revenueStatsService.getRevenueRawData(query);

  //     if (!pendingRawData.length) {
  //       throw new CustomError(404, PENDING_DATA);
  //     }

  //     // Need to change the raw data into stats data format based marketer_id
  //     const processedData = await this.revenueStatsHelpers.processData(pendingRawData);

  //     // Gettin the raw_id (raw collection) for update the process_status
  //     const processedDataIds = processedData.map((e) => e.raw_id);
  //     const finalProcessedIds = [...new Set(processedDataIds)]

  //     // Sperating the existed and not existed data
  //     let { matchedObjects, notMatchedObjects, revenueStatsData } = await this.prepareRawData(processedData);

  //     // To Insert New Stats
  //     await this.revenueStatsHelpers.toInsertStats(notMatchedObjects);

  //     // To Update the already existed stats
  //     await this.revenueStatsHelpers.toUpdateStats(matchedObjects, revenueStatsData);

  //     // To update the process status
  //     const updateData = {
  //       process_status: COMPLETED
  //     }
  //     await this.revenueStatsService.updateRevenueRawProcessStatus(finalProcessedIds, updateData);

  //     return res.status(200).json({
  //       success: true,
  //       message: PROCESS_SUCCESS,
  //     })
  //   } catch (err) {
  //     console.log({ err });
  //     return res.status(500).json({
  //       success: false,
  //       message: err.message || "Something Went Wrong"
  //     })
  //   }
  // }

}
