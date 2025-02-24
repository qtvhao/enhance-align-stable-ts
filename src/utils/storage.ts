// src/utils/storage.ts
import { minioClient } from '../minio/minioClient';
import { config } from '../config'

export class Storage {
    private client = minioClient;
    private bucketName: string;

    constructor() {
        this.bucketName = config.minio.bucketName
    }

    uploadAudioFile = async (file: Express.Multer.File): Promise<string> => {
        await this.uploadFile(file.filename, file.path);
        console.log(`File uploaded to MinIO: ${file.filename}`);
        return file.filename;
    }

    /**
     * Uploads a file to MinIO.
     * @param fileName - The name of the file.
     * @param filePath - The local path to the file.
     */
    async uploadFile(fileName: string, filePath: string): Promise<void> {
        try {
            await this.client.fPutObject(this.bucketName, fileName, filePath);
            console.log(`✅ File '${fileName}' uploaded successfully`);
        } catch (error) {
            console.error(`❌ Error uploading file '${fileName}':`, error);
            throw error;
        }
    }

    /**
     * Downloads a file from MinIO.
     * @param fileName - The name of the file.
     * @param downloadPath - The local path to save the file.
     */
    async downloadFile(fileName: string, downloadPath: string): Promise<void> {
        try {
            await this.client.fGetObject(this.bucketName, fileName, downloadPath);
            console.log(`📥 File '${fileName}' downloaded to '${downloadPath}'`);
        } catch (error) {
            console.error(`❌ Error downloading file '${fileName}':`, error);
            throw error;
        }
    }

    /**
     * Deletes a file from MinIO.
     * @param fileName - The name of the file.
     */
    async deleteFile(fileName: string): Promise<void> {
        try {
            await this.client.removeObject(this.bucketName, fileName);
            console.log(`🗑️ File '${fileName}' deleted successfully`);
        } catch (error) {
            console.error(`❌ Error deleting file '${fileName}':`, error);
            throw error;
        }
    }

    /**
     * Checks if a file exists in MinIO.
     * @param fileName - The name of the file.
     * @returns {Promise<boolean>} - Returns true if the file exists, false otherwise.
     */
    async fileExists(fileName: string): Promise<boolean> {
        try {
            await this.client.statObject(this.bucketName, fileName);
            return true;
        } catch (error: any) {
            if (error.code === 'NotFound') {
                return false;
            }
            console.error(`❌ Error checking file '${fileName}':`, error);
            throw error;
        }
    }
}
