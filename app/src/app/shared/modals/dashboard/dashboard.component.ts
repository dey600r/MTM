import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

// SERVICES
import { DashboardService, ControlService, IconService } from '@services/index';

// MODELS
import { DashboardModel, OperationModel, ModalInputModel } from '@models/index';

// UTILS
import { IDashboardModel, IInfoModel, InfoButtonEnum, PageEnum } from '@utils/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@src/app/shared/modals/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel<any, OperationModel> = new ModalInputModel<any, OperationModel>();
    input: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();

    // MODEL FORM
    dashboardOpTypeExpenses: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
    dashboardReplacementExpenses: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
    dashboardVehicleExpenses: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
    currentPopover = null;

    // DATA
    operations: OperationModel[] = [];
    vehicleModel = '';
    iconFilter = 'filter';

    // SUBSCRIPTION
    searchSubscription: Subscription = new Subscription();
    screenSubscription: Subscription = new Subscription();

    constructor(private platform: Platform,
                private navParams: NavParams,
                private screenOrientation: ScreenOrientation,
                private changeDetector: ChangeDetectorRef,
                private dashboardService: DashboardService,
                private modalController: ModalController,
                private controlService: ControlService,
                private iconService: IconService) {
  }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel<any, OperationModel>(this.navParams.data);
    this.input = new ModalInputModel<IInfoModel>({
      parentPage: this.getParent(this.modalInputModel.parentPage),
      data: {
        text: 'ALERT.NoDataFound',
        icon: 'bar-chart',
        info: InfoButtonEnum.NONE
      }
    });

    this.operations = this.modalInputModel.dataList;
    this.vehicleModel = (!!this.operations && this.operations.length > 0 ?
        `${this.operations[0].vehicle.brand} ${this.operations[0].vehicle.model}` : '');
    this.searchSubscription = this.dashboardService.getObserverSearchDashboard().subscribe(filter => {
      const windowsSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      if (this.modalInputModel.parentPage === PageEnum.VEHICLE) { // VEHICLE TOTAL EXPENSES
        this.dashboardVehicleExpenses = this.dashboardService.getDashboardModelVehicleExpenses(windowsSize, this.operations, filter);
      } else { // VEHICLE EXPENSES PER MONTH
        this.dashboardVehicleExpenses = this.dashboardService.getDashboardModelVehiclePerTime(windowsSize, this.operations, filter);
      }
      // VEHICLE EXPENSES PER OPERATION TYPE
      this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, this.operations, filter);
      this.dashboardReplacementExpenses = this.dashboardService.getDashboardModelReplacementExpenses(windowsSize, this.operations, filter);
      this.loadIconSearch();
      this.changeDetector.detectChanges();
    });

    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      let windowSize: any[] = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
      this.dashboardVehicleExpenses.view = windowSize;
      this.dashboardOpTypeExpenses.view = windowSize;
      this.dashboardReplacementExpenses.view = windowSize;
      setTimeout(() => {
        windowSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
        if (windowSize[0] === windowSize[1]) {
          this.dashboardVehicleExpenses.view = windowSize;
          this.dashboardOpTypeExpenses.view = windowSize;
          this.dashboardReplacementExpenses.view = windowSize;
          this.changeDetector.detectChanges();
        }
      }, 200);
    });

    this.controlService.isAppFree(this.modalController);
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
  }

  getParent(page: PageEnum): PageEnum {
    return (page === PageEnum.VEHICLE ? PageEnum.MODAL_DASHBOARD_VEHICLE : PageEnum.MODAL_DASHBOARD_OPERATION);
  }

  showPopover(ev: any) {
    const parentPage: PageEnum = this.getParent(this.modalInputModel.parentPage);
    this.controlService.showPopover(parentPage, ev, SearchDashboardPopOverComponent, new ModalInputModel({ parentPage: parentPage }));
  }

  isParentPageVehicle() {
    return this.modalInputModel.parentPage === PageEnum.VEHICLE;
  }

  isParentPageOperation() {
    return this.modalInputModel.parentPage === PageEnum.OPERATION;
  }

  loadIconSearch() {
    const parentPage: PageEnum = this.getParent(this.modalInputModel.parentPage);
    this.iconFilter = this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(parentPage));
  }
}
