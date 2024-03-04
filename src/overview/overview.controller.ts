import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { CreateOverviewDto } from './dto/create-overview.dto';
import { UpdateOverviewDto } from './dto/update-overview.dto';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';
import { SUCCESS_FETCHED_CASE_TYPE_VOLUME_AND_COUNT } from 'src/constants/messageConstants';


@Controller({
  version: '2.0',
  path: 'overview',
})
export class OverviewController {
  constructor(
    private readonly overviewService: OverviewService,
    private readonly salesRepHelper: SalesRepHelper,

  ) { }

  @Post()
  async getOverViewCaseTypes(@Body() createOverviewDto: CreateOverviewDto, @Res() res: any) {
    try {

      const { from_date, to_date } = createOverviewDto

      const volumeData = await this.salesRepHelper.getOverviewCaseTypesVolumeData(from_date, to_date)
      const revenueData = await this.salesRepHelper.getOverviewCaseTypesRevenueData(from_date, to_date)

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_CASE_TYPE_VOLUME_AND_COUNT,
        data: {
          volume_data: { total: volumeData.total, case_type_wise_count: volumeData.totalCounts },
          revenue_data: { total: revenueData.total_amount, case_type_wise_count: revenueData.totalCaseTypeAmount }
        }
      })
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  @Get()
  findAll() {
    return this.overviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOverviewDto: UpdateOverviewDto) {
    return this.overviewService.update(+id, updateOverviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.overviewService.remove(+id);
  }

}
