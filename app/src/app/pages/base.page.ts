import { inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export class BasePage {

  // INJECTIONS
  protected platform: Platform = inject(Platform);
  protected translator: TranslateService = inject(TranslateService);

  constructor() {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });
  }
}
