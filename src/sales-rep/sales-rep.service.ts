import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import * as fs from 'fs';




@Injectable()
export class SalesRepService {

  async findAll() {
    // from Volume
    const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");

    const finalVolumeResp = JSON.parse(volumeResponse);

    return finalVolumeResp
  }



  async findOneVolume(id: string, start_date: Date, end_date: Date) {
    const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
    const finalVolumeResp = JSON.parse(volumeResponse);

    let totalCounts = {};
    let total: number;

    for (let i = 0; i < finalVolumeResp.length; i++) {
      if (finalVolumeResp[i].marketer_id == id) {
        let date = finalVolumeResp[i].date
        if (date >= start_date && date <= end_date) {

          total = finalVolumeResp[i].total_cases

          finalVolumeResp[i].case_type_wise_counts.forEach(caseType => {
            const { case_type, pending, completed } = caseType;
            totalCounts[case_type] = (totalCounts[case_type] || 0) + pending + completed;
          });

        }
      }

    }
    return { totalCounts, total }
  }





  async findOneRevenue(id: string, start_date: Date, end_date: Date) {

    const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
    const revenue = JSON.parse(revenueResponse);

    let totalCaseTypeAmount = {};
    let total_amount: number;


    for (const item of revenue) {
      if (item.marketer_id == id) {
        if (item.date >= start_date && item.date <= end_date) {



          total_amount = item.total_amount

          item.case_type_wise_counts.forEach(caseType => {
            const { case_type, total_amount } = caseType;
            totalCaseTypeAmount[case_type] = (totalCaseTypeAmount[case_type] || 0) + total_amount
          })
        }
      }
    }
    return { totalCaseTypeAmount, total_amount }
    // throw new NotFoundException('Revenue data not found for the specified marketer ID');
  }



  async getOneSalesRepDuration(id, start_date, end_date) {
    const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
    const revenue = JSON.parse(revenueResponse);


    let total_counts = {}
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)

    while (startDate <= endDate) {
      const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

      total_counts[monthYear] = {
        total_revenue: 0,
        case_type_wise: {}
      };
      startDate.setMonth(startDate.getMonth() + 1);
    }

    for (const item of revenue) {
      if (item.marketer_id == id) {

        let date = new Date(item.date);

        if (date >= start_date && date <= end_date) {
          const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })
          item.case_type_wise_counts.forEach(caseType => {
            const { case_type, total_amount } = caseType;

            total_counts[monthYear]['case_type_wise'][case_type] = (total_counts[monthYear]['case_type_wise'][case_type] || 0) + total_amount
            total_counts[monthYear]['total_revenue'] += total_amount
          })
        }
      }
    }
    return total_counts
  }
}