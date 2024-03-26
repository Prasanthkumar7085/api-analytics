import { Controller, Get, Res } from '@nestjs/common';
import { SyncV3Service } from './sync-v3.service';
import { LisService } from 'src/lis/lis.service';
import { syncHelpers } from 'src/helpers/syncHelper';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';
import { SUCCUSS_SEEDED_MARKETING_MANAGERS } from 'src/constants/messageConstants';

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
	async getSalesRepsManagersData(@Res() res: any){
		try {

			const dates = this.syncHelper.getFromAndToDates(7)

			const query = {
				user_type: "HOSPITAL_MARKETING_MANAGER",
				created_at: {
					$gte:  dates.fromDate,
					$lte:  dates.toDate
				}
			};

			const salesRepsManagersData = await this.lisService.getUsers(query)

			const finalSalesRepsManagersdata = await this.syncHelper.getNewSalesRepsManagersData(salesRepsManagersData)

			const insertedData = await this.salesRepService.seedSalesRepsManager(finalSalesRepsManagersdata)

			return res.status(200).json({success:true, message:SUCCUSS_SEEDED_MARKETING_MANAGERS, data: insertedData})
		}
		catch (error){
			console.log({error})
			return res.status(500).json({success:false, error:error})
		}
	}

}
