import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
  DataBaseService, CommonService, OperationService, ControlService,
  DashboardService, SettingsService, VehicleService
} from '@services/index';
import {
  OperationModel, VehicleModel, ModalInputModel, ModalOutputModel,
  OperationTypeModel, SearchDashboardModel
} from '@models/index';
import { ConstantsColumns, Constants, ActionDBEnum, PageEnum, ToastTypeEnum } from '@utils/index';

// COMPONENTS
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';
import { DashboardComponent } from '@app/shared/modals/dashboard/dashboard.component';
import { BasePage } from '@pages/base.page';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss']
})
export class OperationPage extends BasePage implements OnInit {

  // MODAL
  input: ModalInputModel = new ModalInputModel();
  dataReturned: ModalOutputModel;

  // MODEL
  filterDashboard: SearchDashboardModel = new SearchDashboardModel();

  // DATA
  operations: OperationModel[] = [];
  operationsVehicle: OperationModel[] = [];
  allOperations: OperationModel[] = [];
  vehicles: VehicleModel[] = [];
  vehicleSelected = -1;
  loadedHeader = false;
  loadedBody = false;
  iconNameHeaderLeft = 'bar-chart';
  measure: any = {};
  coin: any = {};

  constructor(public platform: Platform,
              private dbService: DataBaseService,
              public translator: TranslateService,
              private commonService: CommonService,
              private controlService: ControlService,
              private vehicleService: VehicleService,
              private operationService: OperationService,
              private dashboardService: DashboardService,
              private settingsService: SettingsService,
              private detector: ChangeDetectorRef) {
    super(platform, translator);
  }

  ngOnInit(): void {
      this.initPage();
  }

  /** INIT */

  initPage() {

    this.input = new ModalInputModel(false, null, [], PageEnum.HOME, Constants.STATE_INFO_OPERATION_EMPTY);

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
        this.operationsVehicle = this.allOperations.filter(x => x.vehicle.id === this.vehicleSelected);
      } else {
        this.allOperations = [];
        this.operationsVehicle = [];
      }
      this.dashboardService.setSearchOperation();
    });

    this.dashboardService.getObserverSearchOperation().subscribe(filter => {
      this.loadOperationVehicles();
      this.loadIconDashboard(this.operationsVehicle);
      this.filterDashboard = filter;
      this.operations = this.commonService.orderBy(this.filterOperations(filter, this.operationsVehicle),
        ConstantsColumns.COLUMN_MTM_OPERATION_KM, true);
      this.detector.detectChanges();
    });
  }

  ionViewDidEnter() {
    if (document.getElementById('custom-overlay').style.display === 'flex' ||
    document.getElementById('custom-overlay').style.display === '') {
      document.getElementById('custom-overlay').style.display = 'none';
    }
    if (!this.loadedHeader || !this.loadedBody) {
      setTimeout(() => {
        this.loadedHeader = true;
        this.loadedBody = true;
      }, 1000);
    }
  }

  /** MODALS */

  openOperationModal(
      row: OperationModel = new OperationModel(null, null, new OperationTypeModel(),
      this.vehicles.find(x => x.id === this.vehicleSelected)),
      create: boolean = true) {
    this.controlService.openModal(PageEnum.OPERATION,
      AddEditOperationComponent, new ModalInputModel(create, row, [], PageEnum.OPERATION));
  }

  openDashboardOperation() {
    if (this.operationsVehicle.length === 0) {
      this.showModalInfoOperation();
    } else {
      this.controlService.openModal(PageEnum.OPERATION,
        DashboardComponent, new ModalInputModel(true, null, this.operationsVehicle, PageEnum.OPERATION));
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
      new ModalInputModel(true, null, [], PageEnum.OPERATION));
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
    this.loadedBody = false;
    setTimeout(() => {
      this.loadedBody = true;
    }, 500);
    this.vehicleSelected = Number(event.detail.value);
    this.loadOperationVehicles();
    this.operations = this.commonService.orderBy(this.filterOperations(this.filterDashboard,
      this.allOperations.filter(x => x.vehicle.id === Number(event.detail.value))),
        ConstantsColumns.COLUMN_MTM_OPERATION_KM, true);
    this.loadIconDashboard(this.operations);
  }

  activeSegmentScroll(): boolean {
    return this.controlService.activeSegmentScroll(this.vehicles.length);
  }

  filterOperations(filter: SearchDashboardModel, operations: OperationModel[]): OperationModel[] {
    const filteredText: string = filter.searchText.toLowerCase();
    return operations.filter(op =>
      (op.description.toLowerCase().includes(filteredText) || op.details.toLowerCase().includes(filteredText) ||
      op.owner.toLowerCase().includes(filteredText) || op.location.toLowerCase().includes(filteredText)) &&
      (filter.searchOperationType.length === 0 || filter.searchOperationType.some(y => y.id === op.operationType.id)) &&
      (filter.searchMaintenanceElement.length === 0 ||
        filter.searchMaintenanceElement.some(y => op.listMaintenanceElement.some(z => y.id === z.id)))
    );
  }

  loadOperationVehicles(): void {
    this.operationsVehicle = this.allOperations.filter(op => op.vehicle.id === this.vehicleSelected);
  }

  /** ICONS */

  loadIconDashboard(operations: OperationModel[]): void {
    this.iconNameHeaderLeft = this.vehicleService.loadIconDashboard<OperationModel>(operations);
  }

  getIconInfoDashboard(): string {
    return this.operationsVehicle.length > 0 ? 'bar-chart' : 'information-circle';
  }

  getIconVehicle(vehicle: VehicleModel): string {
    return this.vehicleService.getIconVehicle(vehicle);
  }

  geClassIconOperationType(operation: OperationModel): string {
    return `${Constants.CLASS_ION_ICON_OPERATION_TYPE}${operation.operationType.code}`;
  }

  getIconOperationType(operation: OperationModel): string {
    switch (operation.operationType.code) {
      case Constants.OPERATION_TYPE_MAINTENANCE_HOME:
      case Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP:
        return 'build';
      case Constants.OPERATION_TYPE_FAILURE_HOME:
      case Constants.OPERATION_TYPE_FAILURE_WORKSHOP:
        return 'hammer';
      case Constants.OPERATION_TYPE_CLOTHES:
        return 'shirt';
      case Constants.OPERATION_TYPE_ACCESSORIES:
        return 'gift';
      case Constants.OPERATION_TYPE_TOOLS:
        return 'construct';
      case Constants.OPERATION_TYPE_OTHER:
        return 'body';
      case Constants.OPERATION_TYPE_SPARE_PARTS:
        return 'repeat';
    }
  }
}
