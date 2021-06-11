import { Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { File } from '@ionic-native/file/ngx';

// UTILS
import { Constants, ConstantsTable } from '@utils/index';
import { DataBaseService } from './data-base.service';
import { SqlService } from './sql.service';
import { CalendarService } from './calendar.service';
import { SystemConfigurationModel } from '../models';


@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(private translator: TranslateService,
                private sqlService: SqlService,
                private calendarService: CalendarService,
                private dbService: DataBaseService,
                private file: File) {
    }

    /** SETTINGS */

    getListDistance(): any[] {
        return [
            this.mapToAnyCustomSetting(Constants.SETTING_DISTANCE_KM,
                this.translator.instant(`COMMON.${Constants.SETTING_DISTANCE_KM}`),
                this.translator.instant('COMMON.KILOMETERS')),
            this.mapToAnyCustomSetting(Constants.SETTING_DISTANCE_MILES,
                this.translator.instant('COMMON.MI'),
                this.translator.instant(`COMMON.${Constants.SETTING_DISTANCE_MILES}`))];
    }

    getListMoney(): any[] {
        return [
            this.mapToAnyCustomSetting(Constants.SETTING_MONEY_EURO, '€',
                this.translator.instant(`COMMON.${Constants.SETTING_MONEY_EURO}`)),
            this.mapToAnyCustomSetting(Constants.SETTING_MONEY_DOLLAR, '$',
                this.translator.instant(`COMMON.${Constants.SETTING_MONEY_DOLLAR}`)),
            this.mapToAnyCustomSetting(Constants.SETTING_MONEY_POUND, '£',
                this.translator.instant(`COMMON.${Constants.SETTING_MONEY_POUND}`))];
    }

    getDistanceSelected(settings: SystemConfigurationModel[]): any {
        const select: any = this.getListDistance().find(x => x.code === settings.find(y => y.key === Constants.KEY_CONFIG_DISTANCE).value);
        return this.mapToAnyCustomSetting(select.code, select.value, select.valueLarge);
    }

    getMoneySelected(settings: SystemConfigurationModel[]): any {
        const select: any = this.getListMoney().find(x => x.code === settings.find(y => y.key === Constants.KEY_CONFIG_MONEY).value);
        return this.mapToAnyCustomSetting(select.code, select.value, select.valueLarge);
    }

    // SAVE DATA

    saveSystemConfiguration(key: string, value: string) {
        if (!!value) {
            this.dbService.executeScriptDataBase(
                this.sqlService.updateSqlSystemConfiguration(key, value, this.calendarService.getDateStringToDB(new Date())),
                [ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION]);
        }
    }

    mapToAnyCustomSetting(c: string, v: string, vl: string): any {
        return { code: c, value: v, valueLarge: vl };
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
        const nameFile = `${fileNameExport}_${today.getFullYear()}${today.getMonth()}${today.getDate()}_` +
            `${today.getHours()}${today.getMinutes()}${today.getSeconds()}.${Constants.FORMAT_FILE_DB}`;
        return nameFile;
    }
}
