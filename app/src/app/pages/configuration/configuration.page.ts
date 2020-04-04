import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService, ConfigurationService } from '@services/index';
import { ConstantsColumns, ActionDB } from '@utils/index';
import {
  MaintenanceModel, MaintenanceElementModel, ConfigurationModel, ModalInputModel, ModalOutputModel, MotoModel, OperationModel
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

  motos: MotoModel[] = [];
  operations: OperationModel[] = [];
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
              private commonService: CommonService,
              private configurationService: ConfigurationService) {
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
    this.dbService.getMotos().subscribe(data => {
      // Filter to get less elemnts to better perfomance
      this.motos = data.filter(x => x.configuration.id !== 1);
    });

    this.dbService.getOperations().subscribe(data => {
      // Filter to get less elemnts to better perfomance
      this.operations = data.filter(x => !!x.listMaintenanceElement && x.listMaintenanceElement.length > 0);
    });

    this.dbService.getConfigurations().subscribe(data => {
      this.configurations = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    });

    this.dbService.getMaintenance().subscribe(data => {
      this.maintenances = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
    });

    this.dbService.getMaintenanceElement().subscribe(data => {
      this.maintenanceElements = this.configurationService.orderMaintenanceElement(data);
    });
  }

  /** CONFIGURATION */

  openConfigurationModal(row: ConfigurationModel = new ConfigurationModel(), create: boolean = true) {
    this.rowConfSelected = row;
    this.dataInputModel = new ModalInputModel(create, this.rowConfSelected);
    this.openModal(AddEditConfigurationComponent);
  }

  deleteConfiguration(row: ConfigurationModel) {
    this.rowConfSelected = row;
    this.showConfirmDeleteConfiguration();
  }

  async showConfirmDeleteConfiguration() {
    const motosDeleteConfig: MotoModel[] = this.motos.filter(x => x.configuration.id === this.rowConfSelected.id);
    let msg: string = this.translator.instant('PAGE_CONFIGURATION.ConfirmDeleteConfiguration',
      {configuration: this.rowConfSelected.name});
    if (!!motosDeleteConfig && motosDeleteConfig.length > 0) {
      let motosName = '';
      motosDeleteConfig.forEach((x, index) => {
        motosName += x.model + ((index + 1) < motosDeleteConfig.length ? ',' : '');
      });
      msg = this.translator.instant('PAGE_CONFIGURATION.ConfirmDeleteConfigurationMoveMoto',
        {configuration: this.rowConfSelected.name, moto: motosName});
    }

    const alert = await this.alertController.create({
      header: this.translator.instant('COMMON.CONFIGURATION'),
      message: msg,
      buttons: [
        {
          text: this.translator.instant('COMMON.CANCEL'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            motosDeleteConfig.forEach((x, index) => {
              x.configuration.id = 1;
            });
            this.configurationService.saveConfiguration(this.rowConfSelected, ActionDB.delete, motosDeleteConfig).then(x => {
              this.commonService.showToast('PAGE_CONFIGURATION.DeleteSaveConfiguration',
                { configuration: this.rowConfSelected.name });
            }).catch(e => {
              this.commonService.showToast('PAGE_CONFIGURATION.ErrorSaveConfiguration');
            });
          }
        }
      ]
    });

    await alert.present();
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

  deleteReplacement(row: MaintenanceElementModel) {
    this.rowReplSelected = row;
    this.showConfirmDeleteReplacement();
  }

  async showConfirmDeleteReplacement() {
    const alert = await this.alertController.create({
      header: this.translator.instant('COMMON.CONFIGURATION'),
      message: this.translator.instant('PAGE_CONFIGURATION.ConfirmDeleteReplacement', {replacement: this.rowReplSelected.name}),
      buttons: [
        {
          text: this.translator.instant('COMMON.CANCEL'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.configurationService.saveMaintenanceElement(this.rowReplSelected, ActionDB.delete).then(x => {
              this.commonService.showToast('PAGE_CONFIGURATION.DeleteSaveReplacement',
                { replacement: this.rowReplSelected.name });
            }).catch(e => {
              this.commonService.showToast('PAGE_CONFIGURATION.ErrorSaveReplacement');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  isNotValidToDeleteReplacement(replacement: MaintenanceElementModel): boolean {
    return this.operations.some(x => x.listMaintenanceElement.some(y => y.id === replacement.id));
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
      case 24:
        return 'battery-charging';
      default:
        return this.getRandomIcon(maintenanceElement.id);
    }

  }

  getRandomIcon(rand: number): string {
    if (rand <= 30) {
      return 'bandage';
    } else if (rand > 30 && rand <= 40) {
      return 'bulb';
    } else if (rand > 40 && rand <= 55) {
      return 'barbell';
    } else {
      return 'briefcase';
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
