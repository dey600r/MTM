import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
  DataBaseService, DashboardService, ConfigurationService, ControlService, VehicleService,
  CalendarService, SettingsService, ThemeService, HomeService
} from '@services/index';
import {
  SearchDashboardModel, WearVehicleProgressBarViewModel, WearMaintenanceProgressBarViewModel,
  MaintenanceModel, MaintenanceFreqModel, ModalInputModel, OperationModel, VehicleModel, VehicleTypeModel, ConfigurationModel, WearReplacementProgressBarViewModel, MaintenanceElementModel
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

  showInfoMaintenance: boolean[] = [];

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
              private settingsService: SettingsService,
              private themeService: ThemeService,
              private homeService: HomeService) {
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
        const theme = this.settingsService.getThemeSelected(settings);
        this.themeService.changeTheme(theme.code);
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

    this.allWears = this.homeService.getWearReplacementToVehicle(
      this.operations, vehiclesActives, configurations, maintenances);
    this.allWears.forEach(x => {
      this.wears = [...this.wears, Object.assign({}, x)];
      let listWears: WearMaintenanceProgressBarViewModel[] = [];
      const kmVehicle: number = this.calendarService.calculateWearKmVehicleEstimated(x);
      x.listWearMaintenance.forEach(z => {
      if (z.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_ONCE_CODE ||
          z.fromKmMaintenance <= kmVehicle && (z.toKmMaintenance === null || z.toKmMaintenance >= kmVehicle)) {
          listWears = [...listWears, z];
        }
      });
      this.wears.find(y => x.idVehicle === y.idVehicle).listWearMaintenance = listWears;
    });
    if (!this.vehicleSelected || !this.wears.some(x => x.idVehicle === this.vehicleSelected.idVehicle)) {
      this.vehicleSelected = new WearVehicleProgressBarViewModel();
    }
    this.vehicleSelected = (this.vehicleSelected.idVehicle === -1 ?
      this.wears[0] : this.wears.find(x => x.idVehicle === this.vehicleSelected.idVehicle));
    this.activateInfo = this.activateModeInfo(vehiclesActives, this.wears);
    this.initShowInfoMaintenance();
    this.timeOutLoader();
  }

  initShowInfoMaintenance() {
    this.showInfoMaintenance = [];
    if (this.vehicleSelected) {
      this.vehicleSelected.listWearMaintenance.forEach(x => this.showInfoMaintenance = [...this.showInfoMaintenance, true]);
    }
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
    return this.homeService.getClassProgressbar(warning, styles);
  }

  getReplacementClassIcon(wearRep: WearReplacementProgressBarViewModel, styles: string): string {
    return this.getClassIcon(this.homeService.calculateWearNotificationPriority(wearRep.warningKms, wearRep.warningMonths), styles);
  }

  getIconReplacement(wearRep: WearReplacementProgressBarViewModel): string {
    return this.configurationService.getIconReplacement(new MaintenanceElementModel(null, null, null, 0, wearRep.idMaintenanceElement));
  }

  getClassIcon(warning: WarningWearEnum, styles: string): string {
    return this.homeService.getClassIcon(warning, styles);
  }

  getIconKms(warning: WarningWearEnum): string {
    return this.homeService.getIconKms(warning);
  }

  getIconMaintenance(wear: WearMaintenanceProgressBarViewModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(wear.codeMaintenanceFreq)));
  }

  segmentChanged(event: any): void {
    this.loadedBody = false;
    setTimeout(() => {
      this.loadedBody = true;
    }, 500);
    this.vehicleSelected = this.wears.find(x => x.idVehicle === Number(event.detail.value));
    this.initShowInfoMaintenance();
    this.activateModeInfo([new VehicleModel()], [this.vehicleSelected]);
  }

  activeSegmentScroll(): boolean {
    return (this.platform.width() < Constants.MAX_WIDTH_SEGMENT_SCROLABLE && this.wears.length > 2) || this.wears.length > 10;
  }

  // MODALS

  openInfoNotification(wv: WearVehicleProgressBarViewModel, wm: WearMaintenanceProgressBarViewModel,
                       wr: WearReplacementProgressBarViewModel) {
    let listGroupWearMaintenance: WearMaintenanceProgressBarViewModel[] = [];
    if (wm.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE) {
      listGroupWearMaintenance = this.allWears.find(x => wv.idVehicle === x.idVehicle).listWearMaintenance.filter(x =>
        wm.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE && x.listWearReplacement.some(y =>
          y.idMaintenanceElement === wr.idMaintenanceElement));
      const margenGrouper = 4000;
      listGroupWearMaintenance = listGroupWearMaintenance.filter(x => x.idMaintenance !== wm.idMaintenance &&
        listGroupWearMaintenance.some(y =>
        x.idMaintenance !== y.idMaintenance && y.kmMaintenance !== x.kmMaintenance &&
        (y.fromKmMaintenance !== null && x.toKmMaintenance !== null &&
          y.fromKmMaintenance >= x.toKmMaintenance - margenGrouper && y.fromKmMaintenance <= x.toKmMaintenance + margenGrouper) ||
        (y.toKmMaintenance !== null && x.fromKmMaintenance !== null &&
          y.toKmMaintenance >= x.fromKmMaintenance - margenGrouper && y.toKmMaintenance <= x.fromKmMaintenance + margenGrouper)));
    }
    listGroupWearMaintenance = [...listGroupWearMaintenance, wm];
    const groupWearVehicle: WearVehicleProgressBarViewModel =
      new WearVehicleProgressBarViewModel(wv.idVehicle, wv.nameVehicle, wv.kmVehicle, wv.datePurchaseVehicle,
      wv.kmsPerMonthVehicle, wv.dateKmsVehicle, wv.percent, wv.percentKm, wv.percentTime, wv.warning, []);
    listGroupWearMaintenance.forEach(x => {
      groupWearVehicle.listWearMaintenance = [...groupWearVehicle.listWearMaintenance, new WearMaintenanceProgressBarViewModel(
        x.codeMaintenanceFreq, x.idMaintenance, x.descriptionMaintenance, x.kmMaintenance, x.timeMaintenance,
        x.fromKmMaintenance, x.toKmMaintenance, x.initMaintenance, x.wearMaintenance, [], [wr]
      )];
    });
    this.controlService.openModal(PageEnum.HOME, InfoNotificationComponent, new ModalInputModel(true,
      groupWearVehicle, this.operations, PageEnum.HOME));
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

  openModalMaintenance(itemSliding: any, w: WearMaintenanceProgressBarViewModel = null, create: boolean = true): void {
    let rowMaintenance: MaintenanceModel = new MaintenanceModel();
    if (w !== null) {
      rowMaintenance = this.maintenances.find(x => x.id === w.idMaintenance);
    }
    if (itemSliding) { itemSliding.close(); }
    this.controlService.openModal(PageEnum.HOME,
      AddEditMaintenanceComponent, new ModalInputModel(create, rowMaintenance, [this.vehicleSelected.kmVehicle], PageEnum.HOME));
  }

  desactivateMaintenance(itemSliding: any, w: WearMaintenanceProgressBarViewModel): void {
    if (itemSliding) { itemSliding.close(); }
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

  getKmPercent(wearMain: WearMaintenanceProgressBarViewModel, wearRep: WearReplacementProgressBarViewModel): string {
    return `${wearMain.kmMaintenance - wearRep.calculateKms } / ${wearMain.kmMaintenance}`;
  }

  getTimePercent(wearMain: WearMaintenanceProgressBarViewModel, wearRep: WearReplacementProgressBarViewModel): string {
    return `${this.homeService.getDateCalculateMonths(wearMain.timeMaintenance - wearRep.calculateMonths)} /` +
      ` ${this.homeService.getDateCalculateMonths(wearMain.timeMaintenance)}`;
  }

}
