import { SalesRep } from './../sales-rep-v3/entities/sales-rep.entity';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { CaseTypesV3Service } from './case-types-v3.service';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_CASE_TYPES } from 'src/constants/messageConstants';

@Controller({
  version: '3.0',
  path: 'case-types'
})
export class CaseTypesV3Controller {
  constructor(
    private readonly caseTypesV3Service: CaseTypesV3Service,
    private readonly filterHelper: FilterHelper

  ) { }

  @Get()
  async getCaseTypeStats(@Res() res: any, @Query() query: any) {
    try {
      const queryString = await this.filterHelper.facilitiesDateFilter(query);

      const data = await this.caseTypesV3Service.getCaseTypeStats(queryString);

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_CASE_TYPES,
        data: data
      })


    }
    catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }
}


