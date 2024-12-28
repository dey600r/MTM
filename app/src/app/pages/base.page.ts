import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export class BasePage {
  constructor(public platform: Platform,
              public translator: TranslateService) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });
  }
}
