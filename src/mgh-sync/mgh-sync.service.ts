import { Injectable } from '@nestjs/common';
import { CaseModel } from 'src/schemas/caseSchema';
import { HospitalModel } from 'src/schemas/hospitalSchema';
import { InsurancePayorsModel } from 'src/schemas/insurancPayors';
import { LabModel } from 'src/schemas/lab';
import { UserModel } from 'src/schemas/userSchema';

@Injectable()
export class MghSyncService {
    constructor(
    ) { }


    async getUsers(query, select = {}) {
        return await UserModel.find(query).select(select).lean();
    }


    async getUserById(userId, projection = {}) {
        return await UserModel.findById(userId).select(projection);
    }


    async getCases(query, select = {}) {
        return await CaseModel.find(query).select(select);
    }

    async getlabs(query = {}, select = {}) {
        return await LabModel.find(query).select(select).lean();
    }

    async getFacilities(query, projection) {
        return await HospitalModel.find(query).select(projection).lean();
    }


    async getInsurancePayors(query = {}, projection = {}) {
        return await InsurancePayorsModel.find(query).select(projection);

    }

    async getUserByUserName(username) {
        return await UserModel.findOne({
            username,
            status: { $ne: "ARCHIVED" },
        }).lean();
    }

    async getCasesStats() {
        return await UserModel.aggregate([
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
                                        { $gte: [{ $toDate: '$received_date' }, { $toDate: "2023-10-01T04:00:00Z" }] }
                                    ]
                                }
                            }
                        },
                        // Limit the fields if necessary
                        { $project: { hospital: 1, status: 1, received_date: 1 } }
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
