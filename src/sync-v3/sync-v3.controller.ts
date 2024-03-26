import { Controller, Get, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { LisService } from 'src/lis/lis.service';
import { syncHelpers } from 'src/helpers/syncHelper';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';
import { SUCCUSS_SEEDED_MARKETING_MANAGERS, SUCCUSS_SEEDED_SALES_REPS } from 'src/constants/messageConstants';

@Controller({
  version: '3.0',
  path: 'sync'
})
export class SyncV3Controller {
	constructor(
		private readonly syncV3Service: SyncV3Service,
		private readonly lisService: LisService,
		private readonly syncHelper: syncHelpers,
		private readonly salesRepService: SalesRepServiceV3
		) {}


	@Get('managers')
	async syncSalesRepsManagers(@Res() res: any){
		try {

			const datesObj = this.syncHelper.getFromAndToDates(7)

			const query = {
				user_type: "HOSPITAL_MARKETING_MANAGER",
				created_at: {
					$gte:  datesObj.fromDate,
					$lte:  datesObj.toDate
				}
			};

			const salesRepsManagersData = await this.lisService.getUsers(query)

			const finalSalesRepsManagersData = await this.syncHelper.getNewSalesRepsManagersData(salesRepsManagersData)

			const insertedData = await this.salesRepService.seedSalesRepsManager(finalSalesRepsManagersData)

			return res.status(200).json({success:true, message:SUCCUSS_SEEDED_MARKETING_MANAGERS, data: insertedData})
		}
		catch (error){
			console.log({error})
			return res.status(500).json({success:false, error:error})
		}
	}


	@Get('marketer')
	async syncSalesRepsMarketers(@Res() res:any){
		try {

			const datesObj = this.syncHelper.getFromAndToDates(7)

			const query = {
				user_type: "MARKETER",
				created_at: {
					$gte:  datesObj.fromDate,
					$lte:  datesObj.toDate
				}
			};

			const salesRepsMarketersData = await this.lisService.getUsers(query)

			const finalSalesRepsMarketersData = await this.syncHelper.getNewSalesRepsData(salesRepsMarketersData)
			
			
			const insertedData = await this.salesRepService.seedSalesReps(finalSalesRepsMarketersData)

			return res.status(200).json({success:true, message:SUCCUSS_SEEDED_SALES_REPS, data: insertedData})

		}
		catch (error){
			console.log({error})
			return res.status(500).json({success:false, error:error})
		}
	}
}
