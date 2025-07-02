import { FileStats } from '@/types';
export declare class FileUtils {
    static generateFormattedFilename(originalFilename: string, documentType?: string): string;
    static getFileStats(filePath: string): FileStats;
    static formatFileSize(bytes: number): string;
    private static estimatePages;
    static ensureDirectoryExists(dirPath: string): void;
    static cleanupFile(filePath: string): void;
}
//# sourceMappingURL=fileUtil.d.ts.map