import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

// SERVICES
import {
  CommonService, ControlService, DashboardService, DataBaseService,  InfoVehicleService, SettingsService
} from '@services/index';

// MODELS
import {
  ConfigurationModel, IDashboardModel, IInfoModel, ISettingModel,
  DashboardModel, InfoVehicleHistoricModel,
  InfoVehicleConfigurationModel, InfoVehicleHistoricReplacementModel, MaintenanceElementModel,
  MaintenanceModel, ModalInputModel, OperationModel, VehicleModel, InfoVehicleReplacementModel
} from '@models/index';

// UTILS
import { ConstantsColumns, InfoButtonEnum } from '@utils/index';

@Component({
  selector: 'app-info-vehicle',
  templateUrl: './info-vehicle.component.html',
  styleUrls: ['./info-vehicle.component.scss'],
})
export class InfoVehicleComponent implements OnInit {

  // MODAL MODELS
  modalInputModel: ModalInputModel<any, VehicleModel> = new ModalInputModel<any, VehicleModel>();
  input: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();

  // DATA
  vehicles: VehicleModel[] = [];
  operations: OperationModel[] = [];
  vehicleSelected: VehicleModel = new VehicleModel();
  measure: ISettingModel;
  coin: ISettingModel;
  showInfoMaintenance: boolean[] = [];
  showInfoReplacement: boolean[] = [];

  // CHARTS
  dataDashboardInformationVehicle: any[] = [];
  dashboardInformationVehicle: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
  dataDashboardConfigurationVehicle: any[] = [];
  dashboardConfigurationVehicle: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();

  // MODELS
  listInfoVehicleConfiguration: InfoVehicleConfigurationModel[] = [];
  selectedInfoVehicleConfiguration: InfoVehicleConfigurationModel = new InfoVehicleConfigurationModel();
  listInfoVehicleReplacement: InfoVehicleHistoricModel[] = [];
  selectedInfoReplacement: InfoVehicleHistoricReplacementModel[] = [];
  hideVehicleSummary = false;
  hideConfigurationSummary = true;
  loadedBodyConfigurationSummary = true;
  hideReplacementSummary = true;
  loadedBodyReplacementSummary = true;
  showSpinner = false;
  labelVehicleKm = '';
  labelPercent = 0;
  labelIconClassPercent = '';
  labelIconPercent = '';
  labelVehicleAverageKm = '';

  // SUSBSCRIPTION
  screenSubscription: Subscription = new Subscription();

  constructor(private platform: Platform,
              public navParams: NavParams,
              private screenOrientation: ScreenOrientation,
              private modalController: ModalController,
              private controlService: ControlService,
              private dbService: DataBaseService,
              private commonService: CommonService,
              private infoVehicleService: InfoVehicleService,
              private settingsService: SettingsService,
              private dashboardService: DashboardService,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.initSummary();
  }

  // INIT DATA

  initSummary() {
    this.modalInputModel = new ModalInputModel<any, VehicleModel>(this.navParams.data);
    this.input = new ModalInputModel<IInfoModel>({
      parentPage: this.modalInputModel.parentPage,
      data: {
        text: 'ALERT.NoDataFound',
        icon: 'analytics',
        info: InfoButtonEnum.NONE
      }
    });

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
      this.labelIconClassPercent = this.infoVehicleService.getIconPercent(this.labelPercent, 'color');
      this.labelIconPercent = this.infoVehicleService.getIconPercent(this.labelPercent, 'icon');
      this.labelVehicleAverageKm = this.infoVehicleService.getLabelAverageKmVehicle(this.dashboardInformationVehicle.data, this.measure);
    }
  }

  initConfigurationSummary() {
    // INFO VEHICLE CONFIGURATION
    const configurations: ConfigurationModel[] = this.commonService.orderBy(
      this.dbService.getConfigurationsData(), ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    const maintenances: MaintenanceModel[] = this.commonService.orderBy(
      this.dbService.getMaintenanceData(), ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
    const maintenanceElements: MaintenanceElementModel[] = this.dbService.getMaintenanceElementData();
    this.operations = this.dbService.getOperationsData();
    this.vehicles = this.modalInputModel.dataList.filter(v =>
      configurations.find(c => c.id === v.configuration.id).listMaintenance.length > 0);

    if (this.vehicles && this.vehicles.length > 0) {
      this.vehicleSelected = this.vehicles[0];

      // INFO CONFIGURATION VEHICLE
      this.listInfoVehicleConfiguration = this.infoVehicleService.calculateInfoVehicleConfiguration(
        this.operations, this.vehicles, configurations, maintenances);

      // INFO VEHICLE REPLACEMENTS
      this.listInfoVehicleReplacement = this.infoVehicleService.calculateInfoReplacementHistoric(
        this.vehicles, maintenances, this.operations, configurations, maintenanceElements);

      this.initShowInfo(this.vehicleSelected);
    }
  }

  initChartSummary() {
    let windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
    this.initChartInformationVehicle(windowSize);
    this.initChartConfigurationVehicle(windowSize);
    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      windowSize = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
      this.dataDashboardInformationVehicle.forEach(x => x.data.view = windowSize);
      this.dashboardInformationVehicle.view = windowSize;
      this.dataDashboardConfigurationVehicle.forEach(x => x.data.view = windowSize);
      this.dashboardConfigurationVehicle.view = windowSize;
      this.changeDetector.detectChanges();
    });
  }

  initChartInformationVehicle(windowSize: any[]) {
    this.vehicles.forEach(x => {
      this.dataDashboardInformationVehicle = [...this.dataDashboardInformationVehicle, {
        id: x.id,
        data: this.dashboardService.getDashboardInformationVehicle(windowSize, x, this.operations.filter(o => o.vehicle.id === x.id)) }];
    });
    
  }

  initChartConfigurationVehicle(windowSize: any[]) {
    this.listInfoVehicleConfiguration.forEach(x => {
      this.dataDashboardConfigurationVehicle = [...this.dataDashboardConfigurationVehicle, {
        id: x.idVehicle,
        data: this.dashboardService.getDashboardConfigurationVehicle(windowSize, x) }];
    });
  }

  initShowInfo(vehicleSelected: VehicleModel) {
    this.initShowInfoMaintenance(vehicleSelected);
    this.initShowInfoReplacement(vehicleSelected);
  }

  resetList() {
    this.hideVehicleSummary = false;
    this.hideConfigurationSummary = true;
    this.hideReplacementSummary = true;
  }

  initShowInfoMaintenance(vehicleSelected: VehicleModel) {
    this.showInfoMaintenance = [];
    if (vehicleSelected) {
      this.selectedInfoVehicleConfiguration.listMaintenance.forEach(x =>
        this.showInfoMaintenance = [...this.showInfoMaintenance, true]);
    }
  }

  initShowInfoReplacement(vehicleSelected: VehicleModel) {
    this.showInfoReplacement = [];
    if (vehicleSelected) {
      this.selectedInfoReplacement.forEach(x =>
        this.showInfoReplacement = [...this.showInfoReplacement, true]);
    }
  }

  initDataSelected(idVehicle: number) {
    if (this.vehicles && this.vehicles.length > 0) {
      this.vehicleSelected = this.vehicles.find(x => x.id === idVehicle);
      this.selectedInfoVehicleConfiguration = this.listInfoVehicleConfiguration.find(x => x.idVehicle === idVehicle);
      this.selectedInfoReplacement = this.listInfoVehicleReplacement.find(x => x.id === idVehicle).listHistoricReplacements;
      this.dashboardInformationVehicle = this.dataDashboardInformationVehicle.find(x => x.id === this.selectedInfoVehicleConfiguration.idVehicle).data;
      this.dashboardConfigurationVehicle = this.dataDashboardConfigurationVehicle.find(x => x.id === this.selectedInfoVehicleConfiguration.idVehicle).data;
    }
  }

  // METHODS

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

  // SEGMENT

  segmentChanged(event: any): void {
    this.showSpinner = true; // Windows 10: Fix no change good the data of the chart when the tabs is changed
    this.initDataSelected(Number(event.detail.value));
    this.initShowInfo(this.vehicleSelected);
    this.initVehicleSummary();
    this.resetList();
    this.changeDetector.detectChanges();
    setTimeout(() => { this.showSpinner = false; }, 150);
  }

  activeSegmentScroll(): boolean {
    return this.controlService.activeSegmentScroll(this.vehicles.length);
  }

  // MODAL

  closeModal() {
    this.controlService.closeModal(this.modalController);
  }

}
