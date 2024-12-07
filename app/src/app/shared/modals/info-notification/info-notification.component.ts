import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { TranslateService } from '@ngx-translate/core';
import * as shape from 'd3-shape';

// UTILS
import {
  ModalInputModel, WearVehicleProgressBarViewModel, WearMaintenanceProgressBarViewModel, DashboardModel,
  InfoCalendarReplacementViewModel, WearReplacementProgressBarViewModel, SearchDashboardModel, OperationModel, MaintenanceElementModel,
  IDashboardExpensesModel, IDashboardModel, IDashboardSerieModel, ISettingModel
} from '@models/index';
import { Constants, PageEnum, ToastTypeEnum } from '@utils/index';

// SERVICES
import {
  DashboardService, ControlService, CalendarService,
  SettingsService, DataService, HomeService, InfoVehicleService, InfoCalendarService, IconService
} from '@services/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@src/app/shared/modals/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'info-notification',
  templateUrl: 'info-notification.component.html',
  styleUrls: ['info-notification.component.scss']
})
export class InfoNotificationComponent implements OnInit, OnDestroy {

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<WearVehicleProgressBarViewModel, OperationModel> = new ModalInputModel<WearVehicleProgressBarViewModel, OperationModel>();

  // MODEL FORM
  wear: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();
  dashboardVehicleOperationExpenses: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
  dashboardVehicleReplacementExpenses: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
  dashboardRecordsMaintenance: DashboardModel<IDashboardSerieModel> = new DashboardModel<IDashboardSerieModel>();
  currentPopover = null;
  hideGraphLabor = true;
  hideGraphReplacement = true;
  hideSummary = false;
  hideRecords = true;
  isCalendar = true;
  linear: any = shape.curveMonotoneX;

  // DATA
  dataMaintenance: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();
  nameMaintenanceElement = '';
  nameMaintenance = '';
  labelNameVehicle = '';
  labelVehicleKm = '';
  labelReliability = '';
  labelPercent = 0;
  labelNextChange = '';
  labelLifeReplacement = '';
  labelNotRecord = '';
  measure: ISettingModel;
  iconMaintenanceElement = '';
  iconFilter = 'filter';
  showSpinner = false;
  openningPopover = false;

  // SUBSCRIPTION
  searchDashboardSubscription: Subscription = new Subscription();
  searchDashboardRecordsSubscription: Subscription = new Subscription();
  screenSubscription: Subscription = new Subscription();
  component: any;

  constructor(private readonly platform: Platform,
              private readonly modalController: ModalController,
              private readonly dashboardService: DashboardService,
              private readonly calendarService: CalendarService,
              private readonly infoCalendarService: InfoCalendarService,
              private readonly controlService: ControlService,
              private readonly screenOrientation: ScreenOrientation,
              private readonly changeDetector: ChangeDetectorRef,
              private readonly translator: TranslateService,
              private readonly settingsService: SettingsService,
              private readonly dataService: DataService,
              private readonly homeService: HomeService,
              private readonly infoVehicleService: InfoVehicleService,
              private readonly iconService: IconService) {
  }

  ngOnInit() {
    this.getSettings();

    this.configureResume();

    this.initInfoNotifications();
  }

  ngOnDestroy() {
    this.searchDashboardSubscription.unsubscribe();
    this.searchDashboardRecordsSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
  }

  initInfoNotifications() {
    this.wear = this.homeService.getWearReplacement(true, this.modalInputModel.data, this.modalInputModel.dataList);

    if (this.wear.listWearMaintenance.length > 0) {
      this.labelPercent = this.wear.percent;
      this.getObserverSearchDashboard();
      this.getObserverOrientationChange();
      this.getObserverSearchDashboardRecords();
      this.iconMaintenanceElement = this.getMaintenanceNow(this.wear.listWearMaintenance).listWearReplacement[0].iconMaintenanceElement;
    } else {
      const wear: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearMaintenance);
      this.isCalendar = false;
      this.iconMaintenanceElement = '';
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
      if (!this.openningPopover) {
        this.showSpinner = true; // Windows: Fix refresh chart :(
        this.calculateDashboardExpenses(filter);
        this.calculateDashboad(false, filter);
        setTimeout(() => { this.showSpinner = false; }, 150);
      }
    });
  }

  getObserverSearchDashboardRecords() {
    this.searchDashboardRecordsSubscription = this.dashboardService.getObserverSearchDashboardRecords().subscribe(filter => {
      if (!this.openningPopover) {
        this.calculateDashboad(true, filter);
      }
    });
  }

  calculateDashboardExpenses(filter: SearchDashboardModel) {
    if (!this.hideGraphLabor || !this.hideGraphReplacement) {
      const windowsSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      const wearMain: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearMaintenance);
      const oldData: MaintenanceElementModel[] = [...filter.searchMaintenanceElement];
      filter.searchMaintenanceElement = [new MaintenanceElementModel({ id: wearMain.listWearReplacement[0].idMaintenanceElement })];
      const results: IDashboardExpensesModel<DashboardModel<IDashboardModel>> = this.dashboardService.getDashboardModelVehiclePerTime(windowsSize,
        this.modalInputModel.dataList.filter(x =>
          this.wear.listWearMaintenance.some(y => y.listWearReplacement[0].idOperation === x.id)), filter);
      filter.searchMaintenanceElement = oldData;
      this.dashboardVehicleOperationExpenses = results.operationSum;
      this.dashboardVehicleReplacementExpenses = results.replacementSum;
    }
  }

  calculateDashboad(all: boolean, filter: SearchDashboardModel) {
    if (!this.hideRecords) {
      const windowsSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      if (all) {
        this.wear = this.homeService.getWearReplacement(filter.showStrict, this.modalInputModel.data, this.modalInputModel.dataList);
      }
      this.dashboardRecordsMaintenance =
        this.dashboardService.getDashboardRecordMaintenances(windowsSize, this.wear, filter, this.measure);
    }
    this.loadIconSearch();
  }

  getObserverOrientationChange() {
    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      let windowSize = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
      this.dashboardVehicleOperationExpenses.view = windowSize;
      this.dashboardVehicleReplacementExpenses.view = windowSize;
      this.dashboardRecordsMaintenance.view = windowSize;
      setTimeout(() => {
        windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        if (windowSize[0] === windowSize[1]) {
          this.dashboardVehicleOperationExpenses.view = windowSize;
          this.dashboardVehicleReplacementExpenses.view = windowSize;
          this.dashboardRecordsMaintenance.view = windowSize;
          this.changeDetector.detectChanges();
        }
      }, 200);
    });
  }

  getSettings() {
    const settings = this.dataService.getSystemConfigurationData();
    if (!!settings && settings.length > 0) {
      this.measure = this.settingsService.getDistanceSelected(settings);
    }
  }

  configureResume() {
    this.dataMaintenance = this.modalInputModel.data;
    const wearMain: WearMaintenanceProgressBarViewModel = this.getMaintenanceNow(this.dataMaintenance.listWearMaintenance);
    const wearRep: WearReplacementProgressBarViewModel = wearMain.listWearReplacement[0];
    this.labelNameVehicle = this.dataMaintenance.nameVehicle;
    this.nameMaintenance = wearMain.descriptionMaintenance;
    this.nameMaintenanceElement = wearRep.nameMaintenanceElement;
    this.labelVehicleKm = this.infoVehicleService.getLabelKmVehicle(this.dataMaintenance.kmVehicle, this.dataMaintenance.kmEstimatedVehicle, this.measure);
    this.labelReliability = `${this.translator.instant('PAGE_HOME.RELIABILITY')} ${this.nameMaintenanceElement}`;
    let kmLife = this.dataMaintenance.kmEstimatedVehicle;
    const today: Date = new Date();
    if (wearRep.kmOperation !== null) {
      kmLife -= wearRep.kmOperation;
    }
    if (wearMain.timeMaintenance !== 0) {
      let timeLife = 0;
      if (wearRep.kmOperation === null) {
        timeLife = this.calendarService.monthDiff(new Date(this.dataMaintenance.datePurchaseVehicle), today);
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
      this.infoCalendarService.createInfoCalendarReplacement(this.dataMaintenance, wearMain, wearRep, true);
    const calendarTime: InfoCalendarReplacementViewModel =
      this.infoCalendarService.createInfoCalendarReplacement(this.dataMaintenance, wearMain, wearRep, false);
    const dateMaintenance: Date = (calendarKm.date < calendarTime.date || wearMain.timeMaintenance === null ?
      calendarKm.date : calendarTime.date);
    this.labelNextChange = this.translator.instant('PAGE_HOME.NextChangeKm',
      {
        maintenance: this.nameMaintenanceElement,
        km: (calendarKm.km > this.dataMaintenance.kmEstimatedVehicle ? calendarKm.km : this.dataMaintenance.kmEstimatedVehicle),
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

  refreshChartLaborExpenses() {
    this.hideGraphLabor = !this.hideGraphLabor;
    if (!this.hideGraphLabor) {
      this.dashboardService.setSearchDashboard(this.dashboardService.getSearchDashboard());
    }
  }

  refreshChartReplacementExpenses() {
    this.hideGraphReplacement = !this.hideGraphReplacement;
    if (!this.hideGraphReplacement) {
      this.dashboardService.setSearchDashboard(this.dashboardService.getSearchDashboard());
    }
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
    let result: WearMaintenanceProgressBarViewModel = wears.find(x => x.fromKmMaintenance <= this.dataMaintenance.kmEstimatedVehicle &&
      (x.toKmMaintenance === null || x.toKmMaintenance >= this.dataMaintenance.kmEstimatedVehicle));
    if (!!!result) {
      result = wears[wears.length - 1];
    }
    return result;
  }

  showPopover(ev: any) {
    this.openningPopover = true;
    this.controlService.showPopover(PageEnum.MODAL_INFO, ev, SearchDashboardPopOverComponent, this.modalInputModel);
    setTimeout(() => this.openningPopover = false, 200);
  }

  loadIconSearch() {
    this.iconFilter = this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(this.modalInputModel.parentPage));
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
  }

}
