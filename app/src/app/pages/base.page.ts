import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PlatformService } from '@services/index';

export class BasePage {

  // INJECTIONS
  protected platformService: PlatformService = inject(PlatformService);
  protected translator: TranslateService = inject(TranslateService);

  constructor() {
    this.platformService.getReady().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });
  }
}
