import { Component, OnInit } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, DashboardService, ConfigurationService } from '@services/index';
import {
  SearchDashboardModel, WearMotoProgressBarModel, WearReplacementProgressBarModel,
  MaintenanceModel, MaintenanceFreqModel
} from '@models/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss']
})
export class HomePage implements OnInit {

  currentPopover = null;
  wears: WearMotoProgressBarModel[] = [];
  hideMotos: boolean[] = [];

  searchDashboard: SearchDashboardModel = this.dashboardService.getSearchDashboard();
  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private dashboardService: DashboardService,
              private popoverController: PopoverController,
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

  getColorMotoPercent(wear: WearMotoProgressBarModel): string {
    let color = 'primary';
    wear.listWearReplacement.forEach(element => {
      let colorPercent = this.getColorPercent(element, true);
      if (colorPercent === 'warning') {
        colorPercent = this.getColorPercent(element, false);
      }
      if (color === 'primary' && colorPercent === 'warning') {
        color = colorPercent;
      } else if (color === 'primary' && colorPercent === 'danger') {
        color = colorPercent;
      }
    });
    return color;
  }

  getIconMaintenance(wear: WearReplacementProgressBarModel): string {
    return this.configurationService.getIconMaintenance(
      new MaintenanceModel(null, null, new MaintenanceFreqModel(wear.codeMaintenanceFreq)));
  }

  getColorPercent(wear: WearReplacementProgressBarModel, km: boolean): string {
    let color = 'primary';
    if ((km && wear.percentKms >= 0.8 && wear.percentKms < 1) ||
      (!km && wear.percentMonths >= 0.8 && wear.percentMonths < 1)) {
      color = 'warning';
    } else if ((km && wear.percentKms >= 1) || (!km && wear.percentMonths >= 1)) {
      color = 'danger';
    }
    return color;
  }

  async showPopover(ev: any) {
    this.currentPopover = await this.popoverController.create({
      component: SearchDashboardPopOverComponent,
      event: ev,
      translucent: true
    });
    return await this.currentPopover.present();
  }

}
