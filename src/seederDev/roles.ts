import { db } from '../seeders/db'
import { user_role } from '../drizzle/schemas/userRole'



async function seedUserRole() {

    let data = await db.insert(user_role).values([
        {
            "name": "Marketer",
            "id": 1
        },
        {
            "name": "Manager",
            "id": 2
        }
    ]).returning()

    console.log(data)
}

// seedUserRole()