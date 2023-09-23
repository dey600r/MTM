import { Injectable } from '@angular/core';

// LIBRARIES
import { File } from '@awesome-cordova-plugins/file/ngx';

// SERVICES
import { LogService } from '../common/log.service';

// UTILS
import { Constants, PageEnum, ToastTypeEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor(private file: File,
                private logService: LogService) {
    }

    /** EXPORTS AND IMPORTS */

    getRootRealRelativePath(filePath: string = ''): string {
        const dataDirectory: string = this.getRealRelativeDirectory();
        return `${dataDirectory.substring(this.logService.getRootDirectory().length, dataDirectory.length)}${this.logService.getRootRelativePath(filePath)}`;
    }

    getRealRelativeDirectory(): string {
        return (!!this.file.externalRootDirectory ? this.file.externalRootDirectory : this.getRealPathWindows());
    }

    getRealPathWindows(): string {
        return `C:\\Users\\<USER>\\AppData\\Local\\Packages\\<52193DeyHome.MotortrackManager>\\LocalState\\${Constants.OUTPUT_DIR_NAME}`;
    }

    getPathFile(fileName: string, filePath: string = '') {
        return this.logService.getRootPathFiles(filePath) + '/' + fileName;
    }

    createOutputDirectory() {
        const pathDataDirectory: string = this.logService.getDataDirectory();
        this.file.checkDir(pathDataDirectory, Constants.OUTPUT_DIR_NAME).then(dir => {
            this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, `${Constants.OUTPUT_DIR_NAME} directory exists`);
            this.createDiretory(Constants.EXPORT_DIR_NAME);
            this.createDiretory(Constants.IMPORT_DIR_NAME);
        }).catch(errCheck => {
            this.file.createDir(pathDataDirectory, Constants.OUTPUT_DIR_NAME, false).then(newDir => {
                this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, `${Constants.OUTPUT_DIR_NAME} directory created`);
                this.createDiretory(Constants.EXPORT_DIR_NAME);
                this.createDiretory(Constants.IMPORT_DIR_NAME);
            }).catch(errCreate => {
                this.logService.logInfo(ToastTypeEnum.DANGER, PageEnum.HOME, `Error creating ${Constants.OUTPUT_DIR_NAME} directory`, errCreate);
            });
        });
    }

    createDiretory(dirName: string) {
        const pathRootFiles: string = this.logService.getRootPathFiles();
        this.file.checkDir(pathRootFiles, dirName).then(dir => {
            this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, `${dirName} directory exists`);
        }).catch(errCheck => {
            this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `${dirName} directory dont exists`);
            this.file.createDir(pathRootFiles, dirName, false).then(newDir => {
                this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, `${dirName} directory created`);
                this.file.createFile(this.logService.getRootPathFiles(dirName), Constants.FILE_EMPTY_NAME, true);
            }).catch(errCreate => {
                this.logService.logInfo(ToastTypeEnum.DANGER, PageEnum.HOME, `Error creating ${dirName} directory`, errCreate);
            });
        });
    }

    generateNameExportFile(fileNameExport: string = Constants.EXPORT_FILE_NAME) {
        const today: Date = new Date();
        return `${fileNameExport}_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}_` +
            `${today.getHours()}${today.getMinutes()}${today.getSeconds()}.${Constants.FORMAT_FILE_DB}`;
    }

    validateStructureJsonDB(contentFile: string, listTables: string[]): boolean {
        return listTables.every(x => contentFile.includes(x));
      }
}
