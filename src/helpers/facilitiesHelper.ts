import { Injectable } from "@nestjs/common";
import * as fs from 'fs';



@Injectable()
export class FacilitiesHelper {

    async findOneVolumeBasedOnFacility(id: string, from_date: Date, to_date: Date) {
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(volumeResponse);

        let case_type_wise_counts = {};
        let total_count = 0;

        const fromDate = new Date(from_date)
        const toDate = new Date(to_date)

        for (const item of finalVolumeResp) {
            const itemDate = new Date(item.date);

            if (itemDate >= fromDate && itemDate <= toDate) {

                for (const hospital of item.hospital_case_type_wise_counts) {

                    if (hospital.hospital == id) {
                        //iterate over keys and values in hospital object
                        for (const [key, value] of Object.entries(hospital)) {
                            if (key !== 'hospital') {
                                if (!case_type_wise_counts[key]) {
                                    case_type_wise_counts[key] = 0
                                }
                                //explicitly saying value type is number
                                const count = typeof value === 'number' ? value : 0
                                //sum up the counts
                                case_type_wise_counts[key] += value;

                                //adding individual count to total count
                                total_count += count;
                            }
                        }
                    }
                }
            }
        }

        return { case_type_wise_counts, total_count }
    }

    async findOneRevenueBasedOnFacility(id: string, from_date: Date, to_date: Date) {

        const revenueResponse = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const revenue = JSON.parse(revenueResponse);

        let case_type_wise_revenue = {};
        let total_revenue: number = 0;

        const fromDate = new Date(from_date)
        const toDate = new Date(to_date)


        for (const item of revenue) {
            const itemDate = new Date(item.date);
            if (itemDate >= fromDate && itemDate <= toDate) {
                for (const hospital of item.hospital_wise_counts) {
                    if (hospital.hospital == id) {
                        total_revenue += hospital.total_amount
                        hospital.case_type_wise_counts.forEach(caseType => {
                            const { case_type, total_amount } = caseType;
                            case_type_wise_revenue[case_type] = (case_type_wise_revenue[case_type] || 0) + total_amount
                        })
                    }
                }
            }
        }
        return { case_type_wise_revenue, total_revenue }
    }
}


