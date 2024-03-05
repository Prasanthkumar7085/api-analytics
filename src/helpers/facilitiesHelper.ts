import { Injectable } from "@nestjs/common";
import * as fs from 'fs';



@Injectable()
export class FacilitiesHelper {

    async findOneVolumeBasedOnFacility(id: string, from_date: Date, to_date: Date) {
        const volumeResponse = fs.readFileSync('./VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(volumeResponse);

        let totalCounts = {};
        let total = 0;

        const fromDate = new Date(from_date)
        const toDate = new Date(to_date)

        for (const item of finalVolumeResp) {
            const itemDate = new Date(item.date);
            // console.log('hello')
            if (itemDate >= fromDate && itemDate <= toDate) {

                // console.log('hello world')
                for (const hospital of item.hospital_case_type_wise_counts) {
                    if (hospital.hospital == id) {
                        console.log('hiii')
                        //iterate over keys and values in hospital object
                        for (const [key, value] of Object.entries(hospital)) {
                            if (key !== 'hospital') {
                                if (!totalCounts[key]) {
                                    totalCounts[key] = 0
                                }

                                const count = typeof value === 'number' ? value : 0
                                //sum up the counts
                                totalCounts[key] += value;

                                total += count;
                            }
                        }

                    }
                }
            }
        }

        return { totalCounts, total }
    }

}