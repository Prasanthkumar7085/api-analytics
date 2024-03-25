import { sql } from "drizzle-orm";
import { db } from "../seeders/db";
import { case_types } from "../drizzle/schemas/caseTypes";


async function getCaseTypes() {

    let query = sql`
        SELECT *
        FROM user_role
    `;

    const data = await db.execute(query)

    console.log(data.rows);
}
// getCaseTypes()


async function deleteData() {
    let query = sql`
        DELETE FROM user_role
    `;
    const data = await db.execute(query)

    console.log(data)
}

// deleteData()

async function seedCaseTypes() {

    let data = await db.insert(case_types).values([
        {
            "id": 1,
            "name": "COVID",
            "displayName": "COVID"
        },
        {
            "id": 2,
            "name": "RESPIRATORY_PATHOGEN_PANEL",
            "displayName": "RPP"
        },
        {
            "id": 3,
            "name": "CLINICAL_CHEMISTRY",
            "displayName": "CLINICAL_CHEMISTRY"
        },
        {
            "id": 4,
            "name": "UTI",
            "displayName": "UTI"
        },
        {
            "id": 5,
            "name": "URINALYSIS",
            "displayName": "URINALYSIS"
        },
        {
            "id": 6,
            "name": "PGX_TEST",
            "displayName": "PGX_TEST"
        },
        {
            "id": 7,
            "name": "WOUND",
            "displayName": "WOUND"
        },
        {
            "id": 8,
            "name": "NAIL",
            "displayName": "NAIL"
        },
        {
            "id": 9,
            "name": "COVID_FLU",
            "displayName": "COVID_FLU"
        },
        {
            "id": 10,
            "name": "CGX_PANEL",
            "displayName": "CGX_PANEL"
        },
        {
            "id": 11,
            "name": "CARDIAC",
            "displayName": "CARDIAC"
        },
        {
            "id": 12,
            "name": "DIABETES",
            "displayName": "DIABETES"
        },
        {
            "id": 13,
            "name": "GASTRO",
            "displayName": "GASTRO"
        },
        {
            "id": 14,
            "name": "PAD_ALZHEIMERS",
            "displayName": "PAD_ALZHEIMERS"
        },
        {
            "id": 15,
            "name": "PULMONARY_PANEL",
            "displayName": "PULMONARY_PANEL"
        },
        {
            "id": 16,
            "name": "GTI_STI",
            "displayName": "GTI_STI"
        },
        {
            "id": 17,
            "name": "GTI_WOMENS_HEALTH",
            "displayName": "GTI_WOMENS_HEALTH"
        },
        {
            "id": 18,
            "name": "TOXICOLOGY",
            "displayName": "TOXICOLOGY"
        }
    ]);

    console.log(data)
}

// seedCaseTypes()





// [
//     {
//       id: 1,
//       name: 'Shanvantari Marketer',
//       ref_id: 'M1',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 2,
//       name: 'jawahar sk',
//       ref_id: 'M2',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 3,
//       name: 'kamal A',
//       ref_id: 'M3',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 4,
//       name: 'Lakshmi V',
//       ref_id: 'M4',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 5,
//       name: 'madhavi markter',
//       ref_id: 'M5',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 6,
//       name: 'marie ro',
//       ref_id: 'M6',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 7,
//       name: 'marketer six',
//       ref_id: 'M7',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 8,
//       name: 'new test',
//       ref_id: 'M8',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 9,
//       name: 'one marketer',
//       ref_id: 'M9',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 10,
//       name: 'rakesh bodapati',
//       ref_id: 'M10',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 11,
//       name: 'Scott Edward',
//       ref_id: 'M11',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 12,
//       name: 'sree sree',
//       ref_id: 'M12',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 13,
//       name: 'sree marketer',
//       ref_id: 'M13',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 14,
//       name: 'test marketer',
//       ref_id: 'M14',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 15,
//       name: 'Test vol one',
//       ref_id: 'M15',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 16,
//       name: 'testing user',
//       ref_id: 'M16',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 17,
//       name: 'three marketer',
//       ref_id: 'M17',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 18,
//       name: 'two marketer',
//       ref_id: 'M18',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 19,
//       name: 'venkat V',
//       ref_id: 'M19',
//       reporting_to: 21,
//       role_id: 1
//     },
//     {
//       id: 20,
//       name: 'Vishnu K',
//       ref_id: 'M20',
//       reporting_to: 21,
//       role_id: 1
//     },
//     { id: 21, name: 'Mark', ref_id: 'M21', reporting_to: 21, role_id: 2 }
//   ]