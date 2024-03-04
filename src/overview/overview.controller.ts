import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { CreateOverviewDto } from './dto/create-overview.dto';
import { UpdateOverviewDto } from './dto/update-overview.dto';
import { SalesRepHelper } from 'src/helpers/salesRepHelper';
import { SUCCESS_FETCHED_OVERVIEW_REVENUE_STATS, SUCCESS_FETCHED_OVERVIEW_VOLUME_STATS, SUCCESS_FETCHED_OVERVIEW_REVENUE } from 'src/constants/messageConstants';



@Controller({
  version: '2.0',
  path: 'overview',
})
export class OverviewController {
  constructor(private readonly overviewService: OverviewService,
        private readonly salesRepHelper: SalesRepHelper
    ) {}

  @Post()
  create(@Body() createOverviewDto: CreateOverviewDto) {
    return this.overviewService.create(createOverviewDto);
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

  @Post('stats-revenue')
  async getRevenueStats(@Res() res:any, @Body() overviewDto:CreateOverviewDto) {
    try{
      const start_date = new Date(overviewDto.from_date)
      const end_date = new Date(overviewDto.to_date)

      const {total_amount,paid_amount,pending_amount} = await this.salesRepHelper.getOverviewRevenueStatsData(start_date, end_date)
      return res.status(200).json({
        success:true,
        message: SUCCESS_FETCHED_OVERVIEW_REVENUE_STATS,
        data : {
          generated : total_amount,
          collected : paid_amount,
          pending : pending_amount,
        }
      })
    } catch (err) {
      return res.status(500).json({
        success:false,
        message: err
      })
    }
  }

  @Post('stats-volume')
  async getVolumeStats(@Res() res:any, @Body() overviewDto:CreateOverviewDto) {
    try {
      const start_date = new Date(overviewDto.from_date)
      const end_date = new Date(overviewDto.to_date)
      const {total_cases,completed_cases,pending_cases} = await this.salesRepHelper.getOverViewVolumeStatsData(start_date, end_date)
      return res.status(200).json({
        success:true,
        message: SUCCESS_FETCHED_OVERVIEW_VOLUME_STATS,
        data : {
          total : total_cases,
          completed:completed_cases,
          pending:pending_cases
        }
      })
    } catch (err) {
      return res.status(500).json({
        success:false,
        message: err
      })
    } 
  }

  @Post('revenue')
  async revenuGraph(@Res() res:any, @Body() overviewDto:CreateOverviewDto){
    try {
      const from_date = new Date(overviewDto.from_date)
      const to_date = new Date(overviewDto.to_date)
      const data = await this.salesRepHelper.getRevenueGraph(from_date,to_date)
      return res.status(200).json({
        success:true,
        messgae:SUCCESS_FETCHED_OVERVIEW_REVENUE,
        data:data
      })
    }
    catch (err) {
      return res.status(500).json({
        success:false,
        message: err
      })
   }
  }
}
