import AWS from 'aws-sdk'
import fs from 'fs'
import { config } from '../config'
import { getSignedUrlApiPayload } from '../services/upload/types'
import fetch from 'node-fetch'
import { File, UploadedFile } from './general_types/general'

const bucketName = config.get('/S3Bucket')
const AWSAccessKeyID = config.get('/AWSAccessId')
const AWSSecretKey = config.get('/AWSSecretAccessKey')
const AWSRegion = config.get('/AWSRegion')

AWS.config.update({
    region: AWSRegion,
    accessKeyId: AWSAccessKeyID,
    secretAccessKey: AWSSecretKey,
    signatureVersion: 'v4'
})

class AwsService {
    bucketName: string
    s3: AWS.S3
    signedUrlExpireSeconds: number
    constructor() {
        this.bucketName = bucketName
        this.s3 = new AWS.S3()
        this.signedUrlExpireSeconds = 60 * 5 * 1000
    }

    public async GetSignedUrl(user: string, type: string, data: getSignedUrlApiPayload) {
        const uploadUrl = await this.s3.getSignedUrlPromise('putObject', {
            Bucket: `${bucketName}`,
            Key: `${type}/${user}/${data?.filename}`,
            Expires: 60 * 5 * 1000,
            ContentType: data?.fileType,
            ACL: data?.ACL
        })

        const imageUrl = `https://${bucketName}.s3.ap-southeast-1.amazonaws.com/${type}/${user}/${data?.filename}`

        return {
            uploadUrl,
            imageUrl
        }
    }

    private generateFileKey(file: File, timestamp: number): string {
        return `${file.name?.split(' ').join('-')}-${timestamp}.${file.extension}`;
    }

    public async uploadFile(file: File): Promise<string> {
        const timestamp = Date.now();
        const fileKey = this.generateFileKey(file, timestamp);
        const fileUploaded = await this.s3
            .putObject({
                Bucket: this.bucketName,
                Key: fileKey,
                ContentType: file.type,
                Body: file.content,
                ACL: "public-read"
            }).promise()

        return `https://vakeelonline.s3.ap-southeast-1.amazonaws.com/${fileKey}`;
    }
}

// const getBlob = async (fileUri) => {
//     const resp = await fetch(fileUri);
//     const imageBody = await resp.blob();

//     return imageBody;
// };

// const uploadImage = async (uploadUrl, data) => {
//     const imageBody = await getBlob(data);

//     return fetch(uploadUrl, {
//         method: "PUT",
//         body: imageBody,
//     });
// };

// uploadImage('', '../../Screenshot.png')

// const uplo = new AwsService()
// uplo.GetSignedUrl({
//     filename: 'Screenshot.png',
//     fileType: 'image/png',
//     ACL: 'public-read'
// })

export default new AwsService()