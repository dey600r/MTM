import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonSelect, Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService, ConfigurationService, ControlService, SettingsService, VehicleService } from '@services/index';
import { ConstantsColumns, ActionDBEnum, PageEnum, Constants, ToastTypeEnum, ModalOutputEnum } from '@utils/index';
import {
  MaintenanceModel, MaintenanceElementModel, ConfigurationModel, ModalInputModel, ModalOutputModel,
  VehicleModel, OperationModel, ListModalModel, ListDataModalModel
} from '@models/index';

// COMPONENTS
import { AddEditConfigurationComponent } from '@modals/add-edit-configuration/add-edit-configuration.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditMaintenanceElementComponent } from '@modals/add-edit-maintenance-element/add-edit-maintenance-element.component';
import { ListDataToUpdateComponent } from '@modals/list-data-to-update/list-data-to-update.component';

@Component({
  selector: 'app-configuration',
  templateUrl: 'configuration.page.html',
  styleUrls: ['../../app.component.scss']
})
export class ConfigurationPage {

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

  @ViewChild('selectVehicles', { static: false }) selectVehicles: IonSelect;

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private commonService: CommonService,
              private controlService: ControlService,
              private configurationService: ConfigurationService,
              private settingsService: SettingsService,
              private vehicleService: VehicleService,
              private detector: ChangeDetectorRef) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    }).finally(() => {
      this.initPage();
    });
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
      this.vehicles = data;
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

  async openListModalConfiguration(itemSliding: any, configuration: ConfigurationModel) {
    this.rowConfSelected = configuration;
    let listDataModel: ListDataModalModel[] = [];
    this.vehicles.forEach(x => {
      listDataModel = [...listDataModel,
        new ListDataModalModel(
          x.id,
          `${x.brand} ${x.model}`,
          x.configuration.name,
          `${x.km} ${this.measure.value}`,
          this.vehicleService.getIconVehicle(x),
          (x.configuration.id === configuration.id)
        )];
    });
    const listModel: ListModalModel = new ListModalModel(this.translator.instant('PAGE_CONFIGURATION.AssignConfigurationToVehicle',
      { configuration : configuration.name }), true, listDataModel);
    const modal = await this.controlService.openModal(PageEnum.CONFIGURATION,
      ListDataToUpdateComponent, new ModalInputModel<ListModalModel>(true, listModel, [], PageEnum.CONFIGURATION));

    const { data } = await modal.onWillDismiss();
    if (itemSliding) { itemSliding.close(); }
    if (data && data.data && data.action === ModalOutputEnum.SAVE) {
      this.showConfirmSaveVehiclesAssociatedToConfiguration(data.data);
    }
  }

  async openListModalMaintenance(itemSliding: any, maintenance: MaintenanceModel) {
    this.rowMainSelected = maintenance;
    let listDataModel: ListDataModalModel[] = [];

    this.configurations.forEach(x => {
      listDataModel = [...listDataModel,
        new ListDataModalModel(
          x.id,
          x.name,
          '',
          x.description,
          'cog',
          (x.listMaintenance && x.listMaintenance.some(z => z.id === maintenance.id)),
          (x.id === 1)
        )];
    });
    const listModel: ListModalModel = new ListModalModel(this.translator.instant('PAGE_CONFIGURATION.AssignMaintenanceToConfiguration',
      { maintenance : maintenance.description }), true, listDataModel);
    const modal = await this.controlService.openModal(PageEnum.CONFIGURATION,
      ListDataToUpdateComponent, new ModalInputModel<ListModalModel>(true, listModel, [], PageEnum.CONFIGURATION));

    const { data } = await modal.onWillDismiss();
    if (itemSliding) { itemSliding.close(); }
    if (data && data.data && data.action === ModalOutputEnum.SAVE) {
      this.showConfirmSaveMaintenancesAssociatedToConfiguration(data.data);
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
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.SUCCESS,
               'PAGE_CONFIGURATION.DeleteSaveConfiguration', { configuration: this.rowConfSelected.name });
          }).catch(e => {
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveConfiguration');
          });
        }
      }
    );
  }

  showConfirmSaveVehiclesAssociatedToConfiguration(data: ListModalModel) {
    const msg = this.translator.instant('PAGE_CONFIGURATION.ConfirmSaveVehiclesAssociatedToConfiguration',
      { configuration: this.rowConfSelected.name });
    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.CONFIGURATION'), msg,
    {
      text: this.translator.instant('COMMON.ACCEPT'),
      handler: () => {
        this.saveVehiclesAssociatedToConfiguration(data);
      }
    });
  }

  saveVehiclesAssociatedToConfiguration(data: ListModalModel) {
    const vehiclesAssociatedToConfigurationSelected: VehicleModel[] =
      this.vehicles.filter(x => x.configuration.id === this.rowConfSelected.id);
    const vehiclesChangeToConfigurationDefault: VehicleModel[] = vehiclesAssociatedToConfigurationSelected.filter(x =>
      data.listData.some(y => y.id === x.id && !y.selected));
    const vehiclesChangeToConfigurationSelected: VehicleModel[] = this.vehicles.filter(x =>
      data.listData.some(y => y.id === x.id && y.selected));
    let vehiclesToSave: VehicleModel[] = [];
    if (vehiclesChangeToConfigurationDefault.length > 0) {
      vehiclesChangeToConfigurationDefault.forEach(x => {
        x.configuration.id = 1;
        vehiclesToSave = [...vehiclesToSave, x];
      });
    }
    if (vehiclesChangeToConfigurationSelected.length > 0) {
      vehiclesChangeToConfigurationSelected.forEach(x => {
        x.configuration.id = this.rowConfSelected.id;
        vehiclesToSave = [...vehiclesToSave, x];
      });
    }
    if (vehiclesToSave.length > 0) {
      this.vehicleService.saveVehicle(vehiclesToSave, ActionDBEnum.UPDATE).then(res => {
        this.controlService.showToast(PageEnum.MODAL_VEHICLE, ToastTypeEnum.SUCCESS, 'PAGE_CONFIGURATION.EditSaveVehiclesAssociated');
      }).catch(e => {
        this.controlService.showToast(PageEnum.MODAL_VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle');
      });
    }
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
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.SUCCESS,
              'PAGE_CONFIGURATION.DeleteSaveMaintenance', { maintenance: this.rowMainSelected.description });
          }).catch(e => {
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveMaintenance');
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

  showConfirmSaveMaintenancesAssociatedToConfiguration(data: ListModalModel) {
    const msg = this.translator.instant('PAGE_CONFIGURATION.ConfirmSaveMaintenancesAssociatedToConfiguration',
      { maintenance: this.rowMainSelected.description });
    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.MAINTENANCE'), msg,
    {
      text: this.translator.instant('COMMON.ACCEPT'),
      handler: () => {
        this.saveMaintenanceAssociatedToConfiguration(data);
      }
    });
  }

  saveMaintenanceAssociatedToConfiguration(data: ListModalModel) {
    let configurationSave: ConfigurationModel[] = [];
    let configurationDelete: ConfigurationModel[] = [];
    this.configurations.forEach(c => {
      if (c.listMaintenance && c.listMaintenance.length > 0) {
        c.listMaintenance.forEach(m => {
          if (this.rowMainSelected.id === m.id && data.listData.some(x => x.id === c.id && !x.selected)) {
            configurationDelete = [...configurationDelete, new ConfigurationModel(c.name, c.description, c.master, [m], c.id)];
          }
        });
      }
    });
    data.listData.forEach(x => {
      if (x.selected && this.configurations.some(c => c.id === x.id && !c.listMaintenance.some(m => m.id === this.rowMainSelected.id))) {
        configurationSave = [...configurationSave, new ConfigurationModel('', '', true, [this.rowMainSelected], x.id)];
      }
    });
    this.configurationService.saveConfigurationMaintenance(configurationSave, configurationDelete).then(res => {
      this.controlService.showToast(PageEnum.MODAL_CONFIGURATION,
        ToastTypeEnum.SUCCESS, 'PAGE_CONFIGURATION.EditSaveMaintenancesAssociated');
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveConfiguration');
    });
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
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.SUCCESS,
              'PAGE_CONFIGURATION.DeleteSaveReplacement', { replacement: this.rowReplSelected.name });
          }).catch(e => {
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveReplacement');
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
