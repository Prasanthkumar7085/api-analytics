import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { FacilitiesV3Service } from './facilities-v3.service';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_FACILITIES_REVENUE_STATS, SUCCESS_FETCHED_FACILITY } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';

@Controller({
  version: '3.0',
  path: 'facilities'
})
export class FacilitiesV3Controller {
  constructor(
    private readonly facilitiesV3Service: FacilitiesV3Service,
    private readonly filterHelper: FilterHelper
  ) { }

  @Get(':id/stats-revenue')
  async getRevenuestatsData(@Res() res: any, @Param('id') id: any, @Query() query: any) {
    try {
      const queryString = await this.filterHelper.salesRep(query);

      const data = await this.facilitiesV3Service.getStatsRevenue(id, queryString)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITIES_REVENUE_STATS,
        data: data
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }

}
