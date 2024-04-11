import { user_role } from '../drizzle/schemas/userRole'
import { db } from './db'


export default {
    seed: async (title) => {
        let data = await db.insert(user_role).values([
            {
                "name": "Markter",
                "id": 1
            },
            {
                "name": "Manager",
                "id": 2
            }
        ]).returning()
        console.log(data)
        console.log(title, "Data Seeded")
    }
}