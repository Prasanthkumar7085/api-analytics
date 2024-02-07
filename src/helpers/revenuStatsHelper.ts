import { FileUploadDataServiceProvider } from "services/fileUploadService";
import { INVALID_FILE, NO_FILE } from "src/constants/messageConstants";
import { CustomError } from "src/middlewares/customValidationMiddleware";
import { MapRevenueCsvDataHelper } from "./mapRevenueCsvDataHelper";


export class RevenueStatsHelpers {
    constructor(
        private readonly fileUploadDataServiceProvider: FileUploadDataServiceProvider,
        private readonly mapRevenueCsvDataHelper: MapRevenueCsvDataHelper,
    ) { }


    async covertCsvToJson(file) {
        try {
            if (!file) {
                throw new CustomError(400, NO_FILE)
            }

            if (file.mimetype !== 'text/csv') {
                throw new CustomError(400, INVALID_FILE)
            }

            const csvFileData = await this.fileUploadDataServiceProvider.processCsv(file);
            // console.log("fileRews", csvFileData);
            const MappedRevenueCsvData = await this.mapRevenueCsvDataHelper.mapCsvDataForDb(csvFileData)

            console.log("MappedRevenueCsvData", MappedRevenueCsvData)
            return MappedRevenueCsvData;
        } catch (err) {
            throw err;
        }
    }
}