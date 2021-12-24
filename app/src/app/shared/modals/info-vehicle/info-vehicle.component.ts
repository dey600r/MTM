import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// SERVICES
import {
  CommonService, ConfigurationService, ControlService, DashboardService,
  DataBaseService, HomeService, InfoVehicleService, SettingsService, VehicleService
} from '@services/index';

// MODELS
import {
  ConfigurationModel,
  DashboardModel, InfoVehicleHistoricModel, InfoVehicleConfigurationMaintenanceModel,
  InfoVehicleConfigurationModel, InfoVehicleHistoricReplacementModel, MaintenanceElementModel,
  MaintenanceFreqModel, MaintenanceModel, ModalInputModel, OperationModel, VehicleModel, InfoVehicleReplacementModel
} from '@models/index';

// UTILS
import { ConstantsColumns, WarningWearEnum } from '@utils/index';

@Component({
  selector: 'app-info-vehicle',
  templateUrl: './info-vehicle.component.html',
  styleUrls: ['./info-vehicle.component.scss'],
})
export class InfoVehicleComponent implements OnInit {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();

  // DATA
  vehicles: VehicleModel[] = [];
  vehicleSelected: VehicleModel = new VehicleModel();
  measure: any = {};
  coin: any = {};
  showInfoMaintenance: boolean[] = [];
  showInfoReplacement: boolean[] = [];

  // MODELS
  listInfoVehicleConfiguration: InfoVehicleConfigurationModel[] = [];
  selectedInfoVehicleConfiguration: InfoVehicleConfigurationModel = new InfoVehicleConfigurationModel();
  listInfoVehicleReplacement: InfoVehicleHistoricModel[] = [];
  selectedInfoReplacement: InfoVehicleHistoricReplacementModel[] = [];
  hideVehicleSummary = true;
  hideConfigurationSummary = true;
  loadedBodyConfigurationSummary = true;
  hideReplacementSummary = true;
  loadedBodyReplacementSummary = true;
  dashboard: DashboardModel = new DashboardModel([], []);
  windowsSize: any[] = [];
  dataDashboard: any[] = [];
  labelVehicleKm = '';
  labelPercent = 0;

  // SUSBSCRIPTION
  screenSubscription: Subscription = new Subscription();

  constructor(private platform: Platform,
              public navParams: NavParams,
              private screenOrientation: ScreenOrientation,
              private modalController: ModalController,
              private controlService: ControlService,
              private vehicleService: VehicleService,
              private dbService: DataBaseService,
              private commonService: CommonService,
              private infoVehicleService: InfoVehicleService,
              private configurationService: ConfigurationService,
              private settingsService: SettingsService,
              private homeService: HomeService,
              private dashboardService: DashboardService,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.initSummary();
  }

  // INIT DATA

  initSummary() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    const settings = this.dbService.getSystemConfigurationData();
    this.measure = this.settingsService.getDistanceSelected(settings);
    this.coin = this.settingsService.getMoneySelected(settings);

    if (this.modalInputModel.dataList !== null && this.modalInputModel.dataList.length > 0) {
      this.initConfigurationSummary();
      this.initChartSummary();
      this.changeDetector.detectChanges();
    }

    this.controlService.isAppFree(this.modalController);
  }

  initVehicleSummary() {
    if (this.listInfoVehicleConfiguration && this.listInfoVehicleConfiguration.length > 0) {
      const data = this.listInfoVehicleConfiguration.find(x => x.idVehicle === this.vehicleSelected.id);
      this.labelVehicleKm = this.infoVehicleService.getLabelKmVehicle(this.vehicleSelected.km, data.kmEstimated, this.measure);
      this.labelPercent = this.infoVehicleService.getPercentKmVehicle(this.selectedInfoVehicleConfiguration);
    }
  }

  initConfigurationSummary() {
    // INFO VEHICLE CONFIGURATION
    const configurations: ConfigurationModel[] = this.commonService.orderBy(
      this.dbService.getConfigurationsData(), ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    const maintenances: MaintenanceModel[] = this.commonService.orderBy(
      this.dbService.getMaintenanceData(), ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
    const operations: OperationModel[] = this.dbService.getOperationsData();
    const maintenanceElements: MaintenanceElementModel[] = this.dbService.getMaintenanceElementData();
    this.vehicles = this.modalInputModel.dataList.filter(v =>
      configurations.find(c => c.id === v.configuration.id).listMaintenance.length > 0);

    if (this.vehicles && this.vehicles.length > 0) {
      this.vehicleSelected = this.vehicles[0];

      this.listInfoVehicleConfiguration = this.infoVehicleService.calculateInfoVehicleConfiguration(
        operations, this.vehicles, configurations, maintenances);

      // INFO VEHICLE REPLACEMENTS
      this.listInfoVehicleReplacement = this.infoVehicleService.calculateInfoReplacementHistoric(
        this.vehicles, maintenances, operations, configurations, maintenanceElements);

      this.initShowInfo();
    }
  }

  initChartSummary() {
    // CHART
    let windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
    this.listInfoVehicleConfiguration.forEach(x => {
      this.dataDashboard = [...this.dataDashboard, {
        id: x.idVehicle,
        data: this.dashboardService.getDashboardInfoVehicle(windowSize, x) }];
    });
    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      windowSize = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
      this.dataDashboard.forEach(x => x.data.view = windowSize);
      this.dashboard.view = windowSize;
      this.changeDetector.detectChanges();
    });
  }

  initShowInfo() {
    this.initShowInfoMaintenance();
    this.initShowInfoReplacement();
  }

  resetList() {
    this.hideVehicleSummary = true;
    this.hideConfigurationSummary = true;
    this.hideReplacementSummary = true;
  }

  initShowInfoMaintenance() {
    this.showInfoMaintenance = [];
    if (this.vehicleSelected) {
      this.selectedInfoVehicleConfiguration.listMaintenance.forEach(x =>
        this.showInfoMaintenance = [...this.showInfoMaintenance, true]);
    }
  }

  initShowInfoReplacement() {
    this.showInfoReplacement = [];
    if (this.vehicleSelected) {
      this.selectedInfoReplacement.forEach(x =>
        this.showInfoReplacement = [...this.showInfoReplacement, true]);
    }
  }

  initDataSelected(idVehicle: number) {
    if (this.vehicles && this.vehicles.length > 0) {
      this.vehicleSelected = this.vehicles.find(x => x.id === idVehicle);
      this.selectedInfoVehicleConfiguration = this.listInfoVehicleConfiguration.find(x => x.idVehicle === idVehicle);
      this.selectedInfoReplacement = this.listInfoVehicleReplacement.find(x => x.id === idVehicle).listHistoricReplacements;
      this.dashboard = this.dataDashboard.find(x => x.id === this.selectedInfoVehicleConfiguration.idVehicle).data;
    }
  }

  // METHODS

  getIconMaintenance(maintenance: InfoVehicleConfigurationMaintenanceModel): string {
    return this.configurationService.getIconMaintenance(new MaintenanceModel('', [], new MaintenanceFreqModel(maintenance.codeFrequency)));
  }

  getIconPercent(type: string): string {
    return this.infoVehicleService.getIconPercent(this.labelPercent, type);
  }

  getIconPlanned(rep: InfoVehicleHistoricReplacementModel): string {
    return rep.planned ? 'build' : 'construct';
  }

  showInfoVehicle() {
    this.infoVehicleService.showInfoVehicle(this.vehicleSelected.dateKms, this.measure);
  }

  showToastInfoReplacement(rep: InfoVehicleHistoricReplacementModel, subRep: InfoVehicleReplacementModel) {
    this.infoVehicleService.showToastInfoReplacement(rep, subRep, this.measure, this.coin);
  }

  showInfoReplacementLoad() {
    if (this.hideReplacementSummary) {
      this.loadedBodyReplacementSummary = false;
      setTimeout(() => {
        this.loadedBodyReplacementSummary = true;
        this.hideReplacementSummary = false;
      }, 350);
    } else {
      this.hideReplacementSummary = true;
    }
  }

  showInfoConfigurationLoad() {
    if (this.hideConfigurationSummary) {
      this.loadedBodyConfigurationSummary = false;
      setTimeout(() => {
        this.loadedBodyConfigurationSummary = true;
        this.hideConfigurationSummary = false;
      }, 350);
    } else {
      this.hideConfigurationSummary = true;
    }
  }

  // ICONS

  getIconReplacement(replacementId: number): string {
    return this.configurationService.getIconReplacement(new MaintenanceElementModel(null, null, false, 0, replacementId));
  }

  getClassIcon(warning: WarningWearEnum, styles: string): string {
    return this.homeService.getClassIcon(warning, styles);
  }

  getIconVehicle(vehicle: VehicleModel): string {
    return this.vehicleService.getIconVehicle(vehicle);
  }

  getIconKms(warning: WarningWearEnum): string {
    return this.homeService.getIconKms(warning);
  }

  // SEGMENT

  segmentChanged(event: any): void {
    this.initDataSelected(Number(event.detail.value));
    this.initShowInfo();
    this.initVehicleSummary();
    this.resetList();
  }

  activeSegmentScroll(): boolean {
    return this.controlService.activeSegmentScroll(this.vehicles.length);
  }

  // MODAL

  closeModal() {
    this.controlService.closeModal(this.modalController);
  }

}
