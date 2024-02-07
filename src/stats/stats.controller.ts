import { Body, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { NOT_LESSER, SOMETHING_WENT_WRONG, SUCCESS_COMPLETE, SUCCESS_DELETE, SUCCESS_MARKETERS, SUCCESS_PENDING, SUCCESS_RETREIVE } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { PaginationHelper } from 'src/helpers/paginationHelper';
import { SortHelper } from 'src/helpers/sortHelper';
import { StatsHelper } from 'src/helpers/statsHelper';
import seedStats from 'src/seeder/statsSeeder';
import { ManagerCombinedDto } from './dto/manager-combined.dto';
import { ManagerIndividualDto } from './dto/manager-individual';
import { StatsService } from './stats.service';


@Controller({
  version: '1.0',
  path: 'marketers-stats',
})
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly paginationHelper: PaginationHelper,
    private readonly filterHelper: FilterHelper,
    private readonly sortHelper: SortHelper,
    private readonly statsHelper: StatsHelper,
  ) { }

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

  @Post("case/pending")
  async addPending(@Body() createStatDto: any, @Res() res: any) {
    try {
      let reqBody = createStatDto;

      const marketerIds = reqBody.marketer_ids;
      const date = reqBody.date;

      let query = {
        date: {
          equals: date
        },
        marketer_id: {
          in: marketerIds
        }
      }

      let existedData = await this.statsService.findMany(query);

      let existedDataMarketerIds = existedData.map((e) => e.marketer_id);

      const notExistedMarketers = marketerIds.filter(item => !existedDataMarketerIds.includes(item));

      let data = await this.statsHelper.prepareDateForPending(notExistedMarketers, existedDataMarketerIds, existedData, reqBody);


      return res.status(200).json({
        success: true,
        message: SUCCESS_PENDING,
        data
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }


  @Post("case/complete/conform")
  async addCompleted(@Body() createStatDto: any, @Res() res: any) {
    try {
      let reqBody = createStatDto;

      const marketerIds = reqBody.marketer_ids;
      const date = reqBody.date;

      let query = {
        date: {
          equals: date
        },
        marketer_id: {
          in: marketerIds
        }
      }

      let existedData = await this.statsService.findMany(query);

      let modifiedDataArray = []
      for (let i = 0; i < marketerIds.length; i++) {
        const marketerObject = existedData.find((item) => item.marketer_id === marketerIds[i]);
        const modifiedData = this.statsHelper.prepareToUpdateComplete(marketerObject, reqBody);

        modifiedDataArray.push(modifiedData);

      }

      if (modifiedDataArray.length > 0) {
        const convertedData = modifiedDataArray.map(entry => {
          return `(${entry.id}, '${entry.marketer_id}', ${entry.total_cases}, ${entry.pending_cases}, ${entry.completed_cases}, ${entry.hospitals_count}, ARRAY[${entry.case_type_wise_counts.map(item => `'{"pending":${item.pending},"case_type":"${item.case_type}","completed":${item.completed}}'`)}]::jsonb[], ARRAY[${entry.hospital_case_type_wise_counts.map(item => `'{"cgx_panel":${item.cgx_panel},"pad_alzheimers":${item.pad_alzheimers},"pgx_test":${item.pgx_test},"uti":${item.uti},"nail":${item.nail},"covid":${item.covid},"wound":${item.wound},"gastro":${item.gastro},"cardiac":${item.cardiac},"diabetes":${item.diabetes},"hospital":"${item.hospital}","covid_flu":${item.covid_flu},"pulmonary_panel":${item.pulmonary_panel},"toxicology":${item.toxicology},"urinalysis":${item.urinalysis},"clinical_chemistry":${item.clinical_chemistry},"respiratory_pathogen_panel":${item.respiratory_pathogen_panel},"gti_sti":${item.gti_sti},"gti_womens_health":${item.gti_womens_health}}'`)}]::jsonb[])`
        });

        const finalString = convertedData.join(',');

        await this.statsService.updateMany(finalString)
      }

      return res.status(200).json({
        success: true,
        message: SUCCESS_COMPLETE
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post("case/complete/retrieve")
  async addRetrieve(@Body() createStatDto: any, @Res() res: any) {
    try {
      let reqBody = createStatDto;

      const marketerIds = reqBody.marketer_ids;
      const date = reqBody.date;

      let query = {
        date: {
          equals: date
        },
        marketer_id: {
          in: marketerIds
        }
      }

      let existedData = await this.statsService.findMany(query);



      let modifiedDataArray = []
      for (let i = 0; i < marketerIds.length; i++) {
        const marketerObject = existedData.find((item) => item.marketer_id === marketerIds[i]);

        const modifiedData = this.statsHelper.prepareToUpdateRetrive(marketerObject, reqBody);
        modifiedDataArray.push(modifiedData);
      }

      if (modifiedDataArray.length > 0) {
        const convertedData = modifiedDataArray.map(entry => {
          return `(${entry.id}, '${entry.marketer_id}', ${entry.total_cases}, ${entry.pending_cases}, ${entry.completed_cases}, ${entry.hospitals_count}, ARRAY[${entry.case_type_wise_counts.map(item => `'{"pending":${item.pending},"case_type":"${item.case_type}","completed":${item.completed}}'`)}]::jsonb[], ARRAY[${entry.hospital_case_type_wise_counts.map(item => `'{"cgx_panel":${item.cgx_panel},"pad_alzheimers":${item.pad_alzheimers},"pgx_test":${item.pgx_test},"uti":${item.uti},"nail":${item.nail},"covid":${item.covid},"wound":${item.wound},"gastro":${item.gastro},"cardiac":${item.cardiac},"diabetes":${item.diabetes},"hospital":"${item.hospital}","covid_flu":${item.covid_flu},"pulmonary_panel":${item.pulmonary_panel},"toxicology":${item.toxicology},"urinalysis":${item.urinalysis},"clinical_chemistry":${item.clinical_chemistry},"respiratory_pathogen_panel":${item.respiratory_pathogen_panel},"gti_sti":${item.gti_sti},"gti_womens_health":${item.gti_womens_health}}'`)}]::jsonb[])`
        });

        const finalString = convertedData.join(',');

        await this.statsService.updateMany(finalString)
      }



      return res.status(200).json({
        success: true,
        message: SUCCESS_RETREIVE,
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
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
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Delete(":id")
  async delete(@Param('id') id: number, @Res() res: any) {
    try {
      let deleteData = await this.statsService.remove(id)
      return res.status(200).json({
        success: true,
        message: SUCCESS_DELETE,
        data: deleteData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Post("combined")
  async getMarketersStatsByManager(
    @Body() reqBody: ManagerCombinedDto,
    @Res() res: any) {
    try {

      const orderBy = reqBody.order_by || "total_cases";
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

      let finalStatsQuery: any = this.filterHelper.stats(statsQuery, fromDate, toDate);

      let sort = {}
      if (orderBy && orderType) {
        sort = this.sortHelper.stats(orderBy, orderType);
      }

      let statsData = await this.statsService.marketers(finalStatsQuery, sort);

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


  @Post("individual")
  async getMarketersHopitalsStatsByManager(
    @Body() reqBody: ManagerIndividualDto,
    @Res() res: any
  ) {
    try {
      const orderBy = reqBody.order_by || "total_cases";
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

      const dataArray = await this.statsHelper.forHospitalWiseData(orderBy, orderType, statsQuery);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: dataArray
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }


}
