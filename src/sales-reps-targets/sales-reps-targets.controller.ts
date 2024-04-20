import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { salesRepsTargets } from 'sales-reps-targets';
import { SALES_REPS_TARGET_DATA_ADDED_SUCCESS, SALES_REPS_TARGET_DATA_NOT_FOUND, SALES_REPS_TARGET_DATA_SUMMARY_EMAIL_SENT_SUCCESS, SALES_REPS_TARGET_DATA_UPDATED_SUCCESS, SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REPS_TARGET_DATA } from 'src/constants/messageConstants';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
import { UpdateSalesRepTargetsDto } from './dto/update-sales-reps-target.dto';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { EmailServiceProvider } from 'src/notifications/emailServiceProvider';
import { FilterHelper } from 'src/helpers/filterHelper';


import { faker } from '@faker-js/faker';

@Controller(
  {
    version: '1.0',
    path: 'sales-reps-monthly-targets'
  })

export class SalesRepsTargetsController {
  constructor(
    private readonly salesRepsTargetsService: SalesRepsTargetsService,
    private readonly salesRepService: SalesRepService,
    private readonly emailServiceProvider: EmailServiceProvider,
    private readonly filterHelper: FilterHelper

  ) { }

  @Get()
  async getAll(
    @Res() res: any,
    @Req() req: Request,
    @Query() query: any) {
    try {

      const queryString = this.filterHelper.salesRepsTargets(query);
      const saleRepsTargetData = await this.salesRepsTargetsService.getAllSalesRepsTargets(queryString);

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
    @Res() res: any,
    @Param('id') id: number,
    @Body() updateSalesRepTargetDto: UpdateSalesRepTargetsDto) {
    try {

      const saleRepTargetData = await this.salesRepsTargetsService.getOneSalesRepTargetDataById(id);

      if (saleRepTargetData.length === 0) {

        return res.status(404).json({
          success: false,
          message: SALES_REPS_TARGET_DATA_NOT_FOUND,
          data: saleRepTargetData

        });
      }

      await this.salesRepsTargetsService.updateSalesRepsTargets(id, updateSalesRepTargetDto);

      return res.status(200).json({
        success: true,
        message: SALES_REPS_TARGET_DATA_UPDATED_SUCCESS,

      });
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      });
    }
  }
}

