import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import * as shape from 'd3-shape';

// UTILS
import {
  ModalInputModel, ModalOutputModel, WearVehicleProgressBarViewModel, WearReplacementProgressBarViewModel,
  MaintenanceFreqModel, MaintenanceModel, MaintenanceElementModel, DashboardModel, VehicleModel
} from '@models/index';
import { DashboardService, ConfigurationService, ControlService, CalendarService, VehicleService } from '@services/index';
import { WarningWearEnum, Constants, PageEnum } from '@utils/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'info-notification',
  templateUrl: 'info-notification.component.html',
  styleUrls: ['info-notification.component.scss', '../../../app.component.scss']
})
export class InfoNotificationComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();
    modalOutputModel: ModalOutputModel = new ModalOutputModel();

    // MODEL FORM
    wear: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();
    dashboardVehicleExpenses: DashboardModel = new DashboardModel([], []);
    dashboardRecordsMaintenance: DashboardModel = new DashboardModel([], []);
    currentPopover = null;
    hideGraph = true;
    hideSummary = false;
    hideRecords = true;
    isCalendar = true;
    linear: any = shape.curveMonotoneX; // shape.curveBasis;

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

    // SUBSCRIPTION
    searchSubscription: Subscription = new Subscription();
    screenSubscription: Subscription = new Subscription();

    constructor(private platform: Platform,
                private navParams: NavParams,
                private modalController: ModalController,
                private dashboardService: DashboardService,
                private configurationService: ConfigurationService,
                private calendarService: CalendarService,
                private controlService: ControlService,
                private screenOrientation: ScreenOrientation,
                private changeDetector: ChangeDetectorRef,
                private translator: TranslateService) {
  }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    this.configureResume();

    this.wear = this.dashboardService.getWearReplacement(this.modalInputModel.data, this.modalInputModel.dataList);

    if (this.wear.listWearReplacement.length > 0) {
      this.labelPercent = this.wear.percent;
      this.searchSubscription = this.dashboardService.getObserverSearchODashboard().subscribe(filter => {
        const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        if (!this.hideGraph) {
          this.dashboardVehicleExpenses = this.dashboardService.getDashboardModelVehiclePerTime(windowsSize,
            this.modalInputModel.dataList.filter(x => this.wear.listWearReplacement.some(y => y.idOperation === x.id)), filter);
        }
        if (!this.hideRecords) {
          this.dashboardRecordsMaintenance =
            this.dashboardService.getDashboardRecordMaintenances(windowsSize, this.wear, filter);
        }
      });

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
    } else {
      const wear: WearReplacementProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearReplacement);
      this.isCalendar = false;
      this.labelPercent = Math.round((1 -
        (wear.timeMaintenance === 0 ? wear.percentKms : (wear.percentKms + wear.percentMonths) / 2)) * 100);
      if (wear.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE) {
        this.labelNotRecord = this.translator.instant('PAGE_HOME.NotExistRecords', {maintenance: this.nameMaintenanceElement });
      }
    }
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
  }

  configureResume() {
    this.dataMaintenance = this.modalInputModel.data;
    const vehicle: VehicleModel = new VehicleModel(null, null, 0, this.dataMaintenance.kmVehicle,
      null, null, this.dataMaintenance.kmsPerMonthVehicle, this.dataMaintenance.dateKmsVehicle, this.dataMaintenance.datePurchaseVehicle);
    this.vehicleKmEstimated = this.calendarService.calculateKmVehicleEstimated(vehicle);
    const wear: WearReplacementProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearReplacement);
    this.labelNameVehicle = this.dataMaintenance.nameVehicle;
    this.nameMaintenance = wear.descriptionMaintenance;
    this.nameMaintenanceElement = wear.nameMaintenanceElement;
    this.labelVehicleKm = this.translator.instant('PAGE_HOME.VehicleKm', { km: this.dataMaintenance.kmVehicle });
    if (this.dataMaintenance.kmVehicle !== this.vehicleKmEstimated) {
      this.labelVehicleKm += '\n' + this.translator.instant('PAGE_HOME.VehicleEstimatedKm', { km: this.vehicleKmEstimated });
    }
    this.labelReliability = `${this.translator.instant('PAGE_HOME.RELIABILITY')} ${this.nameMaintenanceElement}`;
    let kmMaintenane = 0;
    let kmLife = 0;
    let timeLife = 0;
    if (wear.kmOperation === null) {
      const mant: number = (wear.kmMaintenance < this.vehicleKmEstimated ? this.vehicleKmEstimated / wear.kmMaintenance : 1);
      kmMaintenane = wear.kmMaintenance * Math.floor(mant) + wear.kmMaintenance;
      kmLife = this.vehicleKmEstimated;
    } else {
      kmMaintenane = wear.kmOperation + wear.kmMaintenance;
      kmMaintenane = (kmMaintenane < this.vehicleKmEstimated ? this.vehicleKmEstimated : kmMaintenane);
      kmLife = this.vehicleKmEstimated - wear.kmOperation;
    }
    let date: Date = new Date(4000, 1, 1);
    const dateMaintenanceKmVehicleEstimated: Date = this.calendarService.calculateKmInfoNotification(vehicle, kmMaintenane);
    if (wear.timeMaintenance !== 0) {
      date = new Date(vehicle.datePurchase);
      const monthVehicle: number = this.calendarService.monthDiff(date, new Date());
      if (wear.kmOperation === null) {
        const mantMonth: number = (wear.timeMaintenance < monthVehicle ? monthVehicle / wear.timeMaintenance : 1);
        date.setMonth(date.getMonth() + wear.timeMaintenance * Math.floor(mantMonth) + wear.timeMaintenance);
        timeLife = this.calendarService.monthDiff(new Date(vehicle.datePurchase), new Date());
      } else {
        const mantMonth = this.calendarService.monthDiff(
          new Date(vehicle.datePurchase), new Date(wear.dateOperation)) + wear.timeMaintenance;
        date.setMonth(date.getMonth() + (mantMonth < monthVehicle ? monthVehicle : mantMonth));
        timeLife = this.calendarService.monthDiff(new Date(wear.dateOperation), new Date());
      }
      this.labelLifeReplacement = this.translator.instant('ALERT.InfoLifeReplacementTime',
        { replacement: this.nameMaintenanceElement, km: kmLife, time: timeLife});
    } else {
      this.labelLifeReplacement = this.translator.instant('ALERT.InfoLifeReplacementKm',
        { replacement: this.nameMaintenanceElement, km: kmLife});
    }
    this.labelNextChange = this.translator.instant('PAGE_HOME.NextChangeKm',
      {maintenance: this.nameMaintenanceElement, km: kmMaintenane,
        date: this.calendarService.getDateString((date > dateMaintenanceKmVehicleEstimated ? dateMaintenanceKmVehicleEstimated : date))});
  }

  refreshChart() {
    this.hideRecords = !this.hideRecords;
    if (!this.hideRecords) {
      this.dashboardService.setSearchDashboard(this.dashboardService.getSearchDashboard());
    }
  }

  refreshChartExpenses() {
    this.hideGraph = !this.hideGraph;
    if (!this.hideGraph) {
      this.dashboardService.setSearchDashboard(this.dashboardService.getSearchDashboard());
    }
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

  getIconReplacement(): string {
    return (!!this.wear && this.wear.listWearReplacement.length > 0 ? this.configurationService.getIconReplacement(
      new MaintenanceElementModel(null, null, null, this.getMaintenanceNow(this.wear.listWearReplacement).idMaintenanceElement)) : '');
  }

  getKmPercent(wear: WearReplacementProgressBarViewModel): string {
    return `${this.getKmOperation(wear) } / ${wear.kmAcumulateMaintenance}`;
  }

  getKmOperation(wear: WearReplacementProgressBarViewModel): string {
    return `${(wear.kmOperation === null ? '--' : wear.kmAcumulateMaintenance - wear.calculateKms) }`;
  }

  getTimePercent(wear: WearReplacementProgressBarViewModel): string {
    const dateMaintenance: Date = this.getDateMaintenance(wear);
    const dateOperation: Date = this.getDateOperation(wear, dateMaintenance);
    return `${(wear.kmOperation === null ? '--' : this.calendarService.getDateString(dateOperation))} /` +
      ` ${this.calendarService.getDateString(dateMaintenance)}`;
  }

  getDateMaintenance(wear: WearReplacementProgressBarViewModel): Date {
    const dateMaintenance: Date = new Date(this.wear.datePurchaseVehicle);
    dateMaintenance.setMonth(dateMaintenance.getMonth() + wear.timeAcumulateMaintenance);
    return dateMaintenance;
  }

  getDateOperation(wear: WearReplacementProgressBarViewModel, dateMaintenance: Date): Date {
    const dateOperation: Date = new Date(dateMaintenance);
    dateOperation.setMonth(dateOperation.getMonth() - wear.calculateMonths);
    return dateOperation;
  }

  getIconPercent(type: string): string {
    if (this.labelPercent < 25) {
      return (type === 'color' ?
        this.dashboardService.getClassIcon(WarningWearEnum.SKULL, '') : this.getIconKms(WarningWearEnum.SKULL));
    } else if (this.labelPercent >= 25 && this.labelPercent < 50) {
      return (type === 'color' ?
        this.dashboardService.getClassIcon(WarningWearEnum.DANGER, '') : this.getIconKms(WarningWearEnum.DANGER));
    } else if (this.labelPercent >= 50 && this.labelPercent < 75) {
      return (type === 'color' ?
        this.dashboardService.getClassIcon(WarningWearEnum.WARNING, '') : this.getIconKms(WarningWearEnum.WARNING));
    } else {
      return (type === 'color' ? this.dashboardService.getClassIcon(WarningWearEnum.SUCCESS, '') : 'checkmark-done-circle');
    }
  }

  // MODALS

  showInfo(wear: WearReplacementProgressBarViewModel) {
    let msg = '';
    if (wear.kmOperation === null) {
      if (wear.timeMaintenance === 0) {
        msg = this.translator.instant('ALERT.InfoNotOperationKm', { km: wear.kmAcumulateMaintenance });
      } else {
        const dateMaintenance: Date = this.getDateMaintenance(wear);
        msg = this.translator.instant('ALERT.InfoNotOperationKmTime',
          { km: wear.kmAcumulateMaintenance, time: this.calendarService.getDateString(dateMaintenance) });
      }
    } else {
      msg = this.translator.instant('ALERT.InfoOperationKm',
        { kmop: wear.kmAcumulateMaintenance - wear.calculateKms, km: wear.kmAcumulateMaintenance });
      if (wear.timeMaintenance !== 0) {
        const dateMaintenance: Date = this.getDateMaintenance(wear);
        const dateOperation: Date = this.getDateOperation(wear, dateMaintenance);
        msg += this.translator.instant('ALERT.InfoOperationTime',
          { timeop: this.calendarService.getDateString(dateOperation), time: this.calendarService.getDateString(dateMaintenance) });
      }
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoVehicle() {
    const msg = this.translator.instant('ALERT.LastUpdateVehicleKm',
      { date: this.calendarService.getDateString(new Date(this.dataMaintenance.dateKmsVehicle)) });
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoReliability() {
    let msg = '';
    if (this.wear.listWearReplacement.length > 0) {
      const wear: WearReplacementProgressBarViewModel = this.getMaintenanceNow(this.wear.listWearReplacement);
      msg = (wear.timeMaintenance === 0 ?
        this.translator.instant('ALERT.InfoReliabilityPercentKm',
          { maintenance: wear.descriptionMaintenance, percentKm: this.wear.percentKm }) :
        this.translator.instant('ALERT.InfoReliabilityPercentTime',
          { maintenance: wear.descriptionMaintenance, percentKm: this.wear.percentKm, percentTime: this.wear.percentTime }));
    } else {
      const wear: WearReplacementProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearReplacement);
      msg = (wear.timeMaintenance === 0 ?
        this.translator.instant('ALERT.InfoReliabilityPercentKm',
          { maintenance: wear.descriptionMaintenance, percentKm: Math.floor((1 - wear.percentKms) * 100) }) :
        this.translator.instant('ALERT.InfoReliabilityPercentTime',
          { maintenance: wear.descriptionMaintenance, percentKm: Math.floor((1 - wear.percentKms) * 100),
            percentTime: Math.floor((1 - wear.percentMonths) * 100) }));
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoMaintenance() {
    const wear: WearReplacementProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearReplacement);
    let msg = '';
    let msgFromTo = '';
    const translateAnd: string = this.translator.instant('COMMON.AND');
    const translateBetween: string = this.translator.instant('COMMON.BETWEEN');
    const translateOr: string = this.translator.instant('COMMON.OR');
    const translateMonths: string = this.translator.instant('COMMON.MONTHS');
    this.dataMaintenance.listWearReplacement.forEach((x, index) => {
      msgFromTo += `${x.kmMaintenance} km`;
      if (x.fromKmMaintenance !== 0 || x.toKmMaintenance !== null) {
        msgFromTo += ` ${translateBetween} ${x.fromKmMaintenance} km ${translateAnd} ` +
        `${(x.toKmMaintenance === null ? '∞' : x.toKmMaintenance)} km`;
      }
      msgFromTo += (x.timeMaintenance === 0 ? '' : ` ${translateOr} ${x.timeMaintenance} ${translateMonths}`);
      msgFromTo += index + 1 === this.dataMaintenance.listWearReplacement.length ? ' ' : ` ${translateAnd} `;
    });
    if (wear.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE) {
      msg = this.translator.instant('ALERT.InfoMaintenanceCalendarTime',
        { maintenance: wear.descriptionMaintenance, between: msgFromTo });
    } else {
      msg = this.translator.instant('ALERT.InfoMaintenanceWearTime',
        { maintenance: wear.descriptionMaintenance, between: msgFromTo });
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoLifeReplacement() {
    const wear: WearReplacementProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearReplacement);
    let msg = '';
    if (wear.calculateKms >= 0 && wear.calculateMonths >= 0) {
      msg = this.translator.instant('ALERT.InfoOk');
    } else {
      msg = this.translator.instant('ALERT.InfoNotOk');
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, msg, Constants.DELAY_TOAST);
  }

  getMaintenanceNow(wears: WearReplacementProgressBarViewModel[]): WearReplacementProgressBarViewModel {
    let result: WearReplacementProgressBarViewModel = wears.find(x => x.fromKmMaintenance <= this.vehicleKmEstimated &&
      (x.toKmMaintenance === null || x.toKmMaintenance >= this.vehicleKmEstimated));
    if (!!!result) {
      result = wears[wears.length - 1];
    }
    return result;
  }

  showPopover(ev: any) {
    this.controlService.showPopover(PageEnum.MODAL_INFO, ev, SearchDashboardPopOverComponent, this.modalInputModel);
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }
}
