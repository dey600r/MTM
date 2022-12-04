import { Injectable } from '@angular/core';

// LIBRARIES
import { File } from '@awesome-cordova-plugins/file/ngx';

// UTILS
import { Constants } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor(private file: File) {
    }

    /** EXPORTS AND IMPORTS */

    getDataDirectory(): string {
        return (!!this.file.externalRootDirectory ? this.file.externalRootDirectory : this.file.dataDirectory);
    }

    getRootDirectory(): string {
        return (!!this.file.externalRootDirectory ? this.file.externalRootDirectory : '');
    }

    getRootPathFiles(filePath: string = ''): string {
        return `${this.getDataDirectory()}${this.getRootRelativePath(filePath)}`;
    }

    getRootRelativePath(filePath: string = ''): string {
        return `${Constants.OUTPUT_DIR_NAME}/${filePath}`;
    }

    getRootRealRelativePath(filePath: string = ''): string {
        const dataDirectory: string = this.getRealRelativeDirectory();
        return `${dataDirectory.substring(this.getRootDirectory().length, dataDirectory.length)}${this.getRootRelativePath(filePath)}`;
    }

    getRealRelativeDirectory(): string {
        return (!!this.file.externalRootDirectory ? this.file.externalRootDirectory : this.getRealPathWindows());
    }

    getRealPathWindows(): string {
        return `C:\\Users\\<USER>\\AppData\\Local\\Packages\\<52193DeyHome.MotortrackManager>\\LocalState\\${Constants.OUTPUT_DIR_NAME}`;
    }

    getPathFile(fileName: string, filePath: string = '') {
        return this.getRootPathFiles(filePath) + '/' + fileName;
    }

    createOutputDirectory() {
        this.file.checkDir(this.getDataDirectory(), Constants.OUTPUT_DIR_NAME).then(dir => {
            console.log(`${Constants.OUTPUT_DIR_NAME} directory exists`);
            this.createDiretory(Constants.EXPORT_DIR_NAME);
            this.createDiretory(Constants.IMPORT_DIR_NAME);
        }).catch(errCheck => {
            console.log(`${Constants.OUTPUT_DIR_NAME} directory dont exists`);
            this.file.createDir(this.getDataDirectory(), Constants.OUTPUT_DIR_NAME, false).then(newDir => {
                console.log(`${Constants.OUTPUT_DIR_NAME} directory created`);
                this.createDiretory(Constants.EXPORT_DIR_NAME);
                this.createDiretory(Constants.IMPORT_DIR_NAME);
            }).catch(errCreate => {
                console.log(`Error creating ${Constants.OUTPUT_DIR_NAME} directory`);
            });
        });
    }

    createDiretory(dirName: string) {
        this.file.checkDir(this.getRootPathFiles(), dirName).then(dir => {
            console.log(`${dirName} directory exists`);
        }).catch(errCheck => {
            console.log(`${dirName} directory dont exists`);
            this.file.createDir(this.getRootPathFiles(), dirName, false).then(newDir => {
                console.log(`${dirName} directory created`);
                this.file.createFile(this.getRootPathFiles(dirName), Constants.FILE_EMPTY_NAME, true);
            }).catch(errCreate => {
                console.log(`Error creating ${dirName} directory`);
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
