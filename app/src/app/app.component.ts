import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, ControlService, ExportService } from '@services/index';
import { PageEnum } from '@utils/index';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private readonly platform: Platform,
    private readonly statusBar: StatusBar,
    private readonly dbService: DataBaseService,
    private readonly translator: TranslateService,
    private readonly controlService: ControlService,
    private readonly exportService: ExportService
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
      this.statusBar.styleLightContent();

      // FILES
      this.exportService.createOutputDirectory();

      // DB
      this.dbService.initDB();
      this.controlService.activateButtonExist(PageEnum.HOME);
    });
  }

}
