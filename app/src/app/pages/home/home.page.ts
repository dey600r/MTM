import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, DashboardService, ConfigurationService, ControlService, VehicleService, CalendarService } from '@services/index';
import {
  SearchDashboardModel, WearVehicleProgressBarViewModel, WearReplacementProgressBarViewModel,
  MaintenanceModel, MaintenanceFreqModel, ModalInputModel, OperationModel, VehicleModel, VehicleTypeModel
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
  wears: WearVehicleProgressBarViewModel[] = [];
  allWears: WearVehicleProgressBarViewModel[] = [];
  hideVehicles: boolean[] = [];
  operations: OperationModel[] = [];
  loaded = false;

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
              private vehicleService: VehicleService) {
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
          this.vehicleSubscription.unsubscribe();
          if (!!maintenances && maintenances.length > 0) {
            this.vehicleSubscription = this.dbService.getVehicles().subscribe(vehicles => {
              this.operationSubscription.unsubscribe();
              this.operations = [];
              if (!!vehicles && vehicles.length > 0) {
                this.operationSubscription = this.dbService.getOperations().subscribe(operations => {
                  this.operations = operations;
                  this.wears = [];
                  this.allWears = this.dashboardService.getWearReplacementToVehicle(operations, vehicles, configurations, maintenances);
                  this.allWears.forEach((x, index) => {
                    this.wears = [...this.wears, Object.assign({}, x)];
                    this.hideVehicles[index] = (index !== 0);
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
                  this.activateInfo = this.activateModeInfo(vehicles, operations, this.wears);
                  this.timeOutLoader();
                });
              } else {
                this.timeOutLoader();
                this.activateInfo = this.activateModeInfo(vehicles, [], []);
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
    if (!this.loaded) {
      setTimeout(() => { this.loaded = true; }, 2500);
    }
  }

  activateModeInfo(m: VehicleModel[], op: OperationModel[], w: WearVehicleProgressBarViewModel[]): boolean {
    let result = true;
    if (m === null || m.length === 0) {
      this.input = new ModalInputModel(true, null, [], PageEnum.HOME, Constants.STATE_INFO_VEHICLE_EMPTY);
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

  getIconMaintenance(wear: WearReplacementProgressBarViewModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(wear.codeMaintenanceFreq)));
  }

  getDateCalculateMonths(wear: WearReplacementProgressBarViewModel): string {
    return this.dashboardService.getDateCalculateMonths(wear);
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
    // Change filter operation to easy
    this.dashboardService.setSearchOperation(new VehicleModel(m.nameVehicle, '', null, null, null, null, null, null, null, m.idVehicle));
    this.controlService.openModal(PageEnum.HOME, InfoNotificationComponent, new ModalInputModel(true,
      new WearVehicleProgressBarViewModel(m.idVehicle, m.nameVehicle, m.kmVehicle, m.datePurchaseVehicle,
        m.kmsPerMonthVehicle, m.dateKmsVehicle, m.percent, m.percentKm, m.percentTime, m.warning, listGroupWear),
        this.operations, PageEnum.HOME));
  }

  openInfoCalendar() {
    this.controlService.openModal(PageEnum.HOME,
      InfoCalendarComponent, new ModalInputModel(true, null, this.wears, PageEnum.HOME));
  }

  getIconVehicle(wear: WearVehicleProgressBarViewModel): string {
    return this.vehicleService.getIconVehicle(new VehicleModel(null, null, null, null, null,
      new VehicleTypeModel(wear.typeVehicle)));
  }

}
