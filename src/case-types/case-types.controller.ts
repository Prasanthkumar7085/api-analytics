import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { CaseTypesService } from './case-types.service';
import { FilterHelper } from 'src/helpers/filterHelper';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_CASE_TYEPS_MONTH_WISE_REVENUE_DATA, SUCCESS_FETCHED_CASE_TYEPS_MONTH_WISE_VOLUME_DATA, SUCCESS_FETCHED_CASE_TYPES, SUCCESS_FETCHED_CASE_TYPES_STATS } from 'src/constants/messageConstants';
import { AuthGuard } from 'src/guards/auth.guard';
import { SyncHelpers } from 'src/helpers/syncHelper';

@Controller({
	version: '1.0',
	path: 'case-types'
})
export class CaseTypesController {
	constructor(
		private readonly caseTypesService: CaseTypesService,
		private readonly filterHelper: FilterHelper,
		private readonly syncHelper: SyncHelpers
	) { }


	@UseGuards(AuthGuard)
	@Get()
	async getAllCaseTypes(@Res() res: any) {
		try {

			const caseTypesData = await this.caseTypesService.getAllCaseTypes();

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_CASE_TYPES,
				data: caseTypesData
			});
		} catch (err) {
			console.log({ err });
			return res.status(500).json({
				success: true,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}



	@UseGuards(AuthGuard)
	@Get("stats")
	async getCaseTypeStatsData(@Res() res: any, @Query() query: any) {
		try {

			// here filter is used to make a string for date filter.
			const queryString = await this.filterHelper.facilitiesFilter(query);

			const data = await this.caseTypesService.getCaseTypeStatsData(queryString);

			console.log(data.length);
			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_CASE_TYPES_STATS,
				data: data
			});
		}
		catch (err) {
			console.log({ err });

			return res.status(500).json({
				success: false,
				message: err || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get('months/revenue')
	async getCaseTypesMonthWiseData(@Res() res: any, @Query() query: any) {
		try {

			const queryString = await this.filterHelper.facilitiesFilter(query);

			const data = await this.caseTypesService.getCaseTypesMonthWiseRevenueData(queryString);

			const resultsArray = this.syncHelper.modifySalesRepRevenuCaseTypeWise(data);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_CASE_TYEPS_MONTH_WISE_REVENUE_DATA,
				data: resultsArray
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}

	@UseGuards(AuthGuard)
	@Get('months/volume')
	async getCaseTypesMonthWiseOverallData(@Res() res: any, @Query() query: any) {
		try {

			const queryString = await this.filterHelper.facilitiesFilter(query);

			const data = await this.caseTypesService.getCaseTypesMonthWiseVolumeData(queryString);

			const resultArray = this.syncHelper.modifySalesRepVolumeCaseTypeWise(data);

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_CASE_TYEPS_MONTH_WISE_VOLUME_DATA,
				data: resultArray
			});
		}
		catch (error) {
			console.log({ error });

			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			});
		}
	}
}


