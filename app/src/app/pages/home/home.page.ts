import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import { DataBaseService, DashboardService } from '@services/index';
import { DashboardModel, OperationModel, SearchDashboardModel, FilterGroupMotoOpTypeReplacement } from '@models/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss']
})
export class HomePage implements OnInit, OnChanges {

  currentPopover = null;
  operations: OperationModel[] = [];

  searchDashboard: SearchDashboardModel = this.dashboardService.getSearchDashboard();
  dashboardOpTypeExpenses: DashboardModel = new DashboardModel([], []);
  dashboardMotoExpenses: DashboardModel = new DashboardModel([], []);

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private screenOrientation: ScreenOrientation,
              private changeDetector: ChangeDetectorRef,
              private dashboardService: DashboardService,
              private popoverController: PopoverController) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });

    this.dbService.getOperations().subscribe(data => {
      this.dashboardService.getObserverSearchODashboard().subscribe(filter => {
        const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        if (this.isChartMoto()) {
          this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoExpenses(windowsSize, data);
          this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, data);
        } else if (this.isChartOperationType()) {
          this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoOpTypeExpenses(windowsSize, data);
          this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, data);
        } else {
          this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoOpTypeExpenses(windowsSize, data);
          this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, data);
        }
      });
    });

    this.screenOrientation.onChange().subscribe(
      () => {
        const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
        this.dashboardMotoExpenses.view = windowsSize;
        this.dashboardOpTypeExpenses.view = windowsSize;
        this.changeDetector.detectChanges();
      }
   );
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  async showPopover(ev: any) {
    this.currentPopover = await this.popoverController.create({
      component: SearchDashboardPopOverComponent,
      event: ev,
      translucent: true
    });
    return await this.currentPopover.present();
  }

  isChartMoto() {
    return this.searchDashboard.filterGrouper === FilterGroupMotoOpTypeReplacement.MOTO;
  }

  isChartOperationType() {
    return this.searchDashboard.filterGrouper === FilterGroupMotoOpTypeReplacement.OPERATION_TYPE;
  }
}
