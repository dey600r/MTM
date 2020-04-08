import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform, ModalController, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import { DataBaseService, DashboardService } from '@services/index';
import { DashboardModel, OperationModel, ModalInputModel, ModalOutputModel } from '@models/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'dashboard-moto',
  templateUrl: 'dashboard-moto.component.html',
  styleUrls: ['dashboard-moto.component.scss', '../../../app.component.scss']
})
export class DashboardMotoComponent implements OnInit, OnDestroy {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  // MODEL FORM
  dashboardOpTypeExpenses: DashboardModel = new DashboardModel([], []);
  dashboardMotoExpenses: DashboardModel = new DashboardModel([], []);
  currentPopover = null;

  // DATA
  operations: OperationModel[] = [];

  // SUBSCRIPTION
  operationSubscription: Subscription = new Subscription();
  searchSubscription: Subscription = new Subscription();
  screenSubscription: Subscription = new Subscription();

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private screenOrientation: ScreenOrientation,
              private changeDetector: ChangeDetectorRef,
              private dashboardService: DashboardService,
              private modalController: ModalController,
              private popoverController: PopoverController) {
  }

  ngOnInit() {
      this.operationSubscription = this.dbService.getOperations().subscribe(data => {
        this.searchSubscription = this.dashboardService.getObserverSearchODashboard().subscribe(filter => {
          const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
          this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoExpenses(windowsSize, data, filter);
          this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, data, filter);
        });
      });

      this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
              const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
              this.dashboardMotoExpenses.view = windowsSize;
              this.dashboardOpTypeExpenses.view = windowsSize;
              this.changeDetector.detectChanges();
          }
      );
  }

  ngOnDestroy() {
      this.operationSubscription.unsubscribe();
      this.searchSubscription.unsubscribe();
      this.screenSubscription.unsubscribe();
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  async showPopover(ev: any) {
    this.currentPopover = await this.popoverController.create({
      component: SearchDashboardPopOverComponent,
      componentProps: new ModalInputModel(false),
      event: ev,
      translucent: true
    });
    return await this.currentPopover.present();
  }
}
