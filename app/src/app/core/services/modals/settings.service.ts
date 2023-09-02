import { Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { Constants } from '@utils/index';
import { CRUDService } from '../data/index';

// MODALS
import { SystemConfigurationModel, ISettingModel } from '@models/index';


@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(private translator: TranslateService,
                private crudService: CRUDService) {
    }

    /** SETTINGS */

    getListDistance(): ISettingModel[] {
        return [
            this.mapToAnyCustomSetting(Constants.SETTING_DISTANCE_KM,
                this.translator.instant(`COMMON.${Constants.SETTING_DISTANCE_KM}`),
                this.translator.instant('COMMON.KILOMETERS')),
            this.mapToAnyCustomSetting(Constants.SETTING_DISTANCE_MILES,
                this.translator.instant('COMMON.MI'),
                this.translator.instant(`COMMON.${Constants.SETTING_DISTANCE_MILES}`))];
    }

    getListMoney(): ISettingModel[] {
        return [
            this.mapToAnyCustomSetting(Constants.SETTING_MONEY_EURO, '€',
                this.translator.instant(`COMMON.${Constants.SETTING_MONEY_EURO}`)),
            this.mapToAnyCustomSetting(Constants.SETTING_MONEY_DOLLAR, '$',
                this.translator.instant(`COMMON.${Constants.SETTING_MONEY_DOLLAR}`)),
            this.mapToAnyCustomSetting(Constants.SETTING_MONEY_POUND, '£',
                this.translator.instant(`COMMON.${Constants.SETTING_MONEY_POUND}`))];
    }

    getListThemes(): ISettingModel[] {
        return [
            this.mapToAnyCustomSetting(Constants.SETTING_THEME_LIGHT,
                this.translator.instant(`COMMON.${Constants.SETTING_THEME_LIGHT_DESC}`), Constants.SETTING_THEME_LIGHT),
            this.mapToAnyCustomSetting(Constants.SETTING_THEME_DARK,
                this.translator.instant(`COMMON.${Constants.SETTING_THEME_DARK_DESC}`), Constants.SETTING_THEME_DARK),
            this.mapToAnyCustomSetting(Constants.SETTING_THEME_SKY,
                this.translator.instant(`COMMON.${Constants.SETTING_THEME_SKY_DESC}`), Constants.SETTING_THEME_SKY)
          ];
    }

    getDistanceSelected(settings: SystemConfigurationModel[]): ISettingModel {
        const select: any = this.getListDistance().find(x => x.code === settings.find(y => y.key === Constants.KEY_CONFIG_DISTANCE).value);
        return this.mapToAnyCustomSetting(select.code, select.value, select.valueLarge);
    }

    getMoneySelected(settings: SystemConfigurationModel[]): ISettingModel {
        const select: any = this.getListMoney().find(x => x.code === settings.find(y => y.key === Constants.KEY_CONFIG_MONEY).value);
        return this.mapToAnyCustomSetting(select.code, select.value, select.valueLarge);
    }

    getThemeSelected(settings: SystemConfigurationModel[]): ISettingModel {
        const select: ISettingModel = this.getListThemes().find(x => x.code === settings.find(y => y.key === Constants.KEY_CONFIG_THEME).value);
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
        return this.crudService.saveSystemConfiguration(key, value);
    }

    mapToAnyCustomSetting(c: string, v: string, vl: string): ISettingModel {
        return { code: c, value: v, valueLarge: vl };
    }

    finishImportLoad() {
        this.crudService.loadAllTables();
    }
}
