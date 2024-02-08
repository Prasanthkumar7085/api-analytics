import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FILE_UPLOAD, REVENUE_MODIFIED_DATA, REVENUE_STATS, REVENUE_STAT_SINGLE, SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { RevenueStatsService } from './revenue-stats.service';

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
  async processRawCsvFile(@UploadedFile() file, @Req() req: any, @Res() res: any) {
    try {

      const modifiedData = await this.revenueStatsHelpers.prepareModifyData(file);

      const finalModifiedData = await this.revenueStatsHelpers.getDataFromLis(modifiedData);

      const saveDataInDb = await this.revenueStatsService.saveDataInDb(finalModifiedData)

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

  @Get()
  async revenueModifiedData(@Req() req: any, @Res() res: any) {
    try {
      let fetchedRevenueData = await this.revenueStatsService.getRawRevenueRawData()

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
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }
}
