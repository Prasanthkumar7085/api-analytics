import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';
import { SOMETHING_WENT_WRONG, SUCCESS_FETECHED_FACILITIES_REVENUE_STATS } from 'src/constants/messageConstants';

@Controller({
  version: '2.0',
  path: 'facilities',
})
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService,
    private readonly facilitiesHelper:FacilitiesHelper) {}

  @Post()
  create(@Body() createFacilityDto: CreateFacilityDto) {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Get()
  findAll() {
    return this.facilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facilitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacilityDto: UpdateFacilityDto) {
    return this.facilitiesService.update(+id, updateFacilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilitiesService.remove(+id);
  }


  @Post('stats-revenue')
  async getRevenuestatsData(@Res() res:any, @Body() facilityDto:CreateFacilityDto){
    try {
      const id = facilityDto.facility_id
      const from_date = new Date(facilityDto.from_date)
      const to_date = new Date(facilityDto.to_date)

      const {total_amount,paid_amount,pending_amount} = await this.facilitiesHelper.getFacilityRevenueStats(id,from_date,to_date)
      return res.status(200).json({
        success:true,
        message:SUCCESS_FETECHED_FACILITIES_REVENUE_STATS,
        data :{
          billed:total_amount,
          collected:paid_amount,
          pending:pending_amount
        }
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
