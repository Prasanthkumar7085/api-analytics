import { ConfigService } from "@nestjs/config";
import mongoose from "mongoose";
import { Configuration } from "../config/config.service";
import { UserModel } from "../schemas/userSchema";
import { HOSPITAL_MARKETING_MANAGER, MARKETER } from "../constants/messageConstants";
import { HospitalModel } from "../schemas/hospitalSchema";
import * as fs from 'fs';


export default {
    seed: async () => {
        console.log(12345);

        const configuration = new Configuration(new ConfigService());
        const { lis_dlw_db_url } = configuration.getConfig();
        await mongoose.connect(lis_dlw_db_url);

        console.log("CONNECCTED");

        const query = {
            status: "ACTIVE",
            user_type: {
                $in: [MARKETER, HOSPITAL_MARKETING_MANAGER]
            }
        };


        const select = {
            first_name: 1,
            last_name: 1,
            hospitals: 1
        };

        const users = await UserModel.find(query).select(select)
            .populate({
                path: "hospitals",
                model: HospitalModel,
                select: "name",
            });
        console.log({ users: users.length });

        fs.writeFileSync("dlw-sales-reps", JSON.stringify(users), "utf8");
    }
};