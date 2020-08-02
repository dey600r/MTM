import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, ControlService, SettingsService } from '@services/index';
import { PageEnum, Constants } from './core/utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dbService: DataBaseService,
    private translator: TranslateService,
    private controlService: ControlService,
    private settingsService: SettingsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // TRANSLATOR
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    }).finally(() => {
      // CONFIGURATION
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // DB
      this.dbService.initDB();
      this.controlService.activateButtonExist(PageEnum.HOME);

      // FILES
      this.settingsService.createDiretory(Constants.EXPORT_DIR_NAME);
      this.settingsService.createDiretory(Constants.IMPORT_DIR_NAME);
    });
  }

}
