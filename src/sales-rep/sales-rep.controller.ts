import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REP } from 'src/constants/messageConstants';

@Controller({
  version: '1.0',
  path: 'sales-rep',
})
export class SalesRepController {
  constructor(private readonly salesRepService: SalesRepService) { }

  @Post('')
  async getAllSalesRep(@Res() res: any) {
    try {

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }
}
