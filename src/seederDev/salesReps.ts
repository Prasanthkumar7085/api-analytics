import { ConfigService } from "@nestjs/config";
import { Configuration } from "../config/config.service";
import mongoose from "mongoose";
import { UserModel } from "../schemas/userSchema";
import { db } from "../seeders/db";
import { sales_reps } from "../drizzle/schemas/salesReps";
import { sql } from "drizzle-orm";


async function seedSalesReps() {
    const configuration =  new Configuration(new ConfigService());

    const config = configuration.getConfig()

    const dataBase = mongoose.connect(config)

    const data = await UserModel.find({ user_type : "HOSPITAL_MARKETING_MANAGER"})

    const result_data = []

    data.forEach(item => 
        result_data.push(
            {
                name:item.first_name,
                roleId:2,
                refId:item._id.toString()
            })
        )
    // console.log(result_data.length)

    const salesRepsData = await db.insert(sales_reps).values(result_data).returning()

    await mongoose.disconnect()

    return salesRepsData
}

// seedSalesReps()
