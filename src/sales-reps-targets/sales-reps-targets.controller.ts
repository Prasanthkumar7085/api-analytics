import { Body, Controller, Get, Param, Patch, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SALES_REPS_TARGET_DATA_NOT_FOUND, SALES_REPS_TARGET_DATA_UPDATED_SUCCESS, SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REPS_TARGET_DATA } from 'src/constants/messageConstants';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterHelper } from 'src/helpers/filterHelper';
import { EmailServiceProvider } from 'src/notifications/emailServiceProvider';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { UpdateSalesRepTargetsDto } from './dto/update-sales-reps-target.dto';
import { SalesRepsTargetsService } from './sales-reps-targets.service';
import * as ejs from 'ejs';
import { salesRepsTargetsTemplate } from 'src/views/email-templates/sales-reps-targets';
import { monthlyTargetsUpdateTemplate } from 'src/views/email-templates/montly-sales-targets-update-template';



@Controller(
  {
    version: '1.0',
    path: 'sales-reps-monthly-targets'
  })

export class SalesRepsTargetsController {
  constructor(
    private readonly salesRepsTargetsService: SalesRepsTargetsService,
    private readonly filterHelper: FilterHelper,
    private readonly salesRepService: SalesRepService,
    private readonly emailServiceProvider: EmailServiceProvider,

  ) { }
  @UseGuards(AuthGuard)
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

  @Patch(':id')
  async update(
    @Res() res: any,
    @Param('id') id: number,
    @Body() updateSalesRepTargetDto: UpdateSalesRepTargetsDto) {
    try {

      const saleRepTargetData = await this.salesRepsTargetsService.getOneSalesRepTargetDataById(id);

      const salesRepData = await this.salesRepService.getOne(saleRepTargetData[0].salesRepId);

      if (saleRepTargetData.length === 0) {

        return res.status(404).json({
          success: false,
          message: SALES_REPS_TARGET_DATA_NOT_FOUND,
          data: saleRepTargetData

        });
      }

      await this.salesRepsTargetsService.updateSalesRepsTargets(id, updateSalesRepTargetDto);

      // if (!salesRepData[0].sales_rep_email) {
      //   throw new Error("Sales rep email is empty");
      // }

      let emailData = {
        email: "tharunampolu9.8@gmail.com",
        subject: `Monthly Sales Targets Updated -${saleRepTargetData[0].month}`,
      };

      delete updateSalesRepTargetDto.new_facilities;

      const caseTypes = Object.keys(updateSalesRepTargetDto); // Get all case types from the update DTO

      const updatedTargetsArray = caseTypes.map(caseType => ({
        caseType: caseType,
        oldTargets: saleRepTargetData[0][caseType], // Assuming the structure is consistent
        updatedTargets: updateSalesRepTargetDto[caseType]
      }));

      const emailContent = {
        emailContent: updatedTargetsArray,
        sales_rep_name: salesRepData[0].sales_rep

      };

      this.emailServiceProvider.sendSalesRepsTargetVolumeUpdateNotification(emailData, emailContent);

      const invoiceHtmlCode = ejs.render(monthlyTargetsUpdateTemplate, emailContent);

      res.status(200).send(invoiceHtmlCode);


      // return res.status(200).json({
      //   success: true,
      //   message: SALES_REPS_TARGET_DATA_UPDATED_SUCCESS,

      // });
    }
    catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: error || SOMETHING_WENT_WRONG
      });
    }
  }
}

