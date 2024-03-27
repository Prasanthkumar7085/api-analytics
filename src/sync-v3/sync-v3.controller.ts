import { Controller, Get, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { LisService } from 'src/lis/lis.service';
import { syncHelpers } from 'src/helpers/syncHelper';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';
import { SUCCESS_SEEDED_FACILICES, SUCCUSS_SEEDED_MARKETING_MANAGERS, SUCCUSS_SEEDED_SALES_REPS } from 'src/constants/messageConstants';
import { FacilitiesV3Service } from 'src/facilities-v3/facilities-v3.service';

@Controller({
  version: '3.0',
  path: 'sync'
})
export class SyncV3Controller {
  constructor(
    private readonly syncV3Service: SyncV3Service,
    private readonly lisService: LisService,
    private readonly syncHelper: syncHelpers,
    private readonly salesRepService: SalesRepServiceV3,
    private readonly faciliticesService: FacilitiesV3Service
  ) { }


  @Get('managers')
  async syncSalesRepsManagers(@Res() res: any) {
    try {

      const datesObj = this.syncHelper.getFromAndToDates(7);

      // REVIEW: Move HOSPITAL_MARKETING_MANAGER into constants
      const query = {
        user_type: "HOSPITAL_MARKETING_MANAGER",
        created_at: {
          $gte: datesObj.fromDate,
          $lte: datesObj.toDate
        }
      };

      const salesRepsManagersData = await this.lisService.getUsers(query);

      // REVIEW: change function name getNewSalesRepsManagersData
      const finalSalesRepsManagersData = await this.syncHelper.getNewSalesRepsManagersData(salesRepsManagersData);

      // REVIEW: remove awaits 
      const insertedData = await this.salesRepService.seedSalesRepsManager(finalSalesRepsManagersData);

      // REVIEW: remove data
      return res.status(200).json({ success: true, message: SUCCUSS_SEEDED_MARKETING_MANAGERS, data: insertedData });
    }
    catch (error) {
      console.log({ error });
      return res.status(500).json({ success: false, message: error });
    }
  }


  @Get('marketer')
  async syncSalesRepsMarketers(@Res() res: any) {
    try {
      // REVIEW: change vaieable name
      const datesObj = this.syncHelper.getFromAndToDates(7);

      // REVIEW: Move MARKETER into constants
      const query = {
        user_type: "MARKETER",
        created_at: {
          $gte: datesObj.fromDate,
          $lte: datesObj.toDate
        }
      };

      // REVIEW: change vaieable name
      const salesRepsMarketersData = await this.lisService.getUsers(query);

      // REVIEW: change vaieable name and function name
      const finalSalesRepsMarketersData = await this.syncHelper.getNewSalesRepsData(salesRepsMarketersData);

      // REVIEW: remove await and change function name
      const insertedData = await this.salesRepService.seedSalesReps(finalSalesRepsMarketersData);

      return res.status(200).json({ success: true, message: SUCCUSS_SEEDED_SALES_REPS, data: insertedData });

    }
    catch (error) {
      console.log({ error });
      return res.status(500).json({ success: false, message: error });
    }
  }


  @Get('facilities')
  async syncFacilities(@Res() res: any) {
    try {
      // REVIEW: change vaieable name
      const datesObj = this.syncHelper.getFromAndToDates(7);

      // REVIEW: Move MARKETER into constants
      const query = {
        user_type: "MARKETER",
        created_at: {
          $gte: datesObj.fromDate,
          $lte: datesObj.toDate
        }
      };

      const salesRepsData = await this.lisService.getUsers(query);

      const facilitiesIdsData = await this.syncHelper.getFacilitiesDataFromSalesReps(salesRepsData);

      const hospitalQuery = {
        _id: { $in: facilitiesIdsData.unMatchedFacilitiesIds },
        created_at: {
          $gte: datesObj.fromDate,
          $lte: datesObj.toDate
        }
      };

      const faciliticesData = await this.lisService.getHospitalsData(hospitalQuery);

      // REVIEW: How i know if faciliticesData is not came

      const finalObjs = await this.syncHelper.getFacilitiesIds(faciliticesData, facilitiesIdsData.salesRepsAndFacilityData);

      const insertedData = await this.faciliticesService.seedFacilities(finalObjs);

      return res.status(200).json({ success: true, message: SUCCESS_SEEDED_FACILICES, data: insertedData });
    }
    catch (error) {
      console.log({ error });
      return res.status(500).json({ success: false, message: error });
    }
  }
}
