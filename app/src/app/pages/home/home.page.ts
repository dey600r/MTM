import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, DashboardService, ConfigurationService, ControlService } from '@services/index';
import {
  SearchDashboardModel, WearMotoProgressBarModel, WearReplacementProgressBarModel,
  MaintenanceModel, MaintenanceFreqModel, ModalInputModel, OperationModel, MotoModel
} from '@models/index';
import { WarningWearEnum, PageEnum, Constants } from '@utils/index';

// COMPONENTS
import { InfoNotificationComponent } from '@modals/info-notification/info-notification.component';
import { InfoCalendarComponent } from '@modals/info-calendar/info-calendar.component';

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
  wears: WearMotoProgressBarModel[] = [];
  allWears: WearMotoProgressBarModel[] = [];
  hideMotos: boolean[] = [];
  operations: OperationModel[] = [];
  loaded = false;

  // SUBSCRIPTION
  operationSubscription: Subscription = new Subscription();
  motoSubscription: Subscription = new Subscription();
  maintenanceSubscription: Subscription = new Subscription();

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private dashboardService: DashboardService,
              private configurationService: ConfigurationService,
              private controlService: ControlService) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });
  }

  ngOnInit() {
    this.dbService.getConfigurations().subscribe(configurations => {
      this.maintenanceSubscription.unsubscribe();
      if (!!configurations && configurations.length > 0) {
        this.maintenanceSubscription = this.dbService.getMaintenance().subscribe(maintenances => {
          this.motoSubscription.unsubscribe();
          if (!!maintenances && maintenances.length > 0) {
            this.motoSubscription = this.dbService.getMotos().subscribe(motos => {
              this.operationSubscription.unsubscribe();
              this.operations = [];
              if (!!motos && motos.length > 0) {
                this.operationSubscription = this.dbService.getOperations().subscribe(operations => {
                  this.operations = operations;
                  this.wears = [];
                  this.allWears = this.dashboardService.getWearReplacementToMoto(operations, motos, configurations, maintenances);
                  this.allWears.forEach((x, index) => {
                    this.wears = [...this.wears, Object.assign({}, x)];
                    this.hideMotos[index] = (index !== 0);
                    let listWears: WearReplacementProgressBarModel[] = [];
                    const kmMoto: number = this.dashboardService.calculateKmMotoEstimated(new MotoModel(null, null, 0, x.kmMoto,
                      null, x.kmsPerMonthMoto, x.dateKmsMoto, x.datePurchaseMoto));
                    x.listWearReplacement.forEach(z => {
                    if (z.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_ONCE_CODE ||
                        z.fromKmMaintenance <= kmMoto && (z.toKmMaintenance === null || z.toKmMaintenance >= kmMoto)) {
                        listWears = [...listWears, z];
                      }
                    });
                    this.wears.find(y => x.idMoto === y.idMoto).listWearReplacement = listWears;
                  });
                  this.activateInfo = this.activateModeInfo(motos, operations, this.wears);
                  this.timeOutLoader();
                });
              } else {
                this.timeOutLoader();
                this.activateInfo = this.activateModeInfo(motos, [], []);
              }
            });
          }
        });
      }
    });
  }

  ionViewDidEnter() {
    // RELOAD NOTIFICATIONS
    if (this.controlService.getDateLastUse().toDateString() !== new Date().toDateString()) {
      this.loaded = false;
      this.dbService.motos.next(this.dbService.motosData);
      this.controlService.setDateLastUse();
    }
    this.timeOutLoader();
  }

  timeOutLoader() {
    if (document.getElementById('custom-overlay').style.display === 'flex' ||
    document.getElementById('custom-overlay').style.display === '') {
      setTimeout(() => { document.getElementById('custom-overlay').style.display = 'none'; }, 3000);
    }
    if (!this.loaded) {
      setTimeout(() => { this.loaded = true; }, 2500);
    }
  }

  activateModeInfo(m: MotoModel[], op: OperationModel[], w: WearMotoProgressBarModel[]): boolean {
    let result = true;
    if (m === null || m.length === 0) {
      this.input = new ModalInputModel(true, null, [], PageEnum.HOME, Constants.STATE_INFO_MOTO_EMPTY);
    } else if (w === null  || w.length === 0) {
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

  getIconMaintenance(wear: WearReplacementProgressBarModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(wear.codeMaintenanceFreq)));
  }

  getDateCalculateMonths(wear: WearReplacementProgressBarModel): string {
    return this.dashboardService.getDateCalculateMonths(wear);
  }

  // MODALS

  openInfoNotification(m: WearMotoProgressBarModel, w: WearReplacementProgressBarModel) {
    let listGroupWear: WearReplacementProgressBarModel[] = [];
    if (w.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE) {
      listGroupWear = this.allWears.find(x => m.idMoto === x.idMoto).listWearReplacement.filter(x =>
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
    // Change filter operation to easy
    this.dashboardService.setSearchOperation(new MotoModel(m.nameMoto, '', null, null, null, null, null, null, m.idMoto));
    this.controlService.openModal(PageEnum.HOME, InfoNotificationComponent, new ModalInputModel(true,
      new WearMotoProgressBarModel(m.idMoto, m.nameMoto, m.kmMoto, m.datePurchaseMoto,
        m.kmsPerMonthMoto, m.dateKmsMoto, m.percent, m.percentKm, m.percentTime, m.warning, listGroupWear),
        this.operations, PageEnum.HOME));
  }

  openInfoCalendar() {
    this.controlService.openModal(PageEnum.HOME,
      InfoCalendarComponent, new ModalInputModel(true, null, this.wears, PageEnum.HOME));
  }

}
