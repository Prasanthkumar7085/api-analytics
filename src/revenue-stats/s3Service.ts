// // s3.service.ts
// import { Injectable } from '@nestjs/common';
// import * as AWS from 'aws-sdk';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class S3Service {
//   private s3: AWS.S3;

//   constructor(private prisma: PrismaService) {
//     this.s3 = new AWS.S3();
//   }

//   async getPresignedUrl(filename: string): Promise<string> {
//     const params = {
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: `revenue-raw/${filename}`,
//       Expires: 60, // Time in seconds for the URL to expire
//       ContentType: 'application/octet-stream', // Set the content type based on your file type
//     };

//     return this.s3.getSignedUrlPromise('putObject', params);
//   }

//   async importDataFromS3(filePath): Promise<AWS.S3.GetObjectOutput> {
//     const params: AWS.S3.GetObjectRequest = {
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: filePath,
//     };

//     return this.s3.getObject(params).promise();
//   }
// }

