import { Component, inject } from '@angular/core';

import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, ControlService, ExportService, PlatformService } from '@services/index';
import { PageEnum } from '@utils/index';

declare let window: any;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false
})
export class AppComponent {

  // INJECTIONS
  private readonly platformService: PlatformService = inject(PlatformService);
  private readonly statusBar: StatusBar = inject(StatusBar);
  private readonly dbService: DataBaseService = inject(DataBaseService);
  private readonly translator: TranslateService = inject(TranslateService);
  private readonly controlService: ControlService = inject(ControlService);
  private readonly exportService: ExportService = inject(ExportService);
  
  constructor()
  {
    this.initializeApp();
  }

  initializeApp() {
    this.platformService.getReady().then(() => {
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
