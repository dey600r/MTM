import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// UTILS
import {
  DataService, ConfigurationService, ControlService,
  SettingsService, ThemeService, HomeService
} from '@services/index';
import {
  WearVehicleProgressBarViewModel, WearMaintenanceProgressBarViewModel,
  MaintenanceModel, ModalInputModel, OperationModel, VehicleModel, ISettingModel, IInfoModel,
  ConfigurationModel, WearReplacementProgressBarViewModel, SystemConfigurationModel,
  CalendarInputModal, HeaderInputModel, HeaderOutputModel, HeaderSegmentInputModel,
  SkeletonInputModel
} from '@models/index';
import { 
  PageEnum, Constants, ToastTypeEnum, InfoButtonEnum, ModalTypeEnum, HeaderOutputEnum, HomeSkeletonSetting,
  FailurePredictionTypeEnum
} from '@utils/index';

// COMPONENTS
import { InfoNotificationComponent } from '@modals/info-notification/info-notification.component';
import { InfoCalendarComponent } from '@modals/info-calendar/info-calendar.component';
import { SettingsComponent } from '@modals/settings/settings.component';
import { AddEditMaintenanceComponent } from '@modals/add-edit-maintenance/add-edit-maintenance.component';
import { AddEditVehicleComponent } from '@modals/add-edit-vehicle/add-edit-vehicle.component';
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { BasePage } from '@pages/base.page';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: false
})
export class HomePage extends BasePage implements OnInit {

  // INJECTIONS
  private readonly dataService: DataService = inject(DataService);
  private readonly configurationService: ConfigurationService = inject(ConfigurationService);
  private readonly controlService: ControlService = inject(ControlService);
  private readonly settingsService: SettingsService = inject(SettingsService);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly homeService: HomeService = inject(HomeService);
  private readonly modalController: ModalController = inject(ModalController);
  private readonly detector: ChangeDetectorRef = inject(ChangeDetectorRef);

  // MODAL
  input: ModalInputModel = new ModalInputModel();
  skeletonInput: SkeletonInputModel = HomeSkeletonSetting;
  headerInput: HeaderInputModel = new HeaderInputModel();

  // DATA
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
  measure: ISettingModel;
  modalSettings: any = null;

  showInfoMaintenance: boolean[] = [];

  // SUBSCRIPTION
  operationSubscription: Subscription = new Subscription();
  vehicleSubscription: Subscription = new Subscription();
  maintenanceSubscription: Subscription = new Subscription();

  constructor() {
    super();
    this.loadHeader();
  }

  ngOnInit() {
    this.initPage();
  }  

  /** INIT */

  initPage() {
    this.getSystemConfiguration();
    this.initDashboard();
  }

  getSystemConfiguration() {
    this.dataService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
        const theme = this.settingsService.getThemeSelected(settings);
        this.themeService.changeTheme(theme.code);
        this.openPrivacyPolicy(settings);
      }
    });
  }

  initDashboard() {
    this.dataService.getConfigurations().subscribe(configurations => {
      this.maintenanceSubscription.unsubscribe();
      if (!!configurations && configurations.length > 0) {
        this.maintenanceSubscription = this.dataService.getMaintenance().subscribe(maintenances => {
          this.vehicleSubscription.unsubscribe();
          if (!!maintenances && maintenances.length > 0) {
            this.maintenances = maintenances;
            this.vehicleSubscription = this.dataService.getVehicles().subscribe(vehicles => {
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
        this.operationSubscription = this.dataService.getOperations().subscribe(operations => {
          this.calculateDashboard(vehiclesActives, operations, configurations, maintenances);
        });
      } else {
        this.activateInfo = this.activateModeInfo([], []);
        this.vehicleSelected = new WearVehicleProgressBarViewModel();
      }
    } else {
      this.activateInfo = this.activateModeInfo([], []);
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
      x.listWearMaintenance.forEach(z => {
        if (z.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_ONCE_CODE ||
          z.fromKmMaintenance <= x.kmEstimatedVehicle && (z.toKmMaintenance === null || z.toKmMaintenance >= x.kmEstimatedVehicle)) {
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
    this.loadHeader(this.allWears, this.vehicleSelected.idVehicle);
    this.activateInfo = this.activateModeInfo(vehiclesActives, this.wears);
    this.initShowInfoMaintenance();
    this.detector.detectChanges();
  }

  initShowInfoMaintenance() {
    this.showInfoMaintenance = [];
    if (this.vehicleSelected) {
      this.vehicleSelected.listWearMaintenance.forEach(x => this.showInfoMaintenance = [...this.showInfoMaintenance, false]);
    }
  }

  ionViewDidEnter() {
    // RELOAD NOTIFICATIONS
    if (this.controlService.getDateLastUse().toDateString() !== new Date().toDateString()) {
      this.loadedHeader = false;
      this.loadedBody = false;
      this.dataService.setVehicles(this.dataService.getVehiclesData());
      this.controlService.setDateLastUse();
    }
  }

  activateModeInfo(m: VehicleModel[], w: WearVehicleProgressBarViewModel[]): boolean {
    let result = true;
    this.hideOpButton = false;
    this.hideFabButton = false;
    if (m === null || m.length === 0) {
      this.hideOpButton = true;
      this.input = new ModalInputModel<IInfoModel>({
        parentPage: PageEnum.HOME,
        data: {
          text: 'ALERT.VehicleEmpty',
          icon: 'home',
          info: InfoButtonEnum.VEHICLES
        }
      });
    } else if (w === null  || w.length === 0) {
      this.hideFabButton = true;
      this.input = new ModalInputModel({
        parentPage: PageEnum.HOME,
        data: {
          text: 'ALERT.ConfigurationNotAssociatedToMaintenance',
          icon: 'cog',
          info: InfoButtonEnum.CONFIGURATIONS
        }
      });
    } else if (w.some(x => x.idVehicle === this.vehicleSelected.idVehicle && x.listWearMaintenance.length === 0)) {
      this.input = new ModalInputModel({
        parentPage: PageEnum.HOME,
        data: {
          text: 'ALERT.ConfigurationWithout',
          icon: 'stats-chart',
          info: InfoButtonEnum.NONE
        }
      });
    } else {
      result = false;
    }
    return result;
  }

  segmentChanged(event: any): void {
    this.changeLoadedBody(false);
    this.vehicleSelected = this.wears.find(x => x.idVehicle === Number(event.detail.value));
    this.initShowInfoMaintenance();
    this.activateInfo = this.activateModeInfo((this.vehicleSelected ? [new VehicleModel()] : []), this.wears);
    this.detector.detectChanges();
  }

  activeSegmentScroll(): boolean {
    return this.controlService.activeSegmentScroll(this.wears.length);
  }

  /* HEADER */

  loadHeader(wears: WearVehicleProgressBarViewModel[] = [], idVehicleSelected: number = 0): void {
    this.headerInput = new HeaderInputModel({
      title: 'PAGE_HOME.HOME',
      iconButtonLeft: 'calendar',
      iconButtonRight: 'settings',
      dataSegment: wears.map(x => new HeaderSegmentInputModel({
        id: x.idVehicle,
        name: x.nameVehicle,
        icon: x.iconVehicle,
        selected: (x.idVehicle === idVehicleSelected),
        progressColor: x.warningProgressBarIcon,
        progressValue: x.percent * 100
      }))
    });
  }

  eventEmitHeader(output: HeaderOutputModel) {
    switch(output.type) {
      case HeaderOutputEnum.BUTTON_LEFT:
        this.openInfoCalendar();
        break;
      case HeaderOutputEnum.BUTTON_RIGHT:
        this.openSettings();
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
    const groupWearVehicle: WearVehicleProgressBarViewModel = {
      idVehicle: wv.idVehicle, nameVehicle: wv.nameVehicle, kmVehicle: wv.kmVehicle, kmEstimatedVehicle: wv.kmEstimatedVehicle, 
      datePurchaseVehicle: wv.datePurchaseVehicle, kmsPerMonthVehicle: wv.kmsPerMonthVehicle, dateKmsVehicle: wv.dateKmsVehicle,
      percent: wv.percent, percentKm: wv.percentKm, percentTime: wv.percentTime, warning: wv.warning, listWearMaintenance: [],
      iconVehicle: wv.iconVehicle, idConfiguration: wv.idConfiguration, nameConfiguration: wv.nameConfiguration,
      typeVehicle: wv.typeVehicle, warningProgressBarIcon: wv.warningProgressBarIcon
    };
    listGroupWearMaintenance.forEach(x => {
      groupWearVehicle.listWearMaintenance = [...groupWearVehicle.listWearMaintenance, {
        codeMaintenanceFreq: x.codeMaintenanceFreq, 
        idMaintenance: x.idMaintenance, 
        descriptionMaintenance: x.descriptionMaintenance,
        kmMaintenance: x.kmMaintenance, 
        timeMaintenance: x.timeMaintenance, 
        fromKmMaintenance: x.fromKmMaintenance,
        toKmMaintenance: x.toKmMaintenance, 
        initMaintenance: x.initMaintenance, 
        listWearReplacement: [wr], 
        iconMaintenance: x.iconMaintenance,
        percent: x.percent,
        warning: x.warning,
        warningProgressBarIcon: x.warningProgressBarIcon,
        wearMaintenance: x.wearMaintenance, 
        listWearNotificationReplacement: [] 
      }];
    });
    this.controlService.openModal(PageEnum.HOME, InfoNotificationComponent,
      new ModalInputModel<WearVehicleProgressBarViewModel, OperationModel>({
        data: groupWearVehicle,
        dataList: this.operations,
        parentPage: PageEnum.HOME
      }));
  }

  openInfoCalendar() {
    if ((!!this.wears && this.wears.length > 0) || (!!this.operations && this.operations.length > 0)) {
      this.controlService.openModal(PageEnum.HOME,
        InfoCalendarComponent, new ModalInputModel<CalendarInputModal>({
          data: {
            wear: this.wears,
            operations: this.operations,
            vehicleSelected: this.vehicleSelected.idVehicle
          },
          parentPage: PageEnum.HOME
        }));
    } else {
      const msg = `${this.translator.instant('ALERT.NotificationEmpty')} ${this.translator.instant('ALERT.AddMustVehicle')}`;
      this.controlService.showMsgToast(PageEnum.HOME, ToastTypeEnum.WARNING, msg);
    }
  }

  async openSettings() {
    this.modalSettings = await this.controlService.openModal(PageEnum.HOME,
      SettingsComponent, new ModalInputModel<any, WearVehicleProgressBarViewModel>({
        dataList: this.wears,
        parentPage: PageEnum.HOME
      }));
  }

  openCreateModalVehicle(): void {
    this.controlService.openModal(PageEnum.HOME, AddEditVehicleComponent, new ModalInputModel<VehicleModel>({
        data: new VehicleModel(),
        parentPage: PageEnum.HOME
    }));
  }

  openCreateModalOperation(): void {
    const operation: OperationModel = new OperationModel();
    operation.vehicle.id = this.vehicleSelected.idVehicle;
    this.controlService.openModal(PageEnum.HOME, AddEditOperationComponent, new ModalInputModel<OperationModel>({
        data: operation,
        parentPage: PageEnum.HOME
      }));
  }

  openUpdateModalMaintenance(event: any, w: WearMaintenanceProgressBarViewModel = null): void {
    event.stopPropagation();
    let rowMaintenance: MaintenanceModel = new MaintenanceModel();
    if (w !== null) {
      rowMaintenance = this.maintenances.find(x => x.id === w.idMaintenance);
    }
    this.controlService.openModal(PageEnum.HOME, AddEditMaintenanceComponent, new ModalInputModel<MaintenanceModel, number>({
        type: ModalTypeEnum.UPDATE,
        data: rowMaintenance,
        dataList: [this.vehicleSelected.kmEstimatedVehicle],
        parentPage: PageEnum.HOME
      }));
  }

  desactivateMaintenance(event: any, w: WearMaintenanceProgressBarViewModel): void {
    event.stopPropagation();
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
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveConfiguration', e);
          });
        }
      }
    );
    }
  }

  getKmPercent(wearMain: WearMaintenanceProgressBarViewModel, wearRep: WearReplacementProgressBarViewModel): string {
    return `${wearMain.kmMaintenance - wearRep.calculateKms } / ${wearMain.kmMaintenance}`;
  }

  getTimePercent(wearMain: WearMaintenanceProgressBarViewModel, wearRep: WearReplacementProgressBarViewModel): string {
    return `${this.homeService.getDateCalculateMonths(wearMain.timeMaintenance - wearRep.calculateMonths)} /` +
      ` ${this.homeService.getDateCalculateMonths(wearMain.timeMaintenance)}`;
  }

  // PRIVACY POLICY
  openPrivacyPolicy(settings: SystemConfigurationModel[]) {
    if (!this.settingsService.getPrivacySelected(settings)) {
      setTimeout(() => {
        if (this.modalSettings) {
          this.controlService.closeModal(this.modalController);
        }
        this.controlService.alertCustom(PageEnum.HOME, 'COMMON.PRIVACY_POLICY', 'ALERT.InfoHavetoAcceptPrivaciyPolicy', [{
          text: this.translator.instant('COMMON.PRIVACY_POLICY'),
          handler: () => {
            this.controlService.showPrivacyPolicy();
            return false;
          },
        },
        {
          text: this.translator.instant('COMMON.REJECT'),
          handler: () => {
            this.controlService.closeApp();
          },
        },
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_PRIVACY, Constants.DATABASE_YES).then(x => {
              this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'ALERT.InfoAcceptPrivacyPolicy');
            }).catch(e => {
              this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.InfoErrorSaveSettings', e);
            });
          },
        }]);
      }, 1000);
    }
  }

}
