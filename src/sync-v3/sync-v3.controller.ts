import { Controller, Get, NotFoundException, Post, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { LisService } from 'src/lis/lis.service';
import { CASE_TYPES_NOT_FOUND, INSURANCE_PAYORS_NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS_SYNCED_CASE_TYPES, SUCCESS_SYNCED_INSURANCE_PAYORS } from 'src/constants/messageConstants';
import { syncHelpers } from 'src/helpers/syncHelper';
import * as fs from 'fs';
import { Configuration } from 'src/config/config.service';


@Controller({
    version: '3.0',
    path: 'sync'
})

export class SyncV3Controller {
    constructor(
        private readonly syncV3Service: SyncV3Service,
        private readonly lisService: LisService,
        private readonly synchelpers: syncHelpers,
        private readonly configuration: Configuration,
    ) { }

    @Get('insurance-payors')
    async syncInsurancePayors(@Res() res: any) {
        try {
            const query = {};

            const projection = { _id: 1, name: 1 };

            const insurancePayorsData = await this.lisService.getInsurancePayors(query, projection);

            if (insurancePayorsData.length == 0) {
                return res.status(200).json({ success: true, message: INSURANCE_PAYORS_NOT_FOUND })
            }

            const modifiedData = await this.synchelpers.modifyInsurancePayors(insurancePayorsData);

            if (modifiedData.length == 0) {
                return res.status(200).json({ success: true, message: INSURANCE_PAYORS_NOT_FOUND });
            }
            this.synchelpers.insertInsurancePayors(modifiedData);

            return res.status(200).json({ success: true, message: SUCCESS_SYNCED_INSURANCE_PAYORS });
        }
        catch (err) {
            console.log({ err });

            return res.status(500).json({ success: false, message: err || SOMETHING_WENT_WRONG });
        }

    }


    @Get('case-types')
    async syncCaseTypes(@Res() res: any) {
        try {

            const { lab_id } = this.configuration.getConfig();

            const datesObj = this.synchelpers.getFromAndToDates(10);


            // REVIEW: get lab id from env or config
            const query = {
                lab: lab_id,
                created_at: {
                    $gte: datesObj.fromDate,
                    $lte: datesObj.toDate
                }
            };

            const projection = { name: 1, code: 1 }

            const caseTypesData = await this.lisService.getCaseTypes(query, projection);

            if (caseTypesData.length == 0) {
                return res.status(200).json({ success: true, message: CASE_TYPES_NOT_FOUND })
            }

            const modifiedData = await this.synchelpers.modifyCaseTypes(caseTypesData);

            if (modifiedData.length == 0) {
                return res.status(200).json({ success: true, message: CASE_TYPES_NOT_FOUND })
            }

            this.synchelpers.insertCaseTypes(modifiedData);

            return res.status(200).json({ success: true, message: SUCCESS_SYNCED_CASE_TYPES });
        }
        catch (error) {
            console.log({ error });

            return res.status(500).json({ success: false, message: error || SOMETHING_WENT_WRONG });
        }
    }


    @Get('facilities')
    async getFacilitiesWithNoMarketers(@Res() res: any) {
        try {
            const query = {};

            const projection = { _id: 1, name: 1 };

            const facilitiesData = await this.lisService.getFacilities(query, projection);

            const marketersDataJson = fs.readFileSync('sales_reps_hospitalsIds.json', 'utf-8');

            const marketersData = JSON.parse(marketersDataJson)

            const data = await this.synchelpers.getHospitalsWithNoManagers(facilitiesData, marketersData);

            return res.status(200).json({ success: true, message: 'Success', data: data });
        }
        catch (error) {
            console.log({ error });

            return res.status(500).json({ success: false, message: error || SOMETHING_WENT_WRONG });
        }
    }

}
