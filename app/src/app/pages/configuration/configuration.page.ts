import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService } from '@services/index';
import { ConstantsColumns } from '@utils/index';
import {
  MaintenanceModel, MaintenanceElementModel, ConfigurationModel, ModalInputModel, ModalOutputModel
} from '@models/index';

// COMPONENTS
import { AddEditConfigurationComponent } from '@modals/add-edit-configuration/add-edit-configuration.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditMaintenanceElementComponent } from '@modals/add-edit-maintenance-element/add-edit-maintenance-element.component';


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

  dataInputModel: ModalInputModel;
  dataReturned: ModalOutputModel;
  rowConfSelected: ConfigurationModel = new ConfigurationModel();
  rowMantSelected: MaintenanceModel = new MaintenanceModel();
  rowReplSelected: MaintenanceElementModel = new MaintenanceElementModel();

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private modalController: ModalController,
              private translator: TranslateService,
              private alertController: AlertController,
              private commonService: CommonService) {
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
      this.configurations = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    });

    this.dbService.getMaintenance().subscribe(data => {
      this.maintenances = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
    });

    this.dbService.getMaintenanceElement().subscribe(data => {
      data.filter(x => x.master).forEach(x => x.name = this.translator.instant('DB.' + x.name));
      this.maintenanceElements = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME);
    });
  }

  /** CONFIGURATION */

  openConfigurationModal(row: ConfigurationModel = new ConfigurationModel(), create: boolean = true) {
    this.rowConfSelected = row;
    this.dataInputModel = new ModalInputModel(create, this.rowConfSelected);
    this.openModal(AddEditConfigurationComponent);
  }

  deleteConfiguration(configuration: ConfigurationModel) {

  }

  /** MAINTENANCE */

  openMaintenanceModal(row: MaintenanceModel = new MaintenanceModel(), create: boolean = true) {
    this.rowMantSelected = row;
    this.dataInputModel = new ModalInputModel(create, this.rowMantSelected);
    this.openModal(AddEditMaintenanceComponent);
  }

  deleteMaintenance(maintenance: MaintenanceModel) {

  }

  /** MAINTENANCE ELEMENTS / REPLACEMENT */

  openReplacementModal(row: MaintenanceElementModel = new MaintenanceElementModel(), create: boolean = true) {
    this.rowReplSelected = row;
    this.dataInputModel = new ModalInputModel(create, this.rowReplSelected);
    this.openModal(AddEditMaintenanceElementComponent);
  }

  deleteReplacement(maintenanceElement: MaintenanceElementModel) {

  }

  getIconReplacement(maintenanceElement: MaintenanceElementModel): string {
    switch (maintenanceElement.id) {
      case 1: case 2: case 22: case 23:
        return 'disc';
      case 4: case 5:
        return 'basket';
      case 6:
        return 'flash';
      case 9: case 14: case 15:
        return 'thermometer';
      case 3: case 7: case 8: case 12:
        return 'color-fill';
      case 11: case 13: case 16:
        return 'layers';
      case 18: case 19:
        return 'eyedrop';
      case 10: case 17: case 20: case 21:
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

  /** COMMON */

  async openModal(modalComponent: any) {

    const modal = await this.modalController.create({
      component: modalComponent,
      componentProps: this.dataInputModel
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
    });

    return await modal.present();
  }
}
