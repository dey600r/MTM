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
import { WarningWearEnum } from '@utils/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';

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
    hideGraph = false;
    hideSummary = true;
    hideRecords = true;

    // DATA
    dataMaintenance: WearMotoProgressBarModel = new WearMotoProgressBarModel();
    motoKmEstimated = 0;

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
                private popoverController: PopoverController) {
  }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    this.dataMaintenance = this.modalInputModel.data;
    this.motoKmEstimated = this.dashboardService.calculateKmMotoEstimated(new MotoModel(null, null, 0, this.dataMaintenance.kmMoto,
      null, this.dataMaintenance.kmsPerMonthMoto, this.dataMaintenance.dateKmsMoto, this.dataMaintenance.datePurchaseMoto));

    this.wear = this.dashboardService.getWearReplacement(this.modalInputModel.data, this.modalInputModel.dataList);

    this.searchSubscription = this.dashboardService.getObserverSearchODashboard().subscribe(filter => {
      const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      this.dashboardRecordsMaintenance =
        this.dashboardService.getDashboardRecordMaintenances(windowsSize, this.wear, filter);
    });

    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      const windowSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
      this.dashboardRecordsMaintenance.view = windowSize;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
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
    return this.configurationService.getIconReplacement(
      new MaintenanceElementModel(null, null, null, this.wear.listWearReplacement[0].idMaintenanceElement));
  }

  getKmPercent(wear: WearReplacementProgressBarModel): string {
    return `${this.getKmOperation(wear) } / ${wear.kmMaintenance}`;
  }

  getKmOperation(wear: WearReplacementProgressBarModel): string {
    return `${(wear.kmOperation === null ? '--' : wear.kmMaintenance - wear.calculateKms) }`;
  }

  getTimePercent(wear: WearReplacementProgressBarModel): string {
    const dateMaintenance: Date = new Date(this.wear.datePurchaseMoto);
    dateMaintenance.setMonth(dateMaintenance.getMonth() + wear.timeMaintenance);
    const dateOperation: Date = new Date(dateMaintenance);
    dateOperation.setMonth(dateOperation.getMonth() - wear.calculateMonths);
    return `${(wear.kmOperation === null ? '--' : this.commonService.getDateString(dateOperation))} /` +
      ` ${this.commonService.getDateString(dateMaintenance)}`;
  }

  showInfo(wear: WearReplacementProgressBarModel) {
    this.commonService.showToast('Operacion pasada ' + this.getKmOperation(wear) + ' y se deberia pasar a ' + wear.kmMaintenance);
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
}
