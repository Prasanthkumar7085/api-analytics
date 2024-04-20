

export class TargetsAchivedHelper {

    modifyAchivedTargets(achivedData) {
        const groupedData = {};

        achivedData.forEach(entry => {
            // Extract the month and year from the entry
            const monthYear = this.formatDate(entry.month);

            // Iterate through each key-value pair in the entry
            Object.entries(entry).forEach(([key, value]) => {
                // Exclude the 'month' key
                if (key !== 'month') {
                    // Extract the case type from the key (e.g., 'covid_a' -> 'covid')
                    const caseType = key.split('_')[0];

                    // Create the case type object if it doesn't exist
                    if (!groupedData[caseType]) {
                        groupedData[caseType] = {
                            case_type: caseType,
                            month_wise: []
                        };
                    }

                    // Check if the month already exists for the case type
                    const existingMonth = groupedData[caseType].month_wise.find(item => item.month === monthYear);
                    if (existingMonth) {
                        // If the month exists, increment the total cases
                        existingMonth.total_cases += value;
                    } else {
                        // If the month doesn't exist, add a new entry for that month
                        groupedData[caseType].month_wise.push({
                            month: monthYear,
                            total_cases: value
                        });
                    }
                }
            });
        });

        // Convert the grouped data object to an array of values
        const result = Object.values(groupedData);

        return result;
    }


    formatDate(monthString) {
        const [month, year] = monthString.split('-');
        const date = new Date(`${month}-01-${year}`);
        return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }


    mergeResults(targetedData, achivedData) {
        const groupedData = {};

        // Iterate through each entry in the achievedData
        achivedData.forEach(entry => {
            // Extract the month and year from the entry
            const monthYear = entry.month;

            // Iterate through each key-value pair in the entry
            Object.entries(entry).forEach(([key, value]) => {
                // Exclude the 'month' key
                if (key !== 'month' && value !== 0) {
                    // Extract the case type from the key (e.g., 'covid_flu' -> 'covid')
                    const caseType = key.split('_')[0];

                    // Create the case type object if it doesn't exist
                    if (!groupedData[caseType]) {
                        groupedData[caseType] = {
                            case_type: caseType,
                            month_wise: []
                        };
                    }

                    // Check if the month already exists for the case type
                    const existingMonth = groupedData[caseType].month_wise.find(item => item.month === monthYear);
                    if (existingMonth) {
                        // If the month exists, increment the total cases
                        existingMonth.total_cases += value;
                    } else {
                        // If the month doesn't exist, add a new entry for that month
                        groupedData[caseType].month_wise.push({
                            month: monthYear,
                            total_cases: value
                        });
                    }
                }
            });
        });

        // Iterate through each entry in the targetedData
        targetedData.forEach(entry => {
            // Extract the month and year from the entry
            const monthYear = entry.month;

            // Iterate through each key-value pair in the entry
            Object.entries(entry).forEach(([key, value]) => {
                // Exclude the 'month' key
                if (key !== 'month' && value !== 0) {
                    // Extract the case type from the key (e.g., 'covid_flu' -> 'covid')
                    const caseType = key.split('_')[0];

                    // Find the corresponding case type object in groupedData
                    const caseTypeObject = groupedData[caseType];

                    // If the case type object exists
                    if (caseTypeObject) {
                        // Find the month object in month_wise array for the current case type
                        const monthObject = caseTypeObject.month_wise.find(item => item.month === monthYear);

                        // If the month object exists, add the target cases
                        if (monthObject) {
                            monthObject.target_cases = value;
                        }
                    }
                }
            });
        });

        // Convert the grouped data object to an array of values
        const result = Object.values(groupedData);
        return result;
    }
}