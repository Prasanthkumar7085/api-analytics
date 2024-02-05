import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserModel } from "src/schemas/userSchema";



@Injectable()
export class LisService {
    constructor(
        @InjectModel('User') private userModel: typeof UserModel
    ) { }


    async getUsers(query, projection = {}) {
        console.log(23);
        return await this.userModel.find(query).select(projection);
    }
}