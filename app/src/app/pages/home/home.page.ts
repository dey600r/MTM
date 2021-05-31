import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
  DataBaseService, DashboardService, ConfigurationService, ControlService, VehicleService,
  CalendarService, SettingsService
} from '@services/index';
import {
  SearchDashboardModel, WearVehicleProgressBarViewModel, WearReplacementProgressBarViewModel,
  MaintenanceModel, MaintenanceFreqModel, ModalInputModel, OperationModel, VehicleModel, VehicleTypeModel, ConfigurationModel
} from '@models/index';
import { WarningWearEnum, PageEnum, Constants, ToastTypeEnum } from '@utils/index';

// COMPONENTS
import { InfoNotificationComponent } from '@modals/info-notification/info-notification.component';
import { InfoCalendarComponent } from '@modals/info-calendar/info-calendar.component';
import { SettingsComponent } from '@modals/settings/settings.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditVehicleComponent } from '@modals/add-edit-vehicle/add-edit-vehicle.component';
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss']
})
export class HomePage implements OnInit {

  // MODAL
  input: ModalInputModel = new ModalInputModel();

  // DATA
  searchDashboard: SearchDashboardModel = this.dashboardService.getSearchDashboard();
  activateInfo = false;
  wears: WearVehicleProgressBarViewModel[] = [];
  allWears: WearVehicleProgressBarViewModel[] = [];
  vehicleSelected: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();
  operations: OperationModel[] = [];
  maintenances: MaintenanceModel[] = [];
  loadedHeader = false;
  loadedBody = false;
  hideOpButton = false;
  hideFabButton = false;
  measure: any = {};

  // SUBSCRIPTION
  operationSubscription: Subscription = new Subscription();
  vehicleSubscription: Subscription = new Subscription();
  maintenanceSubscription: Subscription = new Subscription();

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private dashboardService: DashboardService,
              private calendarService: CalendarService,
              private configurationService: ConfigurationService,
              private controlService: ControlService,
              private vehicleService: VehicleService,
              private settingsService: SettingsService) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });
  }

  ngOnInit() {
    this.getSystemConfiguration();
    this.initDashboard();
  }

  getSystemConfiguration() {
    this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });
  }

  initDashboard() {
    this.dbService.getConfigurations().subscribe(configurations => {
      this.maintenanceSubscription.unsubscribe();
      if (!!configurations && configurations.length > 0) {
        this.maintenanceSubscription = this.dbService.getMaintenance().subscribe(maintenances => {
          this.vehicleSubscription.unsubscribe();
          if (!!maintenances && maintenances.length > 0) {
            this.maintenances = maintenances;
            this.vehicleSubscription = this.dbService.getVehicles().subscribe(vehicles => {
              this.calculateVehiclesToDashboard(vehicles, configurations, maintenances);
            });
          }
        });
      }
    });
  }

  calculateVehiclesToDashboard(vehicles: VehicleModel[], configurations: ConfigurationModel[], maintenances: MaintenanceModel[]) {
    this.operationSubscription.unsubscribe();
    this.operations = [];
    this.wears = [];
    this.allWears = [];
    if (!!vehicles && vehicles.length > 0) {
      const vehiclesActives: VehicleModel[] = vehicles.filter(x => x.active);
      if (!!vehiclesActives && vehiclesActives.length > 0) {
        this.operationSubscription = this.dbService.getOperations().subscribe(operations => {
          this.calculateDashboard(vehiclesActives, operations, configurations, maintenances);
        });
      } else {
        this.timeOutLoader();
        this.activateInfo = this.activateModeInfo(vehiclesActives, []);
        this.vehicleSelected = new WearVehicleProgressBarViewModel();
      }
    } else {
      this.timeOutLoader();
      this.activateInfo = this.activateModeInfo(vehicles, []);
      this.vehicleSelected = new WearVehicleProgressBarViewModel();
    }
  }

  calculateDashboard(vehiclesActives: VehicleModel[], operations: OperationModel[],
                     configurations: ConfigurationModel[], maintenances: MaintenanceModel[]) {
    this.operations = operations.filter(x => x.vehicle.active);
    this.wears = [];
    this.allWears = this.dashboardService.getWearReplacementToVehicle(
      this.operations, vehiclesActives, configurations, maintenances);
    this.allWears.forEach((x, index) => {
      this.wears = [...this.wears, Object.assign({}, x)];
      let listWears: WearReplacementProgressBarViewModel[] = [];
      const kmVehicle: number = this.calendarService.calculateWearKmVehicleEstimated(x);
      x.listWearReplacement.forEach(z => {
      if (z.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_ONCE_CODE ||
          z.fromKmMaintenance <= kmVehicle && (z.toKmMaintenance === null || z.toKmMaintenance >= kmVehicle)) {
          listWears = [...listWears, z];
        }
      });
      this.wears.find(y => x.idVehicle === y.idVehicle).listWearReplacement = listWears;
    });
    if (!this.vehicleSelected) {
      this.vehicleSelected = new WearVehicleProgressBarViewModel();
    }
    this.vehicleSelected = (this.vehicleSelected.idVehicle === -1 ?
      this.wears[0] : this.wears.find(x => x.idVehicle === this.vehicleSelected.idVehicle));
    this.activateInfo = this.activateModeInfo(vehiclesActives, this.wears);
    this.timeOutLoader();
  }

  ionViewDidEnter() {
    // RELOAD NOTIFICATIONS
    if (this.controlService.getDateLastUse().toDateString() !== new Date().toDateString()) {
      this.loadedHeader = false;
      this.loadedBody = false;
      this.dbService.vehicles.next(this.dbService.vehiclesData);
      this.controlService.setDateLastUse();
    }
    this.timeOutLoader();
  }

  timeOutLoader() {
    if (document.getElementById('custom-overlay').style.display === 'flex' ||
    document.getElementById('custom-overlay').style.display === '') {
      setTimeout(() => { document.getElementById('custom-overlay').style.display = 'none'; }, 3000);
    }
    if (!this.loadedHeader || !this.loadedBody) {
      setTimeout(() => {
        this.loadedHeader = true;
        this.loadedBody = true;
      }, 2500);
    }
  }

  activateModeInfo(m: VehicleModel[], w: WearVehicleProgressBarViewModel[]): boolean {
    let result = true;
    this.hideOpButton = false;
    this.hideFabButton = false;
    if (m === null || m.length === 0) {
      this.hideOpButton = true;
      this.input = new ModalInputModel(true, null, [], PageEnum.HOME, Constants.STATE_INFO_VEHICLE_EMPTY);
    } else if (w === null  || w.length === 0) {
      this.hideFabButton = true;
      this.input = new ModalInputModel(true, null, [], PageEnum.HOME, Constants.STATE_INFO_NOTIFICATION_EMPTY);
    } else {
      result = false;
    }
    return result;
  }

  getClassProgressbar(warning: WarningWearEnum, styles: string): string {
    return this.dashboardService.getClassProgressbar(warning, styles);
  }

  getClassIcon(warning: WarningWearEnum, styles: string): string {
    return this.dashboardService.getClassIcon(warning, styles);
  }

  getIconKms(warning: WarningWearEnum): string {
    return this.dashboardService.getIconKms(warning);
  }

  getIconMaintenance(wear: WearReplacementProgressBarViewModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(wear.codeMaintenanceFreq)));
  }

  getDateCalculateMonths(wear: WearReplacementProgressBarViewModel): string {
    return this.dashboardService.getDateCalculateMonths(wear.calculateMonths);
  }

  segmentChanged(event: any): void {
    this.loadedBody = false;
    setTimeout(() => {
      this.loadedBody = true;
    }, 500);
    this.vehicleSelected = this.wears.find(x => x.idVehicle === Number(event.detail.value));
    this.activateModeInfo([new VehicleModel()], [this.vehicleSelected]);
  }

  activeSegmentScroll(): boolean {
    return (this.platform.width() < Constants.MAX_WIDTH_SEGMENT_SCROLABLE && this.wears.length > 2) || this.wears.length > 10;
  }

  // MODALS

  openInfoNotification(m: WearVehicleProgressBarViewModel, w: WearReplacementProgressBarViewModel) {
    let listGroupWear: WearReplacementProgressBarViewModel[] = [];
    if (w.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE) {
      listGroupWear = this.allWears.find(x => m.idVehicle === x.idVehicle).listWearReplacement.filter(x =>
        w.idMaintenanceElement === x.idMaintenanceElement && w.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE);
      const margenGrouper = 4000;
      listGroupWear = listGroupWear.filter(x => x.idMaintenance !== w.idMaintenance  && listGroupWear.some(y =>
        x.idMaintenance !== y.idMaintenance && y.kmMaintenance !== x.kmMaintenance &&
        (y.fromKmMaintenance !== null && x.toKmMaintenance !== null &&
          y.fromKmMaintenance >= x.toKmMaintenance - margenGrouper && y.fromKmMaintenance <= x.toKmMaintenance + margenGrouper) ||
        (y.toKmMaintenance !== null && x.fromKmMaintenance !== null &&
          y.toKmMaintenance >= x.fromKmMaintenance - margenGrouper && y.toKmMaintenance <= x.fromKmMaintenance + margenGrouper)));
    }
    listGroupWear = [...listGroupWear, w];
    this.controlService.openModal(PageEnum.HOME, InfoNotificationComponent, new ModalInputModel(true,
      new WearVehicleProgressBarViewModel(m.idVehicle, m.nameVehicle, m.kmVehicle, m.datePurchaseVehicle,
        m.kmsPerMonthVehicle, m.dateKmsVehicle, m.percent, m.percentKm, m.percentTime, m.warning, listGroupWear),
        this.operations, PageEnum.HOME));
  }

  openInfoCalendar() {
    if (!!this.wears && this.wears.length > 0) {
      this.controlService.openModal(PageEnum.HOME,
        InfoCalendarComponent, new ModalInputModel(true, null, this.wears, PageEnum.HOME));
    } else {
      const msg = `${this.translator.instant('ALERT.NotificationEmpty')} ${this.translator.instant('ALERT.AddMustVehicle')}`;
      this.controlService.showMsgToast(PageEnum.HOME, ToastTypeEnum.WARNING, msg);
    }
  }

  openSettings() {
    this.controlService.openModal(PageEnum.HOME,
      SettingsComponent, new ModalInputModel(true, null, this.wears, PageEnum.HOME));
  }

  openModalVehicle(): void {
    this.controlService.openModal(PageEnum.HOME,
      AddEditVehicleComponent, new ModalInputModel(true, new VehicleModel(), [], PageEnum.HOME));
  }

  openModalOperation(): void {
    const operation: OperationModel = new OperationModel();
    operation.vehicle.id = this.vehicleSelected.idVehicle;
    this.controlService.openModal(PageEnum.HOME,
      AddEditOperationComponent, new ModalInputModel(true, operation, [], PageEnum.HOME));
  }

  openModalMaintenance(w: WearReplacementProgressBarViewModel = null, create: boolean = true): void {
    let rowMaintenance: MaintenanceModel = new MaintenanceModel();
    if (w !== null) {
      rowMaintenance = this.maintenances.find(x => x.id === w.idMaintenance);
    }
    this.controlService.openModal(PageEnum.HOME,
      AddEditMaintenanceComponent, new ModalInputModel(create, rowMaintenance, [this.vehicleSelected.kmVehicle], PageEnum.HOME));
  }

  desactivateMaintenance(w: WearReplacementProgressBarViewModel): void {
    if (this.vehicleSelected.idConfiguration === 1) {
      this.controlService.showToast(PageEnum.HOME, ToastTypeEnum.WARNING, 'PAGE_HOME.ValidateDeleteConfigurationMaintenance',
              {maintenance: w.descriptionMaintenance, configuration: this.vehicleSelected.nameConfiguration},
              Constants.DELAY_TOAST_NORMAL);
    } else {
      this.controlService.showConfirm(PageEnum.HOME, this.translator.instant('COMMON.CONFIGURATION'),
      this.translator.instant('PAGE_HOME.ConfirmDeleteConfigurationMaintenance',
        {maintenance: w.descriptionMaintenance, configuration: this.vehicleSelected.nameConfiguration}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.configurationService.deleteConfigManintenance(this.vehicleSelected.idConfiguration, w.idMaintenance).then(x => {
            this.controlService.showToast(PageEnum.HOME, ToastTypeEnum.SUCCESS, 'PAGE_HOME.DeleteSaveConfigurationMaintenance',
              {maintenance: w.descriptionMaintenance, configuration: this.vehicleSelected.nameConfiguration},
              Constants.DELAY_TOAST_NORMAL);
          }).catch(e => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveConfiguration');
          });
        }
      }
    );
    }
  }

  getIconVehicle(wear: WearVehicleProgressBarViewModel): string {
    return this.vehicleService.getIconVehicle(new VehicleModel(null, null, null, null, null,
      new VehicleTypeModel(wear.typeVehicle)));
  }

  getKmPercent(wear: WearReplacementProgressBarViewModel): string {
    return `${wear.kmMaintenance - wear.calculateKms } / ${wear.kmMaintenance}`;
  }

  getTimePercent(wear: WearReplacementProgressBarViewModel): string {
    return `${this.dashboardService.getDateCalculateMonths(wear.timeMaintenance - wear.calculateMonths)} /` +
      ` ${this.dashboardService.getDateCalculateMonths(wear.timeMaintenance)}`;
  }

}
