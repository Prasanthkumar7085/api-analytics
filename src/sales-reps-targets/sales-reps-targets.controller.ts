import { Controller, Get, Patch, Post, Query, Res } from '@nestjs/common';
import { salesRepsTargets } from 'sales-reps-targets';
import { SALES_REPS_TARGET_DATA_ADDED_SUCCESS, SALES_REPS_TARGET_DATA_UPDATED_SUCCESS, SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REPS_TARGET_DATA } from 'src/constants/messageConstants';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
@Controller(
  {
    version: '1.0',
    path: 'sales-reps-targets'
  })

export class SalesRepsTargetsController {
  constructor(private readonly salesRepsTargetsService: SalesRepsTargetsService) { }


  @Get()
  async getAll(
    @Res() res: any, req: Request,
    @Query() query: any) {
    try {

      let filterData;

      if (query.from_date && query.to_date) {

        var startDate = new Date(query.from_date);
        var endDate = new Date(query.to_date);

        filterData = salesRepsTargets.filter(entry => {
          const date = new Date(entry.target_end_date);
          return (date >= startDate && date <= endDate);
        });

      }
      else {
        filterData = salesRepsTargets;
      }

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REPS_TARGET_DATA,
        data: filterData
      });
    }
    catch (error) {
      console.log({ error });

      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      });
    }
  }


  @Post()
  async add(
    @Res() res: any, req: Request,
    @Query() query: any) {
    try {

      const data = {

        "sales_rep": "Chester Boyle",
        "volume": 97,
        "facilities": 63,
        "target_start_date": "2024-02-17",
        "target_end_date": "2024-03-04",
        "created_at": "2024-04-08T18:33:36.327Z",
        "updated_at": "2024-04-15T13:03:52.555Z"

      };
      return res.status(200).json({
        success: true,
        message: SALES_REPS_TARGET_DATA_ADDED_SUCCESS,
        data

      });
    }
    catch (error) {
      console.log({ error });

      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      });
    }
  }

  @Patch(':id')
  async update(
    @Res() res: any, req: Request,
    @Query() query: any) {
    try {


      return res.status(200).json({
        success: true,
        message: SALES_REPS_TARGET_DATA_UPDATED_SUCCESS,

      });
    }
    catch (error) {
      console.log({ error });

      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      });
    }
  }


}

