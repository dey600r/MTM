import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { TranslateService } from '@ngx-translate/core';
import * as shape from 'd3-shape';

// UTILS
import {
  ModalInputModel, WearVehicleProgressBarViewModel, WearMaintenanceProgressBarViewModel,
  MaintenanceFreqModel, MaintenanceModel, MaintenanceElementModel, DashboardModel, VehicleModel,
  InfoCalendarReplacementViewModel, WearReplacementProgressBarViewModel, SearchDashboardModel
} from '@models/index';
import {
  DashboardService, ConfigurationService, ControlService, CalendarService,
  SettingsService, DataBaseService, HomeService, InfoVehicleService
} from '@services/index';
import { WarningWearEnum, Constants, PageEnum, ToastTypeEnum } from '@utils/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'info-notification',
  templateUrl: 'info-notification.component.html',
  styleUrls: ['info-notification.component.scss']
})
export class InfoNotificationComponent implements OnInit, OnDestroy {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();

  // MODEL FORM
  wear: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();
  dashboardVehicleExpenses: DashboardModel = new DashboardModel([], []);
  dashboardRecordsMaintenance: DashboardModel = new DashboardModel([], []);
  currentPopover = null;
  hideGraph = true;
  hideSummary = false;
  hideRecords = true;
  isCalendar = true;
  linear: any = shape.curveMonotoneX;

  // DATA
  dataMaintenance: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();
  vehicleKmEstimated = 0;
  nameMaintenanceElement = '';
  nameMaintenance = '';
  labelNameVehicle = '';
  labelVehicleKm = '';
  labelReliability = '';
  labelPercent = 0;
  labelNextChange = '';
  labelLifeReplacement = '';
  labelNotRecord = '';
  measure: any = {};

  // SUBSCRIPTION
  searchDashboardSubscription: Subscription = new Subscription();
  searchDashboardRecordsSubscription: Subscription = new Subscription();
  screenSubscription: Subscription = new Subscription();
  settingsSubscription: Subscription = new Subscription();

  constructor(private platform: Platform,
              public navParams: NavParams,
              private modalController: ModalController,
              private dashboardService: DashboardService,
              private configurationService: ConfigurationService,
              private calendarService: CalendarService,
              private controlService: ControlService,
              private screenOrientation: ScreenOrientation,
              private changeDetector: ChangeDetectorRef,
              private translator: TranslateService,
              private settingsService: SettingsService,
              private dbService: DataBaseService,
              private homeService: HomeService,
              private infoVehicleService: InfoVehicleService) {
  }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    this.getSettings();

    this.configureResume();

    this.initInfoNotifications();

    this.controlService.isAppFree(this.modalController);
  }

  ngOnDestroy() {
    this.searchDashboardSubscription.unsubscribe();
    this.searchDashboardRecordsSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
    this.settingsSubscription.unsubscribe();
  }

  initInfoNotifications() {
    this.wear = this.homeService.getWearReplacement(true, this.modalInputModel.data, this.modalInputModel.dataList);

    if (this.wear.listWearMaintenance.length > 0) {
      this.labelPercent = this.wear.percent;
      this.getObserverSearchDashboard();
      this.getObserverOrientationChange();
      this.getObserverSearchDashboardRecords();
    } else {
      const wear: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearMaintenance);
      this.isCalendar = false;
      this.labelPercent = Math.round((1 - (wear.timeMaintenance === 0 || wear.timeMaintenance === null ?
          wear.listWearReplacement[0].percentKms :
          (wear.listWearReplacement[0].percentKms + wear.listWearReplacement[0].percentMonths) / 2)) * 100);
      if (wear.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE) {
        this.labelNotRecord = this.translator.instant('PAGE_HOME.NotExistRecords', {maintenance: this.nameMaintenanceElement });
      }
    }
  }

  getObserverSearchDashboard() {
    this.searchDashboardSubscription = this.dashboardService.getObserverSearchDashboard().subscribe(filter => {
      this.calculateDashboardExpenses(filter);
      this.calculateDashboad(false, filter);
    });
  }

  getObserverSearchDashboardRecords() {
    this.searchDashboardRecordsSubscription = this.dashboardService.getObserverSearchDashboardRecords().subscribe(filter => {
      this.calculateDashboad(true, filter);
    });
  }

  calculateDashboardExpenses(filter: SearchDashboardModel) {
    if (!this.hideGraph) {
      const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      this.dashboardVehicleExpenses = this.dashboardService.getDashboardModelVehiclePerTime(windowsSize,
        this.modalInputModel.dataList.filter(x =>
          this.wear.listWearMaintenance.some(y => y.listWearReplacement[0].idOperation === x.id)), filter);
    }
  }

  calculateDashboad(all: boolean, filter: SearchDashboardModel) {
    if (!this.hideRecords) {
      const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      if (all) {
        this.wear = this.homeService.getWearReplacement(filter.showStrict, this.modalInputModel.data, this.modalInputModel.dataList);
      }
      this.dashboardRecordsMaintenance =
        this.dashboardService.getDashboardRecordMaintenances(windowsSize, this.wear, filter, this.measure);
    }
  }

  getObserverOrientationChange() {
    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      let windowSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
      this.dashboardVehicleExpenses.view = windowSize;
      this.dashboardRecordsMaintenance.view = windowSize;
      setTimeout(() => {
        windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        if (windowSize[0] === windowSize[1]) {
          this.dashboardVehicleExpenses.view = windowSize;
          this.dashboardRecordsMaintenance.view = windowSize;
          this.changeDetector.detectChanges();
        }
      }, 200);
    });
  }

  getSettings() {
    this.settingsSubscription = this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });
  }

  configureResume() {
    this.dataMaintenance = this.modalInputModel.data;
    const vehicle: VehicleModel = new VehicleModel(null, null, 0, this.dataMaintenance.kmVehicle,
      null, null, this.dataMaintenance.kmsPerMonthVehicle, this.dataMaintenance.dateKmsVehicle, this.dataMaintenance.datePurchaseVehicle);
    this.vehicleKmEstimated = this.calendarService.calculateKmVehicleEstimated(vehicle);
    const wearMain: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearMaintenance);
    const wearRep: WearReplacementProgressBarViewModel = wearMain.listWearReplacement[0];
    this.labelNameVehicle = this.dataMaintenance.nameVehicle;
    this.nameMaintenance = wearMain.descriptionMaintenance;
    this.nameMaintenanceElement = wearRep.nameMaintenanceElement;
    this.labelVehicleKm = this.infoVehicleService.getLabelKmVehicle(this.dataMaintenance.kmVehicle, this.vehicleKmEstimated, this.measure);
    this.labelReliability = `${this.translator.instant('PAGE_HOME.RELIABILITY')} ${this.nameMaintenanceElement}`;
    let kmLife = this.vehicleKmEstimated;
    const today: Date = new Date();
    if (wearRep.kmOperation !== null) {
      kmLife -= wearRep.kmOperation;
    }
    if (wearMain.timeMaintenance !== 0) {
      let timeLife = 0;
      if (wearRep.kmOperation === null) {
        timeLife = this.calendarService.monthDiff(new Date(vehicle.datePurchase), today);
      } else {
        timeLife = this.calendarService.monthDiff(new Date(wearRep.dateOperation), today);
      }
      this.labelLifeReplacement = this.translator.instant('ALERT.InfoLifeReplacementTime',
        { replacement: this.nameMaintenanceElement, km: kmLife, time: timeLife, measure: this.measure.value });
    } else {
      this.labelLifeReplacement = this.translator.instant('ALERT.InfoLifeReplacementKm',
        { replacement: this.nameMaintenanceElement, km: kmLife, measure: this.measure.value });
    }
    const calendarKm: InfoCalendarReplacementViewModel =
      this.calendarService.createInfoCalendarReplacement(this.dataMaintenance, wearMain, wearRep, true);
    const calendarTime: InfoCalendarReplacementViewModel =
      this.calendarService.createInfoCalendarReplacement(this.dataMaintenance, wearMain, wearRep, false);
    const dateMaintenance: Date = (calendarKm.date < calendarTime.date || wearMain.timeMaintenance === null ?
      calendarKm.date : calendarTime.date);
    this.labelNextChange = this.translator.instant('PAGE_HOME.NextChangeKm',
      {
        maintenance: this.nameMaintenanceElement,
        km: (calendarKm.km > this.vehicleKmEstimated ? calendarKm.km : this.vehicleKmEstimated),
        date: this.calendarService.getDateString(dateMaintenance),
        measure: this.measure.value
      });
  }

  refreshChart() {
    this.hideRecords = !this.hideRecords;
    if (!this.hideRecords) {
      const search: SearchDashboardModel = this.dashboardService.getSearchDashboard();
      this.dashboardService.setSearchDashboardRecords(search.filterKmTime, search.showStrict);
    }
  }

  refreshChartExpenses() {
    this.hideGraph = !this.hideGraph;
    if (!this.hideGraph) {
      this.dashboardService.setSearchDashboard(this.dashboardService.getSearchDashboard());
    }
  }

  getClassProgressbar(warning: WarningWearEnum, styles: string): string {
    return this.homeService.getClassProgressbar(warning, styles);
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

  getIconReplacement(): string {
    return (!!this.wear && this.wear.listWearMaintenance.length > 0 ? this.configurationService.getIconReplacement(
      new MaintenanceElementModel(null, null, null, 0,
        this.getMaintenanceNow(this.wear.listWearMaintenance).listWearReplacement[0].idMaintenanceElement)) : '');
  }

  getKmPercent(wear: WearReplacementProgressBarViewModel): string {
    return `${this.getKmOperation(wear) } / ${wear.kmAcumulateMaintenance}`;
  }

  getKmOperation(wear: WearReplacementProgressBarViewModel): string {
    return `${(wear.kmOperation === null ? '--' : wear.kmAcumulateMaintenance - wear.calculateKms) }`;
  }

  getTimePercent(wear: WearReplacementProgressBarViewModel): string {
    const dateMaintenance: Date = this.calendarService.sumTimeToDate(this.wear.datePurchaseVehicle, wear.timeAcumulateMaintenance);
    const dateOperation: Date = this.calendarService.sumTimeToDate(dateMaintenance, -wear.calculateMonths);
    return `${(wear.kmOperation === null ? '--' : this.calendarService.getDateString(dateOperation))} /` +
      ` ${this.calendarService.getDateString(dateMaintenance)}`;
  }

  getIconPercent(type: string): string {
    return this.infoVehicleService.getIconPercent(this.labelPercent, type);
  }

  // MODALS

  showInfo(wearMain: WearMaintenanceProgressBarViewModel) {
    const wearRep: WearReplacementProgressBarViewModel = wearMain.listWearReplacement[0];
    let msg = '';
    if (wearRep.kmOperation === null) {
      if (wearMain.timeMaintenance === 0) {
        msg = this.translator.instant('ALERT.InfoNotOperationKm',
          { km: wearRep.kmAcumulateMaintenance, measure: this.measure.value });
      } else {
        const dateMaintenance: Date = this.calendarService.sumTimeToDate(this.wear.datePurchaseVehicle, wearRep.timeAcumulateMaintenance);
        msg = this.translator.instant('ALERT.InfoNotOperationKmTime',
          { km: wearRep.kmAcumulateMaintenance, time: this.calendarService.getDateString(dateMaintenance), measure: this.measure.value });
      }
    } else {
      msg = this.translator.instant('ALERT.InfoOperationKm',
        { kmop: wearRep.kmAcumulateMaintenance - wearRep.calculateKms, km: wearRep.kmAcumulateMaintenance, measure: this.measure.value });
      if (wearMain.timeMaintenance !== 0) {
        const dateMaintenance: Date = this.calendarService.sumTimeToDate(this.wear.datePurchaseVehicle, wearRep.timeAcumulateMaintenance);
        const dateOperation: Date = this.calendarService.sumTimeToDate(dateMaintenance, -wearRep.calculateMonths);
        msg += this.translator.instant('ALERT.InfoOperationTime',
          { timeop: this.calendarService.getDateString(dateOperation), time: this.calendarService.getDateString(dateMaintenance) });
      }
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoVehicle() {
    this.infoVehicleService.showInfoVehicle(this.dataMaintenance.dateKmsVehicle, this.measure);
  }

  showInfoReliability() {
    let msg = '';
    if (this.wear.listWearMaintenance.length > 0) {
      const wearMain: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.wear.listWearMaintenance);
      msg = (wearMain.timeMaintenance === 0 || wearMain.timeMaintenance === null ?
        this.translator.instant('ALERT.InfoReliabilityPercentKm',
          { maintenance: wearMain.descriptionMaintenance, percentKm: this.wear.percentKm, measurelarge: this.measure.valueLarge }) :
        this.translator.instant('ALERT.InfoReliabilityPercentTime',
          { maintenance: wearMain.descriptionMaintenance, percentKm: this.wear.percentKm, percentTime: this.wear.percentTime,
            measurelarge: this.measure.valueLarge }));
    } else {
      const wearMain: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearMaintenance);
      const wearRep: WearReplacementProgressBarViewModel = wearMain.listWearReplacement[0];
      msg = (wearMain.timeMaintenance === 0 || wearMain.timeMaintenance === null ?
        this.translator.instant('ALERT.InfoReliabilityPercentKm',
          { maintenance: wearMain.descriptionMaintenance, percentKm: Math.floor((1 - wearRep.percentKms) * 100),
            measurelarge: this.measure.valueLarge }) :
        this.translator.instant('ALERT.InfoReliabilityPercentTime',
          { maintenance: wearMain.descriptionMaintenance, percentKm: Math.floor((1 - wearRep.percentKms) * 100),
            percentTime: Math.floor((1 - wearRep.percentMonths) * 100), measurelarge: this.measure.valueLarge}));
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoMaintenance() {
    const wear: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearMaintenance);
    let msg = '';
    let msgFromTo = '';
    const translateAnd: string = this.translator.instant('COMMON.AND');
    const translateBetween: string = this.translator.instant('COMMON.BETWEEN');
    const translateOr: string = this.translator.instant('COMMON.OR');
    const translateMonths: string = this.translator.instant('COMMON.MONTHS');
    this.dataMaintenance.listWearMaintenance.forEach((x, index) => {
      msgFromTo += `${x.kmMaintenance} ${this.measure.value}`;
      if (x.fromKmMaintenance !== 0 || x.toKmMaintenance !== null) {
        msgFromTo += ` ${translateBetween} ${x.fromKmMaintenance} ${this.measure.value} ${translateAnd} ` +
        `${(x.toKmMaintenance === null ? '∞' : x.toKmMaintenance)} ${this.measure.value}`;
      }
      msgFromTo += (x.timeMaintenance === 0 || x.timeMaintenance === null ? '' : ` ${translateOr} ${x.timeMaintenance} ${translateMonths}`);
      msgFromTo += index + 1 === this.dataMaintenance.listWearMaintenance.length ? ' ' : ` ${translateAnd} `;
    });
    if (wear.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE) {
      msg = this.translator.instant('ALERT.InfoMaintenanceCalendarTime',
        { maintenance: wear.descriptionMaintenance, between: msgFromTo });
    } else {
      msg = this.translator.instant('ALERT.InfoMaintenanceWearTime',
        { maintenance: wear.descriptionMaintenance, between: msgFromTo });
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoLifeReplacement() {
    const wearMain: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearMaintenance);
    const wearRep: WearReplacementProgressBarViewModel = wearMain.listWearReplacement[0];
    let msg = '';
    if (wearRep.calculateKms >= 0 && wearRep.calculateMonths >= 0) {
      msg = this.translator.instant('ALERT.InfoOk');
    } else {
      msg = this.translator.instant('ALERT.InfoNotOk');
      if (wearRep.calculateKms < 0 && wearRep.calculateMonths >= 0) {
        msg += this.translator.instant('ALERT.InfoKmNotOk', { measure: this.measure.valueLarge });
      } else if (wearRep.calculateKms >= 0 && wearRep.calculateMonths < 0) {
        msg += this.translator.instant('ALERT.InfoTimeNotOk');
      }
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST);
  }

  getMaintenanceNow(wears: WearMaintenanceProgressBarViewModel[]): WearMaintenanceProgressBarViewModel {
    let result: WearMaintenanceProgressBarViewModel = wears.find(x => x.fromKmMaintenance <= this.vehicleKmEstimated &&
      (x.toKmMaintenance === null || x.toKmMaintenance >= this.vehicleKmEstimated));
    if (!!!result) {
      result = wears[wears.length - 1];
    }
    return result;
  }

  showPopover(ev: any) {
    this.controlService.showPopover(PageEnum.MODAL_INFO, ev, SearchDashboardPopOverComponent, this.modalInputModel);
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
  }

}
