import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// UTILS
import { DashboardService, ControlService, VehicleService } from '@services/index';
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
    dashboardReplacementExpenses: DashboardModel = new DashboardModel([], []);
    dashboardVehicleExpenses: DashboardModel = new DashboardModel([], []);
    currentPopover = null;

    // DATA
    operations: OperationModel[] = [];
    vehicleModel = '';

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
                private vehicleService: VehicleService) {
  }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

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
    this.modalOutputModel = new ModalOutputModel(true);
    this.controlService.closeModal(this.modalController);
  }

  getParent(page: PageEnum): PageEnum {
    return (page === PageEnum.VEHICLE ? PageEnum.MODAL_DASHBOARD_VEHICLE : PageEnum.MODAL_DASHBOARD_OPERATION);
  }

  showPopover(ev: any) {
    this.controlService.showPopover(this.getParent(this.modalInputModel.parentPage), ev, SearchDashboardPopOverComponent,
      new ModalInputModel(this.modalInputModel.isCreate, this.modalInputModel.data, this.modalInputModel.dataList,
        this.getParent(this.modalInputModel.parentPage)));
  }

  isParentPageVehicle() {
    return this.modalInputModel.parentPage === PageEnum.VEHICLE;
  }

  isParentPageOperation() {
    return this.modalInputModel.parentPage === PageEnum.OPERATION;
  }

  getIconVehicle(): string {
    return this.vehicleService.getIconVehicle(this.operations[0].vehicle);
  }
}
