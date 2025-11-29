import { ChangeDetectorRef, Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '../search-dashboard-popover/search-dashboard-popover.component';

// SERVICES
import {
  CommonService, ControlService, DashboardService, DataService,  IconService,  InfoVehicleService, SettingsService
} from '@services/index';

// MODELS
import {
  ConfigurationModel, IDashboardModel, IInfoModel, ISettingModel,
  DashboardModel, InfoVehicleHistoricModel,
  InfoVehicleConfigurationModel, InfoVehicleHistoricReplacementModel, MaintenanceElementModel,
  MaintenanceModel, ModalInputModel, OperationModel, VehicleModel, InfoVehicleReplacementModel,
  HeaderInputModel, HeaderSegmentInputModel, HeaderOutputModel, BodySkeletonInputModel,
  SearchDashboardModel,
} from '@models/index';

// UTILS
import { 
  ConstantsColumns, HeaderOutputEnum, InfoButtonEnum, InfoVehicleConfSummarySkeletonSetting, 
  InfoVehicleReplSummarySkeletonSetting, PageEnum
} from '@utils/index';

@Component({
    selector: 'app-info-vehicle',
    templateUrl: './info-vehicle.component.html',
    styleUrls: ['./info-vehicle.component.scss'],
    standalone: false
})
export class InfoVehicleComponent implements OnInit, OnDestroy {

  // INJECTIONS
  private readonly platform: Platform = inject(Platform);
  private readonly screenOrientation: ScreenOrientation = inject(ScreenOrientation);
  private readonly dataService: DataService = inject(DataService);
  private readonly commonService: CommonService = inject(CommonService);
  private readonly infoVehicleService: InfoVehicleService = inject(InfoVehicleService);
  private readonly settingsService: SettingsService = inject(SettingsService);
  private readonly dashboardService: DashboardService = inject(DashboardService);
  private readonly iconService: IconService = inject(IconService);
  private readonly controlService: ControlService = inject(ControlService);
  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

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
  dashboardInformationVehicle: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
  dashboardConfigurationVehicle: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
  dashboardReplacementVehicle: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();

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
  openningPopover = false;

  // SUSBSCRIPTION
  screenSubscription: Subscription = new Subscription();
  searchDashboardSubscription: Subscription = new Subscription();
  searchDashboardRecordsSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.initSummary();
  }

  ngOnDestroy() {
    this.searchDashboardSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
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

  loadHeader() {
    this.headerInput = new HeaderInputModel({
        title: 'COMMON.SUMMARY_VEHICLES',
        iconButtonLeft: this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(PageEnum.MODAL_INFO_VEHICLE)),
        dataSegment: this.vehicles.map(x => new HeaderSegmentInputModel({
          id: x.id,
          name: x.$getName,
          icon: x.vehicleType.icon,
          selected: (x.id == this.vehicleSelected.id)
        }))
      });
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
      this.loadHeader();

      // INFO CONFIGURATION VEHICLE
      this.listInfoVehicleConfiguration = this.infoVehicleService.calculateInfoVehicleConfiguration(
        this.operations, this.vehicles, configurations, maintenances);

      // INFO VEHICLE REPLACEMENTS
      this.listInfoVehicleReplacement = this.infoVehicleService.calculateInfoReplacementHistoric(
        this.vehicles, maintenances, this.operations, configurations, maintenanceElements);
    }
  }

  getObserverSearchDashboard() {
    this.searchDashboardSubscription = this.dashboardService.getObserverSearchDashboard().subscribe(filter => {
      if (!this.openningPopover) {
        let windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        this.initChartInformationVehicle(windowSize, filter);
        this.initChartConfigurationVehicle(windowSize);
        this.initChartReplacementVehicle(windowSize, filter);
        this.loadHeader();
      }
    });
  }

  getObserverSearchDashboardRecords() {
    this.searchDashboardRecordsSubscription = this.dashboardService.getObserverSearchDashboardRecords().subscribe(filter => {
      if (!this.openningPopover) {
        let windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        this.initChartReplacementVehicle(windowSize, filter);
        this.loadHeader();
      }
    });
  }

  initChartSummary() {
    this.getObserverSearchDashboard();
    this.getObserverSearchDashboardRecords();
    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      let windowSize = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
      this.dashboardInformationVehicle.view = windowSize;
      this.dashboardConfigurationVehicle.view = windowSize;
      this.dashboardReplacementVehicle.view = windowSize;
      this.changeDetector.detectChanges();
    });
  }

  initChartInformationVehicle(windowSize: [number, number], filter: SearchDashboardModel) {
    if(!this.hideVehicleSummary) {
      this.dashboardInformationVehicle = this.dashboardService.getDashboardInformationVehicle(windowSize, this.vehicleSelected, this.operations.filter(o => o.vehicle.id === this.vehicleSelected.id), filter);
    }
  }

  initChartConfigurationVehicle(windowSize: [number, number]) {
    if(!this.hideConfigurationSummary) {
      const infoVehicleConfiguration = this.getInfoVehicleConfigurationModel(this.vehicleSelected.id);
      this.dashboardConfigurationVehicle = this.dashboardService.getDashboardConfigurationVehicle(windowSize, infoVehicleConfiguration);
    }
  }

  initChartReplacementVehicle(windowSize: [number, number], filter: SearchDashboardModel) {
    if(!this.hideReplacementSummary) {
      const infoReplacementVehicle = this.getInfoVehicleReplacementModel(this.vehicleSelected.id);
      this.dashboardReplacementVehicle = this.dashboardService.getDashboardReplacementVehicle(windowSize, infoReplacementVehicle.listHistoricReplacements, filter);
    }
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

  getInfoVehicleConfigurationModel(idVehicle: number): InfoVehicleConfigurationModel {
    return this.listInfoVehicleConfiguration.find(x => x.idVehicle === idVehicle);
  }

  getInfoVehicleReplacementModel(idVehicle: number): InfoVehicleHistoricModel {
    return this.listInfoVehicleReplacement.find(x => x.id === idVehicle);
  }

  initDataSelected(idVehicle: number) {
    if (this.vehicles && this.vehicles.length > 0) {
      this.vehicleSelected = this.vehicles.find(x => x.id === idVehicle);
      this.selectedInfoVehicleConfiguration = this.getInfoVehicleConfigurationModel(idVehicle);
      this.selectedInfoReplacement = this.getInfoVehicleReplacementModel(idVehicle).listHistoricReplacements;
    }
  }

  refreshChart(idVehicle: number) {
    this.initData(idVehicle);
    this.dashboardService.setSearchDashboard(this.dashboardService.getSearchDashboard());
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
        const search: SearchDashboardModel = this.dashboardService.getSearchDashboard();
        this.dashboardService.setSearchDashboardRecords(search.filterKmTime, search.showStrict);
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
        this.dashboardService.setSearchDashboard(this.dashboardService.getSearchDashboard());
      }, 350);
    } else {
      this.hideConfigurationSummary = true;
    }
  }

  // HEADER

  eventEmitHeader(output: HeaderOutputModel) {
    switch (output.type){
      case HeaderOutputEnum.SEGMENT:
        this.segmentChanged(output.data);
        break;
      case HeaderOutputEnum.BUTTON_LEFT:
        this.showPopover(output.data);
        break;
    }
  }

  showPopover(ev: any) {
    this.openningPopover = true;
    this.controlService.showPopover(PageEnum.MODAL_INFO_VEHICLE, ev, SearchDashboardPopOverComponent, 
      new ModalInputModel<any, VehicleModel>({
        parentPage: PageEnum.MODAL_INFO_VEHICLE,
        dataList: this.modalInputModel.dataList
      }));
    setTimeout(() => this.openningPopover = false, 200);
  }

  loadIconSearch() {
    this.headerInput.iconButtonLeft = this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(this.modalInputModel.parentPage));
  }

  initData(idVehicle: number) {
    this.initDataSelected(idVehicle);
    this.initShowInfo(this.vehicleSelected);
    this.initVehicleSummary();
    this.resetList();
  }

  segmentChanged(event: any): void {
    this.showSpinner = true; // Windows 10: Fix no change good the data of the chart when the tabs is changed
    this.refreshChart(Number(event.detail.value));
    this.changeDetector.detectChanges();
    setTimeout(() => { this.showSpinner = false; }, 150);
  }
}
