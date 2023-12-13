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

@Controller({
  version: '1.0',
  path: 'stats',
})
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly paginationHelper: PaginationHelper,
    private readonly filterHelper: FilterHelper
  ) { }

  @Get("marketers")
  async findAll(@Req() req: any, @Res() res: any) {
    try {

      let page = req.query.page || 1;
      let limit = req.query.limit || 100;
      let orderBy = req.query.order_by || "date";
      let orderType = req.query.order_type || "desc";

      let skip = (page - 1) * limit;

      const sort = {
        [orderBy]: orderType
      }

      let query: any = this.filterHelper.stats(req.query)

      const select = {
        marketer_id: true,
        total_cases: true,
        pending_cases: true,
        completed_cases: true,
        hospitals_count: true,
        date: true
      }
      
      const [statsData, count] = await Promise.all([
        await this.statsService.findAll({ query, select, skip, limit, sort }),
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

  @Get("marketers-case-type")
  getMarketersByCaseTypes(@Res() res: any) {
    try {
      const filePath = path.resolve(__dirname, '../../../src/stats/responses/allMarketersCaseType.json');
      let data = fs.readFileSync(filePath, "utf8")

      const parsedData = JSON.parse(data);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: parsedData
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(":marketer_id")
  singleMarketer(@Res() res: any) {
    try {
      const filePath = path.resolve(__dirname, '../../../src/stats/responses/singleMarketer.json');
      let data = fs.readFileSync(filePath, "utf8")

      const parsedData = JSON.parse(data);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: parsedData
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post("")
  async add(@Body() createStatDto: CreateStatDto, @Res() res: any) {
    try {
      let reqBody = createStatDto;

      console.log(reqBody);

      let insertedData = await this.statsService.create(reqBody)

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
}
