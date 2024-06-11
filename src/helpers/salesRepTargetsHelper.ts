import { Injectable } from "@nestjs/common";
import { SalesRepService } from "src/sales-rep/sales-rep.service";
import { SalesRepsTargetsService } from "src/sales-reps-targets/sales-reps-targets.service";
@Injectable()
export class SalesRepTargetsHelper {
    constructor(
        private readonly salesRepService: SalesRepService,
        private readonly salesRepsTargetsService: SalesRepsTargetsService,
    ) { }
    async seedSalesRepTargets(startYear: number, endYear: number, startMonth: number, endMonth: number, salesRepsIds = []) {
        console.log({salesRepsIds})
        const batchSize = 50; // Define the batch size
        const data = await this.generateData(startYear, endYear, startMonth, endMonth, salesRepsIds);
        // Split data into batches
        for (let i = 0; i < data.length; i += batchSize) {
            const batchData = data.slice(i, i + batchSize);
            await this.insertBatch(batchData);
        }
        console.log("Data Seeded");
    }
    private async insertBatch(batchData: any[]) {
        try {
            await this.salesRepsTargetsService.insertSalesRepsTargets(batchData);
            console.log("Batch inserted successfully", batchData);
        } catch (error) {
            console.error("Error inserting batch:", error);
        }
    }
    private async generateData(startYear: number, endYear: number, startMonth: number, endMonth: number, salesRepsIds) {
        const data = [];
        const salesRepIds = await this.getActiveSalesReps();
        for (let salesRepId of salesRepsIds) {
            let currentYear = startYear;
            let currentMonth = startMonth;
            while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
                const startDate = new Date(currentYear, currentMonth - 1, 1); // Month is zero-indexed
                const endDate = new Date(currentYear, currentMonth, 0); // Last day of the month
                const entry = {
                    salesRepId,
                    startDate: await this.formatDate(startDate),
                    endDate: await this.formatDate(endDate),
                    month: await this.formatMonth(startDate),
                    covid: 0,
                    covidFlu: 0,
                    clinical: 0,
                    gastro: 0,
                    nail: 0,
                    pgx: 0,
                    rpp: 0,
                    tox: 0,
                    ua: 0,
                    uti: 0,
                    wound: 0,
                    card: 0,
                    total: 0,
                    newFacilities: 0
                };
                data.push(entry);
                if (currentMonth === 12) {
                    currentMonth = 1;
                    currentYear++;
                } else {
                    currentMonth++;
                }
            }
        }
        return data;
    }
    private async formatDate(date: Date): Promise<string> {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    private async formatMonth(date: Date): Promise<string> {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${month}-${year}`;
    }
    async getActiveSalesReps(): Promise<number[]> {
        const idsData = await this.salesRepService.getActiveSalesReps();
        return idsData.map(e => e.id);
    }
}