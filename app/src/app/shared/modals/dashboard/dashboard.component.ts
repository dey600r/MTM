import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

// SERVICES
import { DashboardService, ControlService, IconService } from '@services/index';

// MODELS
import { IDashboardModel, IInfoModel, DashboardModel, OperationModel, ModalInputModel, HeaderInputModel, HeaderOutputModel, HeaderSegmentInputModel, DashboardInputModal } from '@models/index';

// UTILS
import { InfoButtonEnum, HeaderOutputEnum, PageEnum } from '@utils/index';

// COMPONENTS
import { SearchDashboardPopOverComponent } from '@src/app/shared/modals/search-dashboard-popover/search-dashboard-popover.component';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    @Input() modalInputModel: ModalInputModel<DashboardInputModal> = new ModalInputModel<DashboardInputModal>();
    input: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
    headerInput: HeaderInputModel = new HeaderInputModel();

    // MODEL FORM
    dashboardOpTypeExpenses: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
    dashboardReplacementExpenses: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
    dashboardVehicleExpenses: DashboardModel<IDashboardModel> = new DashboardModel<IDashboardModel>();
    currentPopover = null;

    // DATA
    allOperations: OperationModel[] = [];
    operations: OperationModel[] = [];
    iconFilter = 'filter';
    showSpinner = false;
    openningPopover = false;

    // SUBSCRIPTION
    searchSubscription: Subscription = new Subscription();
    screenSubscription: Subscription = new Subscription();

    constructor(private readonly platform: Platform,
                private readonly screenOrientation: ScreenOrientation,
                private readonly changeDetector: ChangeDetectorRef,
                private readonly dashboardService: DashboardService,
                private readonly controlService: ControlService,
                private readonly iconService: IconService) {
  }

  ngOnInit() {

    this.input = new ModalInputModel<IInfoModel>({
      parentPage: this.getParent(this.modalInputModel.parentPage),
      data: {
        text: 'ALERT.NoDataFound',
        icon: 'bar-chart',
        info: InfoButtonEnum.NONE
      }
    });
    
    this.allOperations = this.modalInputModel.data.operations;
    this.loadChart(this.modalInputModel.data.vehicleSelected);
    this.searchSubscription = this.dashboardService.getObserverSearchDashboard().subscribe(filter => {
      this.showSpinner = true;
      const windowsSize = this.dashboardService.getSizeWidthHeight(this.platform.width(), this.platform.height());
      if (this.modalInputModel.parentPage === PageEnum.VEHICLE) { // VEHICLE TOTAL EXPENSES
        this.dashboardVehicleExpenses = this.dashboardService.getDashboardModelVehicleExpenses(windowsSize, this.operations, filter);
      } else { // VEHICLE EXPENSES PER MONTH
        this.dashboardVehicleExpenses = this.dashboardService.getDashboardModelVehiclePerTime(windowsSize, this.operations, filter).allSum;
      }
      // VEHICLE EXPENSES PER OPERATION TYPE
      this.dashboardOpTypeExpenses = this.dashboardService.getDashboardModelOpTypeExpenses(windowsSize, this.operations, filter);
      this.dashboardReplacementExpenses = this.dashboardService.getDashboardModelReplacementExpenses(windowsSize, this.operations, filter);
      this.loadIconSearch();
      setTimeout(() => {
        this.showSpinner = false;
        this.changeDetector.detectChanges();
      }, 100);
    });

    this.screenSubscription = this.screenOrientation.onChange().subscribe(() => {
      let windowSize = this.dashboardService.getSizeWidthHeight(this.platform.height(), this.platform.width());
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
  }

  loadChart(idVehicle: number) {
    if(this.isParentPageOperation()) {
      this.operations = this.allOperations.filter(x => x.vehicle.id === idVehicle);
    } else {
      this.operations = this.allOperations;
    }
  }

  refreshChart(idVehicle: number) {
    this.loadChart(idVehicle);
    this.dashboardService.setSearchDashboard(this.dashboardService.getSearchDashboard());
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
  }

  getParent(page: PageEnum): PageEnum {
    return (page === PageEnum.VEHICLE ? PageEnum.MODAL_DASHBOARD_VEHICLE : PageEnum.MODAL_DASHBOARD_OPERATION);
  }

  eventEmitHeader(output: HeaderOutputModel) {
    switch(output.type) {
      case HeaderOutputEnum.BUTTON_LEFT:
        this.showPopover(output.data);
        break
      case HeaderOutputEnum.SEGMENT:
        this.refreshChart(Number(output.data.detail.value));
        break;
    }
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

  loadHeader() {
    let listVehicles: HeaderSegmentInputModel[] = [];
    if(this.isParentPageOperation()) {
      this.modalInputModel.data.vehicles.forEach(x => {
        if(!listVehicles.some(y => y.id === x.id)) {
          listVehicles = [...listVehicles, new HeaderSegmentInputModel({
            id: x.id, name: x.$getName, icon: x.vehicleType.icon, selected: (x.id === this.modalInputModel.data.vehicleSelected)
          })];
        }
      });
    }
    this.headerInput = new HeaderInputModel({
      title: 'COMMON.CHARTS',
      iconButtonLeft: this.iconFilter,
      dataSegment: listVehicles
    });
  }

  loadIconSearch() {
    const parentPage: PageEnum = this.getParent(this.modalInputModel.parentPage);
    this.iconFilter = this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(parentPage));
    this.loadHeader();
  }
}
