import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform, ModalController, NavParams, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import { DashboardService } from '@services/index';
import { DashboardModel, OperationModel, ModalInputModel, ModalOutputModel } from '@models/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'dashboard-operation',
  templateUrl: 'dashboard-operation.component.html',
  styleUrls: ['dashboard-operation.component.scss', '../../../app.component.scss']
})
export class DashboardOperationComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();
    modalOutputModel: ModalOutputModel = new ModalOutputModel();

    // MODEL FORM
    dashboardOpTypeExpenses: DashboardModel = new DashboardModel([], []);
    dashboardMotoExpenses: DashboardModel = new DashboardModel([], []);
    currentPopover = null;

    // DATA
    operations: OperationModel[] = [];
    motoModel = '';

    // SUBSCRIPTION
    searchSubscription: Subscription = new Subscription();
    screenSubscription: Subscription = new Subscription();

    constructor(private platform: Platform,
                private navParams: NavParams,
                private screenOrientation: ScreenOrientation,
                private changeDetector: ChangeDetectorRef,
                private dashboardService: DashboardService,
                private modalController: ModalController,
                private popoverController: PopoverController) {
  }

    ngOnInit() {
        this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
            this.navParams.data.data, this.navParams.data.dataList);

        this.operations = this.modalInputModel.dataList;
        this.motoModel = (!!this.operations && this.operations.length > 0 ?
            `${this.operations[0].moto.brand} ${this.operations[0].moto.model}` : '');
        this.searchSubscription = this.dashboardService.getObserverSearchODashboard().subscribe(filter => {
          const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
          this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoPerTime(windowsSize, this.operations, filter);
          this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, this.operations, filter);
        });

        this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
            const windowSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
            this.dashboardMotoExpenses.view = windowSize;
            this.dashboardOpTypeExpenses.view = windowSize;
            this.changeDetector.detectChanges();
            }
        );
    }

  ngOnDestroy() {
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
      componentProps: new ModalInputModel(true),
      event: ev,
      translucent: true
    });
    return await this.currentPopover.present();
  }
}
