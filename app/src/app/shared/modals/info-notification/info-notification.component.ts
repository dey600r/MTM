import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import * as shape from 'd3-shape';

// UTILS
import {
  ModalInputModel, ModalOutputModel, WearMotoProgressBarModel, WearReplacementProgressBarModel,
  MaintenanceFreqModel, MaintenanceModel, MaintenanceElementModel, DashboardModel, MotoModel
} from '@models/index';
import { DashboardService, ConfigurationService, CommonService, ControlService } from '@services/index';
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
    wear: WearMotoProgressBarModel = new WearMotoProgressBarModel();
    dashboardMotoExpenses: DashboardModel = new DashboardModel([], []);
    dashboardRecordsMaintenance: DashboardModel = new DashboardModel([], []);
    currentPopover = null;
    hideGraph = true;
    hideSummary = false;
    hideRecords = true;
    isCalendar = true;
    linear: any = shape.curveMonotoneX; // shape.curveBasis;

    // DATA
    dataMaintenance: WearMotoProgressBarModel = new WearMotoProgressBarModel();
    motoKmEstimated = 0;
    nameMaintenanceElement = '';
    nameMaintenance = '';
    labelNameMoto = '';
    labelMotoKm = '';
    labelReliability = '';
    labelPercent = 0;
    labelNextChange = '';
    labelNotRecord = '';

    // SUBSCRIPTION
    searchSubscription: Subscription = new Subscription();
    screenSubscription: Subscription = new Subscription();

    constructor(private platform: Platform,
                private navParams: NavParams,
                private modalController: ModalController,
                private dashboardService: DashboardService,
                private configurationService: ConfigurationService,
                private commonService: CommonService,
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
          this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoPerTime(windowsSize,
            this.modalInputModel.dataList.filter(x => this.wear.listWearReplacement.some(y => y.idOperation === x.id)), filter);
        }
        if (!this.hideRecords) {
          this.dashboardRecordsMaintenance =
            this.dashboardService.getDashboardRecordMaintenances(windowsSize, this.wear, filter);
        }
      });

      this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
        let windowSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
        this.dashboardMotoExpenses.view = windowSize;
        this.dashboardRecordsMaintenance.view = windowSize;
        setTimeout(() => {
          windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
          if (windowSize[0] === windowSize[1]) {
            this.dashboardMotoExpenses.view = windowSize;
            this.dashboardRecordsMaintenance.view = windowSize;
            this.changeDetector.detectChanges();
          }
        }, 200);
      });
    } else {
      const wear: WearReplacementProgressBarModel = this.dataMaintenance.listWearReplacement[0];
      this.isCalendar = false;
      this.labelPercent = Math.round((1 -
        (wear.timeMaintenance === 0 || wear.percentKms > wear.percentMonths ? wear.percentKms : wear.percentMonths)) * 100);
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
    const wear: WearReplacementProgressBarModel = this.dataMaintenance.listWearReplacement[0];
    this.labelNameMoto = this.dataMaintenance.nameMoto;
    this.nameMaintenance = wear.descriptionMaintenance;
    this.nameMaintenanceElement = wear.nameMaintenanceElement;
    const moto: MotoModel = new MotoModel(null, null, 0, this.dataMaintenance.kmMoto,
      null, this.dataMaintenance.kmsPerMonthMoto, this.dataMaintenance.dateKmsMoto, this.dataMaintenance.datePurchaseMoto);
    this.motoKmEstimated = this.dashboardService.calculateKmMotoEstimated(moto);

    this.labelMotoKm = this.translator.instant('PAGE_HOME.MotoKm', { km: this.dataMaintenance.kmMoto });
    if (this.dataMaintenance.kmMoto !== this.motoKmEstimated) {
      this.labelMotoKm += '\n' + this.translator.instant('PAGE_HOME.MotoEstimatedKm', { km: this.motoKmEstimated });
    }
    this.labelReliability = `${this.translator.instant('PAGE_HOME.RELIABILITY')} ${this.nameMaintenanceElement}`;
    let kmMaintenane = 0;
    if (wear.kmOperation === null) {
      const mant: number = (wear.kmMaintenance < this.motoKmEstimated ? this.motoKmEstimated / wear.kmMaintenance : 1);
      kmMaintenane = wear.kmMaintenance * Math.floor(mant) + wear.kmMaintenance;
    } else {
      kmMaintenane = wear.kmOperation + wear.kmMaintenance;
      kmMaintenane = (kmMaintenane < this.motoKmEstimated ? this.motoKmEstimated : kmMaintenane);
    }
    let date: Date = new Date(4000, 1, 1);
    const dateMaintenanceKmMotoEstimated: Date = this.dashboardService.calculateDateMaintenanceKmMotoEstimated(moto, kmMaintenane);
    if (wear.timeMaintenance !== 0) {
      date = new Date(moto.datePurchase);
      const monthMoto: number = this.commonService.monthDiff(date, new Date());
      if (wear.kmOperation === null) {
        const mantMonth: number = (wear.timeMaintenance < monthMoto ? monthMoto / wear.timeMaintenance : 1);
        date.setMonth(date.getMonth() + wear.timeMaintenance * Math.floor(mantMonth) + wear.timeMaintenance);
      } else {
        const mantMonth = this.commonService.monthDiff(new Date(moto.datePurchase), new Date(wear.dateOperation)) + wear.timeMaintenance;
        date.setMonth(date.getMonth() + (mantMonth < monthMoto ? monthMoto : mantMonth));
      }
    }
    this.labelNextChange = this.translator.instant('PAGE_HOME.NextChangeKm',
      {maintenance: this.nameMaintenanceElement, km: kmMaintenane,
        date: this.commonService.getDateString((date > dateMaintenanceKmMotoEstimated ? dateMaintenanceKmMotoEstimated : date))});
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

  getIconMaintenance(wear: WearReplacementProgressBarModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(wear.codeMaintenanceFreq)));
  }

  getIconReplacement(): string {
    return (!!this.wear && this.wear.listWearReplacement.length > 0 ? this.configurationService.getIconReplacement(
      new MaintenanceElementModel(null, null, null, this.wear.listWearReplacement[0].idMaintenanceElement)) : '');
  }

  getKmPercent(wear: WearReplacementProgressBarModel): string {
    return `${this.getKmOperation(wear) } / ${wear.kmAcumulateMaintenance}`;
  }

  getKmOperation(wear: WearReplacementProgressBarModel): string {
    return `${(wear.kmOperation === null ? '--' : wear.kmAcumulateMaintenance - wear.calculateKms) }`;
  }

  getTimePercent(wear: WearReplacementProgressBarModel): string {
    const dateMaintenance: Date = this.getDateMaintenance(wear);
    const dateOperation: Date = this.getDateOperation(wear, dateMaintenance);
    return `${(wear.kmOperation === null ? '--' : this.commonService.getDateString(dateOperation))} /` +
      ` ${this.commonService.getDateString(dateMaintenance)}`;
  }

  getDateMaintenance(wear: WearReplacementProgressBarModel): Date {
    const dateMaintenance: Date = new Date(this.wear.datePurchaseMoto);
    dateMaintenance.setMonth(dateMaintenance.getMonth() + wear.timeAcumulateMaintenance);
    return dateMaintenance;
  }

  getDateOperation(wear: WearReplacementProgressBarModel, dateMaintenance: Date): Date {
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

  showInfo(wear: WearReplacementProgressBarModel) {
    let msg = '';
    if (wear.kmOperation === null) {
      if (wear.timeMaintenance === 0) {
        msg = this.translator.instant('ALERT.InfoNotOperationKm', { km: wear.kmAcumulateMaintenance });
      } else {
        const dateMaintenance: Date = this.getDateMaintenance(wear);
        msg = this.translator.instant('ALERT.InfoNotOperationKmTime',
          { km: wear.kmAcumulateMaintenance, time: this.commonService.getDateString(dateMaintenance) });
      }
    } else {
      msg = this.translator.instant('ALERT.InfoOperationKm',
        { kmop: wear.kmAcumulateMaintenance - wear.calculateKms, km: wear.kmAcumulateMaintenance });
      if (wear.timeMaintenance !== 0) {
        const dateMaintenance: Date = this.getDateMaintenance(wear);
        const dateOperation: Date = this.getDateOperation(wear, dateMaintenance);
        msg += this.translator.instant('ALERT.InfoOperationTime',
          { timeop: this.commonService.getDateString(dateOperation), time: this.commonService.getDateString(dateMaintenance) });
      }
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoMoto() {
    const msg = this.translator.instant('ALERT.LastUpdateMotoKm',
      { date: this.commonService.getDateString(new Date(this.dataMaintenance.dateKmsMoto)) });
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoReliability() {
    let msg = '';
    if (this.wear.listWearReplacement.length > 0) {
      const wear: WearReplacementProgressBarModel = this.wear.listWearReplacement[0];
      msg = (wear.timeMaintenance === 0 ?
        this.translator.instant('ALERT.InfoReliabilityPercentKm',
          { maintenance: wear.descriptionMaintenance, percentKm: this.wear.percentKm }) :
        this.translator.instant('ALERT.InfoReliabilityPercentTime',
          { maintenance: wear.descriptionMaintenance, percentKm: this.wear.percentKm, percentTime: this.wear.percentTime }));
    } else {
      const wear: WearReplacementProgressBarModel = this.dataMaintenance.listWearReplacement[0];
      msg = (wear.timeMaintenance === 0 ?
        this.translator.instant('ALERT.InfoReliabilityPercentKm',
          { maintenance: wear.descriptionMaintenance, percentKm: Math.floor(wear.percentKms) }) :
        this.translator.instant('ALERT.InfoReliabilityPercentTime',
          { maintenance: wear.descriptionMaintenance, percentKm: Math.floor(wear.percentKms),
            percentTime: Math.floor(wear.percentMonths) }));
    }
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, msg, Constants.DELAY_TOAST_HIGH);
  }

  showInfoMaintenance() {
    const wear: WearReplacementProgressBarModel = this.dataMaintenance.listWearReplacement[0];
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

  showPopover(ev: any) {
    this.controlService.showPopover(PageEnum.MODAL_INFO, ev, SearchDashboardPopOverComponent, this.modalInputModel);
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }
}
