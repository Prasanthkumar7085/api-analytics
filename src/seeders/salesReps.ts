import { sales_reps } from '../drizzle/schemas/salesReps'
import { db } from './db'


export default {
    seed: async (title) => {
        let data = await db.insert(sales_reps).values([
            {
                "id": 1,
                "name": "Emily Johnson",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M1"
            },
            {
                "id": 2,
                "name": "Benjamin Davis",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M2"
            },
            {
                "id": 3,
                "name": "Olivia Martinez",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M3"
            },
            {
                "id": 4,
                "name": "Liam Thompson",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M4"
            },
            {
                "id": 5,
                "name": "Ava Wilson",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M5"
            },
            {
                "id": 6,
                "name": "Jackson Taylor",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M6"
            },
            {
                "id": 7,
                "name": "Sophia Anderson",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M7"
            },
            {
                "id": 8,
                "name": "Aiden Miller",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M8"
            },
            {
                "id": 9,
                "name": "Emma Hernandez",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M9"
            },
            {
                "id": 10,
                "name": "Mason White",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M10"
            },
            {
                "id": 11,
                "name": "Isabella Moore",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M11"
            },
            {
                "id": 12,
                "name": "Caleb Brown",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M12"
            },
            {
                "id": 13,
                "name": "Harper Lee",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M13"
            },
            {
                "id": 14,
                "name": "Elijah Harris",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M14"
            },
            {
                "id": 15,
                "name": "Abigail Robinson",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M15"
            },
            {
                "id": 16,
                "name": "Logan Clark",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M16"
            },
            {
                "id": 17,
                "name": "Grace Turner",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M17"
            },
            {
                "id": 18,
                "name": "Carter Baker",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M18"
            },
            {
                "id": 19,
                "name": "Mia Lewis",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M19"
            },
            {
                "id": 20,
                "name": "Lucas Adams",
                "roleId": 1,
                "reportingTo": 21,
                "refId": "M20"
            },
            {
                "id": 21,
                "name": "Mark",
                "roleId": 2,
                "reportingTo": 21,
                "refId": "M21"
            }
        ]).returning()
        console.log(data)
        console.log(title, "Data Seeded")
    }
}