import { Injectable } from '@nestjs/common';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import * as RevenueStatsData from 'RevenueStatsData.json'
import * as volumeStatsData from 'VolumeStatsData.json'
import * as fs from 'fs';

@Injectable()
export class SalesRepService {
  create(createSalesRepDto: CreateSalesRepDto) {
    return 'This action adds a new salesRep';
  }

  findAll() {
    return `This action returns all salesRep`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesRep`;
  }

  update(id: number, updateSalesRepDto: UpdateSalesRepDto) {
    return `This action updates a #${id} salesRep`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesRep`;
  }



  async getRevenueSats(id:string, start_date:Date, end_date:Date){

    const RevenueStatsData = fs.readFileSync('RevenueStatsData.json',  "utf-8")
    const finalRevenueResp = JSON.parse(RevenueStatsData)

    let total_amount = 0;
    let paid_amount = 0;
    let pending_amount = 0;

    for (let i = 0; i < finalRevenueResp.length; i++){
      const date = new Date(finalRevenueResp[i].date)
      
      if (start_date < end_date) {
      
        if (date >= start_date && date <= end_date){
          if (finalRevenueResp[i].marketer_id==id){
            
            total_amount = total_amount + finalRevenueResp[i].total_amount,
            paid_amount = paid_amount+finalRevenueResp[i].paid_amount
            pending_amount = pending_amount+finalRevenueResp[i].pending_amount
          }
        }
      }

    }
    return ({total_amount:total_amount,paid_amount:paid_amount,pending_amount:pending_amount})
  }



  async getVolumeStats(id:string, start_date: Date, end_date:Date){
    const VolumeStatsData = fs.readFileSync('VolumeStatsData.json',  "utf-8")
    const finalVolumeResp = JSON.parse(VolumeStatsData)

    let total_cases = 0;
    let completed_cases = 0;
    let pending_cases = 0;

    for (let i = 0; i < finalVolumeResp.length; i++){
      const date = new Date(finalVolumeResp[i].date)
      if (start_date < end_date){
        if (date >= start_date && date <=  end_date){
  
          if (finalVolumeResp[i].marketer_id==id){
            total_cases = total_cases+finalVolumeResp[i].total_cases,
            completed_cases = completed_cases+finalVolumeResp[i].completed_cases,
            pending_cases = pending_cases+finalVolumeResp[i].pending_cases
    
          }
        }
      }
    }
    return ({total_cases : total_cases,completed_cases : completed_cases,pending_cases : pending_cases})
  }



  async getCaseTypesVolumeMonthWise(id, start, end) {
    const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8");
    const finalVolumeResp = JSON.parse(VolumeStatsData);

    let totalCounts = {};
    let count = 0

    const startDate = new Date(start);
    const endDate = new Date(end);
    while (startDate <= endDate) {
        const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        totalCounts[monthYear] = {count:0, case_type_wise_counts:{}};
        startDate.setMonth(startDate.getMonth() + 1);
    }

    for (let i = 0; i < finalVolumeResp.length; i++) {
        
        if (finalVolumeResp[i].marketer_id == id) {
      
          let date = new Date(finalVolumeResp[i].date);
            if (date >= start && date <= end) {
                
              const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

              finalVolumeResp[i].case_type_wise_counts.forEach(caseType => {
                  const { case_type, pending, completed } = caseType;
                  totalCounts[monthYear]['case_type_wise_counts'][case_type] = (totalCounts[monthYear]['case_type_wise_counts'][case_type] || 0) + pending + completed;
                  totalCounts[monthYear]['count'] += (pending+completed);
              });
            }
        }
    }
    return totalCounts;
  }

}
