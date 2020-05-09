import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import { DashboardService, ControlService } from '@services/index';
import { DashboardModel, OperationModel, ModalInputModel, ModalOutputModel } from '@models/index';
import { PageEnum } from '@utils/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['../../../app.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

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
                private controlService: ControlService) {
  }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    this.operations = this.modalInputModel.dataList;
    this.motoModel = (!!this.operations && this.operations.length > 0 ?
        `${this.operations[0].moto.brand} ${this.operations[0].moto.model}` : '');
    this.searchSubscription = this.dashboardService.getObserverSearchODashboard().subscribe(filter => {
      const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      if (this.modalInputModel.parentPage === PageEnum.MOTO) { // MOTO TOTAL EXPENSES
        this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoExpenses(windowsSize, this.operations, filter);
      } else { // MOTO EXPENSES PER MONTH
        this.dashboardMotoExpenses = this.dashboardService.getDashboardModelMotoPerTime(windowsSize, this.operations, filter);
      }
      // MOTO EXPENSES PER OPERATION TYPE
      this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, this.operations, filter);
    });

    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      let windowSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
      this.dashboardMotoExpenses.view = windowSize;
      this.dashboardOpTypeExpenses.view = windowSize;
      setTimeout(() => {
        windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        if (windowSize[0] === windowSize[1]) {
          this.dashboardMotoExpenses.view = windowSize;
          this.dashboardOpTypeExpenses.view = windowSize;
          this.changeDetector.detectChanges();
        }
      }, 200);
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  getParent(page: PageEnum): PageEnum {
    return (page === PageEnum.MOTO ? PageEnum.MODAL_DASHBOARD_MOTO : PageEnum.MODAL_DASHBOARD_OPERATION);
  }

  showPopover(ev: any) {
    this.controlService.showPopover(this.getParent(this.modalInputModel.parentPage), ev, SearchDashboardPopOverComponent,
      new ModalInputModel(this.modalInputModel.isCreate, this.modalInputModel.data, this.modalInputModel.dataList,
        this.getParent(this.modalInputModel.parentPage)));
  }

  isParentPageMoto() {
    return this.modalInputModel.parentPage === PageEnum.MOTO;
  }

  isParentPageOperation() {
    return this.modalInputModel.parentPage === PageEnum.OPERATION;
  }
}
