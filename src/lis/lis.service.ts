import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CaseModel } from "src/schemas/caseSchema";
import { HospitalModel } from "src/schemas/hospitalSchema";
import { InsurancePayorsModel } from "src/schemas/insurancPayors";
import { LabModel } from "src/schemas/lab";
import { LabTestPanelModel } from "src/schemas/testPanelSchema";
import { UserModel } from "src/schemas/userSchema";



@Injectable()
export class LisService {
    constructor(
        @InjectModel('User') private userModel: typeof UserModel,
        @InjectModel('Case') private caseModel: typeof CaseModel,
        @InjectModel('Insurance_Payors') private insuranceModel: typeof InsurancePayorsModel,
        @InjectModel('Test_Panels') private labTestPanelModel: typeof LabTestPanelModel,
        @InjectModel('Hospital') private hospitalModel: typeof HospitalModel,
        @InjectModel('Lab') private labModel: typeof LabModel,
    ) { }


    async getUsers(query, select = {}) {
        return await this.userModel.find(query).select(select).lean();
    }


    async getUserById(userId, projection = {}) {
        return await this.userModel.findById(userId).select(projection);
    }


    async getCases(query, select = {}) {
        return await this.caseModel.find(query).select(select);
    }


    async getCaseByAccessionId(query) {
        return await this.caseModel.find(query).select({
            accession_id: 1, _id: 1, case_types: 1, hospital: 1, hospital_marketers: 1,
            'patient_info._id': 1, 'patient_info.first_name': 1, 'patient_info.middle_name': 1, 'patient_info.last_name': 1
        });
    }


    // Fetch insurance data from lis
    async getInsurancePayors(query = {}, projection = {}) {

        //need to get the last 10 days data
        return await this.insuranceModel.find(query).select(projection);

    }


    async getCaseTypes(query = {}, projection = {}) {

        return await this.labTestPanelModel.find(query).select(projection);
    }


    async getFacilities(query, projection) {

        return await this.hospitalModel.find(query).select(projection).lean();
    }


    async getHospitalsData(query) {
        return await this.hospitalModel.find(query);
    }

    async getLabs(query = {}, select = {}) {
        return await this.labModel.find(query).select(select).lean();
    }


    async getUserByUserName(username) {
        return await this.userModel.findOne({
            username,
            status: { $ne: "ARCHIVED" },
        }).lean();
    }

    async getCasesStats() {
        return await this.userModel.aggregate([
            {
                $match: {
                    status: "ACTIVE",
                    user_type: { $in: ["HOSPITAL_MARKETING_MANAGER", "MARKETER"] }
                }
            },
            {
                $lookup: {
                    from: 'hospitals',
                    localField: 'hospitals',
                    foreignField: '_id',
                    as: 'hospitals'
                }
            },
            {
                $unwind: '$hospitals'
            },
            {
                $lookup: {
                    from: 'cases',
                    let: { hospitalId: '$hospitals._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$hospital', '$$hospitalId'] },
                                        { $ne: ['$status', 'ARCHIVE'] },
                                        { $ne: ['$status', 'ARCHIVED'] },
                                        { $gte: [{ $toDate: '$received_date' }, { $toDate: "2023-10-01T05:00:00Z" }] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'cases'
                }
            },
            {
                $addFields: {
                    'hospitals.total_cases_count': { $size: '$cases' }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    first_name: { $first: '$first_name' },
                    last_name: { $first: '$last_name' },
                    user_type: { $first: '$user_type' },
                    hospitals: { $push: '$hospitals' }
                }
            },
            {
                $project: {
                    first_name: 1,
                    last_name: 1,
                    user_type: 1,
                    hospitals: {
                        _id: 1,
                        name: 1,
                        total_cases_count: 1
                    }
                }
            }
        ]);
    }
}
