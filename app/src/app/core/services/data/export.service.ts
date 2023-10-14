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
        return (!!this.file.externalDataDirectory ? this.file.externalDataDirectory : this.getRealPathWindows());
    }

    getRealPathWindows(): string {
        return `C:\\Users\\<USER>\\AppData\\Local\\Packages\\<52193DeyHome.MotortrackManager>\\LocalState\\${Constants.OUTPUT_DIR_NAME}`;
    }

    getPathFile(fileName: string, filePath: string = '') {
        return this.logService.getRootPathFiles(filePath) + '/' + fileName;
    }

    createOutputDirectory() {
        const pathDataDirectory: string = this.logService.getDataDirectory();
        try {
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
        } catch(e: any) {
            this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `Error creating ${Constants.OUTPUT_DIR_NAME} directory`, e);
        }
        
    }

    createDiretory(dirName: string) {
        try {
            const pathRootFiles: string = this.logService.getRootPathFiles();
            this.file?.checkDir(pathRootFiles, dirName).then(dir => {
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
        } catch(e: any) {
            this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `Error creating ${Constants.OUTPUT_DIR_NAME} directory`, e);
        }
    }

    generateNameExportFile(fileNameExport: string = Constants.EXPORT_FILE_NAME) {
        const today: Date = new Date();
        return `${fileNameExport}_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}_` +
            `${today.getHours()}${today.getMinutes()}${today.getSeconds()}.${Constants.FORMAT_FILE_DB}`;
    }

    validateStructureJsonDB(contentFile: string, listTables: string[]): boolean {
        return listTables.every(x => contentFile.includes(x));
    }

    exportJsonWeb(json: any, exportFileName: string) {
        const blob = new Blob([JSON.stringify(json, null, 2)], {type: 'application/json'});
        // window.open(window.URL.createObjectURL(blob)); // OPEN IN A NEW TAB
    
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') !=
            -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", exportFileName);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }
}
