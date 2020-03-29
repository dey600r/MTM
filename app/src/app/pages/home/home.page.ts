import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import { DataBaseService, CommonService, DashboardService } from '@services/index';
import { DashboardModel, OperationModel } from '@models/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss']
})
export class HomePage implements OnInit, OnChanges {

  operations: OperationModel[] = [];

  dashboardOpTypeExpenses: DashboardModel = new DashboardModel([], []);
  dashboardMotoExpenses: DashboardModel = new DashboardModel([], []);

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private commonService: CommonService,
              private screenOrientation: ScreenOrientation,
              private changeDetector: ChangeDetectorRef,
              private dashboardService: DashboardService) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    });

    this.dbService.getOperations().subscribe(data => {
      const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoExpenses(windowsSize, data);
      this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, data);
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

  showPopover() {
  }

}
