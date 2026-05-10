import AWS from 'aws-sdk';
import fs from 'fs';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export class StorageService {
  static async uploadFile(filePath: string, bucket: string, key: string): Promise<string> {
    if (!process.env.AWS_ACCESS_KEY_ID) {
      console.log('AWS Credentials not found, mock uploading:', filePath);
      return `https://mock-storage.contractly.in/${key}`;
    }

    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: bucket,
      Key: key,
      Body: fileContent,
      ContentType: 'application/pdf'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  }
}
