import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService, ConfigurationService, ControlService } from '@services/index';
import { ConstantsColumns, ActionDBEnum, PageEnum } from '@utils/index';
import {
  MaintenanceModel, MaintenanceElementModel, ConfigurationModel, ModalInputModel, ModalOutputModel,
  MotoModel, OperationModel
} from '@models/index';

// COMPONENTS
import { AddEditConfigurationComponent } from '@modals/add-edit-configuration/add-edit-configuration.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditMaintenanceElementComponent } from '@modals/add-edit-maintenance-element/add-edit-maintenance-element.component';

@Component({
  selector: 'app-configuration',
  templateUrl: 'configuration.page.html',
  styleUrls: ['../../app.component.scss']
})
export class ConfigurationPage implements OnInit {

  // MODAL
  dataReturned: ModalOutputModel;

  // MODEL FORM
  rowConfSelected: ConfigurationModel = new ConfigurationModel();
  rowMainSelected: MaintenanceModel = new MaintenanceModel();
  rowReplSelected: MaintenanceElementModel = new MaintenanceElementModel();

  // DATA
  motos: MotoModel[] = [];
  operations: OperationModel[] = [];
  configurations: ConfigurationModel[] = [];
  maintenances: MaintenanceModel[] = [];
  maintenanceElements: MaintenanceElementModel[] = [];

  hideConfiguration = false;
  hideMaintenance = true;
  hideReplacement = true;

  loaded = false;

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private commonService: CommonService,
              private controlService: ControlService,
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

  ionViewDidEnter() {
    if (!this.loaded) {
      setTimeout(() => { this.loaded = true; }, 1200);
    }
  }

  /** CONFIGURATION */

  openConfigurationModal(row: ConfigurationModel = new ConfigurationModel(), create: boolean = true) {
    this.rowConfSelected = row;
    this.controlService.openModal(PageEnum.CONFIGURATION,
      AddEditConfigurationComponent, new ModalInputModel(create, this.rowConfSelected, [], PageEnum.CONFIGURATION));
  }

  deleteConfiguration(row: ConfigurationModel) {
    this.rowConfSelected = row;
    this.showConfirmDeleteConfiguration();
  }

  showConfirmDeleteConfiguration() {
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

    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.CONFIGURATION'), msg,
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          motosDeleteConfig.forEach((x, index) => {
            x.configuration.id = 1;
          });
          this.configurationService.saveConfiguration(this.rowConfSelected, ActionDBEnum.DELETE, motosDeleteConfig).then(x => {
            this.controlService.showToast(PageEnum.CONFIGURATION, 'PAGE_CONFIGURATION.DeleteSaveConfiguration',
              { configuration: this.rowConfSelected.name });
          }).catch(e => {
            this.controlService.showToast(PageEnum.CONFIGURATION, 'PAGE_CONFIGURATION.ErrorSaveConfiguration');
          });
        }
      }
    );
  }

  /** MAINTENANCE */

  openMaintenanceModal(row: MaintenanceModel = new MaintenanceModel(), create: boolean = true) {
    this.rowMainSelected = row;
    this.controlService.openModal(PageEnum.CONFIGURATION,
      AddEditMaintenanceComponent, new ModalInputModel(create, this.rowMainSelected, [], PageEnum.CONFIGURATION));
  }

  deleteMaintenance(row: MaintenanceModel) {
    this.rowMainSelected = row;
    this.showConfirmDeleteMaintenance();
  }

  showConfirmDeleteMaintenance() {
    let msg = 'PAGE_CONFIGURATION.ConfirmDeleteMaintenance';
    const configurationWithMaintenance: ConfigurationModel[] =
      this.configurations.filter(x => x.listMaintenance.some(y => y.id === this.rowMainSelected.id));
    if (!!configurationWithMaintenance && configurationWithMaintenance.length > 0) {
      msg = 'PAGE_CONFIGURATION.ConfirmDeleteMaintenanceWithConfigururation';
    }
    msg = this.translator.instant(msg, { maintenance: this.rowMainSelected.description });

    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.MAINTENANCE'), msg,
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.configurationService.saveMaintenance(this.rowMainSelected, ActionDBEnum.DELETE, configurationWithMaintenance).then(x => {
            this.controlService.showToast(PageEnum.CONFIGURATION, 'PAGE_CONFIGURATION.DeleteSaveMaintenance',
              { maintenance: this.rowMainSelected.description });
          }).catch(e => {
            this.controlService.showToast(PageEnum.CONFIGURATION, 'PAGE_CONFIGURATION.ErrorSaveMaintenance');
          });
        }
      }
    );
  }

  getIconMaintenance(maintenance: MaintenanceModel): string {
    return this.configurationService.getIconMaintenance(maintenance);
  }

  /** MAINTENANCE ELEMENTS / REPLACEMENT */

  openReplacementModal(row: MaintenanceElementModel = new MaintenanceElementModel(), create: boolean = true) {
    this.rowReplSelected = row;
    this.controlService.openModal(PageEnum.CONFIGURATION,
      AddEditMaintenanceElementComponent, new ModalInputModel(create, this.rowReplSelected, [], PageEnum.CONFIGURATION));
  }

  deleteReplacement(row: MaintenanceElementModel) {
    this.rowReplSelected = row;
    this.showConfirmDeleteReplacement();
  }

  showConfirmDeleteReplacement() {
    let msg = 'PAGE_CONFIGURATION.ConfirmDeleteReplacement';
    const operationsWithReplacement: OperationModel[] =
      this.operations.filter(x => x.listMaintenanceElement.some(y => y.id === this.rowReplSelected.id));
    if (!!operationsWithReplacement && operationsWithReplacement.length > 0) {
      msg = 'PAGE_CONFIGURATION.ConfirmDeleteReplacementWithOperations';
    }
    msg = this.translator.instant(msg, {replacement: this.rowReplSelected.name});
    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.REPLACEMENT'), msg,
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.configurationService.saveMaintenanceElement(this.rowReplSelected,
              ActionDBEnum.DELETE, operationsWithReplacement).then(x => {
            this.controlService.showToast(PageEnum.CONFIGURATION, 'PAGE_CONFIGURATION.DeleteSaveReplacement',
              { replacement: this.rowReplSelected.name });
          }).catch(e => {
            this.controlService.showToast(PageEnum.CONFIGURATION, 'PAGE_CONFIGURATION.ErrorSaveReplacement');
          });
        }
      }
    );
  }

  isNotValidToDeleteReplacement(replacement: MaintenanceElementModel): boolean {
    return !replacement.master && this.maintenances.some(x => x.maintenanceElement.id === replacement.id);
  }

  getIconReplacement(maintenanceElement: MaintenanceElementModel): string {
    return this.configurationService.getIconReplacement(maintenanceElement);
  }
}
