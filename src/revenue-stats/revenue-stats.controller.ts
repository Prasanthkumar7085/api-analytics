import { StatsHelper } from 'src/helpers/statsHelper';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { COMPLETED, DELETE_REVENUE_RAW, FILE_UPLOAD, NOT_LESSER, PENDING, PENDING_DATA, PROCESS_SUCCESS, REVENUE_MODIFIED_DATA, REVENUE_STATS, REVENUE_STAT_SINGLE, SOMETHING_WENT_WRONG, MONTHLY_STATS_SUCCESS, SUCCESS_MARKETERS, CASE_STATS_SUCCESS } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { RevenueStatsService } from './revenue-stats.service';
import { CustomError } from 'src/middlewares/customValidationMiddleware';
import { ManagerCombinedDto } from 'src/stats/dto/manager-combined.dto';
import { SortHelper } from 'src/helpers/sortHelper';
import { StatsService } from 'src/stats/stats.service';
import { total_amount, total_cases } from 'src/constants/lisConstants';
import { ManagerIndividualDto } from 'src/stats/dto/manager-individual';

@Controller({
  version: '1.0',
  path: 'revenue',
})
export class RevenueStatsController {
  constructor(
    private readonly revenueStatsService: RevenueStatsService,
    private readonly revenueStatsHelpers: RevenueStatsHelpers,
    private readonly filterHelper: FilterHelper,
    private readonly paginationHelper: PaginationHelper,
    private readonly statsHelper: StatsHelper,
    private readonly sortHelper: SortHelper,
    private readonly statsServive: StatsService
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

      // Newly obtained stats will inserting into our db
      if (notMatchedObjects.length > 0) {

        await this.revenueStatsService.saveDataInDb(notMatchedObjects);
      }

      // Already existed stats will be updating with differences
      await this.revenueStatsHelpers.updateRawStats(matchedObjects);

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


  @Post("process")
  async revenueStatsProcess(@Req() req: any, @Res() res: any) {
    try {
      const query = {
        process_status: {
          equals: PENDING
        }
      }

      // Getting the PENDING raw stats from db
      const pendingRawData = await this.revenueStatsService.getRevenueRawData(query);

      if (!pendingRawData.length) {
        throw new CustomError(404, PENDING_DATA);
      }

      // Need to change the raw data into stats data format based marketer_id
      const processedData = await this.revenueStatsHelpers.processData(pendingRawData);

      // Gettin the raw_id (raw collection) for update the process_status
      const processedDataIds = processedData.map((e) => e.raw_id);
      const finalProcessedIds = [...new Set(processedDataIds)]

      // Sperating the existed and not existed data
      let { matchedObjects, notMatchedObjects, revenueStatsData } = await this.prepareRawData(processedData);

      // To Insert New Stats
      await this.revenueStatsHelpers.toInsertStats(notMatchedObjects);

      // To Update the already existed stats
      await this.revenueStatsHelpers.toUpdateStats(matchedObjects, revenueStatsData);

      // To update the process status
      const updateData = {
        process_status: COMPLETED
      }
      await this.revenueStatsService.updateRevenueRawProcessStatus(finalProcessedIds, updateData);

      return res.status(200).json({
        success: true,
        message: PROCESS_SUCCESS,
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

  @Post('individual')
  async getMarketerRevenueByManeger(
    @Body() reqBody: ManagerIndividualDto,
    @Res() res: any
  ) {
    try {
      const orderBy = reqBody.order_by || "total_amount";
      const orderType = reqBody.order_type || "desc";
      const managerId = reqBody.manager_id;
      const fromDate = reqBody.from_date;
      const toDate = reqBody.to_date;
      const marketerIds = reqBody.marketer_ids || [];

      if (toDate < fromDate) {
        return res.status(400).json({
          success: false,
          message: NOT_LESSER
        })
      };

      let marketersIdsArray = [];
      if (!marketerIds.length) {
        marketersIdsArray = await this.statsHelper.getUsersData(managerId);
      } else {
        marketersIdsArray = marketerIds;
      };
      const statsQuery = this.filterHelper.hospitalWiseMarketers(fromDate, toDate, marketerIds, marketersIdsArray)
      const dataArray = await this.revenueStatsHelpers.forHospitalWiseData(orderBy, orderType, statsQuery);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: dataArray
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post('combined')
  async getMarketersRevenueStatsByManager(
    @Body() reqBody: ManagerCombinedDto,
    @Res() res: any) {
    try {

      const orderBy = reqBody.order_by || "total_amount";
      const orderType = reqBody.order_type || "desc";
      const managerId = reqBody.manager_id;
      const fromDate = reqBody.from_date;
      const toDate = reqBody.to_date;
      const marketerIds = reqBody.marketer_ids || [];

      if (toDate < fromDate) {
        return res.status(400).json({
          success: false,
          message: NOT_LESSER
        })
      };


      let statsQuery;
      if (managerId && marketerIds.length == 0) {
        const marketersIdsArray = await this.statsHelper.getUsersData(managerId);

        statsQuery = {
          hospital_marketers: marketersIdsArray
        };
      } else {
        statsQuery = {
          hospital_marketers: marketerIds
        };
      };

      let finalStatsQuery: any = this.filterHelper.revenueStats(statsQuery, fromDate, toDate);
      let sort = {}
      if (orderBy && orderType) {
        sort = this.sortHelper.stats(orderBy, orderType);
      }

      let statsData = await this.revenueStatsService.marketers(finalStatsQuery, sort);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: statsData
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    };
  };

  @Post('volume-stats/combined')
  async revenueAndVolumeStatsCombined(
    @Body() reqBody: ManagerCombinedDto,
    @Res() res: any) {
    try {
      let orderBy = reqBody.order_by || total_amount;
      const orderType = reqBody.order_type || "desc";
      const managerId = reqBody.manager_id;
      const fromDate = reqBody.from_date;
      const toDate = reqBody.to_date;
      const marketerIds = reqBody.marketer_ids || [];

      if (toDate < fromDate) {
        return res.status(400).json({
          success: false,
          message: NOT_LESSER
        })
      };


      let statsQuery;
      if (managerId && marketerIds.length == 0) {
        const marketersIdsArray = await this.statsHelper.getUsersData(managerId);

        statsQuery = {
          hospital_marketers: marketersIdsArray
        };
      } else {
        statsQuery = {
          hospital_marketers: marketerIds
        };
      };

      const finalRevenueStatsQuery: any = this.filterHelper.revenueStats(statsQuery, fromDate, toDate);

      const finalVolumeStatsQuery: any = this.filterHelper.stats(statsQuery, fromDate, toDate);

      let sort = {};
      if (orderBy && orderType) {
        sort = this.sortHelper.stats(orderBy, orderType);

      }

      const revenueStatsData = await this.revenueStatsService.marketers(finalRevenueStatsQuery, sort);

      if (orderBy && orderType) {
        orderBy = total_cases;
        sort = this.sortHelper.stats(orderBy, orderType);
      }

      const volumeStatsData = await this.statsServive.marketers(finalVolumeStatsQuery, sort);

      const mergedStats = this.revenueStatsHelpers.mergedStatsData(revenueStatsData, volumeStatsData)

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: mergedStats
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    };
  };

  @Post('monthly-graph')
  async monthWiseGraph(
    @Body() reqBody: ManagerCombinedDto,
    @Res() res: any) {
    try {

      const orderBy = reqBody.order_by || "total_amount";
      const orderType = reqBody.order_type || "desc";
      const managerId = reqBody.manager_id;
      const fromDate = reqBody.from_date;
      const toDate = reqBody.to_date;
      const marketerIds = reqBody.marketer_ids || [];

      if (toDate < fromDate) {
        return res.status(400).json({
          success: false,
          message: NOT_LESSER
        })
      };


      let statsQuery;
      if (managerId && marketerIds.length == 0) {
        const marketersIdsArray = await this.statsHelper.getUsersData(managerId);

        statsQuery = {
          hospital_marketers: marketersIdsArray
        };
      } else {
        statsQuery = {
          hospital_marketers: marketerIds
        };
      };

      let finalStatsQuery: any = this.filterHelper.revenueStats(statsQuery, fromDate, toDate);

      let statsData = await this.revenueStatsService.marketersMonthWise(finalStatsQuery);

      return res.status(200).json({
        success: true,
        message: MONTHLY_STATS_SUCCESS,
        data: statsData
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    };
  };


  @Post('case-type-graph')
  async caseTypeWiseGraph(
    @Body() reqBody: ManagerCombinedDto,
    @Res() res: any) {
    try {
      const managerId = reqBody.manager_id;
      const fromDate = reqBody.from_date;
      const toDate = reqBody.to_date;
      const marketerIds = reqBody.marketer_ids || [];

      const statsQuery = await this.statsHelper.statsQueryBuilder(toDate, fromDate, res, managerId, marketerIds);

      let finalStatsQuery: any = this.filterHelper.revenueStats(statsQuery, fromDate, toDate);

      let statsData: any = await this.revenueStatsService.findAll(finalStatsQuery);

      const groupedArray = await this.revenueStatsHelpers.groupRevenueStatsData(statsData);

      return res.status(200).json({
        success: true,
        message: CASE_STATS_SUCCESS,
        data: groupedArray
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    };
  };



  @Post('volume-stats/individual')
  async revenueAndVolumeStatsIndividual(
    @Body() reqBody: ManagerIndividualDto,
    @Res() res: any
  ) {
    try {
      const orderBy = reqBody.order_by || "total_amount";
      const orderType = reqBody.order_type || "desc";
      const managerId = reqBody.manager_id;
      const fromDate = reqBody.from_date;
      const toDate = reqBody.to_date;
      const marketerIds = reqBody.marketer_ids || [];

      if (toDate < fromDate) {
        return res.status(400).json({
          success: false,
          message: NOT_LESSER
        })
      };

      let marketersIdsArray = [];
      if (!marketerIds.length) {
        marketersIdsArray = await this.statsHelper.getUsersData(managerId);
      } else {
        marketersIdsArray = marketerIds;
      };
      const revenueStatsQuery = this.filterHelper.hospitalWiseMarketers(fromDate, toDate, marketerIds, marketersIdsArray)
      const revenueStatsData = await this.revenueStatsHelpers.forHospitalWiseData(orderBy, orderType, revenueStatsQuery);

      const volumeStatsQuery = this.filterHelper.hospitalWiseMarketers(fromDate, toDate, marketerIds, marketersIdsArray)

      const volumeStatsData = await this.statsHelper.forHospitalWiseData(orderBy, orderType, volumeStatsQuery);

      const mergedStats = this.revenueStatsHelpers.mergeIndividualVolumeAndRevenueStats(revenueStatsData, volumeStatsData)

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        mergedStats
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    }
  }


  @Post('test-wise')
  async testWiseVolumeAndRevenueStats(
    @Body() reqBody: ManagerCombinedDto,
    @Res() res: any
  ) {
    try {
      const orderBy = reqBody.order_by || "total_amount";
      const orderType = reqBody.order_type || "desc";
      const managerId = reqBody.manager_id;
      const fromDate = reqBody.from_date;
      const toDate = reqBody.to_date;
      const marketerIds = reqBody.marketer_ids || [];

      if (toDate < fromDate) {
        return res.status(400).json({
          success: false,
          message: NOT_LESSER
        })
      };

      let marketersIdsArray = [];
      if (managerId && marketerIds.length == 0) {
        marketersIdsArray = await this.statsHelper.getUsersData(managerId);
      } else {
        marketersIdsArray = marketerIds;
      };

      const revenueStatsQuery = this.filterHelper.hospitalWiseMarketers(fromDate, toDate, marketerIds, marketersIdsArray)
      const revenueStatsData = await this.revenueStatsHelpers.forHospitalWiseData(orderBy, orderType, revenueStatsQuery);

      const volumeStatsQuery = this.filterHelper.hospitalWiseMarketers(fromDate, toDate, marketerIds, marketersIdsArray)

      const volumeStatsData = await this.statsHelper.forHospitalWiseData(orderBy, orderType, volumeStatsQuery);

      const mergedStats = this.revenueStatsHelpers.mergeIndividualVolumeAndRevenueStats(revenueStatsData, volumeStatsData)

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        mergedStats
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    }
  }

  async prepareRawData(processedData) {

    const finalProcessedData = processedData.map(obj => {
      // Using destructuring to create a new object without the specified key
      const { ["raw_id"]: deletedKey, ...newObject } = obj;
      return newObject;
    });

    // get the revenue stats data based on the marketer_id and date
    const revenueStatsData = await this.getAlreadyExistedData(finalProcessedData);

    // Separating the existed and not existed revenue stats based on the abode revenueStatsData
    let { matchedObjects, notMatchedObjects } = await this.seperateExistedAndNotExistedData(finalProcessedData, revenueStatsData);

    return { matchedObjects, notMatchedObjects, revenueStatsData };
  }


  async getAlreadyExistedData(finalProcessedData) {
    const someData = finalProcessedData.map(obj => {
      // Using object destructuring to extract only the specified fields
      const { marketer_id, date } = obj;
      return { marketer_id, date };
    })

    const queryString: any = {
      OR: someData.map(item => ({
        AND: [
          { marketer_id: item.marketer_id },
          { date: new Date(item.date) }, // Assuming 'date' is stored as a Date in the database
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
