import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { BasePage } from '../base.page';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: [],
    standalone: false
})
export class TabsPage extends BasePage {

  constructor(platform: Platform,
              translator: TranslateService) {
    super(platform, translator);
  }

}
