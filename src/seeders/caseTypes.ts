import { sql } from 'drizzle-orm';
import { case_types } from '../drizzle/schemas/caseTypes'
import { db } from './db'


export default {
    seed: async (title) => {
        let data = await db.insert(case_types).values([
            {
                "id": 1,
                "name": "Covid"
            },
            {
                "id": 2,
                "name": "Respiratory pathogen panel"
            },
            {
                "id": 3,
                "name": "Clinical chemistry"
            },
            {
                "id": 4,
                "name": "UTI"
            },
            {
                "id": 5,
                "name": "Urinanlysis"
            },
            {
                "id": 6,
                "name": "Pgx test"
            },
            {
                "id": 7,
                "name": "Wound"
            },
            {
                "id": 8,
                "name": "Nail"
            },
            {
                "id": 9,
                "name": "Covid flu"
            },
            {
                "id": 10,
                "name": "Cgx panel"
            },
            {
                "id": 11,
                "name": "Cardiac"
            },
            {
                "id": 12,
                "name": "Diabetes"
            },
            {
                "id": 13,
                "name": "Gastro"
            },
            {
                "id": 14,
                "name": "Pad alzheimers"
            },
            {
                "id": 15,
                "name": "Pulmonary panel"
            },
            {
                "id": 16,
                "name": "Gti sti"
            },
            {
                "id": 17,
                "name": "Gti womens health"
            },
            {
                "id": 18,
                "name": "Toxicology"
            }
        ]).returning()
        console.log(data)
        console.log(title, "Data Seeded")
    }
}