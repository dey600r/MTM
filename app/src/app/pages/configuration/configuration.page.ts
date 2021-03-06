import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService, ConfigurationService, ControlService, SettingsService } from '@services/index';
import { ConstantsColumns, ActionDBEnum, PageEnum, Constants } from '@utils/index';
import {
  MaintenanceModel, MaintenanceElementModel, ConfigurationModel, ModalInputModel, ModalOutputModel,
  VehicleModel, OperationModel
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
  vehicles: VehicleModel[] = [];
  operations: OperationModel[] = [];
  configurations: ConfigurationModel[] = [];
  maintenances: MaintenanceModel[] = [];
  maintenanceElements: MaintenanceElementModel[] = [];
  maxKm = 0;
  measure: any = {};
  segmentHeader: any[] = [];
  segmentSelected = 1;

  loaded = false;

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private commonService: CommonService,
              private controlService: ControlService,
              private configurationService: ConfigurationService,
              private settingsService: SettingsService,
              private detector: ChangeDetectorRef) {
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

    this.segmentSelected = 1;
    this.segmentHeader = [
      { id: 1, title: 'PAGE_CONFIGURATION.YOURS_CONFIGURATIONS', icon: 'cog'},
      { id: 2, title: 'PAGE_CONFIGURATION.MAINTENANCES', icon: 'build'},
      { id: 3, title: 'PAGE_CONFIGURATION.REPLACEMENTS', icon: 'repeat'}
    ];

    this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });

    this.dbService.getVehicles().subscribe(data => {
      if (!!data && data.length > 0) {
        this.maxKm = this.commonService.max(data, ConstantsColumns.COLUMN_MTM_VEHICLE_KM);
      }
      // Filter to get less elemnts to better perfomance
      this.vehicles = data.filter(x => x.configuration.id !== 1);
    });

    this.dbService.getOperations().subscribe(data => {
      // Filter to get less elemnts to better perfomance
      this.operations = data.filter(x => !!x.listMaintenanceElement && x.listMaintenanceElement.length > 0);
    });

    this.dbService.getConfigurations().subscribe(data => {
      this.configurations = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
      this.detector.detectChanges();
    });

    this.dbService.getMaintenance().subscribe(data => {
      this.maintenances = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
      this.detector.detectChanges();
    });

    this.dbService.getMaintenanceElement().subscribe(data => {
      this.maintenanceElements = this.configurationService.orderMaintenanceElement(data);
      this.detector.detectChanges();
    });
  }

  ionViewDidEnter() {
    if (document.getElementById('custom-overlay').style.display === 'flex' ||
    document.getElementById('custom-overlay').style.display === '') {
      document.getElementById('custom-overlay').style.display = 'none';
    }
    if (!this.loaded) {
      setTimeout(() => { this.loaded = true; }, 1200);
    }
  }

  segmentChanged(event: any): void {
    this.segmentSelected = Number(event.detail.value);
  }

  openModalSegmentSelected() {
    switch (this.segmentSelected) {
      case 1:
        this.openConfigurationModal();
        break;
      case 2:
        this.openMaintenanceModal();
        break;
      default:
        this.openReplacementModal();
    }
  }

  activeSegmentScroll(): boolean {
    return this.platform.width() < Constants.MAX_WIDTH_SEGMENT_SCROLABLE;
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
    const vehiclesDeleteConfig: VehicleModel[] = this.vehicles.filter(x => x.configuration.id === this.rowConfSelected.id);
    let msg: string = this.translator.instant('PAGE_CONFIGURATION.ConfirmDeleteConfiguration',
      {configuration: this.rowConfSelected.name});
    if (!!vehiclesDeleteConfig && vehiclesDeleteConfig.length > 0) {
      let vehiclesName = '';
      vehiclesDeleteConfig.forEach((x, index) => {
        vehiclesName += x.model + ((index + 1) < vehiclesDeleteConfig.length ? ',' : '');
      });
      msg = this.translator.instant('PAGE_CONFIGURATION.ConfirmDeleteConfigurationMoveVehicle',
        { configuration: this.rowConfSelected.name, vehicle: vehiclesName });
    }

    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.CONFIGURATION'), msg,
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          vehiclesDeleteConfig.forEach((x, index) => {
            x.configuration.id = 1;
          });
          this.configurationService.saveConfiguration(this.rowConfSelected, ActionDBEnum.DELETE, vehiclesDeleteConfig).then(x => {
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
      AddEditMaintenanceComponent, new ModalInputModel(create, this.rowMainSelected, [this.maxKm], PageEnum.CONFIGURATION));
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

  getReplacementCommas(replacements: MaintenanceElementModel[]): string {
    return this.configurationService.getReplacement(replacements);
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
    return !replacement.master && this.maintenances.some(x => x.listMaintenanceElement.some(y => y.id === replacement.id));
  }

  getIconReplacement(maintenanceElement: MaintenanceElementModel): string {
    return this.configurationService.getIconReplacement(maintenanceElement);
  }
}
