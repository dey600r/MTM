import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService } from '@services/index';
import { MaintenanceModel, MaintenanceElementModel, ConfigurationModel } from '@models/index';

@Component({
  selector: 'app-configuration',
  templateUrl: 'configuration.page.html',
  styleUrls: ['configuration.page.scss', '../../app.component.scss']
})
export class ConfigurationPage implements OnInit {

  configurations: ConfigurationModel[] = [];
  maintenances: MaintenanceModel[] = [];
  maintenanceElements: MaintenanceElementModel[] = [];

  hideConfiguration = false;
  hideMaintenance = true;
  hideReplacement = true;

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private modalController: ModalController,
              private translator: TranslateService,
              private alertController: AlertController) {
      this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
      }).finally(() => {
        this.initPage();
      });
    }

  ngOnInit() {
  }

  initPage() {
    this.dbService.getConfigurations().subscribe(data => {
      this.configurations = data;
    });

    this.dbService.getMaintenance().subscribe(data => {
      this.maintenances = data;
    });

    this.dbService.getMaintenanceElement().subscribe(data => {
      this.maintenanceElements = data;
    });
  }

  /** CONFIGURATION */

  openCreateConfigurationModal() {
  }

  openEditConfigurationModal(configuration: ConfigurationModel) {

  }

  deleteConfiguration(configuration: ConfigurationModel) {

  }

  /** MAINTENANCE */

  openCreateMaintenanceModal() {

  }

  openEditMaintenanceModal(maintenance: MaintenanceModel) {

  }

  deleteMaintenance(maintenance: MaintenanceModel) {

  }

  /** MAINTENANCE ELEMENTS / REPLACEMENT */

  openCreateReplacementModal() {

  }

  openEditReplacementModal(maintenanceElement: MaintenanceElementModel) {

  }

  deleteReplacement(maintenanceElement: MaintenanceElementModel) {

  }

  getIconReplacement(maintenanceElement: MaintenanceElementModel): string {
    switch (maintenanceElement.id) {
      case 1:
      case 2:
      case 22:
      case 23:
        return 'disc';
      case 4:
      case 5:
        return 'basket';
      case 6:
        return 'flash';
      case 9:
      case 14:
      case 15:
        return 'thermometer';
      case 3:
      case 7:
      case 8:
      case 12:
        return 'color-fill';
      case 11:
      case 13:
      case 16:
        return 'layers';
      case 18:
      case 19:
        return 'eyedrop';
      case 10:
      case 17:
      case 20:
      case 21:
        return 'settings';
      default:
        return this.getRandomIcon();
    }

  }

  getRandomIcon(): string {
    switch (Math.floor(Math.random() * (3 - 1) + 1)) {
      case 1:
        return 'bulb';
      case 2:
        return 'bandage';
      case 3:
        return 'briefcase';
      default:
        return 'barbell';
    }
  }
}
