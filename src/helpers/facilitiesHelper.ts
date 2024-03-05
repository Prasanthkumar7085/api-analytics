import * as fs from 'fs';


export class FacilitiesHelper {
    async getFacilityRevenueStats(id:string,from_date:Date, to_date:Date){
        const facilitiesRevenueStats = fs.readFileSync('./RevenueStatsData.json', "utf-8");
        const finalRevenueStats = JSON.parse(facilitiesRevenueStats);

        let total_amount = 0;
        let paid_amount = 0;
        let pending_amount = 0;

        for (const data of finalRevenueStats) {
            const date = new Date(data.date);

            if (date >= from_date && date <= to_date) {
            
                for (const hospital of data.hospital_wise_counts) {
                    if (hospital.hospital === id) {

                        total_amount += hospital.total_amount;
                        paid_amount += hospital.paid_amount;
                        pending_amount += hospital.pending_amount;
                    }
                }
            }
        }
        return ({ total_amount: total_amount, paid_amount: paid_amount, pending_amount: pending_amount })
    }

    
    async getFacilityVolumeStats(id,from_date,to_date){
        const VolumeStatsData = fs.readFileSync('VolumeStatsData.json', "utf-8");
        const finalVolumeResp = JSON.parse(VolumeStatsData);

        let total_cases = 0;
        let completed_cases = 0;
        let pending_cases = 0;

        for (const data of finalVolumeResp) {
            const date = new Date(data.date)
            
            if (date >= from_date && date <= to_date) {

                for (const hospital of data.hospital_case_type_wise_counts){
                    if (hospital.hospital === id){
                        
                        total_cases += data.total_cases
                        completed_cases += data.completed_cases
                        pending_cases += data.pending_cases
                    }
                }
            }
        }
        return ({ total_cases: total_cases, completed_cases: completed_cases, pending_cases: pending_cases })
    }

}