import { Controller, Get, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { LisService } from 'src/lis/lis.service';
import { syncHelpers } from 'src/helpers/syncHelper';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';
import { HOSPITAL_MARKETING_MANAGER, SALES_REPS_NOT_FOUND, FACILITIES_NOT_FOUND, SOMETHING_WENT_WRONG, NEW_SALES_REPS_DATA_NOT_FOUND, SUCCUSS_INSERTED_MARKETING_MANAGERS, SUCCUSS_INSERTED_SALES_REPS, SUCCESS_INSERTED_FACILICES} from 'src/constants/messageConstants';
import { FacilitiesV3Service } from 'src/facilities-v3/facilities-v3.service';

@Controller({
  version: '3.0',
  path: 'sync',
})
export class SyncV3Controller {
  constructor(
    private readonly syncV3Service: SyncV3Service,
    private readonly lisService: LisService,
    private readonly syncHelper: syncHelpers,
    private readonly salesRepService: SalesRepServiceV3,
    private readonly faciliticesService: FacilitiesV3Service,
  ) {}


	@Get('managers')
	async syncSalesRepsManagers(@Res() res: any) {
		try {

			const datesFilter = this.syncHelper.getFromAndToDates(7);

			const query = {
				user_type: HOSPITAL_MARKETING_MANAGER,
				created_at: {
					$gte: datesFilter.fromDate,
					$lte: datesFilter.toDate,
				},
			};

			const salesRepsManagersData = await this.lisService.getUsers(query);

			if (salesRepsManagersData.length === 0) {
				return res.status(200).json({success:true, message: SALES_REPS_NOT_FOUND});
			}

			const finalManagersData = await this.syncHelper.getFinalManagersData(salesRepsManagersData);

			if (finalManagersData.length === 0) {
				return res.status(200).json({success:true, message: NEW_SALES_REPS_DATA_NOT_FOUND});
			}

			await this.salesRepService.insertSalesRepsManagers(finalManagersData)

			this.salesRepService.updateSalesRepsManagersData();

			return res.status(200).json({ success: true, message: SUCCUSS_INSERTED_MARKETING_MANAGERS });
		}
		catch (error) {
			console.log({ error });
			
			return res.status(500).json({ success: false, message: error.message || SOMETHING_WENT_WRONG });
		}
	}


	@Get('marketer')
	async syncSalesRepsMarketers(@Res() res: any) {
		try {

			const datesFilter = this.syncHelper.getFromAndToDates(7);

			const salesRepsData = await this.syncHelper.getSalesRepsData(datesFilter)

			if (salesRepsData.length === 0){
				return res.status(200).json({success:true, message: SALES_REPS_NOT_FOUND});
			}

			const unMatchedSalesRepsIds = await this.syncHelper.getNotExistingIds(salesRepsData)

			if(unMatchedSalesRepsIds.length === 0){
				return res.status(200).json({success:true, message: NEW_SALES_REPS_DATA_NOT_FOUND});	
			}

			const salesRepsQuery = {_id: { $in: unMatchedSalesRepsIds }}

			const salesRepsDataToInsert = await this.lisService.getUsers(salesRepsQuery)


			const finalSalesRepsData = await this.syncHelper.getFinalSalesRepsData(salesRepsDataToInsert);

			this.salesRepService.insertSalesReps(finalSalesRepsData)

			return res.status(200).json({success: true, message: SUCCUSS_INSERTED_SALES_REPS });
		} 
		catch (error) {
			console.log({ error });
			
			return res.status(500).json({ success: false, message: error.message || SOMETHING_WENT_WRONG });
		}
	}


	@Get('facilities')
	async syncFacilities(@Res() res: any) {
		try {

			const datesFilter = this.syncHelper.getFromAndToDates(7);

			const salesRepsData = await this.syncHelper.getSalesRepsData(datesFilter)

			if (salesRepsData.length === 0){
				return res.status(200).json({success:true, message: SALES_REPS_NOT_FOUND});
			}

			const salesRepsAndFacilitiesData = await this.syncHelper.getFacilitiesData(salesRepsData)

			const unMatchedFacilitiesIds = await this.syncHelper.getFacilitiesNotExistingIds(salesRepsAndFacilitiesData)

			if(unMatchedFacilitiesIds.length === 0){
				return res.status(200).json({success:true, message: FACILITIES_NOT_FOUND});
			}

			const salesRepsIdsAndRefIds = await this.syncHelper.getSalesRepsIdsandRefIds(salesRepsAndFacilitiesData)

			if (salesRepsIdsAndRefIds.length === 0){
				return res.status(200).json({success:true, message: NEW_SALES_REPS_DATA_NOT_FOUND});
			}

			const salesRepsAndfacilitiesIdsData = await this.syncHelper.getSalesRepsAndFacilitiesIds(salesRepsIdsAndRefIds, salesRepsAndFacilitiesData);

			const hospitalQuery = {
				_id: { $in: unMatchedFacilitiesIds },
				created_at: {
					$gte: datesFilter.fromDate,
					$lte: datesFilter.toDate,
				},
			};

			const faciliticesData = await this.lisService.getHospitalsData(hospitalQuery);

			if (faciliticesData.length === 0){
				return res.status(200).json({success:true, message: FACILITIES_NOT_FOUND});
			}

			const finalArray = await this.syncHelper.getFinalArray(faciliticesData, salesRepsAndfacilitiesIdsData);

			this.faciliticesService.insertfacilities(finalArray)

			return res.status(200).json({success: true, message: SUCCESS_INSERTED_FACILICES});
		}
		catch (error) {
			console.log({ error });
			return res.status(500).json({ success: false, message: error.message || SOMETHING_WENT_WRONG });
		}
	}
}
