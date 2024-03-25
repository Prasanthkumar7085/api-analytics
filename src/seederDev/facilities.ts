import { HospitalModel } from '../schemas/hospitalSchema';
import mongoose from "mongoose";
import { CaseModel } from '../schemas/caseSchema';
import { SalesRepServiceV3 } from '../sales-rep-v3/sales-rep-v3.service';
import { Configuration } from '../config/config.service';
import { ConfigService } from '@nestjs/config';



async function getFacilitiesData() {
    try {

        console.log('start')

        const configuration = new Configuration(new ConfigService());

        const mongoDb = configuration.getConfig()

        await mongoose.connect(mongoDb);

        // const distinctNamesWithIds = await HospitalModel.aggregate([
        //     { $group: { _id: '$name', id: { $first: '$_id' } } }
        // ]);

        // Format the data as needed
        // const formattedData = distinctNamesWithIds.map(entry => ({
        //     id: entry._id.toString(),
        //     name: entry.name.toUpperCase() // Assuming you want the name in uppercase
        // }));


        //delete case-types data

        // console.log(data)

    }
    catch (err) {
        console.error("Error while connecting to mongoose", err);
    }
}
