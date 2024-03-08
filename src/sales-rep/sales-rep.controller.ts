import { Controller, Get, Post, Body, Patch, Param, Delete, Res, NotFoundException, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';

@Controller({ version: '3.0', path: 'sales-reps' })
export class SalesRepController {
  constructor(private readonly salesRepService: SalesRepService) { }

  @Get()
  async getSalesRepStatsRevenue(
    @Res() res: any
  ) {
    try {
      const data = await this.salesRepService.getSalesRep();

      return res.status(200).json(data)

    }
    catch (error) {

      return res.status(500).json({ success: false, error: error.message })
    }
  }
  @Get('insurance')
  async getInsurance(
    @Res() res: any
  ) {
    try {
      const data = await this.salesRepService.getInsurance();

      return res.status(200).json(data)

    }
    catch (error) {

      return res.status(500).json({ success: false, error: error.message })
    }
  }
  @Get('facilities')
  async getFacilities(
    @Res() res: any
  ) {
    try {

      const data = await this.salesRepService.getFacilities();
      return res.status(200).json(data)
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  }
  @Get('case-types')
  async getCaseTypes(
    @Res() res: any
  ) {
    try {

      const data = await this.salesRepService.getCaseTypes();
      return res.status(200).json(data)


    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  }
  @Get('patient-claims')
  async getSalesRepPatientClaims(
    @Res() res: any
  ) {
    try {

      const data = await this.salesRepService.getSalesRepPatientClaims();
      return res.status(200).json(data)


    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  }



  @Get(':id/stats-revenue')
  async getStatsRevenue(@Res() res: any, @Param('id') id: any, @Query() query: any) {
    try {
      const data = await this.salesRepService.getStatsRevenue(id, query)

      return res.status(200).json({ success: true, message: 'Stats revenue Fetched Successfully', data: data })
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ success: false, message: error.message })

      }
      return res.status(500).json({ success: false, error: error.message })
    }
  }




  @Get(':id/insurance-payors')
  async getInsurancePayers(
    @Res() res: any, @Param('id') id: number, @Query() query: any
  ) {
    try {

      const data = await this.salesRepService.getInsurancePayers(id, query)

      return res.status(200).json({ success: true, message: 'Insurance payers data Fetched Successfully', data: data })

    }
    catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ success: false, message: error.message })

      }
      return res.status(500).json({ success: false, error: error.message })
    }
  }

}
