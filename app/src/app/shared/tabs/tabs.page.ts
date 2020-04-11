import { Component } from '@angular/core';
import { CommonService, DataBaseService } from '@services/index';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private platform: Platform,
              private translator: TranslateService,
              private dbService: DataBaseService,
              private commonService: CommonService) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });
  }

  goHome() {
    // RELOAD NOTIFICATIONS
    if (this.commonService.getDateLastUse().toDateString() !== new Date().toDateString()) {
      this.dbService.motos.next(this.dbService.motosData);
      this.commonService.setDateLastUse();
    }
  }
}
