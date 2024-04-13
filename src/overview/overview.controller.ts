import { Controller, Get, Res, Query, UseGuards } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { SOMETHING_WENT_WRONG, SUCCESS_FETCHED_OVERVIEW_CASE_TYPES_REVENUE, SUCCESS_FETCHED_OVERVIEW_CASE_TYPES_VOLUME, SUCCESS_FETCHED_OVERVIEW_REVENUE, SUCCESS_FETCHED_OVERVIEW_REVNUE, SUCCESS_FETCHED_OVERVIEW_STATS_REVENUE, SUCCESS_FETCHED_OVERVIEW_STATS_VOLUME, SUCCESS_FETCHED_OVERVIEW_VOLUME, } from 'src/constants/messageConstants';
import { FilterHelper } from 'src/helpers/filterHelper';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller({
    version: '1.0',
    path: 'overview',
})
export class OverviewController {
    constructor(
        private readonly overviewService: OverviewService,
        private readonly filterHelper: FilterHelper
    ) { }


    @UseGuards(AuthGuard)
    @Get('stats-revenue')
    async getRevenueStats(@Res() res: any, @Query() query: any) {
        try {

            // this filter is used to make the string to date filter
            const queryString = await this.filterHelper.overviewFilter(query);

            const data = await this.overviewService.getRevenueStats(queryString);

            return res.status(200).json({
                success: true,
                message: SUCCESS_FETCHED_OVERVIEW_STATS_REVENUE,
                data: data
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
    @Get('stats-volume')
    async getVolumeStats(@Res() res: any, @Query() query: any) {
        try {

            // this filter is used to make the string to date filter
            const queryString = await this.filterHelper.overviewFilter(query);

            const data = await this.overviewService.getVolumeStats(queryString);

            return res.status(200).json({
                success: true,
                message: SUCCESS_FETCHED_OVERVIEW_STATS_VOLUME,
                data: data
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
    @Get('case-types-revenue')
    async getOverAllCaseTypesRevenue(@Res() res: any, @Query() query: any) {
        try {

            // this filter is used to make the string to date filter
            const queryString = await this.filterHelper.overviewFilter(query);

            const data = await this.overviewService.getOverAllCaseTypesRevenue(queryString);

            return res.status(200).json({
                success: true,
                message: SUCCESS_FETCHED_OVERVIEW_CASE_TYPES_REVENUE,
                data: data
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
    @Get('case-types-volume')
    async getOverAllCaseTypesVolume(@Res() res: any, @Query() query: any) {
        try {

            // this filter is used to make the string to date filter
            const queryString = await this.filterHelper.overviewFilter(query);

            const data = await this.overviewService.getOverAllCaseTypesVolume(queryString);

            return res.status(200).json({
                success: true,
                message: SUCCESS_FETCHED_OVERVIEW_CASE_TYPES_VOLUME,
                data: data
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
    @Get('revenue')
    async getOverviewRevenueData(@Res() res: any, @Query() query: any) {
        try {

            // this filter is used to make the string to date filter
            const queryString = await this.filterHelper.overviewFilter(query);

            const data = await this.overviewService.getOverviewRevenueData(queryString);

            return res.status(200).json({
                success: true,
                message: SUCCESS_FETCHED_OVERVIEW_REVENUE,
                data: data
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
    @Get('volume')
    async getOverviewVolumeData(@Res() res: any, @Query() query: any) {
        try {

            // this filter is used to make the string to date filter
            const queryString = await this.filterHelper.overviewFilter(query);

            const data = await this.overviewService.getOverviewVolumeData(queryString);

            return res.status(200).json({
                success: true,
                message: SUCCESS_FETCHED_OVERVIEW_VOLUME,
                data: data
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
