import { StatsHelper } from 'src/helpers/statsHelper';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DELETE_REVENUE_RAW, FILE_UPLOAD, NOT_LESSER, PROCESS_SUCCESS, REVENUE_MODIFIED_DATA, REVENUE_STATS, REVENUE_STAT_SINGLE, SOMETHING_WENT_WRONG, SUCCESS_MARKETERS } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';
import { RevenueStatsService } from './revenue-stats.service';
import { CustomError } from 'src/middlewares/customValidationMiddleware';
import { ManagerCombinedDto } from 'src/stats/dto/manager-combined.dto';
import { SortHelper } from 'src/helpers/sortHelper';

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

      const { matchedObjects, notMatchedObjects } = await this.revenueStatsHelpers.checkAlreadyExisted(finalModifiedData);


      if (notMatchedObjects.length > 0) {
        // const saveDataInDb = await this.revenueStatsService.saveDataInDb(finalModifiedData);
      }

      if (matchedObjects.length > 0) {

        const convertedData = matchedObjects.map(entry => {
          const formattedCptCodes = entry.cpt_codes.map(code => `'${code}'`).join(', ');
          const formattedLineItemTotal = entry.line_item_total.map(total => `'${total}'`).join(', ');
          const formattedInsurancePaymentAmount = entry.insurance_payment_amount.map(total => `'${total}'`).join(', ');
          const formattedInsuranceAdjustmentAmount = entry.insurance_adjustment_amount.map(total => `'${total}'`).join(', ');
          const formattedInsuranceWriteOfAmount = entry.insurance_write_of_amount.map(total => `'${total}'`).join(', ');
          const formattedPatientPaymentAmount = entry.patient_payment_amount.map(total => `'${total}'`).join(', ');
          const formattedPatientAdjustmentAmount = entry.patient_adjustment_amount.map(total => `'${total}'`).join(', ');
          const formattedPatientWriteOfAmount = entry.patient_write_of_amount.map(total => `'${total}'`).join(', ');;
          const formattedLineItemBalance = entry.line_item_balance.map(total => `'${total}'`).join(', ');

          console.log(`('${entry.case_id}', '${entry.hospital}', '${entry.accession_id}', ARRAY[${formattedCptCodes}]::jsonb[], ARRAY[${formattedLineItemTotal}]::jsonb[], ARRAY[${formattedInsurancePaymentAmount}]::jsonb[], ARRAY[${formattedInsuranceAdjustmentAmount}]::jsonb[], ARRAY[${formattedInsuranceWriteOfAmount}]::jsonb[], ARRAY[${formattedPatientPaymentAmount}]::jsonb[], ARRAY[${formattedPatientAdjustmentAmount}]::jsonb[], ARRAY[${formattedPatientWriteOfAmount}]::jsonb[], ARRAY[${formattedLineItemBalance}]::jsonb[], '${entry.insurance_name}', ${entry.total_amount}, ${entry.paid_amount}, ${entry.pending_amount}, ${entry.difference_values.total_amount_difference}, ${entry.difference_values.paid_amount_difference}, ${entry.difference_values.pending_amount_difference}, ${entry.values_changed})`)
          return `('${entry.case_id}', '${entry.hospital}', '${entry.accession_id}', ARRAY[${formattedCptCodes}]::jsonb[], ARRAY[${formattedLineItemTotal}]::jsonb[], ARRAY[${formattedInsurancePaymentAmount}]::jsonb[], ARRAY[${formattedInsuranceAdjustmentAmount}]::jsonb[], ARRAY[${formattedInsuranceWriteOfAmount}]::jsonb[], ARRAY[${formattedPatientPaymentAmount}]::jsonb[], ARRAY[${formattedPatientAdjustmentAmount}]::jsonb[], ARRAY[${formattedPatientWriteOfAmount}]::jsonb[], ARRAY[${formattedLineItemBalance}]::jsonb[], '${entry.insurance_name}', ${entry.total_amount}, ${entry.paid_amount}, ${entry.pending_amount}, ${entry.difference_values.total_amount_difference}, ${entry.difference_values.paid_amount_difference}, ${entry.difference_values.pending_amount_difference}, ${entry.values_changed})`;
        });
        const finalString = convertedData.join(',');

        this.revenueStatsService.updateManyRaw(finalString);
      }

      return res.status(200).json({
        success: true,
        message: FILE_UPLOAD,
        matchedObjects,
        notMatchedObjects
        // saveDataInDb

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

  @Post('individual')
  async getMarketerRevenueByManeger(
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

    const queryString: any = {
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
