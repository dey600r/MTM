import { Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {  Constants, ConstantsTable } from '@utils/index';
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
                private dbService: DataBaseService) {
    }

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
}
