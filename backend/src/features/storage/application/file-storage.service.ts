import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class FileStorageService {
  private readonly uploadDir = path.join(
    __dirname,
    '../../../public',
    'images'
  );

  constructor() {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveImage(buffer: Buffer, originalName: string): Promise<string> {
    const fileExtension = path.extname(originalName).toLowerCase();
    const filename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    return filename;
  }

  async deleteImage(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete image ${filename}:`, error);
    }
  }

  getImagePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  generatePublicUrl(filename: string): string {
    return `images/${filename}`;
  }
}
