import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export class BasePage {
  constructor(public platform: Platform,
              public translator: TranslateService) {
    this.platform.ready().then(async () => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      await firstValueFrom(this.translator.use(userLang));
    });
  }
}
