import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-configuration',
  templateUrl: 'configuration.page.html',
  styleUrls: ['configuration.page.scss', '../../app.component.scss']
})
export class ConfigurationPage implements OnInit {

  constructor(private platform: Platform,
              private modalController: ModalController,
              private translator: TranslateService,
              private alertController: AlertController) {
      this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
      });
    }

  ngOnInit() {
  }

  openCreateModal() {
  }

}
