import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, DashboardService, ConfigurationService } from '@services/index';
import {
  SearchDashboardModel, WearMotoProgressBarModel, WearReplacementProgressBarModel,
  MaintenanceModel, MaintenanceFreqModel, ModalInputModel, OperationModel, MotoModel, ModalOutputModel
} from '@models/index';
import { WarningWearEnum, PageEnum, Constants } from '@utils/index';

// COMPONENTS
import { InfoNotificationComponent } from '@modals/info-notification/info-notification.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss']
})
export class HomePage implements OnInit {

  // MODAL
  dataReturned: ModalOutputModel = new ModalOutputModel();
  input: ModalInputModel = new ModalInputModel();

  // DATA
  searchDashboard: SearchDashboardModel = this.dashboardService.getSearchDashboard();
  activateInfo = false;
  wears: WearMotoProgressBarModel[] = [];
  hideMotos: boolean[] = [];
  operations: OperationModel[] = [];

  // SUBSCRIPTION
  operationSubscription: Subscription = new Subscription();
  motoSubscription: Subscription = new Subscription();
  maintenanceSubscription: Subscription = new Subscription();

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private dashboardService: DashboardService,
              private configurationService: ConfigurationService,
              private modalController: ModalController) {
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
                  this.wears = this.dashboardService.getWearReplacementToMoto(operations, motos, configurations, maintenances);
                  this.wears.forEach((x, index) => this.hideMotos[index] = (index !== 0));
                  this.activateInfo = this.activateModeInfo(motos, operations, this.wears);
                });
              } else {
                this.activateInfo = this.activateModeInfo(motos, [], []);
              }
            });
          }
        });
      }
    });
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

  getColorKms(warning: WarningWearEnum) {
    return this.dashboardService.getColorKms(warning);
  }

  getIconMaintenance(wear: WearReplacementProgressBarModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(wear.codeMaintenanceFreq)));
  }

  // MODALS

  openInfoNotification(m: WearMotoProgressBarModel, w: WearReplacementProgressBarModel) {
    this.openModal(InfoNotificationComponent, new ModalInputModel(true,
      new WearMotoProgressBarModel(m.idMoto, m.nameMoto, m.kmMoto, m.datePurchaseMoto,
        m.kmsPerMonthMoto, m.dateKmsMoto, m.percent, m.warning, [w]), this.operations, PageEnum.HOME));
  }

  async openModal(modalComponent: any, inputModel: ModalInputModel) {

    const modal = await this.modalController.create({
      component: modalComponent,
      componentProps: inputModel
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
    });

    return await modal.present();
  }

}
