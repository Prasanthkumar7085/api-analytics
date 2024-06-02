import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { Configuration } from 'src/config/config.service';
import { INSURANCE_PAYORS_NOT_FOUND_IN_LIS_DATABASE, LABS_NOT_FOUND, LIS_FACILITIES_NOT_FOUND, PATIENT_CLAIMS_NOT_FOUND, SALES_REPS_NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS_INSERTED_FACILICES, SUCCESS_SALES_REPS_SYNC, SUCCESS_SYNCED_FACILICES, SUCCESS_SYNCED_INSURANCE_PAYORS, SUCCESS_SYNC_LABS, SUCCESS_SYNC_PATIENT_CLAIMS, SUCCUSS_INSERTED_MARKETING_MANAGERS } from 'src/constants/messageConstants';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { MghSyncService } from './mgh-sync.service';
import { FacilitiesService } from 'src/facilities/facilities.service';
import { HOSPITAL_MARKETING_MANAGER, MARKETER, MGH_TIMEZONE, SALES_DIRECTOR } from 'src/constants/lisConstants';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { LisService } from 'src/lis/lis.service';
import { CsvHelper } from 'src/helpers/csvHelper';

@Controller({
  version: '1.0',
  path: 'mgh-sync'
})


export class MghSyncController {
  constructor(
    private readonly mghSyncService: MghSyncService,
    private readonly facilitiesService: FacilitiesService,
    private readonly syncHelpers: SyncHelpers,
    private readonly salesRepService: SalesRepService,
    private readonly csvHelper: CsvHelper
  ) { }


  @Get('patient-claims')
  async syncPatientClaims(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());
      const { lis_mgh_db_url } = configuration.getConfig();
      await mongoose.connect(lis_mgh_db_url);


      const datesObj = this.syncHelpers.getFromAndToDatesInEST(1, MGH_TIMEZONE);

      const fromDate = datesObj.fromDate;
      const toDate = datesObj.toDate;

      console.log({ fromDate, toDate });
      const facilitiesArray = await this.facilitiesService.getAllFacilitiesData();

      let facilities = facilitiesArray.map(e => e.mghRefId);

      facilities = facilities.filter(item => item !== null);

      const cases = await this.syncHelpers.getMghCases(fromDate, toDate, facilities);

      if (cases.length == 0) {
        return res.status(200).json({
          success: true,
          message: PATIENT_CLAIMS_NOT_FOUND
        });
      }

      console.log({ cases: cases.length });

      this.syncHelpers.insertMghPatientClaims(cases);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SYNC_PATIENT_CLAIMS
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("labs")
  async SyncLabs(@Res() res: any) {
    try {

      const configuration = new Configuration(new ConfigService());

      const { lis_mgh_db_url } = configuration.getConfig();

      await mongoose.connect(lis_mgh_db_url);

      const query = {
        lab_code: "MICROGEN"
      };

      const select = {
        _id: 1,
        name: 1,
        lab_code: 1,
      };

      const labsData = await this.mghSyncService.getlabs(query, select);

      if (!labsData.length) {
        return res.status(200).json({
          success: false,
          message: LABS_NOT_FOUND
        });
      }

      const modifiedData = this.syncHelpers.modifyLabs(labsData);

      const refIds = modifiedData.map(e => e.refId);

      this.syncHelpers.insertOrUpdateLabs(modifiedData, refIds);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SYNC_LABS,
        data: modifiedData
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("managers")
  async syncManagers(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());

      const { lis_mgh_db_url } = configuration.getConfig();

      await mongoose.connect(lis_mgh_db_url);

      const datesFilter = this.syncHelpers.getFromAndToDatesInEST(1, MGH_TIMEZONE);

      const query = {
        status: "ACTIVE",
        user_type: { $in: [HOSPITAL_MARKETING_MANAGER] },
        updated_at: {
          $gte: datesFilter.fromDate,
          $lte: datesFilter.toDate,
        },
        _id: { $nin: ["663b6ab71d5f1d9a28738acf"] }
      };

      const salesRepsData = await this.syncHelpers.getMghSalesReps(query);

      if (salesRepsData.length === 0) {
        return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
      }

      const modifiedSalesReps = salesRepsData.map(item => ({
        mghRefId: item._id.toString(),
        name: item.name,
        roleId: item.user_type === "MARKETER" ? 1 : (item.user_type === "HOSPITAL_MARKETING_MANAGER" ? 2 : 2)
      }));


      if (modifiedSalesReps.length) {
        this.syncHelpers.getExistedAndNotExistedReps(modifiedSalesReps);
      }

      return res.status(200).json({
        success: true,
        message: SUCCUSS_INSERTED_MARKETING_MANAGERS,
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("marketers")
  async syncMarketers(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());

      const { lis_mgh_db_url } = configuration.getConfig();

      await mongoose.connect(lis_mgh_db_url);

      const datesFilter = this.syncHelpers.getFromAndToDatesInEST(1, MGH_TIMEZONE);

      const query = {
        status: "ACTIVE",
        user_type: { $in: [MARKETER] },
        updated_at: {
          $gte: datesFilter.fromDate,
          $lte: datesFilter.toDate,
        },
      };

      const salesRepsData = await this.syncHelpers.getMghSalesReps(query);

      if (salesRepsData.length === 0) {
        return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
      }

      const modifiedSalesReps = salesRepsData.map(item => ({
        mghRefId: item._id.toString(),
        name: item.name,
        roleId: item.user_type === "MARKETER" ? 1 : (item.user_type === "HOSPITAL_MARKETING_MANAGER" ? 2 : 1)
      }));


      if (modifiedSalesReps.length) {
        this.syncHelpers.getExistedAndNotExistedReps(modifiedSalesReps);
      }

      return res.status(200).json({
        success: true,
        message: SUCCUSS_INSERTED_MARKETING_MANAGERS
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("facilities")
  async syncFacilities(@Res() res: any) {
    try {

      const configuration = new Configuration(new ConfigService());

      const { lis_mgh_db_url } = configuration.getConfig();

      await mongoose.connect(lis_mgh_db_url);

      const datesFilter = this.syncHelpers.getFromAndToDatesInEST(1, MGH_TIMEZONE);

      const salesRepsData = await this.salesRepService.getSalesReps("");
      const salesReps = salesRepsData.map((e) => e.mgh_ref_id).filter((mgh_ref_id) => mgh_ref_id !== null);

      const query = {
        _id: {
          $in: salesReps
        },
        status: 'ACTIVE'
      };

      const select = {
        _id: 1, hospitals: 1
      };
      const salesRepsDataFromLis = await this.mghSyncService.getUsers(query, select);

      const hospitalsArray = salesRepsDataFromLis.map(e => e.hospitals).flat();

      const hospitals = [...new Set(hospitalsArray)];

      const hospitalQuery = {
        status: 'ACTIVE',
        // updated_at: {
        //   $gte: datesFilter.fromDate,
        //   $lte: datesFilter.toDate,
        // },
        _id: {
          $in: hospitals
        }
      };

      const projection = { _id: 1, name: 1 };

      const facilitiesData = await this.mghSyncService.getFacilities(hospitalQuery, projection);

      if (facilitiesData.length === 0) {
        return res.status(200).json({ success: true, message: LIS_FACILITIES_NOT_FOUND });
      }

      const { notExistedFacilities, existedFacilities } = await this.syncHelpers.getMghFacilitiesNotExisting(facilitiesData);

      this.syncHelpers.insertOrUpdateMghFacilities(notExistedFacilities, existedFacilities);

      return res.status(200).json({
        success: true,
        message: SUCCESS_INSERTED_FACILICES,
        notExistedFacilities, existedFacilities
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("insurance-payors")
  async syncInsurancePayors(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());
      const { lis_mgh_db_url } = configuration.getConfig();
      await mongoose.connect(lis_mgh_db_url);

      const query = {};

      const projection = { _id: 1, name: 1 };

      const insurancePayorsData = await this.mghSyncService.getInsurancePayors(query, projection);

      if (insurancePayorsData.length == 0) {
        return res.status(200).json({
          success: true,
          message: INSURANCE_PAYORS_NOT_FOUND_IN_LIS_DATABASE
        });
      }

      const data = await this.syncHelpers.modifyMghInsurancePayors(insurancePayorsData);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SYNCED_INSURANCE_PAYORS,
        data
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("mgh-stats")
  async mghStats(@Res() res: any) {
    try {

      const configuration = new Configuration(new ConfigService());
      const { lis_mgh_db_url } = configuration.getConfig();
      await mongoose.connect(lis_mgh_db_url);

      const casesStats = await this.mghSyncService.getCasesStats();

      const csv = await this.csvHelper.convertToCsv(casesStats);
      res.header('Content-Type', 'text/csv');
      res.attachment('users.csv');
      res.send(csv);
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("sales-directors")
  async syncSalesReps(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());
      const { lis_mgh_db_url } = configuration.getConfig();
      await mongoose.connect(lis_mgh_db_url);

      const select = {
        user_type: 1,
        first_name: 1,
        last_name: 1,
        email: 1
      };

      const directorsData = await this.syncHelpers.getRepsFromMghLis(SALES_DIRECTOR, select);

      if (directorsData.length === 0) {
        return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
      }

      const { existedReps: existedDirectors, notExistedReps: notExistedDirectors } = await this.syncHelpers.seperateExistedAndNotExistedRepsByMghRefId(directorsData);

      this.syncHelpers.insertOrUpdateMghSalesDirectors(existedDirectors, notExistedDirectors);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SALES_REPS_SYNC,
        existedDirectors, notExistedDirectors
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }



  @Get("sales-managers")
  async syncSalesManagers(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());
      const { lis_mgh_db_url } = configuration.getConfig();
      await mongoose.connect(lis_mgh_db_url);

      const select = {
        user_type: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        reporting_to: 1
      };

      let managersData: any = await this.syncHelpers.getRepsFromMghLis(HOSPITAL_MARKETING_MANAGER, select);

      if (managersData.length === 0) {
        return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
      }

      const { existedReps: existedManagers, notExistedReps: notExistedManagers } = await this.syncHelpers.seperateExistedAndNotExistedManagersByMghRefId(managersData);

      this.syncHelpers.insertOrUpdateMghSalesManagers(existedManagers, notExistedManagers, 2);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SALES_REPS_SYNC,
        existedManagers, notExistedManagers
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("sales-marketers")
  async syncSalesMarketers(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());
      const { lis_mgh_db_url } = configuration.getConfig();
      await mongoose.connect(lis_mgh_db_url);

      const select = {
        user_type: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        reporting_to: 1
      };

      let marketersData: any = await this.syncHelpers.getRepsFromMghLis(MARKETER, select);

      if (marketersData.length === 0) {
        return res.status(200).json({ success: true, message: SALES_REPS_NOT_FOUND });
      }

      const { existedReps: existedMarketers, notExistedReps: notExistedMarketers } = await this.syncHelpers.seperateExistedAndNotExistedManagersByMghRefId(marketersData);

      this.syncHelpers.insertOrUpdateMghSalesManagers(existedMarketers, notExistedMarketers, 1);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SALES_REPS_SYNC,
        existedMarketers, notExistedMarketers
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("all-facilities")
  async syncAllFacilties(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());
      const { lis_mgh_db_url } = configuration.getConfig();
      await mongoose.connect(lis_mgh_db_url);

      const hospitalQuery = {
        status: 'ACTIVE',
        // updated_at: {
        // 	$gte: datesFilter.fromDate,
        // 	$lte: datesFilter.toDate,
        // }
      };

      const projection = { _id: 1, name: 1 };

      const facilitiesData = await this.mghSyncService.getFacilities(hospitalQuery, projection);


      if (facilitiesData.length === 0) {
        return res.status(200).json({ success: true, message: LIS_FACILITIES_NOT_FOUND });
      }

      console.log("facilitiesData:", facilitiesData.length);

      const { notExistedFacilities, existedFacilities } = await this.syncHelpers.getMghFacilitiesNotExisting(facilitiesData);

      console.log({ existedFacilities: existedFacilities.length, notExistedFacilities: notExistedFacilities.length });

      this.syncHelpers.insertMghFacilities(existedFacilities, notExistedFacilities);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SYNCED_FACILICES,
        existedFacilities, notExistedFacilities
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }

}

