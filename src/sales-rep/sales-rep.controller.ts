import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_SALES_REP } from 'src/constants/messageConstants';
import * as fs from 'fs';

@Controller({
  version: '1.0',
  path: 'sales-rep',
})
export class SalesRepController {
  constructor(private readonly salesRepService: SalesRepService) { }

  @Post('')
  async getAllSalesRep(@Res() res: any) {
    try {

      // from Volume
      const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");

      const finalVoumeResp = JSON.parse(volumeResponse);

      const groupedVolumeData = finalVoumeResp.reduce((acc, item) => {
        const { marketer_id, total_cases, hospital_case_type_wise_counts } = item;

        if (!acc[marketer_id]) {
          acc[marketer_id] = {
            marketer_id,
            total_cases: 0,
            hospitals_count: 0,
          };
        }

        const uniqueHospitalIds = new Set(
          hospital_case_type_wise_counts.map((hospital) => hospital.hospital)
        );

        acc[marketer_id].hospitals_count += uniqueHospitalIds.size;

        acc[marketer_id].total_cases += total_cases;

        return acc;
      }, {});

      const volumeResult: any = Object.values(groupedVolumeData);


      // from revenue
      const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");

      const finalRevenueResp = JSON.parse(revenueResponse);
      const groupedRevenueData = finalRevenueResp.reduce((acc, item) => {
        const { marketer_id, total_amount, pending_amount, paid_amount } = item;

        if (!acc[marketer_id]) {
          acc[marketer_id] = {
            marketer_id,
            total_amount: 0,
            pending_amount: 0,
            paid_amount: 0,
            targeted_amount: 5000,
            target_reached: false,
          };
        }

        acc[marketer_id].total_amount += total_amount;
        acc[marketer_id].pending_amount += pending_amount;
        acc[marketer_id].paid_amount += paid_amount;

        if (acc[marketer_id].paid_amount >= acc[marketer_id].targeted_amount) {
          acc[marketer_id].target_reached = true;
        }

        return acc;
      }, {});

      const revenueResult: any = Object.values(groupedRevenueData);


      // combine both results
      const combinedData = revenueResult.map((revneuItem) => {
        const volumeItem = volumeResult.find((volumeItem) => volumeItem.marketer_id === revneuItem.marketer_id);

        return {
          ...revneuItem,
          ...(volumeItem && { total_cases: volumeItem.total_cases, total_hospitals: volumeItem.hospitals_count })
        };
      });

      return res.status(200).json({
        success: true,
        message: SUCCESS_FETCHED_SALES_REP,
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
}
