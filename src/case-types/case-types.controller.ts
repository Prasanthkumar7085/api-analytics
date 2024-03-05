import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { CaseTypesService } from './case-types.service';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_CASE_TYPES } from 'src/constants/messageConstants';
import { CaseTypesHelper } from 'src/helpers/caseTypesHelper';
import { CaseTypesDto } from './dto/case-types.dto';


@Controller({
  version: '2.0',
  path: 'case-types',
})
export class CaseTypesController {
  constructor(
    private readonly caseTypesService: CaseTypesService,
    private readonly caseTypesHelper: CaseTypesHelper
  ) { }

  @Get()
  async getCaseTypeStats(@Res() res: any, @Query() query: any) {
    try {
      const fromDate = query.from_date;
      const toDate = query.to_date;

      // for volume 
      const volumeData = this.caseTypesHelper.forVolumeCaseTypeWise(fromDate, toDate);

      // for revenue
      const revenueData = this.caseTypesHelper.forRevenueCaseTypeWise(fromDate, toDate);

      let combinedArray = revenueData.map((revenueItem) => {
        let volumeItem = volumeData.find((volumeItem) => volumeItem.case_type === revenueItem.case_type);

        if (volumeItem) {
          // Merge properties from both arrays
          return {
            ...revenueItem,
            ...volumeItem
          };
        } else {
          // Return the original revenue item if there is no match
          return revenueItem;
        }
      });

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_CASE_TYPES,
        data: combinedArray
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
