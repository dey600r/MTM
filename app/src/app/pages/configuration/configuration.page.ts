import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { IonSelect, Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { 
  DataBaseService, CommonService, ConfigurationService, ControlService, SettingsService, VehicleService, DashboardService, IconService
} from '@services/index';

// MODELS
import {
  MaintenanceModel, MaintenanceElementModel, ConfigurationModel, ModalInputModel, ModalOutputModel,
  VehicleModel, OperationModel, ListModalModel, ListDataModalModel, SearchDashboardModel
} from '@models/index';

// UTILS
import { ConstantsColumns, ActionDBEnum, PageEnum, ToastTypeEnum, ModalOutputEnum, IInfoModel, InfoButtonEnum } from '@utils/index';

// COMPONENTS
import { AddEditConfigurationComponent } from '@modals/add-edit-configuration/add-edit-configuration.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditMaintenanceElementComponent } from '@modals/add-edit-maintenance-element/add-edit-maintenance-element.component';
import { ListDataToUpdateComponent } from '@modals/list-data-to-update/list-data-to-update.component';
import { BasePage } from '@pages/base.page';
import { SearchDashboardPopOverComponent } from '@src/app/shared/modals/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'app-configuration',
  templateUrl: 'configuration.page.html',
  styleUrls: []
})
export class ConfigurationPage extends BasePage implements OnInit {

  // MODAL
  inputConfiguration: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
  inputMaintenance: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
  inputMaintenanceElement: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
  dataReturned: ModalOutputModel;

  // DATA
  vehicles: VehicleModel[] = [];
  operations: OperationModel[] = [];
  allConfigurations: ConfigurationModel[] = [];
  configurations: ConfigurationModel[] = [];
  allMaintenances: MaintenanceModel[] = [];
  maintenances: MaintenanceModel[] = [];
  allMaintenanceElements: MaintenanceElementModel[] = [];
  maintenanceElements: MaintenanceElementModel[] = [];
  maxKm = 0;
  measure: any = {};
  segmentHeader: any[] = [];
  segmentSelected = 1;
  iconFilter = 'filter';

  loaded = false;

  @ViewChild('selectVehicles', { static: false }) selectVehicles: IonSelect;

  constructor(public platform: Platform,
              private dbService: DataBaseService,
              public translator: TranslateService,
              private commonService: CommonService,
              private controlService: ControlService,
              private configurationService: ConfigurationService,
              private settingsService: SettingsService,
              private vehicleService: VehicleService,
              private dashboardService: DashboardService,
              private iconService: IconService,
              private detector: ChangeDetectorRef) {
    super(platform, translator);
  }

  ngOnInit(): void {
      this.initPage();
  }

  initPage() {
    this.initInfoData();
    this.initData();
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

  initInfoData() {
    this.segmentSelected = 1;
    this.segmentHeader = [
      { id: 1, title: 'PAGE_CONFIGURATION.YOURS_CONFIGURATIONS', icon: 'cog'},
      { id: 2, title: 'PAGE_CONFIGURATION.MAINTENANCES', icon: 'build'},
      { id: 3, title: 'PAGE_CONFIGURATION.REPLACEMENTS', icon: 'repeat'}
    ];

    this.inputConfiguration = new ModalInputModel<IInfoModel>({
      parentPage: PageEnum.CONFIGURATION,
      data: {
        text: 'ALERT.ConfigurationEmpty',
        icon: this.segmentHeader[0].icon,
        info: InfoButtonEnum.NONE
      }
    });
    this.inputMaintenance = new ModalInputModel<IInfoModel>({
        parentPage: PageEnum.CONFIGURATION,
        data: {
          text: 'ALERT.MaintenanceEmpty',
          icon: this.segmentHeader[1].icon,
          info: InfoButtonEnum.NONE
        }
      });
    this.inputMaintenanceElement = new ModalInputModel({
        parentPage: PageEnum.CONFIGURATION,
        data: {
          text: 'ALERT.MaintenanceElementEmpty',
          icon: this.segmentHeader[2].icon,
          info: InfoButtonEnum.NONE
        }
      });

    this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });
  }

  initData() {
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
      this.allConfigurations = data; 
      this.configurations = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
      this.dashboardService.setSearchConfiguration();
      this.detector.detectChanges();
    });

    this.dbService.getMaintenance().subscribe(data => {
      this.allMaintenances = data;
      this.maintenances = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
      this.dashboardService.setSearchConfiguration();
      this.detector.detectChanges();
    });

    this.dbService.getMaintenanceElement().subscribe(data => {
      this.allMaintenanceElements = data;
      this.maintenanceElements = this.configurationService.orderMaintenanceElement(data); 
      this.dashboardService.setSearchConfiguration();
      this.detector.detectChanges();
    });

    this.dashboardService.getObserverSearchConfiguration().subscribe(filter => {
      this.filterConfiguration(filter);
      this.detector.detectChanges();
    });
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
    return this.controlService.activeSegmentScroll(3);
  }

  async openListModalConfiguration(itemSliding: any, configuration: ConfigurationModel) {
    let listDataModel: ListDataModalModel[] = [];
    this.vehicles.forEach(x => {
      listDataModel = [...listDataModel,
        new ListDataModalModel(
          x.id,
          `${x.brand} ${x.model}`,
          x.configuration.name,
          `${x.km} ${this.measure.value}`,
          x.vehicleType.icon,
          (x.configuration.id === configuration.id)
        )];
    });
    const listModel: ListModalModel = new ListModalModel(this.translator.instant('PAGE_CONFIGURATION.AssignConfigurationToVehicle',
      { configuration : configuration.name }), true, listDataModel);
    const modal = await this.controlService.openModal(PageEnum.CONFIGURATION,
      ListDataToUpdateComponent, new ModalInputModel<ListModalModel>({
          data: listModel,
          parentPage: PageEnum.CONFIGURATION
        }));

    const { data } = await modal.onWillDismiss();
    if (itemSliding) { itemSliding.close(); }
    if (data && data.data && data.action === ModalOutputEnum.SAVE) {
      this.showConfirmSaveVehiclesAssociatedToConfiguration(data.data, configuration);
    }
  }

  async openListModalMaintenance(itemSliding: any, maintenance: MaintenanceModel) {
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
      ListDataToUpdateComponent, new ModalInputModel<ListModalModel>({
        data: listModel,
        parentPage: PageEnum.CONFIGURATION
      }));

    const { data } = await modal.onWillDismiss();
    if (itemSliding) { itemSliding.close(); }
    if (data && data.data && data.action === ModalOutputEnum.SAVE) {
      this.showConfirmSaveMaintenancesAssociatedToConfiguration(data.data, maintenance);
    }
  }

  showPopover(ev: any) {
    this.controlService.showPopover(PageEnum.CONFIGURATION, ev, SearchDashboardPopOverComponent,
      new ModalInputModel({ parentPage: PageEnum.CONFIGURATION }));
  }

  filterConfiguration(filter: SearchDashboardModel) {
    const filteredText: string = filter.searchText.toLowerCase();

    // FILTER CONFIGURATION
    const filteredVehicles: VehicleModel[] = this.vehicles.filter(x => filter.searchVehicle.some(y => x.id === y.id));
    this.configurations = this.commonService.orderBy(this.allConfigurations.filter(x => 
      (filteredVehicles.length === 0 || filteredVehicles.some(y => x.id === y.configuration.id)) &&
      (x.name.toLowerCase().includes(filteredText) || x.description.toLowerCase().includes(filteredText))),
      ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    
    // FILTER MAINTENANCE
    this.maintenances = this.commonService.orderBy(this.allMaintenances.filter(x =>
      (filteredVehicles.length === 0 || this.configurations.some(y => y.listMaintenance.some(z => x.id === z.id))) &&
      (x.description.toLowerCase().includes(filteredText))),
      ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);

    // FILTER MAINTENANCE ELEMENT
    this.maintenanceElements = this.configurationService.orderMaintenanceElement(this.allMaintenanceElements.filter(x =>
      (filteredVehicles.length === 0 || this.maintenances.some(y => y.listMaintenanceElement.some(z => x.id === z.id))) &&
      (x.name.toLowerCase().includes(filteredText) || x.description.toLowerCase().includes(filteredText))));

    this.loadIconSearch();
  }

  loadIconSearch() {
    this.iconFilter = this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(PageEnum.CONFIGURATION));
  }

  /** CONFIGURATION */

  openConfigurationModal(row: ConfigurationModel = new ConfigurationModel(), create: boolean = true) {
    this.controlService.openModal(PageEnum.CONFIGURATION, AddEditConfigurationComponent, new ModalInputModel<ConfigurationModel>({
          isCreate: create, 
          data: row,
          parentPage: PageEnum.CONFIGURATION
        }));
  }

  deleteConfiguration(row: ConfigurationModel) {
    this.showConfirmDeleteConfiguration(row);
  }

  showConfirmDeleteConfiguration(row: ConfigurationModel) {
    const vehiclesDeleteConfig: VehicleModel[] = this.vehicles.filter(x => x.configuration.id === row.id);
    let msg: string = this.translator.instant('PAGE_CONFIGURATION.ConfirmDeleteConfiguration',
      {configuration: row.name});
    if (!!vehiclesDeleteConfig && vehiclesDeleteConfig.length > 0) {
      let vehiclesName = '';
      vehiclesDeleteConfig.forEach((x, index) => {
        vehiclesName += x.model + ((index + 1) < vehiclesDeleteConfig.length ? ',' : '');
      });
      msg = this.translator.instant('PAGE_CONFIGURATION.ConfirmDeleteConfigurationMoveVehicle',
        { configuration: row.name, vehicle: vehiclesName });
    }

    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.CONFIGURATION'), msg,
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          vehiclesDeleteConfig.forEach((x, index) => {
            x.configuration.id = 1;
          });
          this.configurationService.saveConfiguration(row, ActionDBEnum.DELETE, vehiclesDeleteConfig).then(x => {
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.SUCCESS,
               'PAGE_CONFIGURATION.DeleteSaveConfiguration', { configuration: row.name });
          }).catch(e => {
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveConfiguration');
          });
        }
      }
    );
  }

  showConfirmSaveVehiclesAssociatedToConfiguration(data: ListModalModel, configuration: ConfigurationModel) {
    const msg = this.translator.instant('PAGE_CONFIGURATION.ConfirmSaveVehiclesAssociatedToConfiguration',
      { configuration: configuration.name });
    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.CONFIGURATION'), msg,
    {
      text: this.translator.instant('COMMON.ACCEPT'),
      handler: () => {
        this.saveVehiclesAssociatedToConfiguration(data, configuration);
      }
    });
  }

  saveVehiclesAssociatedToConfiguration(data: ListModalModel, configuration: ConfigurationModel) {
    const vehiclesAssociatedToConfigurationSelected: VehicleModel[] =
      this.vehicles.filter(x => x.configuration.id === configuration.id);
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
        x.configuration.id = configuration.id;
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
    this.controlService.openModal(PageEnum.CONFIGURATION,
      AddEditMaintenanceComponent, new ModalInputModel<MaintenanceModel, number>({
          isCreate: create,
          data: row,
          dataList: [this.maxKm],
          parentPage: PageEnum.CONFIGURATION
        }));
  }

  deleteMaintenance(row: MaintenanceModel) {
    this.showConfirmDeleteMaintenance(row);
  }

  showConfirmDeleteMaintenance(row: MaintenanceModel) {
    let msg = 'PAGE_CONFIGURATION.ConfirmDeleteMaintenance';
    const configurationWithMaintenance: ConfigurationModel[] =
      this.configurations.filter(x => x.listMaintenance.some(y => y.id === row.id));
    if (!!configurationWithMaintenance && configurationWithMaintenance.length > 0) {
      msg = 'PAGE_CONFIGURATION.ConfirmDeleteMaintenanceWithConfigururation';
    }
    msg = this.translator.instant(msg, { maintenance: row.description });

    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.MAINTENANCE'), msg,
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.configurationService.saveMaintenance(row, ActionDBEnum.DELETE, configurationWithMaintenance).then(x => {
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.SUCCESS,
              'PAGE_CONFIGURATION.DeleteSaveMaintenance', { maintenance: row.description });
          }).catch(e => {
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveMaintenance');
          });
        }
      }
    );
  }

  getReplacementCommas(replacements: MaintenanceElementModel[]): string {
    return this.configurationService.getReplacement(replacements);
  }

  showConfirmSaveMaintenancesAssociatedToConfiguration(data: ListModalModel, maintenance: MaintenanceModel) {
    const msg = this.translator.instant('PAGE_CONFIGURATION.ConfirmSaveMaintenancesAssociatedToConfiguration',
      { maintenance: maintenance.description });
    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.MAINTENANCE'), msg,
    {
      text: this.translator.instant('COMMON.ACCEPT'),
      handler: () => {
        this.saveMaintenanceAssociatedToConfiguration(data, maintenance);
      }
    });
  }

  saveMaintenanceAssociatedToConfiguration(data: ListModalModel, maintenance: MaintenanceModel) {
    let configurationSave: ConfigurationModel[] = [];
    let configurationDelete: ConfigurationModel[] = [];
    this.configurations.forEach(c => {
      if (c.listMaintenance && c.listMaintenance.length > 0) {
        c.listMaintenance.forEach(m => {
          if (maintenance.id === m.id && data.listData.some(x => x.id === c.id && !x.selected)) {
            configurationDelete = [...configurationDelete, new ConfigurationModel(c.name, c.description, c.master, [m], c.id)];
          }
        });
      }
    });
    data.listData.forEach(x => {
      if (x.selected && this.configurations.some(c => c.id === x.id && !c.listMaintenance.some(m => m.id === maintenance.id))) {
        configurationSave = [...configurationSave, new ConfigurationModel('', '', true, [maintenance], x.id)];
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
    this.controlService.openModal(PageEnum.CONFIGURATION, AddEditMaintenanceElementComponent, new ModalInputModel<MaintenanceElementModel>({
          isCreate: create,
          data: row,
          parentPage: PageEnum.CONFIGURATION
        }));
  }

  deleteReplacement(row: MaintenanceElementModel) {
    this.showConfirmDeleteReplacement(row);
  }

  showConfirmDeleteReplacement(row: MaintenanceElementModel) {
    let msg = 'PAGE_CONFIGURATION.ConfirmDeleteReplacement';
    const operationsWithReplacement: OperationModel[] =
      this.operations.filter(x => x.listMaintenanceElement.some(y => y.id ===row.id));
    if (!!operationsWithReplacement && operationsWithReplacement.length > 0) {
      msg = 'PAGE_CONFIGURATION.ConfirmDeleteReplacementWithOperations';
    }
    msg = this.translator.instant(msg, {replacement: row.name});
    this.controlService.showConfirm(PageEnum.CONFIGURATION, this.translator.instant('COMMON.REPLACEMENT'), msg,
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.configurationService.saveMaintenanceElement(row,
              ActionDBEnum.DELETE, operationsWithReplacement).then(x => {
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.SUCCESS,
              'PAGE_CONFIGURATION.DeleteSaveReplacement', { replacement: row.name });
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
}
