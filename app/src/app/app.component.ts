import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, ControlService, ExportService } from '@services/index';
import { PageEnum } from './core/utils';

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
    private exportService: ExportService
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
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();

      // FILES
      this.exportService.createOutputDirectory();

      // DB
      this.dbService.initDB();
      this.controlService.activateButtonExist(PageEnum.HOME);
    });
  }

}
