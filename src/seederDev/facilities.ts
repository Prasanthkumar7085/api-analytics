import { HospitalModel } from '../schemas/hospitalSchema';
import mongoose from "mongoose";
import { CaseModel } from '../schemas/caseSchema';
import { SalesRepServiceV3 } from '../sales-rep-v3/sales-rep-v3.service';
import { Configuration } from '../config/config.service';
import { ConfigService } from '@nestjs/config';




(async function () {
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
})();

// [
//     //     { id: 1, name: 'COVID' },
//     //     { id: 2, name: 'RESPIRATORY_PATHOGEN_PANEL' },
//     //     { id: 3, name: 'CLINICAL_CHEMISTRY' },
//     //     { id: 4, name: 'UTI' },
//     //     { id: 5, name: 'URINALYSIS' },
//     //     { id: 6, name: 'PGX_TEST' },
//     //     { id: 7, name: 'WOUND' },
//     //     { id: 8, name: 'NAIL' },
//     //     { id: 9, name: 'COVID_FLU' },
//     //     { id: 10, name: 'CGX_PANEL' },
//     //     { id: 11, name: 'CARDIAC' },
//     //     { id: 12, name: 'DIABETES' },
//     //     { id: 13, name: 'GASTRO' },
//     //     { id: 14, name: 'PAD_ALZHEIMERS' },
//     //     { id: 15, name: 'PULMONARY_PANEL' },
//     //     { id: 16, name: 'GTI_STI' },
//     //     { id: 17, name: 'GTI_WOMENS_HEALTH' },
//     //     { id: 18, name: 'TOXICOLOGY' }
//     //   ]
