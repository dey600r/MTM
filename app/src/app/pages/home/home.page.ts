import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, DashboardService, ConfigurationService } from '@services/index';
import {
  SearchDashboardModel, WearMotoProgressBarModel, WearReplacementProgressBarModel,
  MaintenanceModel, MaintenanceFreqModel
} from '@models/index';
import { WarningWearEnum } from '@utils/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss']
})
export class HomePage implements OnInit {

  wears: WearMotoProgressBarModel[] = [];
  hideMotos: boolean[] = [];

  searchDashboard: SearchDashboardModel = this.dashboardService.getSearchDashboard();
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
    this.dbService.getOperations().subscribe(operations => {
      if (!!operations && operations.length > 0) {
        this.dbService.getMotos().subscribe(motos => {
          if (!!motos && motos.length > 0) {
            this.dbService.getConfigurations().subscribe(configurations => {
              if (!!configurations && configurations.length > 0) {
                this.dbService.getMaintenance().subscribe(maintenances => {
                  if (!!maintenances && maintenances.length > 0) {
                    this.wears = this.dashboardService.getWearReplacementToMoto(operations, motos, configurations, maintenances);
                    this.wears.forEach((x, index) => this.hideMotos[index] = (index !== 0));
                  }
                });
              }
            });
          }
        });
      }
    });
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
