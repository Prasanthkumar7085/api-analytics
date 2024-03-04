import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { SalesRepService } from './sales-rep.service';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { SINGLE_REP_FACILITY_WISE, SOMETHING_WENT_WRONG, SUCCESS_FECTED_SALE_REP_REVENUE_STATS, SUCCESS_FECTED_SALE_REP_VOLUME_STATS, SUCCESS_FETCHED_SALES_REP, SUCCESS_FETCHED_SALE_VOLUME_MONTH_WISE, SUCCESS_MARKETER } from 'src/constants/messageConstants';
import * as fs from 'fs';
import { FacilityWiseDto } from './dto/facility-wise.dto';
import { SalesRepDto } from './dto/sales-rep.dto';

@Controller({
  version: '2.0',
  path: 'sales-rep',
})
export class SalesRepController {
  constructor(private readonly salesRepService: SalesRepService) { }


@Get(':marketer_id')
async getMarketer(@Res() res: any, @Param() param: any){
  try {
    const marketerid = param.marketer_id;

    const marketerDetails = await this.salesRepService.getMarketer(marketerid);
    return res.status(200).json({
      success: true,
      message: SUCCESS_MARKETER,
      data: marketerDetails
    })
  } catch(err){
    console.log({err});
    return res.status(500).json({
      success: false,
      message: err || SOMETHING_WENT_WRONG
    })
  }
}



  @Post('')
  async getAllSalesRep(@Res() res: any, @Body() body: SalesRepDto) {
    try {

      const fromDate = body.from_date;
      const toDate = body.to_date;



      // from Volume
      const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");

      let finalVoumeResp = JSON.parse(volumeResponse);


      if (fromDate && toDate) {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        // Filter the array based on the date range
        finalVoumeResp = finalVoumeResp.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= fromDateObj && itemDate <= toDateObj;
        });
      }

      const groupedVolumeData = finalVoumeResp.reduce((acc, item) => {
        const { marketer_id, total_cases, hospital_case_type_wise_counts } = item;

        if (!acc[marketer_id]) {
          acc[marketer_id] = {
            marketer_id,
            total_cases: 0,
            hospitals_count: 0
          };
        }

        let uniqueHospitals = new Set();

        const uniqueHospitalIds = new Set(
          hospital_case_type_wise_counts.map((hospital) => hospital.hospital)
        );

        uniqueHospitalIds.forEach((hospitalId) => {
          uniqueHospitals.add(hospitalId);
        });

        acc[marketer_id].hospitals_count += uniqueHospitalIds.size;
        acc[marketer_id].total_cases += total_cases;

        return acc;
      }, {});

      const volumeResult: any = Object.values(groupedVolumeData);


      // from revenue
      const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");

      let finalRevenueResp = JSON.parse(revenueResponse);

      if (fromDate && toDate) {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        // Filter the array based on the date range
        finalRevenueResp = finalRevenueResp.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= fromDateObj && itemDate <= toDateObj;
        });
      }

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

  @Post('facility-wise')
  async getFacilityWiseForSingleRep(@Res() res: any, @Body() body: FacilityWiseDto) {
    try {

      const marketerId = body.marketer_id;
      const fromDate = body.from_date;
      const toDate = body.to_date;

      // from volume
      const volumeData = this.getsingleRepVolumeFacilityWise(marketerId, fromDate, toDate);


      const revenueData = this.getsingleRepRevenueFacilityWise(marketerId, fromDate, toDate);

      const combinedArray = revenueData.map(revenueEntry => {
        const matchingVolumeEntry = volumeData.find(volumeEntry => volumeEntry.hospital === revenueEntry.hospital);

        if (matchingVolumeEntry) {
          return {
            hospital: revenueEntry.hospital,
            paid_amount: revenueEntry.paid_amount,
            total_amount: revenueEntry.total_amount,
            pending_amount: revenueEntry.pending_amount,
            total_cases: matchingVolumeEntry.total_cases
          };
        } else {
          return revenueEntry;
        }
      });

      return res.status(200).json({
        success: true,
        message: SINGLE_REP_FACILITY_WISE,
        combinedArray
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }
  
  @Post('stats-revenue')
  async getRevenueStats(@Res() res:any, @Body() salesrepDto:CreateSalesRepDto) {
    try{
      const id=salesrepDto.marketer_id
      const start_date = new Date(salesrepDto.from_date)
      const end_date = new Date(salesrepDto.to_date)

      const {total_amount,paid_amount,pending_amount} = await this.getRevenueStatsData(id, start_date, end_date)
      return res.status(200).json({
        success:true,
        marketer_id: id,
        message: SUCCESS_FECTED_SALE_REP_REVENUE_STATS,
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
  async getVolumeStats(@Res() res:any, @Body() saleRepDto:CreateSalesRepDto) {
    try {
      const id = saleRepDto.marketer_id
      const start_date = new Date(saleRepDto.from_date)
      const end_date = new Date(saleRepDto.to_date)
      const {total_cases,completed_cases,pending_cases} = await this.getVolumeStatsData(id,start_date, end_date)
      return res.status(200).json({
        success:true,
        marketer_id: id,
        message: SUCCESS_FECTED_SALE_REP_VOLUME_STATS,
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

  @Post('cases-types/volume')
  async getCaseTypesVolumeMonthWise(@Res() res:any, @Body() salesRepDto: CreateSalesRepDto){
    try {
      const id=salesRepDto.marketer_id
      const start = new Date(salesRepDto.from_date)
      const end = new Date(salesRepDto.to_date)
      const data = await this.caseTypesVolumeMonthWise(id, start, end)

      return res.status(200).json({
        success:true,
        message:SUCCESS_FETCHED_SALE_VOLUME_MONTH_WISE,
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        success:false,
        message: err
      })
    }
  }


  
  getsingleRepVolumeFacilityWise(marketerId, fromDate, toDate) {
    const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
    const finalVolumeResp = JSON.parse(volumeResponse);
    let volumeData = finalVolumeResp.filter(item => item.marketer_id === marketerId);

    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      // Filter the array based on the date range
      volumeData = volumeData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= fromDateObj && itemDate <= toDateObj;
      });
    }


    const hospitalWiseData = {};

    volumeData.forEach(item => {
      item.hospital_case_type_wise_counts.forEach(hospitalEntry => {
        const hospitalID = hospitalEntry.hospital;

        if (!hospitalWiseData[hospitalID]) {
          hospitalWiseData[hospitalID] = {
            uti: 0,
            nail: 0,
            covid: 0,
            wound: 0,
            gastro: 0,
            cardiac: 0,
            gti_sti: 0,
            diabetes: 0,
            pgx_test: 0,
            cgx_panel: 0,
            covid_flu: 0,
            toxicology: 0,
            urinalysis: 0,
            pad_alzheimers: 0,
            pulmonary_panel: 0,
            gti_womens_health: 0,
            clinical_chemistry: 0,
            respiratory_pathogen_panel: 0,
          };
        }

        // Accumulate counts for each case type
        Object.keys(hospitalEntry).forEach(caseType => {
          if (caseType !== 'hospital') {
            hospitalWiseData[hospitalID][caseType] += hospitalEntry[caseType];
          }
        });

      });
    });

    const totalCasesPerHospital = Object.keys(hospitalWiseData).map(hospitalID => {
      const totalCases = Object.values(hospitalWiseData[hospitalID]).reduce((sum: number, count: number) => sum + count, 0);
      return {
        hospital: hospitalID,
        total_cases: totalCases,
      };
    });

    return totalCasesPerHospital;
  }


  getsingleRepRevenueFacilityWise(marketerId, fromDate, toDate) {
    const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");

    let finalRevenueResp = JSON.parse(revenueResponse);

    let revenueData = finalRevenueResp.filter(item => item.marketer_id === marketerId);

    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      // Filter the array based on the date range
      revenueData = revenueData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= fromDateObj && itemDate <= toDateObj;
      });
    }

    const aggregatedData = [];

    revenueData.forEach(entry => {
      entry.hospital_wise_counts.forEach(hospitalEntry => {
        const hospitalId = hospitalEntry.hospital;

        // Find existing entry in the aggregatedData array
        const existingEntry = aggregatedData.find(item => item.hospital === hospitalId);

        if (existingEntry) {
          existingEntry.paid_amount += hospitalEntry.paid_amount;
          existingEntry.total_amount += hospitalEntry.total_amount;
          existingEntry.pending_amount += hospitalEntry.pending_amount;
        } else {
          // If the entry does not exist, create a new one
          aggregatedData.push({
            hospital: hospitalId,
            paid_amount: hospitalEntry.paid_amount,
            total_amount: hospitalEntry.total_amount,
            pending_amount: hospitalEntry.pending_amount,
          });
        }
      });
    });

    return aggregatedData;
  }


  
  async getRevenueStatsData(id:string, start_date:Date, end_date:Date){

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



  async getVolumeStatsData(id:string, start_date: Date, end_date:Date){
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



  async caseTypesVolumeMonthWise(id, start, end) {
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
