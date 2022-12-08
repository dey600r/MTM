import { Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { File } from '@awesome-cordova-plugins/file/ngx';

// UTILS
import { Constants, ConstantsTable } from '@utils/index';
import { DataBaseService, SqlService, CalendarService } from '../common/index';

// MODALS
import { SystemConfigurationModel } from '@models/index';


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

    getListThemes(): any[] {
        return [
            this.mapToAnyCustomSetting(Constants.SETTING_THEME_LIGHT,
                this.translator.instant(`COMMON.${Constants.SETTING_THEME_LIGHT_DESC}`), Constants.SETTING_THEME_LIGHT),
            this.mapToAnyCustomSetting(Constants.SETTING_THEME_DARK,
                this.translator.instant(`COMMON.${Constants.SETTING_THEME_DARK_DESC}`), Constants.SETTING_THEME_DARK),
            this.mapToAnyCustomSetting(Constants.SETTING_THEME_SKY,
                this.translator.instant(`COMMON.${Constants.SETTING_THEME_SKY_DESC}`), Constants.SETTING_THEME_SKY)
          ];
    }

    getDistanceSelected(settings: SystemConfigurationModel[]): any {
        const select: any = this.getListDistance().find(x => x.code === settings.find(y => y.key === Constants.KEY_CONFIG_DISTANCE).value);
        return this.mapToAnyCustomSetting(select.code, select.value, select.valueLarge);
    }

    getMoneySelected(settings: SystemConfigurationModel[]): any {
        const select: any = this.getListMoney().find(x => x.code === settings.find(y => y.key === Constants.KEY_CONFIG_MONEY).value);
        return this.mapToAnyCustomSetting(select.code, select.value, select.valueLarge);
    }

    getThemeSelected(settings: SystemConfigurationModel[]): any {
        const select: any = this.getListThemes().find(x => x.code === settings.find(y => y.key === Constants.KEY_CONFIG_THEME).value);
        return this.mapToAnyCustomSetting(select.code, select.value, select.valueLarge);
    }

    getPrivacySelected(settings: SystemConfigurationModel[]): boolean {
        return settings.find(y => y.key === Constants.KEY_CONFIG_PRIVACY).value === Constants.DATABASE_YES;
    }

    getSyncEmailSelected(settings: SystemConfigurationModel[]): string {
        return settings.find(y => y.key === Constants.KEY_CONFIG_SYNC_EMAIL).value;
    }

    getVersionSelected(settings: SystemConfigurationModel[]): SystemConfigurationModel {
        return settings.find(y => y.key === Constants.KEY_LAST_UPDATE_DB);
    }

    // SAVE DATA

    saveSystemConfiguration(key: string, value: string): Promise<any> {
        if (!!value) {
             return this.dbService.executeScriptDataBase(
                        this.sqlService.updateSqlSystemConfiguration(key, value,
                            this.calendarService.getDateStringToDB(new Date())), [ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION]);
        }
        return null;
    }

    insertSystemConfiguration() {
        const data = this.dbService.getSystemConfigurationData();
        let sql = '';
        if (!data.some(x => x.key === Constants.KEY_CONFIG_THEME)) {
            sql = this.sqlService.insertSqlSystemConfiguration(
                    [new SystemConfigurationModel(Constants.KEY_CONFIG_THEME, Constants.SETTING_THEME_LIGHT, new Date(), 4)]);
        }
        if (!data.some(x => x.key === Constants.KEY_CONFIG_PRIVACY)) {
            sql += this.sqlService.insertSqlSystemConfiguration(
                    [new SystemConfigurationModel(Constants.KEY_CONFIG_PRIVACY, Constants.DATABASE_NO, new Date(), 5)]);
        }
        if (!data.some(x => x.key === Constants.KEY_CONFIG_SYNC_EMAIL)) {
            sql += this.sqlService.insertSqlSystemConfiguration(
                    [new SystemConfigurationModel(Constants.KEY_CONFIG_SYNC_EMAIL, '', new Date(), 6)]);
        }
        if (sql) {
            this.dbService.executeScriptDataBase(sql);
        }
    }

    mapToAnyCustomSetting(c: string, v: string, vl: string): any {
        return { code: c, value: v, valueLarge: vl };
    }

    finishImportLoad() {
        this.dbService.loadAllTables();
        setTimeout(() => { this.insertSystemConfiguration(); }, 500);
    }
}