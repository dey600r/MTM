import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { IonSelect, Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { 
  DataService, CommonService, ConfigurationService, ControlService, SettingsService, VehicleService,
  DashboardService, IconService
} from '@services/index';

// MODELS
import {
  MaintenanceModel, MaintenanceElementModel, ConfigurationModel, ModalInputModel, ModalOutputModel,
  VehicleModel, OperationModel, ListModalModel, ListDataModalModel, SearchDashboardModel, ISettingModel, IInfoModel,
  HeaderInputModel, HeaderSegmentInputModel, HeaderOutputModel, SkeletonInputModel,
} from '@models/index';

// UTILS
import { 
  ConstantsColumns, ActionDBEnum, PageEnum, ToastTypeEnum, ModalOutputEnum, InfoButtonEnum, 
  ModalTypeEnum, HeaderOutputEnum, ConfigurationSkeletonSetting
} from '@utils/index';

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
  headerInput: HeaderInputModel = new HeaderInputModel();
  skeletonInput: SkeletonInputModel = ConfigurationSkeletonSetting;
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
  measure: ISettingModel;
  segmentSelected = 1;

  loadedHeader = false;
  loadedBody = false;

  @ViewChild('selectVehicles', { static: false }) selectVehicles: IonSelect;

  constructor(public platform: Platform,
              private readonly dataService: DataService,
              public translator: TranslateService,
              private readonly commonService: CommonService,
              private readonly controlService: ControlService,
              private readonly configurationService: ConfigurationService,
              private readonly settingsService: SettingsService,
              private readonly vehicleService: VehicleService,
              private readonly dashboardService: DashboardService,
              private readonly iconService: IconService,
              private readonly detector: ChangeDetectorRef) {
    super(platform, translator);
  }

  ngOnInit(): void {
      this.initPage();
  }

  initPage() {
    this.initInfoData();
    this.initData();
  }

  initInfoData() {
    this.segmentSelected = 1;

    this.inputConfiguration = new ModalInputModel<IInfoModel>({
      parentPage: PageEnum.CONFIGURATION,
      data: {
        text: 'ALERT.ConfigurationEmpty',
        icon: 'cog',
        info: InfoButtonEnum.NONE
      }
    });
    this.inputMaintenance = new ModalInputModel<IInfoModel>({
        parentPage: PageEnum.CONFIGURATION,
        data: {
          text: 'ALERT.MaintenanceEmpty',
          icon: 'build',
          info: InfoButtonEnum.NONE
        }
      });
    this.inputMaintenanceElement = new ModalInputModel({
        parentPage: PageEnum.CONFIGURATION,
        data: {
          text: 'ALERT.MaintenanceElementEmpty',
          icon: 'repeat',
          info: InfoButtonEnum.NONE
        }
      });

    this.dataService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });
  }

  initData() {
    this.dataService.getVehicles().subscribe(data => {
      if (!!data && data.length > 0) {
        this.maxKm = this.commonService.max(data, ConstantsColumns.COLUMN_MTM_VEHICLE_KM);
      }
      // Filter to get less elemnts to better perfomance
      this.vehicles = data;
    });

    this.dataService.getOperations().subscribe(data => {
      // Filter to get less elemnts to better perfomance
      this.operations = data.filter(x => !!x.listMaintenanceElement && x.listMaintenanceElement.length > 0);
    });

    this.dataService.getConfigurations().subscribe(data => {
      this.allConfigurations = data; 
      this.configurations = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
      this.dashboardService.setSearchConfiguration();
      this.changeLoadedBody(false);
      this.detector.detectChanges();
    });

    this.dataService.getMaintenance().subscribe(data => {
      this.allMaintenances = data;
      this.maintenances = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
      this.dashboardService.setSearchConfiguration();
      this.changeLoadedBody(false);
      this.detector.detectChanges();
    });

    this.dataService.getMaintenanceElement().subscribe(data => {
      this.allMaintenanceElements = data;
      this.maintenanceElements = this.configurationService.orderMaintenanceElement(data); 
      this.dashboardService.setSearchConfiguration();
      this.changeLoadedBody(false);
      this.detector.detectChanges();
    });

    this.dashboardService.getObserverSearchConfiguration().subscribe(filter => {
      this.filterConfiguration(filter);
      this.detector.detectChanges();
    });
  }

  segmentChanged(event: any): void {
    this.segmentSelected = Number(event.detail.value);
    this.changeLoadedBody(false);
  }

  openModalSegmentSelected() {
    switch (this.segmentSelected) {
      case 1:
        this.openCreateConfigurationModal();
        break;
      case 2:
        this.openCreateMaintenanceModal();
        break;
      default:
        this.openCreateReplacementModal();
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
          x.$getName,
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

    this.loadHeader();
  }

  /** CONFIGURATION */

  private openConfigurationModal(row: ConfigurationModel, type: ModalTypeEnum) {
    this.controlService.openModal(PageEnum.CONFIGURATION, AddEditConfigurationComponent, new ModalInputModel<ConfigurationModel>({
      type: type, 
      data: row,
      parentPage: PageEnum.CONFIGURATION
    }));
  }

  openCreateConfigurationModal() {
    this.openConfigurationModal(new ConfigurationModel(), ModalTypeEnum.CREATE);
  }

  openUpdateConfigurationModal(row: ConfigurationModel) {
    this.openConfigurationModal(row, ModalTypeEnum.UPDATE);
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
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveConfiguration', e);
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
        this.controlService.showToast(PageEnum.MODAL_VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle', e);
      });
    }
  }

  /** MAINTENANCE */

  private openMaintenanceModal(row: MaintenanceModel, type: ModalTypeEnum) {
    this.controlService.openModal(PageEnum.CONFIGURATION,
      AddEditMaintenanceComponent, new ModalInputModel<MaintenanceModel, number>({
        type: type,
        data: row,
        dataList: [this.maxKm],
        parentPage: PageEnum.CONFIGURATION
      }));
  }

  openCreateMaintenanceModal() {
    this.openMaintenanceModal(new MaintenanceModel(), ModalTypeEnum.CREATE);
  }

  openUpdateMaintenanceModal(row: MaintenanceModel) {
    this.openMaintenanceModal(row, ModalTypeEnum.UPDATE);
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
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveMaintenance', e);
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
            configurationDelete = [...configurationDelete, new ConfigurationModel({
              name: c.name, 
              description: c.description,
              master: c.master,
              listMaintenance: [m],
              id: c.id
            })];
          }
        });
      }
    });
    data.listData.forEach(x => {
      if (x.selected && this.configurations.some(c => c.id === x.id && !c.listMaintenance.some(m => m.id === maintenance.id))) {
        configurationSave = [...configurationSave, new ConfigurationModel({
          master: true,
          listMaintenance: [maintenance],
          id: x.id
        })];
      }
    });
    this.configurationService.saveConfigurationMaintenance(configurationSave, configurationDelete).then(res => {
      this.controlService.showToast(PageEnum.MODAL_CONFIGURATION,
        ToastTypeEnum.SUCCESS, 'PAGE_CONFIGURATION.EditSaveMaintenancesAssociated');
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveConfiguration', e);
    });
  }

  /** MAINTENANCE ELEMENTS / REPLACEMENT */

  private openReplacementModal(row: MaintenanceElementModel, type: ModalTypeEnum) {
    this.controlService.openModal(PageEnum.CONFIGURATION, AddEditMaintenanceElementComponent, new ModalInputModel<MaintenanceElementModel>({
      type: type,
      data: row,
      parentPage: PageEnum.CONFIGURATION
    }));
  }

  openCreateReplacementModal() {
    this.openReplacementModal(new MaintenanceElementModel(), ModalTypeEnum.CREATE);
  }

  openUpdateReplacementModal(row: MaintenanceElementModel) {
    this.openReplacementModal(row, ModalTypeEnum.UPDATE);
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
            this.controlService.showToast(PageEnum.CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveReplacement', e);
          });
        }
      }
    );
  }

  isNotValidToDeleteReplacement(replacement: MaintenanceElementModel): boolean {
    return !replacement.master && this.maintenances.some(x => x.listMaintenanceElement.some(y => y.id === replacement.id));
  }

  /* HEADER */

  loadHeader(): void {
    this.headerInput = new HeaderInputModel({
      title: 'COMMON.CONFIGURATIONS',
      iconButtonRight: this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(PageEnum.CONFIGURATION)),
      dataSegment: [
        new HeaderSegmentInputModel({id: 1, name: 'PAGE_CONFIGURATION.YOURS_CONFIGURATIONS', icon: this.inputConfiguration.data.icon, selected: true }),
        new HeaderSegmentInputModel({id: 2, name: 'PAGE_CONFIGURATION.MAINTENANCES', icon: this.inputMaintenance.data.icon, selected: false }),
        new HeaderSegmentInputModel({id: 3, name: 'PAGE_CONFIGURATION.REPLACEMENTS', icon: this.inputMaintenanceElement.data.icon, selected: true }),
      ]
    });
  }

  eventEmitHeader(output: HeaderOutputModel) {
    switch(output.type) {
      case HeaderOutputEnum.BUTTON_RIGHT:
        this.showPopover(output.data);
        break;
      case HeaderOutputEnum.SEGMENT:
        this.segmentChanged(output.data);
        break;
    }
  }
    
  /* SKELETON */

  changeLoadedHeader(load: boolean) {
    this.loadedHeader = load;
    this.skeletonInput.time = this.skeletonInput.time / 2;
  }

  changeLoadedBody(load: boolean) {
    this.loadedBody = load;
  }

}
