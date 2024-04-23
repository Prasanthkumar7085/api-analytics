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

            const targetData = await this.overviewService.getOverviewVolumeTargetsData(queryString);

            const transformedTargetData = targetData.map((entry: any) => {
                // Extract month and year from the month string
                const [month, year] = entry.month.split('-');
                // Format the month and year into a human-readable format
                const formattedMonth = `${new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year}`;

                // Calculate the total cases for the current entry
                const totalCases = Object.values(entry)
                    .filter((value: any) => !isNaN(Number(value)))
                    .reduce((acc: number, value: string) => acc + Number(value), 0);

                // Return an object with the month and the total cases
                return {
                    month: formattedMonth,
                    target_cases: totalCases
                };
            });

            const mergedData = data.map((entry: any) => {
                const matchedEntry = transformedTargetData.find((t: any) => t.month === entry.month);
                const target_cases = matchedEntry ? matchedEntry.target_cases : 0;
                return {
                    ...entry,
                    target_cases: target_cases
                };
            });

            mergedData.sort((a: any, b: any) => {
                const dateA = new Date(a.month);
                const dateB = new Date(b.month);
                return dateB.getTime() - dateA.getTime();
            });

            return res.status(200).json({
                success: true,
                message: SUCCESS_FETCHED_OVERVIEW_VOLUME,
                data: mergedData
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
