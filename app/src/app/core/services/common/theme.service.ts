import { Injectable } from '@angular/core';
import { DomController } from '@ionic/angular';

// UTILS
import { Constants, DarkTheme, SkyTheme } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    constructor(private readonly domCtrl: DomController) {}

    changeTheme(themeCode: string) {
        return new Promise<boolean>((resolve) => {
            this.domCtrl.write(() => {
                if (themeCode === Constants.SETTING_THEME_LIGHT) {
                    document.documentElement.style.cssText = '';
                }
                else {
                    this.getTheme(themeCode).styles.forEach(style => {
                        document.documentElement.style.setProperty(style.themeVariable, style.value);
                    });
                }
                resolve(true);
            });
        });
    }

    private getTheme(themeCode): any {
        switch (themeCode) {
            case Constants.SETTING_THEME_SKY:
                return SkyTheme;
            case Constants.SETTING_THEME_DARK:
                return DarkTheme;
            default:
                return DarkTheme;
        }
    }
}
