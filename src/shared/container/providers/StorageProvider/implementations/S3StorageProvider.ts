/* eslint-disable import/no-extraneous-dependencies */
import { S3 } from "@aws-sdk/client-s3";
import upload from "@config/uploadConfig";
import fs from "fs";
import mime from "mime";
import { resolve } from "path";

import { IStorageProvider } from "../IStorageProvide";

export class S3StorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new S3({
            region: process.env.AWS_REGION,
        });
    }

    async save(file: string, folder: string): Promise<string> {
        const filePath = resolve(upload.tmpFolder, file);

        const readedFilePath = await fs.promises.readFile(filePath);

        const ContentType = mime.getType(filePath);

        await this.client
            .putObject({
                Bucket: process.env.AWS_BUCKET,
                Key: `${folder}/${file}`,
                ACL: "public-read",
                Body: readedFilePath,
                ContentType,
            })
            .then();

        // removendo das pasta tmp
        await fs.promises.unlink(filePath);

        return file;
    }
    async delete(file: string, folder: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: process.env.AWS_BUCKET,
                Key: `${folder}/${file}`,
            })
            .then();
    }
}
