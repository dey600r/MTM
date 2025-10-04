import { Component } from '@angular/core';

// LIBRARIES
import { BasePage } from '../base.page';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: [],
    standalone: false
})
export class TabsPage extends BasePage {

  constructor() {
    super();
  }

}
