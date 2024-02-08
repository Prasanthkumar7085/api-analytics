import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DELETE_REVENUE_RAW, FILE_UPLOAD, PROCESS_SUCCESS, REVENUE_STATS, REVENUE_MODIFIED_DATA, SOMETHING_WENT_WRONG, SUCCESS_DELETE } from 'src/constants/messageConstants';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { RevenueStatsService } from './revenue-stats.service';
import { CustomError } from 'src/middlewares/customValidationMiddleware';

@Controller({
  version: '1.0',
  path: 'revenue',
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
      const query = {
        process_status: {
          equals: "PENDING"
        }
      }

      const pendingRawData = await this.revenueStatsService.getRevenueRawData(query);

      if (!pendingRawData.length) {
        throw new CustomError(404, "Pending Data is Not Found!");
      }

      const processedData = await this.revenueStatsHelpers.processData(pendingRawData);
      const processedDataIds = processedData.map((e) => e.raw_id);

      const finalProcessedIds = [...new Set(processedDataIds)]

      let { matchedObjects, notMatchedObjects, revenueStatsData } = await this.prepareRawData(processedData);


      if (notMatchedObjects.length > 0) {
        // const insertStatsData = await this.revenueStatsService.insertStats(finalProcessedData);
      }


      if (matchedObjects.length > 0) {
        const findMatch = (arr, marketerId, date) => {
          return arr.find(obj =>
            obj.marketer_id === marketerId && new Date(obj.date).toISOString() === new Date(date).toISOString()
          );
        };

        matchedObjects.forEach(objOne => {
          const matchingObj = findMatch(revenueStatsData, objOne.marketer_id, objOne.date);
          console.log({ matchingObj });
          if (matchingObj) {
            // Update values based on matchingObj
            objOne.paid_amount = matchingObj.paid_amount;
            objOne.total_amount = matchingObj.total_amount;
            objOne.pending_amount = matchingObj.pending_amount;
            objOne.case_type_wise_counts.forEach((caseType, index) => {
              caseType.paid_amount = matchingObj.case_type_wise_counts[index].paid_amount;
              caseType.total_amount = matchingObj.case_type_wise_counts[index].total_amount;
              caseType.pending_amount = matchingObj.case_type_wise_counts[index].pending_amount;
            });
          }
        });
      }

      // const updateData = {
      //   process_status: "COMPLETED"
      // }
      // await this.revenueStatsService.updateRevenueRawProcessStatus(finalProcessedIds, updateData);

      return res.status(200).json({
        success: true,
        message: PROCESS_SUCCESS,
        // finalProcessedData,
        // someData,
        // revenueStatsData,
        matchedObjects,
        notMatchedObjects
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || "Something Went Wrong"
      })
    }
  }

  @Get("raw")
  async deleteRevenuRawData(@Req() req: any, @Res() res: any) {
    try {

      let fetchedRevenueData = await this.revenueStatsService.getRevenueRawData({})

      return res.status(200).json({
        success: true,
        message: REVENUE_MODIFIED_DATA,
        data: fetchedRevenueData
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }




  @Delete("raw/:id")
  async revenueModifiedData(@Param('id') id: number, @Res() res: any) {
    try {
      let deletedData = await this.revenueStatsService.deleteRevenueRawData(id)

      return res.status(200).json({
        success: true,
        message: DELETE_REVENUE_RAW,
        data: deletedData
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }





  @Delete("stats/:id")
  async deleteRevenueStats(@Param('id') id: number, @Res() res: any) {
    try {
      let deletedData = await this.revenueStatsService.deleteRevenueStats(id)

      return res.status(200).json({
        success: true,
        message: DELETE_REVENUE_RAW,
        data: deletedData
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }


  async prepareRawData(processedData) {

    const finalProcessedData = processedData.map(obj => {
      // Using destructuring to create a new object without the specified key
      const { ["raw_id"]: deletedKey, ...newObject } = obj;
      return newObject;
    });

    const revenueStatsData = await this.getAlreadyExistedData(finalProcessedData);

    let { matchedObjects, notMatchedObjects } = await this.seperateExistedAndNotExistedData(finalProcessedData, revenueStatsData);

    return { matchedObjects, notMatchedObjects, revenueStatsData };
  }


  async getAlreadyExistedData(finalProcessedData) {
    const someData = finalProcessedData.map(obj => {
      // Using object destructuring to extract only the specified fields
      const { marketer_id, date } = obj;
      return { marketer_id, date };
    })

    const queryString = {
      OR: someData.map(item => ({
        AND: [
          { marketer_id: item.marketer_id },
          { date: new Date(item.date) } // Assuming 'date' is stored as a Date in the database
        ]
      }))
    }

    const revenueStatsData = await this.revenueStatsService.getRevenueStats(queryString);

    return revenueStatsData;
  }

  async seperateExistedAndNotExistedData(finalProcessedData, revenueStatsData) {
    const matchedObjects = [];
    const notMatchedObjects = finalProcessedData.filter(objOne => {
      const matchingObj = revenueStatsData.find(objTwo =>
        objOne.marketer_id === objTwo.marketer_id &&
        new Date(objOne.date).toISOString() === new Date(objTwo.date).toISOString()
      );

      if (matchingObj) {
        matchedObjects.push({ ...objOne, id: matchingObj.id });
        return false; // Filter out the matched object
      } else {
        return true; // Keep the not matched object
      }
    });

    return { matchedObjects, notMatchedObjects };
  }
}
