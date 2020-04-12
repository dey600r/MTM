import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, DashboardService, ConfigurationService } from '@services/index';
import {
  SearchDashboardModel, WearMotoProgressBarModel, WearReplacementProgressBarModel,
  MaintenanceModel, MaintenanceFreqModel, ModalInputModel, OperationModel, MotoModel, ConfigurationModel
} from '@models/index';
import { WarningWearEnum, PageEnum, Constants } from '@utils/index';
import { Subscription } from 'rxjs';

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
  hideMotos: boolean[] = [];

  // SUBSCRIPTION
  operationSubscription: Subscription = new Subscription();
  motoSubscription: Subscription = new Subscription();
  maintenanceSubscription: Subscription = new Subscription();

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private dashboardService: DashboardService,
              private configurationService: ConfigurationService) {
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
              if (!!motos && motos.length > 0) {
                this.operationSubscription = this.dbService.getOperations().subscribe(operations => {
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
    switch (warning) {
      case WarningWearEnum.SUCCESS:
        return `${styles} quizz-progress-success`;
      case WarningWearEnum.WARNING:
        return `${styles} quizz-progress-warning`;
      case WarningWearEnum.DANGER:
        return `${styles} quizz-progress-danger`;
    }
  }

  getClassIcon(warning: WarningWearEnum, styles: string): string {
    switch (warning) {
      case WarningWearEnum.SUCCESS:
        return `${styles} icon-color-success`;
      case WarningWearEnum.WARNING:
        return `${styles} icon-color-warning`;
      case WarningWearEnum.DANGER:
        return `${styles} icon-color-danger`;
    }
  }

  getIconKms(warning: WarningWearEnum): string {
    switch (warning) {
      case WarningWearEnum.SUCCESS:
        return 'checkmark-circle';
      case WarningWearEnum.WARNING:
        return 'warning';
      case WarningWearEnum.DANGER:
        return 'nuclear';
    }
  }

  getColorKms(warning: WarningWearEnum) {
    switch (warning) {
      case WarningWearEnum.SUCCESS:
        return 'success';
      case WarningWearEnum.WARNING:
        return 'warning';
      case WarningWearEnum.DANGER:
        return 'nuclear';
    }
  }

  getIconMaintenance(wear: WearReplacementProgressBarModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(wear.codeMaintenanceFreq)));
  }

}
