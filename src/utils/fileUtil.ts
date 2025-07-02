import fs from 'fs';
import path from 'path';
import { FileStats } from '@/types';

export class FileUtils {
    static generateFormattedFilename(
        originalFilename: string,
        documentType: string = 'FSTF2'
    ): string {
        const timestamp = Date.now().toString();
        const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const fileExtension = path.extname(originalFilename);
        const baseNameWithoutExt = path.basename(originalFilename, fileExtension);

        // Format: NU_INT_OFF-{timestamp}_{randomId}_{documentType}_{baseNameWithoutExt}...{extension}
        return `PO 36851–UPTIVEMFG`;
    }

    static getFileStats(filePath: string): FileStats {
        const stats = fs.statSync(filePath);
        const extension = path.extname(filePath).toLowerCase();

        return {
            size: stats.size,
            extension,
            pages: this.estimatePages(filePath, extension)
        };
    }

    static formatFileSize(bytes: number): string {
        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${Math.round(kb)} KB`;
        }
        const mb = kb / 1024;
        return `${Math.round(mb * 100) / 100} MB`;
    }

    private static estimatePages(filePath: string, extension: string): number | undefined {
        // Simple estimation based on file size for PDFs
        if (extension === '.pdf') {
            const stats = fs.statSync(filePath);
            // Rough estimate: 1 page ≈ 50KB for text-heavy PDFs
            return Math.max(1, Math.round(stats.size / (50 * 1024)));
        }
        return undefined;
    }

    static ensureDirectoryExists(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    static cleanupFile(filePath: string): void {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(`Error cleaning up file ${filePath}:`, error);
        }
    }
}
