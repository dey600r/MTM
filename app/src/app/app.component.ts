import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, ControlService, ExportService } from '@services/index';
import { PageEnum } from '@utils/index';

declare let window: any;

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

      // console.log("Plataforma lista. Cordova disponible:", !!window.cordova);

      // if (window.cordova && window.resolveLocalFileSystemURL) {
      //   window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, (fs) => {
      //     console.log("Acceso correcto al directorio:", fs.name);
      //   }, (error) => {
      //     console.error("Error accediendo al sistema de archivos:", error);
      //   });
      // } else {
      //   console.error("Cordova no está disponible en este entorno.");
      // }
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
