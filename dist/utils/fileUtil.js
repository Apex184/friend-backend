"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileUtils {
    static generateFormattedFilename(originalFilename, documentType = 'FSTF2') {
        const timestamp = Date.now().toString();
        const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const fileExtension = path_1.default.extname(originalFilename);
        const baseNameWithoutExt = path_1.default.basename(originalFilename, fileExtension);
        return `NU_INT_OFF-${timestamp}_${randomId}_${documentType}_${baseNameWithoutExt}...${fileExtension}`;
    }
    static getFileStats(filePath) {
        const stats = fs_1.default.statSync(filePath);
        const extension = path_1.default.extname(filePath).toLowerCase();
        return {
            size: stats.size,
            extension,
            pages: this.estimatePages(filePath, extension)
        };
    }
    static formatFileSize(bytes) {
        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${Math.round(kb)} KB`;
        }
        const mb = kb / 1024;
        return `${Math.round(mb * 100) / 100} MB`;
    }
    static estimatePages(filePath, extension) {
        if (extension === '.pdf') {
            const stats = fs_1.default.statSync(filePath);
            return Math.max(1, Math.round(stats.size / (50 * 1024)));
        }
        return undefined;
    }
    static ensureDirectoryExists(dirPath) {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
    }
    static cleanupFile(filePath) {
        try {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error(`Error cleaning up file ${filePath}:`, error);
        }
    }
}
exports.FileUtils = FileUtils;
//# sourceMappingURL=fileUtil.js.map