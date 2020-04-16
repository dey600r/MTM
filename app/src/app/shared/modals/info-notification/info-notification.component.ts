import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams, Platform, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import {
  ModalInputModel, ModalOutputModel, WearMotoProgressBarModel, WearReplacementProgressBarModel,
  MaintenanceFreqModel, MaintenanceModel, MaintenanceElementModel, DashboardModel, MotoModel
} from '@models/index';
import { DashboardService, ConfigurationService, CommonService } from '@services/index';
import { WarningWearEnum, Constants } from '@utils/index';

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
    dashboardRecordsMaintenance: DashboardModel = new DashboardModel([], []);
    currentPopover = null;
    hideGraph = true;
    hideSummary = false;
    hideRecords = true;
    isCalendar = true;

    // DATA
    dataMaintenance: WearMotoProgressBarModel = new WearMotoProgressBarModel();
    motoKmEstimated = 0;
    nameMaintenanceElement = '';
    nameMaintenance = '';
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
                private screenOrientation: ScreenOrientation,
                private changeDetector: ChangeDetectorRef,
                private popoverController: PopoverController,
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
        if (!this.hideGraph) {
          const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
          this.dashboardRecordsMaintenance =
            this.dashboardService.getDashboardRecordMaintenances(windowsSize, this.wear, filter);
        }
      });

      this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
        const windowSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
        this.dashboardRecordsMaintenance.view = windowSize;
        this.changeDetector.detectChanges();
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
    this.nameMaintenance = wear.descriptionMaintenance;
    this.nameMaintenanceElement = wear.nameMaintenanceElement;
    this.motoKmEstimated = this.dashboardService.calculateKmMotoEstimated(new MotoModel(null, null, 0, this.dataMaintenance.kmMoto,
      null, this.dataMaintenance.kmsPerMonthMoto, this.dataMaintenance.dateKmsMoto, this.dataMaintenance.datePurchaseMoto));

    this.labelMotoKm = this.translator.instant('PAGE_HOME.MotoKm', { km: this.dataMaintenance.kmMoto });
    if (this.dataMaintenance.kmMoto !== this.motoKmEstimated) {
      this.labelMotoKm += '\n' + this.translator.instant('PAGE_HOME.MotoEstimatedKm', { km: this.dataMaintenance.kmMoto });
    }
    this.labelReliability = `${this.translator.instant('PAGE_HOME.RELIABILITY')} ${this.nameMaintenanceElement}`;
    this.labelNextChange = this.translator.instant('PAGE_HOME.NextChangeKm',
      {maintenance: this.nameMaintenanceElement, km: this.motoKmEstimated + wear.calculateKms});
    if (wear.timeMaintenance !== 0) {
      const date: Date = new Date();
      date.setMonth(date.getMonth() + wear.calculateMonths);
      this.labelNextChange += ` ${this.translator.instant('COMMON.OR')} ${this.commonService.getDateString(date)}`;
    }
  }

  refreshChart() {
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

  getColorKms(warning: WarningWearEnum) {
    return this.dashboardService.getColorKms(warning);
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
    return `${this.getKmOperation(wear) } / ${wear.kmMaintenance}`;
  }

  getKmOperation(wear: WearReplacementProgressBarModel): string {
    return `${(wear.kmOperation === null ? '--' : wear.kmMaintenance - wear.calculateKms) }`;
  }

  getTimePercent(wear: WearReplacementProgressBarModel): string {
    const dateMaintenance: Date = this.getDateMaintenance(wear);
    const dateOperation: Date = this.getDateOperation(wear, dateMaintenance);
    return `${(wear.kmOperation === null ? '--' : this.commonService.getDateString(dateOperation))} /` +
      ` ${this.commonService.getDateString(dateMaintenance)}`;
  }

  getDateMaintenance(wear: WearReplacementProgressBarModel): Date {
    const dateMaintenance: Date = new Date(this.wear.datePurchaseMoto);
    dateMaintenance.setMonth(dateMaintenance.getMonth() + wear.timeMaintenance);
    return dateMaintenance;
  }

  getDateOperation(wear: WearReplacementProgressBarModel, dateMaintenance: Date): Date {
    const dateOperation: Date = new Date(dateMaintenance);
    dateOperation.setMonth(dateOperation.getMonth() - wear.calculateMonths);
    return dateOperation;
  }

  getIconPercent(type: string): string {
    if (this.labelPercent < 60) {
      return (type === 'color' ? this.dashboardService.getClassIcon(WarningWearEnum.DANGER, '') : 'skull');
    } else if (this.labelPercent >= 60 && this.labelPercent < 80) {
      return (type === 'color' ? this.dashboardService.getClassIcon(WarningWearEnum.WARNING, '') : 'warning');
    } else {
      return (type === 'color' ? this.dashboardService.getClassIcon(WarningWearEnum.SUCCESS, '') : 'checkmark-done-circle');
    }
  }

  // MODALS

  showInfo(wear: WearReplacementProgressBarModel) {
    let msg = '';
    if (wear.kmOperation === null) {
      if (wear.timeMaintenance === 0) {
        msg = this.translator.instant('ALERT.InfoNotOperationKm', { km: wear.kmMaintenance });
      } else {
        const dateMaintenance: Date = this.getDateMaintenance(wear);
        msg = this.translator.instant('ALERT.InfoNotOperationKmTime',
          { km: wear.kmMaintenance, time: this.commonService.getDateString(dateMaintenance) });
      }
    } else {
      msg = this.translator.instant('ALERT.InfoOperationKm',
        { kmop: wear.kmMaintenance - wear.calculateKms, km: wear.kmMaintenance });
      if (wear.timeMaintenance !== 0) {
        const dateMaintenance: Date = this.getDateMaintenance(wear);
        const dateOperation: Date = this.getDateOperation(wear, dateMaintenance);
        msg += this.translator.instant('ALERT.InfoOperationTime',
          { timeop: this.commonService.getDateString(dateOperation), time: this.commonService.getDateString(dateMaintenance) });
      }
    }
    this.commonService.showMsgToast(msg, Constants.DELAY_TOAST_HIGH);
  }

  async showPopover(ev: any) {
    this.currentPopover = await this.popoverController.create({
      component: SearchDashboardPopOverComponent,
      componentProps: this.modalInputModel,
      event: ev,
      translucent: true
    });
    return await this.currentPopover.present();
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }
}
