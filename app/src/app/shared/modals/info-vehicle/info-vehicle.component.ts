import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

// SERVICES
import {
  CommonService, ControlService, DashboardService, DataService,  InfoVehicleService, SettingsService
} from '@services/index';

// MODELS
import {
  ConfigurationModel, IDashboardModel, IInfoModel, ISettingModel,
  DashboardModel, InfoVehicleHistoricModel,
  InfoVehicleConfigurationModel, InfoVehicleHistoricReplacementModel, MaintenanceElementModel,
  MaintenanceModel, ModalInputModel, OperationModel, VehicleModel, InfoVehicleReplacementModel,
  HeaderInputModel, HeaderSegmentInputModel, HeaderOutputModel, BodySkeletonInputModel,
} from '@models/index';

// UTILS
import { ConstantsColumns, InfoButtonEnum, InfoVehicleConfSummarySkeletonSetting, InfoVehicleReplSummarySkeletonSetting } from '@utils/index';

@Component({
  selector: 'app-info-vehicle',
  templateUrl: './info-vehicle.component.html',
  styleUrls: ['./info-vehicle.component.scss'],
})
export class InfoVehicleComponent implements OnInit {

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<any, VehicleModel> = new ModalInputModel<any, VehicleModel>();
  input: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
  inputBodySkeletonConfigurationSummary: BodySkeletonInputModel = InfoVehicleConfSummarySkeletonSetting;
  inputBodySkeletonReplacementSummary: BodySkeletonInputModel = InfoVehicleReplSummarySkeletonSetting;
  headerInput: HeaderInputModel = new HeaderInputModel();

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

  constructor(private readonly platform: Platform,
              private readonly screenOrientation: ScreenOrientation,
              private readonly controlService: ControlService,
              private readonly dataService: DataService,
              private readonly commonService: CommonService,
              private readonly infoVehicleService: InfoVehicleService,
              private readonly settingsService: SettingsService,
              private readonly dashboardService: DashboardService,
              private readonly changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.initSummary();
  }

  // INIT DATA

  initSummary() {
    this.input = new ModalInputModel<IInfoModel>({
      parentPage: this.modalInputModel.parentPage,
      data: {
        text: 'ALERT.NoDataFound',
        icon: 'analytics',
        info: InfoButtonEnum.NONE
      }
    });

    const settings = this.dataService.getSystemConfigurationData();
    this.measure = this.settingsService.getDistanceSelected(settings);
    this.coin = this.settingsService.getMoneySelected(settings);

    if (this.modalInputModel.dataList !== null && this.modalInputModel.dataList.length > 0) {
      this.initConfigurationSummary();
      this.initChartSummary();
      if(this.vehicleSelected)
        this.initData(this.vehicleSelected.id);
    }
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
      this.dataService.getConfigurationsData(), ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    const maintenances: MaintenanceModel[] = this.commonService.orderBy(
      this.dataService.getMaintenanceData(), ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
    const maintenanceElements: MaintenanceElementModel[] = this.dataService.getMaintenanceElementData();
    this.operations = this.dataService.getOperationsData();
    this.vehicles = this.modalInputModel.dataList.filter(v =>
      configurations.find(c => c.id === v.configuration.id).listMaintenance.length > 0);

    if (this.vehicles && this.vehicles.length > 0) {
      this.vehicleSelected = this.vehicles[0];
      this.headerInput = new HeaderInputModel({
        title: 'COMMON.SUMMARY_VEHICLES',
        dataSegment: this.vehicles.map(x => new HeaderSegmentInputModel({
          id: x.id,
          name: x.$getName,
          icon: x.vehicleType.icon,
          selected: (x.id == this.vehicleSelected.id)
        }))
      });

      // INFO CONFIGURATION VEHICLE
      this.listInfoVehicleConfiguration = this.infoVehicleService.calculateInfoVehicleConfiguration(
        this.operations, this.vehicles, configurations, maintenances);

      // INFO VEHICLE REPLACEMENTS
      this.listInfoVehicleReplacement = this.infoVehicleService.calculateInfoReplacementHistoric(
        this.vehicles, maintenances, this.operations, configurations, maintenanceElements);
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

  initChartInformationVehicle(windowSize: [number, number]) {
    this.vehicles.forEach(x => {
      this.dataDashboardInformationVehicle = [...this.dataDashboardInformationVehicle, {
        id: x.id,
        data: this.dashboardService.getDashboardInformationVehicle(windowSize, x, this.operations.filter(o => o.vehicle.id === x.id)) }];
    });
    
  }

  initChartConfigurationVehicle(windowSize: [number, number]) {
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
        this.showInfoMaintenance = [...this.showInfoMaintenance, false]);
    }
  }

  initShowInfoReplacement(vehicleSelected: VehicleModel) {
    this.showInfoReplacement = [];
    if (vehicleSelected) {
      this.selectedInfoReplacement.forEach(x =>
        this.showInfoReplacement = [...this.showInfoReplacement, false]);
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

  eventEmitHeader(output: HeaderOutputModel) {
    this.segmentChanged(output.data);
  }

  initData(idVehicle: number) {
    this.initDataSelected(idVehicle);
    this.initShowInfo(this.vehicleSelected);
    this.initVehicleSummary();
    this.resetList();
  }

  segmentChanged(event: any): void {
    this.showSpinner = true; // Windows 10: Fix no change good the data of the chart when the tabs is changed
    this.initData(Number(event.detail.value));
    this.changeDetector.detectChanges();
    setTimeout(() => { this.showSpinner = false; }, 150);
  }
}
