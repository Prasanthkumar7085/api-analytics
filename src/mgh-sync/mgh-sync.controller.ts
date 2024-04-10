import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { Configuration } from 'src/config/config.service';
import { HOSPITAL_MARKETING_MANAGER, INSURANCE_PAYORS_NOT_FOUND_IN_LIS_DATABASE, LABS_NOT_FOUND, LIS_FACILITIES_NOT_FOUND, MARKETER, PATIENT_CLAIMS_NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS_INSERTED_FACILICES, SUCCESS_SYNCED_INSURANCE_PAYORS, SUCCESS_SYNC_LABS, SUCCESS_SYNC_PATIENT_CLAIMS, SUCCUSS_INSERTED_MARKETING_MANAGERS } from 'src/constants/messageConstants';
import { SyncHelpers } from 'src/helpers/syncHelper';
import { MghSyncService } from './mgh-sync.service';
import { FacilitiesService } from 'src/facilities/facilities.service';

@Controller({
  version: '1.0',
  path: 'mgh-sync'
})


export class MghSyncController {
  constructor(
    private readonly mghSyncService: MghSyncService,
    private readonly facilitiesService: FacilitiesService,
    private readonly syncHelpers: SyncHelpers
  ) { }


  @Get('patient-claims')
  async syncPatientClaims(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());
      const { lis_mgh_db_url } = configuration.getConfig();
      await mongoose.connect(lis_mgh_db_url);


      const datesObj = this.syncHelpers.getFromAndToDates(7);

      const fromDate = datesObj.fromDate;
      const toDate = datesObj.toDate;

      const facilitiesArray = await this.facilitiesService.getAllFacilitiesData();

      let facilities = facilitiesArray.map(e => e.mghRefId);

      facilities = facilities.filter(item => item !== null);

      const cases = await this.syncHelpers.getMghCases(fromDate, facilities);

      if (cases.length == 0) {
        return res.status(200).json({
          success: true,
          message: PATIENT_CLAIMS_NOT_FOUND
        });
      }

      this.syncHelpers.insertMghPatientClaims(cases);

      return res.status(200).json({
        success: true,
        message: SUCCESS_SYNC_PATIENT_CLAIMS,
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

      const datesFilter = this.syncHelpers.getFromAndToDates(7);

      const query = {
        status: "ACTIVE",
        user_type: { $in: [HOSPITAL_MARKETING_MANAGER] },
        // updated_at: {
        //     $gte: datesFilter.fromDate,
        //     $lte: datesFilter.toDate,
        // },
      };

      const salesRepsData = await this.syncHelpers.getMghSalesReps(query);

      const modifiedSalesReps = salesRepsData.map(item => ({
        mghRefId: item._id.toString(),
        name: item.name,
        roleId: item.user_type === "MARKETER" ? 1 : (item.user_type === "HOSPITAL_MARKETING_MANAGER" ? 2 : null)
      }));


      this.syncHelpers.getExistedAndNotExistedReps(modifiedSalesReps);



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


  @Get("marketers")
  async syncMarketers(@Res() res: any) {
    try {
      const configuration = new Configuration(new ConfigService());

      const { lis_mgh_db_url } = configuration.getConfig();

      await mongoose.connect(lis_mgh_db_url);

      const datesFilter = this.syncHelpers.getFromAndToDates(7);

      const query = {
        status: "ACTIVE",
        user_type: { $in: [MARKETER] },
        // updated_at: {
        //     $gte: datesFilter.fromDate,
        //     $lte: datesFilter.toDate,
        // },
      };

      const salesRepsData = await this.syncHelpers.getMghSalesReps(query);

      const modifiedSalesReps = salesRepsData.map(item => ({
        mghRefId: item._id.toString(),
        name: item.name,
        roleId: item.user_type === "MARKETER" ? 1 : (item.user_type === "HOSPITAL_MARKETING_MANAGER" ? 2 : null)
      }));


      this.syncHelpers.getExistedAndNotExistedReps(modifiedSalesReps);



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

      const datesFilter = this.syncHelpers.getFromAndToDates(7);

      const query = {
        _id: {
          $in: [
            "65c159bcb2a4b7d072c7afc9",
            "661047986b4dd9bc67574f1f",
            "6610487e15478abc276765c9",
            "661193602055f3dc3b1f4149",
            "66104b6dc8bf08bcc77070f9",
            "65301618d78bd4eaa12f281c",
            "661055101720c4bb87e4c721",
            "651d7c490f68d73ac39a64b4",
            "64a5a5acead06a14f9c10625",
            "60c8cecd2af7f56c193e7d69",
            "60f9b10bb1469c21fd5748b6",
            "64026600269c13638eed6ba1",
            "64072a7c2393397befad6a46",
            "64085dab1d88aa2cc201a7ea",
            "6409a2d36f430b398f1e0d6a",
            "645e69b0a097dd2ae675499c",
            "645e6a366f916d2abaf39873",
            "646bf97fc07ab512b47927bf",
            "64e60201d007c63e429a9fea",
            "64e77f81abed24021e2679bc",
            "6610574b94b288bc47221cd7"
          ]
        }
      };

      const select = {
        _id: 1, hospitals: 1
      };
      const salesReps = await this.mghSyncService.getUsers(query, select);

      const hospitalsArray = salesReps.map(e => e.hospitals).flat();

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

      const modifiedData = facilitiesData.map(e => ({
        mghRefId: e._id,
        name: e.name
      }));

      this.syncHelpers.insertOrUpdateMghFacilities(modifiedData);

      return res.status(200).json({
        success: true,
        message: SUCCESS_INSERTED_FACILICES
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

}

