import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ConfigurationService, MotoService, OperationService } from '@services/index';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['../../app.component.scss']
})
export class TabsPage {

  constructor(private platform: Platform,
              private translator: TranslateService,
              private motoService: MotoService,
              private operationService: OperationService,
              private configurationService: ConfigurationService) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });
  }

  clickTab(type: string) {
    switch (type) {
      case 'moto':
        this.motoService.showLoader();
        break;
      case 'operation':
          this.operationService.showLoader();
          break;
      case 'configuration':
        this.configurationService.showLoader();
        break;
    }
  }
}
