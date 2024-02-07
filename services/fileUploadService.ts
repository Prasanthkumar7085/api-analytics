import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class FileUploadDataServiceProvider {
    async processCsv(file): Promise<any[]> {
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null); // Signal the end of the stream

        const results = await new Promise<any[]>((resolve, reject) => {
            const parsedData = [];
            readableStream
                .pipe(csvParser())
                .on('data', (data) => parsedData.push(data))
                .on('end', () => resolve(parsedData))
                .on('error', reject);
        });

        return results;
    }
}