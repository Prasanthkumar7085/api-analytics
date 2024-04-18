import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { salesRepsTargets } from 'sales-reps-targets';
import { SALES_REPS_TARGET_DATA_ADDED_SUCCESS, SALES_REPS_TARGET_DATA_NOT_FOUND, SALES_REPS_TARGET_DATA_UPDATED_SUCCESS, SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REPS_TARGET_DATA } from 'src/constants/messageConstants';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
import { UpdateSalesRepTargetsDto } from './dto/update-sales-reps-target.dto';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
@Controller(
  {
    version: '1.0',
    path: 'sales-reps-targets'
  })

export class SalesRepsTargetsController {
  constructor(
    private readonly salesRepsTargetsService: SalesRepsTargetsService,
    private readonly salesRepService: SalesRepService,

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
  async salesRepsTargetsSummary(@Res() res: any,) {

    try {

      const month = 'feb';
      const year = 2023;

      const salesRepsData = await this.salesRepService.getAllSalesReps();

      const salesRepTargetData = await this.salesRepsTargetsService.getAllSalesRepsTargetsData();

      console.log(salesRepTargetData);


      const modifiedData = salesRepsData.map(rep => {
        const target = salesRepTargetData.find(target => target.salesRepId === rep.id && target.year === 2023);
        if (target) {
          return {
            sales_rep_id: rep.id,
            sales_rep_name: rep.name,
            email: rep.email,
            year: year,
            month: month,
            target_volume: target[month][0],
            target_facilities: target[month][1],
            target_volume_reached: target[month][2],
            target_facilities_reached: target[month][3]
          };
        }
      });

      let subject = 'testnig'
      let emailData = {
        email: ['tharunampolu9.8@gmail.com'],
        subject: subject,
      };
      // let emailData = await this.emailSendingDataToManagersAndPhysicians(caseData, accessionId, content)
      // if (emailData.email.length) {
      //   await new EmailServiceProvider().sendPatientReportFnaliizedEmail(
      //     emailData,
      //     emailContent
      //   );
      // }


      return res.status(200).json({
        success: true,
        message: SALES_REPS_TARGET_DATA_UPDATED_SUCCESS,
        data: modifiedData

      });

    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }

}

