import { sql } from "drizzle-orm";
import { db } from "../seeders/db";
import { case_types } from "../drizzle/schemas/caseTypes";



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
