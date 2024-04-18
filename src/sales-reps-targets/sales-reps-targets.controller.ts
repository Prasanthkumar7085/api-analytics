import { Body, Controller, Get, Patch, Post, Query, Res } from '@nestjs/common';
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

      const saleRepsTargetData = await this.salesRepsTargetsService.getAllSalesRepsTargets();

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REPS_TARGET_DATA,
        data: saleRepsTargetData
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
    @Res() res: any,
    @Body() body: any,
    @Query() query: any) {
    try {

      const randomIndex = Math.floor(Math.random() * salesRepsTargets.length);

      const randomId = salesRepsTargets[randomIndex]._id;

      let data = {
        ...body,
        created_at: new Date(),
        updated_at: new Date(),
        _id: randomId

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

