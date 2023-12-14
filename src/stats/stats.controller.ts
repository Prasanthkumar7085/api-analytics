import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { SOMETHING_WENT_WRONG, SUCCESS_MARKETERS } from 'constants/messageConstants';
import * as fs from 'fs';
import * as path from 'path';
import seedStats from 'src/seeder/statsSeeder';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SortHelper } from 'src/helpers/sortHelper';
import { prepareCaseTypeCounts, prepareHospitalWiseCounts } from 'src/constants/statsConstants';


@Controller({
  version: '1.0',
  path: 'marketers-stats',
})
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly paginationHelper: PaginationHelper,
    private readonly filterHelper: FilterHelper,
    private readonly sortHelper: SortHelper
  ) { }

  @Get(":from_date/:to_date")
  async findAll(@Param('from_date') from_date: any, @Param('to_date') to_date: any, @Req() req: any, @Res() res: any) {
    try {
      const orderBy = req.query.order_by;
      const orderType = req.query.order_type;

      if (to_date < from_date) {
        return res.status(400).json({
          success: false,
          message: "To-Date is not be lesser than From-Date"
        })
      }

      let query: any = this.filterHelper.stats(req.query, from_date, to_date)

      let sort = {}
      if (orderBy && orderType) {
        sort = this.sortHelper.stats(orderBy, orderType)
      }

      let statsData = await this.statsService.marketers(query, sort);


      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: statsData

      });

    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get("case-type")
  async getMarketersByCaseTypes(@Req() req: any, @Res() res: any) {
    try {

      let page = req.query.page || 1;
      let limit = req.query.limit || 100;
      let orderBy = req.query.order_by || "date";
      let orderType = req.query.order_type || "desc";

      let skip = (page - 1) * limit;

      const sort = {
        [orderBy]: orderType
      }

      let query: any = this.filterHelper.caseWiseMarketers(req.query)

      const select = {
        marketer_id: true,
        date: true,
        case_type_wise_counts: true,
      }

      const [statsData, count]: any = await Promise.all([
        await this.statsService.caseWiseCounts({ query, select, skip, limit, sort }),
        await this.statsService.countStats(query),
      ]);

      const response = this.paginationHelper.getPaginationResponse({
        page: +req.query.page || 1,
        count,
        limit,
        skip,
        data: statsData,
        message: SUCCESS_MARKETERS,
        searchString: req.query.search_string,
      });


      return res.status(200).json(response);

    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(":marketer_id/:from_date/:to_date")
  async singleMarketer(
    @Param('marketer_id') marketer_id: any,
    @Param('from_date') fromDate: any,
    @Param('to_date') toDate: any,
    @Req() req: any,
    @Res() res: any) {

    try {
      let orderBy = req.query.order_by;
      let orderType = req.query.order_type;

      if (toDate < fromDate) {
        return res.status(400).json({
          success: false,
          message: "To-Date is not be lesser than From-Date"
        })
      }

      const query = this.filterHelper.hospitalWiseMarketers(fromDate, toDate, marketer_id)

      let statsData: any = await this.statsService.findAll(query);

      const result = {};

      statsData.forEach((entry) => {
        entry.hospital_case_type_wise_counts.forEach((hospitalData) => {
          const hospitalId = hospitalData.hospital;

          if (!result[hospitalId]) {
            // Initialize if not exists
            result[hospitalId] = { hospital: hospitalId, ...hospitalData };
          } else {
            // Sum values
            Object.keys(hospitalData).forEach((key) => {
              if (key !== 'hospital') {
                result[hospitalId][key] += hospitalData[key];
              }
            });
          }
        });
      });

      let dataArray = Object.values(result);

      dataArray = this.sortHelper.hospitalWise(orderBy, orderType, dataArray)


      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: dataArray
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post("case/pending")
  async addPending(@Body() createStatDto: CreateStatDto, @Res() res: any) {
    try {
      let reqBody = createStatDto;

      let query = {
        date: {
          equals: reqBody.date
        },
        marketer_id: {
          equals: reqBody.marketer_id
        }
      }

      let existedData = await this.statsService.findOne(query);

      let insertedData;
      if (!existedData) {
        const modifiedData = this.prepareToInsertData(reqBody)

        insertedData = await this.statsService.create(modifiedData)

      } else {
        const modifiedData = this.prepareDataToUpdate(existedData, reqBody);

        insertedData = await this.statsService.update(existedData?.id, modifiedData)

      }

      return res.status(200).json({
        success: true,
        message: "Successfully Inserted Stat",
        data: insertedData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || "Something Went Wrong"
      })
    }
  }


  @Post("case/complete/conform")
  async addCompleted(@Body() createStatDto: CreateStatDto, @Res() res: any) {
    try {
      let reqBody = createStatDto;

      let query = {
        date: {
          equals: reqBody.date
        },
        marketer_id: {
          equals: reqBody.marketer_id
        }
      }

      let existedData = await this.statsService.findOne(query);

      if (!existedData) {
        return res.status(404).json({
          success: false,
          message: "Stat is not existed to update complete stats"
        })

      }

      const modifiedData = this.prepareToUpdateComplete(existedData, reqBody);

      const insertedData = await this.statsService.update(existedData?.id, modifiedData)


      return res.status(200).json({
        success: true,
        message: "Successfully Inserted Stat",
        data: insertedData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || "Something Went Wrong"
      })
    }
  }

  @Post("case/complete/retrieve")
  async addRetrieve(@Body() createStatDto: CreateStatDto, @Res() res: any) {
    try {
      let reqBody = createStatDto;

      let query = {
        date: {
          equals: reqBody.date
        },
        marketer_id: {
          equals: reqBody.marketer_id
        }
      }

      let existedData = await this.statsService.findOne(query);

      if (!existedData) {
        return res.status(404).json({
          success: false,
          message: "Stat is not existed to update retrive stats"
        })

      }

      const modifiedData = this.prepareToUpdateRetrive(existedData, reqBody);

      const insertedData = await this.statsService.update(existedData?.id, modifiedData)


      return res.status(200).json({
        success: true,
        message: "Successfully Inserted Stat",
        data: insertedData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || "Something Went Wrong"
      })
    }
  }

  @Post("seed")
  async seedStats(@Res() res: any) {
    try {

      const fromDate = "2023-06-01"
      const toDate = "2023-12-12"

      let fakeData = seedStats(fromDate, toDate)


      let inserted = await this.statsService.insertMany({
        data: fakeData
      })


      return res.status(200).json({
        success: true,
        message: "Successfully Seeded Stats",
        data: inserted
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || "Something Went Wrong"
      })
    }
  }

  @Delete(":id")
  async delete(@Param('id') id: number, @Res() res: any) {
    try {
      let deleteData = await this.statsService.remove(id)
      return res.status(200).json({
        success: true,
        message: "Successfully Deleted Stat",
        data: deleteData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || "Something Went Wrong"
      })
    }
  }

  prepareToInsertData(reqBody) {
    let prepareNewData: any = {};
    prepareNewData = {
      marketer_id: reqBody.marketer_id,
      date: reqBody.date,
      case_type_wise_counts: prepareCaseTypeCounts,
      hospital_case_type_wise_counts: [prepareHospitalWiseCounts]
    }

    const indexToUpdate = prepareNewData.case_type_wise_counts.findIndex(
      (item) => item.case_type === reqBody.case_type.toUpperCase()
    );

    // If the case type is found, increment the counts
    if (indexToUpdate !== -1) {
      prepareNewData.case_type_wise_counts[indexToUpdate].pending++; // You can adjust the increment as needed
    }


    const caseTypeObject = prepareNewData.hospital_case_type_wise_counts.find(obj => obj.hasOwnProperty(reqBody.case_type.toLowerCase()));
    if (caseTypeObject) {
      caseTypeObject[reqBody.case_type.toLowerCase()]++;
      caseTypeObject["hospital"] = reqBody.hospital_id
    }

    prepareNewData.total_cases = 1;
    prepareNewData.pending_cases = 1;
    prepareNewData.completed_cases = 0;

    prepareNewData.hospitals_count = prepareNewData.hospital_case_type_wise_counts.length

    return prepareNewData;
  }

  prepareDataToUpdate(existedData, reqBody) {

    const indexToUpdate = existedData.case_type_wise_counts.findIndex(
      (item) => item.case_type === reqBody.case_type.toUpperCase()
    );

    // If the case type is found, increment the counts
    if (indexToUpdate !== -1) {
      existedData.case_type_wise_counts[indexToUpdate].pending++; // You can adjust the increment as needed
    }

    const hospitalObject = existedData.hospital_case_type_wise_counts.find(obj => obj.hospital === reqBody.hospital_id);

    if (hospitalObject) {
      hospitalObject[reqBody.case_type.toLowerCase()]++; // Increment the "covid" count by 1
    } else {
      let hospitalData = prepareHospitalWiseCounts
      hospitalData[reqBody.case_type.toLowerCase()]++;
      hospitalData["hospital"] = reqBody.hospital_id;
      existedData.hospital_case_type_wise_counts.push(hospitalData)
    }

    existedData.total_cases++;
    existedData.pending_cases++;

    existedData.hospitals_count = existedData.hospital_case_type_wise_counts.length

    return existedData;

  }

  prepareToUpdateComplete(existedData, reqBody) {
    const indexToUpdate = existedData.case_type_wise_counts.findIndex(
      (item) => item.case_type === reqBody.case_type.toUpperCase()
    );

    // If the case type is found, increment the counts
    if (indexToUpdate !== -1) {
      existedData.case_type_wise_counts[indexToUpdate].completed++; // You can adjust the increment as needed
      existedData.case_type_wise_counts[indexToUpdate].pending--;
    }

    existedData.pending_cases--;
    existedData.completed_cases++;

    existedData.total_cases = existedData.pending_cases + existedData.completed_cases;

    return existedData;

  }

  prepareToUpdateRetrive(existedData, reqBody) {
    const indexToUpdate = existedData.case_type_wise_counts.findIndex(
      (item) => item.case_type === reqBody.case_type.toUpperCase()
    );

    // If the case type is found, increment the counts
    if (indexToUpdate !== -1) {
      existedData.case_type_wise_counts[indexToUpdate].completed--; // You can adjust the increment as needed
      existedData.case_type_wise_counts[indexToUpdate].pending++;
    }

    existedData.pending_cases++;
    existedData.completed_cases--;

    existedData.total_cases = existedData.pending_cases + existedData.completed_cases;

    return existedData;

  }
}
