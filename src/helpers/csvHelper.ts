import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';

@Injectable()
export class CsvHelper {
    async convertToCsv(data: any[]): Promise<string> {
        const fields = [
            { label: 'Sales Rep Name', value: 'sales_rep_name' },
            { label: 'User Type', value: 'user_type' },
            { label: 'Hospital ID', value: 'hospitals._id' },
            { label: 'Hospital Name', value: 'hospitals.name' },
            { label: 'Total Cases Count', value: 'hospitals.total_cases_count' }
        ];

        // Flattening the JSON structure for CSV
        const flatData = data.flatMap(user =>
            user.hospitals.map(hospital => ({
                sales_rep_name: user.first_name + " " + user.last_name,
                user_type: user.user_type,
                'hospitals._id': hospital._id,
                'hospitals.name': hospital.name,
                'hospitals.total_cases_count': hospital.total_cases_count
            }))
        );

        const parser = new Parser({ fields });
        return parser.parse(flatData);
    }
}