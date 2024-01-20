import { faker } from '@faker-js/faker';
import { caseTypes, hospitalIds, marketerIds } from 'src/constants/statsConstants';


function seedStats(fromDate, toDate) {

    const from_date = new Date(fromDate + "T00:00:00.000Z");
    const to_date = new Date(toDate + "T00:00:00.000Z");

    console.log({ from_date });

    const finalArray = []


    console.log(marketerIds.length);
    for (let dateString = from_date; dateString <= to_date; dateString.setDate(dateString.getDate() + 1)) {

        for (let i = 0; i < marketerIds.length; i++) {

            const marketer_id = marketerIds[i]
            const date = dateString.toISOString()

            let resp = prepareCaseTypesCount()

            const case_type_wise_counts = resp.caseTypeData
            const hospital_case_type_wise_counts = resp.hospitalsData


            let totalPending = 0;
            let totalCompleted = 0;

            // Iterate through the array and sum the counts
            case_type_wise_counts.forEach(({ pending, completed }) => {
                totalPending += pending;
                totalCompleted += completed;
            });

            const total_cases = totalCompleted + totalPending
            const pending_cases = totalPending
            const completed_cases = totalCompleted
            const hospitals_count = resp.numberOfHospitals


            let response = {
                marketer_id, total_cases, pending_cases, completed_cases, hospitals_count, date, case_type_wise_counts, hospital_case_type_wise_counts
            }

            finalArray.push(response)
        }
    }

    console.log("length:", finalArray.length);
    return finalArray;
    //  {
    //     marketer_id, total_cases, pending_cases, completed_cases, hospitals_count, date, case_type_wise_counts, hospital_case_type_wise_counts
    // }
}


function prepareCaseTypesCount() {
    const hospitalsData = prepareHospitalWiseCounts();


    const caseTypeCounts = {
        "COVID": { pending: 0, completed: 0 },
        "RESPIRATORY_PATHOGEN_PANEL": { pending: 0, completed: 0 },
        "TOXICOLOGY": { pending: 0, completed: 0 },
        "CLINICAL_CHEMISTRY": { pending: 0, completed: 0 },
        "UTI": { pending: 0, completed: 0 },
        "URINALYSIS": { pending: 0, completed: 0 },
        "PGX": { pending: 0, completed: 0 },
        "WOUND": { pending: 0, completed: 0 },
        "NAIL": { pending: 0, completed: 0 },
        "COVID_FLU": { pending: 0, completed: 0 },
        "CGX": { pending: 0, completed: 0 },
        "CARDIAC": { pending: 0, completed: 0 },
        "DIABETES": { pending: 0, completed: 0 },
        "GASTRO": { pending: 0, completed: 0 },
        "PAD": { pending: 0, completed: 0 },
        "PULMONARY": { pending: 0, completed: 0 }
    };

    // Iterate through each hospital and aggregate counts
    hospitalsData.forEach((hospital) => {
        Object.keys(caseTypeCounts).forEach((caseType) => {
            caseTypeCounts[caseType].pending += hospital[caseType.toLowerCase()];
            caseTypeCounts[caseType].completed += hospital[caseType.toLowerCase()];
        });
    });

    // Divide counts by the number of hospitals
    const numberOfHospitals = hospitalsData.length;

    console.log({numberOfHospitals});

    Object.keys(caseTypeCounts).forEach((caseType) => {
        caseTypeCounts[caseType].pending /= numberOfHospitals;
        caseTypeCounts[caseType].completed /= numberOfHospitals;
    });

    // Convert to the desired response format
    const caseTypeData = Object.keys(caseTypeCounts).map((caseType) => ({
        case_type: caseType,
        pending: Math.round(caseTypeCounts[caseType].pending),
        completed: Math.round(caseTypeCounts[caseType].completed),
    }));

    return {
        caseTypeData, hospitalsData, numberOfHospitals
    }


}


function prepareHospitalWiseCounts() {

    const shuffledHospitals = faker.helpers.shuffle(hospitalIds);

    const generateRandomObject = (hospital) => {
        const counts = {};
        caseTypes.forEach((caseType) => {
            counts[caseType.toLowerCase()] = faker.number.int(100);
        });

        return {
            hospital: hospital,
            ...counts
        };
    };

    const generatedObjects = shuffledHospitals.slice(0, 10).map(generateRandomObject);
    return generatedObjects;
}

const generateEvenNumber = () => {
    let number;
    do {
        number = faker.datatype.number(100);
    } while (number % 2 !== 0);
    return number;
};
export default seedStats;