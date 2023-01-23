import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
  DataBaseService, CommonService, OperationService, ControlService,
  DashboardService, SettingsService, IconService
} from '@services/index';
import {
  OperationModel, VehicleModel, ModalInputModel, ModalOutputModel, SearchDashboardModel
} from '@models/index';
import { ConstantsColumns, Constants, ActionDBEnum, PageEnum, ToastTypeEnum, IInfoModel, InfoButtonEnum, ISettingModel } from '@utils/index';

// COMPONENTS
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { SearchDashboardPopOverComponent } from '@src/app/shared/modals/search-dashboard-popover/search-dashboard-popover.component';
import { DashboardComponent } from '@app/shared/modals/dashboard/dashboard.component';
import { BasePage } from '@pages/base.page';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss']
})
export class OperationPage extends BasePage implements OnInit {

  // MODAL
  input: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
  dataReturned: ModalOutputModel;

  // MODEL
  filterDashboard: SearchDashboardModel = new SearchDashboardModel();

  // DATA
  operations: OperationModel[] = [];
  operationsVehicle: OperationModel[] = [];
  allOperations: OperationModel[] = [];
  vehicles: VehicleModel[] = [];
  vehicleSelected = -1;
  initLoaded = true;
  loadedHeader = false;
  loadedBody = false;
  iconNameHeaderLeft = 'bar-chart';
  iconFilter = 'filter';
  measure: ISettingModel;
  coin: ISettingModel;

  constructor(public platform: Platform,
              private dbService: DataBaseService,
              public translator: TranslateService,
              private commonService: CommonService,
              private controlService: ControlService,
              private operationService: OperationService,
              private dashboardService: DashboardService,
              private settingsService: SettingsService,
              private detector: ChangeDetectorRef,
              private iconService: IconService) {
    super(platform, translator);
  }

  ngOnInit(): void {
      this.initPage();
  }

  /** INIT */

  initPage() {

    this.input = new ModalInputModel<IInfoModel>({
      parentPage: PageEnum.OPERATION,
      data: {
        text: 'ALERT.OperationEmpty',
        icon: 'construct',
        info: InfoButtonEnum.NONE
      }
    });

    this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
        this.coin = this.settingsService.getMoneySelected(settings);
      }
    });

    this.dbService.getVehicles().subscribe(data => {
      if (!!data && data.length > 0) {
        this.vehicles = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND);
        if (this.vehicleSelected === -1) {
          this.vehicleSelected = this.vehicles[0].id;
        } else {
          const vehicle = this.vehicles.find(x => x.id === this.vehicleSelected);
          this.vehicleSelected = (vehicle ? vehicle.id : this.vehicles[0].id);
        }
      } else {
        this.vehicles = [];
        this.vehicleSelected = -1;
      }
    });

    this.dbService.getOperations().subscribe(data => {
      this.filterDashboard = this.dashboardService.getSearchDashboard();
      if (!!data && data.length > 0) {
        this.allOperations = data;
        this.loadOperationVehicles();
      } else {
        this.allOperations = [];
        this.operationsVehicle = [];
      }
      this.dashboardService.setSearchOperation();
      this.showSkeletonBodyNotInit(500);
    });

    this.dashboardService.getObserverSearchOperation().subscribe(filter => {
      this.loadOperationVehicles();
      this.loadIconDashboard(this.operationsVehicle);
      this.loadIconSearch();
      this.filterDashboard = filter;
      this.operations = this.filterOperations(filter, this.operationsVehicle);
      this.detector.detectChanges();
    });
  }

  ionViewDidEnter() {
    if (this.initLoaded) {
      this.showSkeleton();
    }
  }

  /** MODALS */

  openOperationModal(
      row: OperationModel = new OperationModel({
          vehicle: this.vehicles.find(x => x.id === this.vehicleSelected)
        }), create: boolean = true) {
    this.controlService.openModal(PageEnum.OPERATION, AddEditOperationComponent, new ModalInputModel<OperationModel>({
        isCreate: create,
        data: row,
        parentPage: PageEnum.OPERATION
      }));
  }

  openDashboardOperation() {
    if (this.operationsVehicle.length === 0) {
      this.showModalInfoOperation();
    } else {
      this.controlService.openModal(PageEnum.OPERATION, DashboardComponent, new ModalInputModel<any, OperationModel>({
          dataList: this.operationsVehicle,
          parentPage: PageEnum.OPERATION
        }));
    }
  }

  deleteOperation(row: OperationModel) {
    this.showConfirmDelete(row);
  }

  showModalInfoVehicle() {
    this.controlService.showToast(PageEnum.OPERATION, ToastTypeEnum.INFO, 'ALERT.AddVehicleToAddOperation', Constants.DELAY_TOAST_NORMAL);
  }

  showModalInfoOperation() {
    this.controlService.showToast(PageEnum.OPERATION, ToastTypeEnum.INFO, 'ALERT.AddOperationToExpenses', Constants.DELAY_TOAST_NORMAL);
  }

  showConfirmDelete(row: OperationModel) {
    this.controlService.showConfirm(PageEnum.OPERATION, this.translator.instant('COMMON.OPERATION'),
      this.translator.instant('PAGE_OPERATION.ConfirmDeleteOperation', {operation: row.description}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.operationService.saveOperation(row, ActionDBEnum.DELETE).then(x => {
            this.controlService.showToast(PageEnum.OPERATION, ToastTypeEnum.SUCCESS,
              'PAGE_OPERATION.DeleteSaveOperation', {operation: row.description});
          }).catch(e => {
            this.controlService.showToast(PageEnum.OPERATION, ToastTypeEnum.DANGER, 'PAGE_OPERATION.ErrorSaveOperation');
          });
        }
      }
    );
  }

  showPopover(ev: any) {
    this.controlService.showPopover(PageEnum.OPERATION, ev, SearchDashboardPopOverComponent,
      new ModalInputModel({ parentPage: PageEnum.OPERATION }));
  }

  /** METHODS */

  calculatePriceOperation(op: OperationModel): number {
    let totalPrice: number = op.price;
    if (!!op.listMaintenanceElement && op.listMaintenanceElement.length > 0) {
      totalPrice += this.commonService.sum(op.listMaintenanceElement, ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE);
    }
    return this.commonService.round(totalPrice, 100);
  }

  segmentChanged(event: any): void {
    this.showSkeletonBodyNotInit(500);
    this.vehicleSelected = Number(event.detail.value);
    this.loadOperationVehicles();
    this.operations = this.filterOperations(this.filterDashboard, this.allOperations.filter(x => x.vehicle.id === Number(event.detail.value)));
    this.loadIconDashboard(this.operations);
  }

  activeSegmentScroll(): boolean {
    return this.controlService.activeSegmentScroll(this.vehicles.length);
  }

  filterOperations(filter: SearchDashboardModel, operations: OperationModel[]): OperationModel[] {
    const filteredText: string = filter.searchText.toLowerCase();
    const dataFiltered: OperationModel[] = operations.filter(op =>
      (op.description.toLowerCase().includes(filteredText) || op.details.toLowerCase().includes(filteredText) ||
      op.owner.toLowerCase().includes(filteredText) || (op.location !== null && op.location.toLowerCase().includes(filteredText))) &&
      (filter.searchOperationType.length === 0 || filter.searchOperationType.some(y => y.id === op.operationType.id)) &&
      (filter.searchMaintenanceElement.length === 0 ||
        filter.searchMaintenanceElement.some(y => op.listMaintenanceElement.some(z => y.id === z.id)))
    );
    return this.commonService.orderBy(dataFiltered, ConstantsColumns.COLUMN_MTM_OPERATION_KM, true);
  }

  loadOperationVehicles(): void {
    this.operationsVehicle = this.allOperations.filter(op => op.vehicle.id === this.vehicleSelected);
  }

  /** ICONS */

  loadIconDashboard(operations: OperationModel[]): void {
    this.iconNameHeaderLeft = this.iconService.loadIconDashboard<OperationModel>(operations);
  }

  loadIconSearch() {
    this.iconFilter = this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(PageEnum.OPERATION));
  }

  /* SKELETON */

  showSkeleton() {
    this.showSkeletonHeader(1000);
    this.showSkeletonBody(1000);
  }

  showSkeletonHeader(time: number) {
    this.loadedHeader = false;
    setTimeout(() => { this.loadedHeader = true; this.initLoaded = false; }, time);
  }

  showSkeletonBodyNotInit(time: number) {
    this.loadedBody = false;
    if(!this.initLoaded) {
      this.showSkeletonBody(time);
    }
  }

  showSkeletonBody(time: number) {
    setTimeout(() => { this.loadedBody = true; }, time);
  }
}
