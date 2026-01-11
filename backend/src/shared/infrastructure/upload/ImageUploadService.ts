import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

export interface UploadResult {
    url: string;
    filename: string;
    size: number;
}

export class ImageUploadService {
    private readonly allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
    ];
    private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

    public validateImage(file: UploadedFile): void {
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(
                `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
            );
        }

        if (file.size > this.maxFileSize) {
            throw new Error(
                `File size too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`
            );
        }
    }

    public async uploadToCloudinary(file: UploadedFile): Promise<UploadResult> {

        this.validateImage(file);

        // For now, I'll return a mock URL
        // In production, we'll upload the file and return the actual URL
        const filename = `${uuidv4()}-${file.originalname}`;
        const mockUrl = `https://storage.moodrobe.com/products/${filename}`;

        return {
            url: mockUrl,
            filename,
            size: file.size,
        };
    }

    public async uploadMultiple(files: UploadedFile[]): Promise<UploadResult[]> {
        const uploadPromises = files.map((file) => this.uploadToCloudinary(file));
        return Promise.all(uploadPromises);
    }

    public generatePlaceholderUrl(text: string): string {
        // Generate placeholder image URL
        return `https://via.placeholder.com/600x400/cccccc/ffffff?text=${encodeURIComponent(
            text
        )}`;
    }
}