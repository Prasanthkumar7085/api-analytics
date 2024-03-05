import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_FACILITIES, SUCCESS_FETCHED_FACILITY, SUCCESS_VOLUME_TREND } from 'src/constants/messageConstants';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';
import { FacilitiesDto } from './dto/facilities.dto';
import { FacilityDto } from './dto/facility.dto';

@Controller({
  version: '2.0',
  path: 'facilities',
})
export class FacilitiesController {
  constructor(
    private readonly facilitiesService: FacilitiesService,
    private readonly facilitiesHelper: FacilitiesHelper
  ) { }


  @Get(':hospital_id')
  async getHospitalDetails(@Res() res: any, @Param() param: any) {
    try {

      const hospitalId = param.hospital_id;

      const hospitalDetails = await this.facilitiesService.getHospital(hospitalId);

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITY,
        data: hospitalDetails
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }


  @Post()
  async getAllFacilities(@Res() res: any, @Body() body: FacilitiesDto) {
    try {

      const fromDate = body.from_date;
      const toDate = body.to_date;

      // for volume facility wise
      const volumeData = this.facilitiesHelper.forVolumeFacilityWise(fromDate, toDate);


      // for revenue facility wise
      const revenueData = this.facilitiesHelper.forRevenueFacilityWise(fromDate, toDate);

      const combinedData = [];

      revenueData.forEach((revenueEntry) => {
        const volumeEntry = volumeData.find((v) => v.marketer_id === revenueEntry.marketer_id && v.hospital === revenueEntry.hospital);

        if (volumeEntry) {
          combinedData.push({
            marketer_id: revenueEntry.marketer_id,
            hospital: revenueEntry.hospital,
            paid_amount: revenueEntry.paid_amount,
            total_amount: revenueEntry.total_amount,
            pending_amount: revenueEntry.pending_amount,
            total_cases: volumeEntry.total_cases
          });
        }
      });


      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_FACILITIES,
        combinedData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }


  @Post('volume-trend')
  async getVolumeTrend(@Res() res: any, @Body() body: FacilityDto) {
    try {
      const hospitalId = body.hospital_id;
      const fromDate = body.from_date;
      const toDate = body.to_date;

      const volumeData = this.facilitiesHelper.getVolumeTrendData(hospitalId, fromDate, toDate);

      return res.status(200).json({
        success: true,
        message: SUCCESS_VOLUME_TREND,
        volumeData
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
