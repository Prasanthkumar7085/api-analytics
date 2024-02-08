import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DELETE_REVENUE_RAW, FILE_UPLOAD, PROCESS_SUCCESS, REVENUE_MODIFIED_DATA, REVENUE_STATS, REVENUE_STAT_SINGLE, SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { PaginationHelper } from 'src/helpers/paginationHelper';
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
    private readonly filterHelper: FilterHelper,
    private readonly paginationHelper: PaginationHelper
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

      const finalProcessedData = processedData.map(obj => {
        // Using destructuring to create a new object without the specified key
        const { ["raw_id"]: deletedKey, ...newObject } = obj;
        return newObject;
      });

      const insertStatsData = await this.revenueStatsService.insertStats(finalProcessedData);

      const updateData = {
        process_status: "COMPLETED"
      }
      await this.revenueStatsService.updateRevenueRawProcessStatus(finalProcessedIds, updateData);

      return res.status(200).json({
        success: true,
        message: PROCESS_SUCCESS,
        insertStatsData
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


  @Get('stats')
  async getRevenueStats(@Req() req: any, @Res() res: any) {
    try {

      let page = req.query.page || 1;
      let limit = req.query.limit || 100;
      let orderBy = req.query.order_by || "date";
      let orderType = req.query.order_type || "desc";

      let skip = (page - 1) * limit;

      const sort = {
        [orderBy]: orderType
      }

      let query = this.filterHelper.marketerPaymentWiseCounts(req.query);
      const select = {
        marketer_id: true,
        date: true,
        total_amount: true,
        pending_amount: true,
        paid_amount: true
      }

      const [statsData, count]: any = await Promise.all([
        await this.revenueStatsService.getRevenueStats({ query, select, skip, limit, sort }),
        await this.revenueStatsService.countStats(query),
      ]);

      const response = this.paginationHelper.getPaginationResponse({
        page: +req.query.page || 1,
        count,
        limit,
        skip,
        data: statsData,
        message: REVENUE_STATS,
        searchString: req.query.search_string,
      });

      return res.status(200).json(response);

    }
    catch (err) {
      console.log("err", err)
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get('stats/:id')
  async getRevenueStatsById(@Param('id') id: number, @Res() res: any) {
    try {

      let fetchSingleRevenueRecord = await this.revenueStatsService.fetchRecord(id)

      return res.status(200).json({
        success: true,
        message: REVENUE_STAT_SINGLE,
        data: fetchSingleRevenueRecord
      })
    }
    catch (err) {
      console.log("err", err)

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
}
