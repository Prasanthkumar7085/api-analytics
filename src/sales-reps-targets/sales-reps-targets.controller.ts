import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { salesRepsTargets } from 'sales-reps-targets';
import { SALES_REPS_TARGET_DATA_ADDED_SUCCESS, SALES_REPS_TARGET_DATA_NOT_FOUND, SALES_REPS_TARGET_DATA_SUMMARY_EMAIL_SENT_SUCCESS, SALES_REPS_TARGET_DATA_UPDATED_SUCCESS, SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REPS_TARGET_DATA } from 'src/constants/messageConstants';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
import { UpdateSalesRepTargetsDto } from './dto/update-sales-reps-target.dto';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { EmailServiceProvider } from 'src/notifications/emailServiceProvider';
@Controller(
  {
    version: '1.0',
    path: 'sales-reps-targets'
  })

export class SalesRepsTargetsController {
  constructor(
    private readonly salesRepsTargetsService: SalesRepsTargetsService,
    private readonly salesRepService: SalesRepService,
    private readonly emailServiceProvider: EmailServiceProvider

  ) { }

  @Get()
  async getAll(
    @Res() res: any,
    @Req() req: Request,
    @Query() query: any) {
    try {

      const saleRepsTargetData = await this.salesRepsTargetsService.getAllSalesRepsTargets(query.year);

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

  @Get('summary')
  async salesRepsTargetsSummary(
    @Res() res: any,
    @Query() query: any,
  ) {

    try {

      let targetYear: number;

      let targetMonth: string;

      if (query.year && query.modified) {
        targetYear = query.year;
        targetMonth = query.month;
      }

      const dateObject = new Date();

      const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];

      targetMonth = months[dateObject.getMonth()];

      targetYear = dateObject.getFullYear();

      const salesRepsData = await this.salesRepService.getAllSalesReps();

      const salesRepTargetData = await this.salesRepsTargetsService.getAllSalesRepsTargetsData();

      const modifiedData = salesRepsData.map(rep => {
        const target = salesRepTargetData.find(target => target.salesRepId === rep.id && target.year === targetYear);
        if (target) {
          return {
            sales_rep_id: rep.id,
            sales_rep_name: rep.name,
            email: rep.email,
            year: targetYear,
            month: targetMonth,
            target_volume: target[targetMonth][0],
            target_facilities: target[targetMonth][1],
            target_volume_reached: target[targetMonth][2],
            target_facilities_reached: target[targetMonth][3]
          };
        }
      });

      let subject = 'testing';
      const validModifiedData = modifiedData.filter(data => data && data.email);

      for (const data of validModifiedData) {
        const emailObject = {
          email: data.email,
          subject: subject
        };
        await this.emailServiceProvider.sendSalesRepsTargetSummaryReport(emailObject, data);
      }

 

      return res.status(200).json({
        success: true,
        message: SALES_REPS_TARGET_DATA_SUMMARY_EMAIL_SENT_SUCCESS,
        data: modifiedData

      });

    }
    catch (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }

}

