import { ConfigService } from "@nestjs/config";
import mongoose from "mongoose";
import { Configuration } from "../config/config.service";
import { UserModel } from "../schemas/userSchema";
import { HospitalModel } from "../schemas/hospitalSchema";
import * as fs from 'fs';
import { HOSPITAL_MARKETING_MANAGER, MARKETER } from "src/constants/lisConstants";


export default {
    seed: async () => {
        console.log(12345);

        const configuration = new Configuration(new ConfigService());
        const { lis_mgh_db_url } = configuration.getConfig();
        await mongoose.connect(lis_mgh_db_url);

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

        fs.writeFileSync("mgh-sales-reps", JSON.stringify(users), "utf8");
    }
};