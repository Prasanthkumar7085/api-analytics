import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { FacilitiesHelper } from 'src/helpers/facilitiesHelper';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_CASE_TYPES_REVENUE, SUCCESS_FETCHED_CASE_TYPE_VOLUME_AND_COUNT, SUCCESS_FETCHED_REVENUE_MONTH_WISE_TRENDS } from 'src/constants/messageConstants';

@Controller({
	version: '2.0',
	path: 'facilities'
})
export class FacilitiesController {
	constructor(
		private readonly facilitiesService: FacilitiesService,
		private readonly facilitiesHelper: FacilitiesHelper,
	) { }

	@Post('case-types')
	async facilityCaseTypeWiseData(
		@Body() createFacilityDto: CreateFacilityDto,
		@Res() res: any
	) {
		try {
			const { facility_id, from_date, to_date } = createFacilityDto
			const volumeData = await this.facilitiesHelper.findOneVolumeBasedOnFacility(facility_id, from_date, to_date)
			const revenueData = await this.facilitiesHelper.findOneRevenueBasedOnFacility(facility_id, from_date, to_date)

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_CASE_TYPE_VOLUME_AND_COUNT,
				data: {
					volume_data: {
						total_count: volumeData.total_count,
						case_type_wise_count: volumeData.case_type_wise_counts
					},
					revenue_data: {
						total_revenue: revenueData.total_revenue,
						case_type_wise_revenue: revenueData.case_type_wise_revenue
					}
				}
			})

		} catch (error) {
			console.log({ error });
			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			})
		}
	}






	@Post('case-types/revenue')
	async facilityCaseTypeWiseRevenueData(
		@Body() createFacilityDto: CreateFacilityDto,
		@Res() res: any
	) {
		try {
			const { facility_id, from_date, to_date } = createFacilityDto
			const data = await this.facilitiesHelper.findOneRevenueBasedOnFacilityMonthWise(facility_id, from_date, to_date)

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_CASE_TYPES_REVENUE,
				data: data
			})

		} catch (error) {
			console.log({ error });
			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			})
		}

	}


	@Post('revenue-trends')
	async getRevenueMonthWiseTrends(
		@Body() createFacilityDto: CreateFacilityDto,
		@Res() res: any
	) {
		try {
			const { facility_id, from_date, to_date } = createFacilityDto
			const data = await this.facilitiesHelper.findRevenueMonthWiseStats(facility_id, from_date, to_date)

			return res.status(200).json({
				success: true,
				message: SUCCESS_FETCHED_REVENUE_MONTH_WISE_TRENDS,
				data: data
			})

		} catch (error) {
			console.log({ error });
			return res.status(500).json({
				success: false,
				message: error || SOMETHING_WENT_WRONG
			})
		}
	}






	@Get()
	findAll() {
		return this.facilitiesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.facilitiesService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateFacilityDto: UpdateFacilityDto) {
		return this.facilitiesService.update(+id, updateFacilityDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.facilitiesService.remove(+id);
	}
}
