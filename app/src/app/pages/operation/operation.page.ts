import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';

// LIBRARIES

// UTILS
import {
  DataService, CommonService, OperationService, ControlService,
  DashboardService, SettingsService, IconService
} from '@services/index';
import {
  OperationModel, VehicleModel, ModalInputModel, ModalOutputModel, SearchDashboardModel, IInfoModel, ISettingModel,
  OperationTypeModel, DashboardInputModal, HeaderInputModel, HeaderOutputModel, HeaderSegmentInputModel,
  SkeletonInputModel
} from '@models/index';
import { 
  ConstantsColumns, Constants, ActionDBEnum, PageEnum, ToastTypeEnum, InfoButtonEnum, ModalTypeEnum, HeaderOutputEnum, 
  OperationSkeletonSetting 
} from '@utils/index';

// COMPONENTS
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { SearchDashboardPopOverComponent } from '@src/app/shared/modals/search-dashboard-popover/search-dashboard-popover.component';
import { DashboardComponent } from '@app/shared/modals/dashboard/dashboard.component';
import { BasePage } from '@pages/base.page';

@Component({
    selector: 'app-operation',
    templateUrl: 'operation.page.html',
    styleUrls: ['operation.page.scss'],
    standalone: false
})
export class OperationPage extends BasePage implements OnInit {

  // INJECTIONS
  private readonly dataService: DataService = inject(DataService);
  private readonly commonService: CommonService = inject(CommonService);
  private readonly controlService: ControlService = inject(ControlService);
  private readonly operationService: OperationService = inject(OperationService);
  private readonly dashboardService: DashboardService = inject(DashboardService);
  private readonly settingsService: SettingsService = inject(SettingsService);
  private readonly detector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly iconService: IconService = inject(IconService);

  // MODAL
  input: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
  headerInput: HeaderInputModel = new HeaderInputModel();
  skeletonInput: SkeletonInputModel = OperationSkeletonSetting;
  dataReturned: ModalOutputModel;

  // MODEL
  filterDashboard: SearchDashboardModel = new SearchDashboardModel();

  // DATA
  operations: OperationModel[] = [];
  allOperations: OperationModel[] = [];
  vehicles: VehicleModel[] = [];
  vehicleSelected = -1;
  loadedHeader = false;
  loadedBody = false;
  measure: ISettingModel;
  coin: ISettingModel;

  constructor() {
    super();
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

    this.dataService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
        this.coin = this.settingsService.getMoneySelected(settings);
      }
    });

    this.dataService.getVehicles().subscribe(data => {
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
      this.loadHeader(this.getIconDashboard(this.operations), this.vehicles, this.vehicleSelected);
    });

    this.dataService.getOperations().subscribe(data => {
      this.filterDashboard = this.dashboardService.getSearchDashboard();
      if (!!data && data.length > 0) {
        this.allOperations = data;
      } else {
        this.allOperations = [];
      }
      this.dashboardService.setSearchOperation();
      this.changeLoadedBody(false);
    });

    this.dashboardService.getObserverSearchOperation().subscribe(filter => {
      this.filterDashboard = filter;
      this.operations = this.filterOperations(filter, this.getOperationVehicles());
      this.loadHeaderIconLeft(this.getIconDashboard(this.operations));
      this.loadHeaderIconRight();
      this.detector.detectChanges();
    });
  }

  /** MODALS */
  
  openDashboardOperation() {
    if (this.operations.length === 0) {
      this.showModalInfoOperation();
    } else {
      this.controlService.openModal(PageEnum.OPERATION, DashboardComponent, new ModalInputModel<DashboardInputModal>({
          data: {
            operations: this.allOperations,
            vehicles: this.vehicles,
            vehicleSelected: this.vehicleSelected
          },
          parentPage: PageEnum.OPERATION
        }));
    }
  }

  private openOperationModal(row: OperationModel, type: ModalTypeEnum) {
    this.controlService.openModal(PageEnum.OPERATION, AddEditOperationComponent, new ModalInputModel<OperationModel>({
        type: type,
        data: row,
        parentPage: PageEnum.OPERATION
      }));
  }

  openCreateOperationModal() {
    this.openOperationModal(
      new OperationModel({ vehicle: this.vehicles.find(x => x.id === this.vehicleSelected) }), 
      ModalTypeEnum.CREATE
    );
  }

  openUpdateOperationModal(row: OperationModel) {
    this.openOperationModal(row, ModalTypeEnum.UPDATE)
  }

  openDuplicateOperationModal(itemSliding: any, row: OperationModel) {
    if (itemSliding) { itemSliding.close(); }
    this.openOperationModal(new OperationModel({
      description: row.description,
      details: row.details,
      vehicle: new VehicleModel({ id: row.vehicle.id }),
      operationType: new OperationTypeModel(row.operationType.code, row.operationType.description, row.operationType.id),
      listMaintenanceElement: [...row.listMaintenanceElement],
      date: row.date,
      price: row.price,
      location: row.location,
      owner: row.owner
    }), ModalTypeEnum.DUPLICATE);
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
            this.controlService.showToast(PageEnum.OPERATION, ToastTypeEnum.DANGER, 'PAGE_OPERATION.ErrorSaveOperation', e);
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
    this.changeLoadedBody(false);
    this.vehicleSelected = Number(event.detail.value);
    this.operations = this.filterOperations(this.filterDashboard, this.getOperationVehicles());
    this.loadHeaderIconLeft(this.getIconDashboard(this.operations));
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

  getOperationVehicles(): OperationModel[] {
    return this.allOperations.filter(op => op.vehicle.id === this.vehicleSelected);
  }

  getIconDashboard(operation: OperationModel[]): string {
    return this.iconService.loadIconDashboard<OperationModel>(operation);
  }
  getIconSearch(): string {
    return this.iconService.loadIconSearch(this.dashboardService.isEmptySearchDashboard(PageEnum.OPERATION));
  }

  /* HEADER */

  loadHeaderIconLeft(icon: string) {
    if(this.headerInput.iconButtonLeft !== icon) {
      this.headerInput.iconButtonLeft = icon;
    }
  }

  loadHeaderIconRight() {
    const icon = this.getIconSearch();
    if(this.headerInput.iconButtonRight !== icon) {
      this.headerInput.iconButtonRight = icon;
    }
  }

  loadHeader(iconLeft: string, vehicles: VehicleModel[], idVehicleSelected: number): void {
    this.headerInput = new HeaderInputModel({
      title: 'COMMON.OPERATIONS',
      iconButtonLeft: iconLeft,
      iconButtonRight: this.getIconSearch(),
      dataSegment: vehicles.map(x => new HeaderSegmentInputModel({
        id: x.id,
        name: x.$getName,
        icon: x.vehicleType.icon,
        selected: (x.id === idVehicleSelected)
      }))
    });
  }

  eventEmitHeader(output: HeaderOutputModel) {
    switch(output.type) {
      case HeaderOutputEnum.BUTTON_LEFT:
        this.openDashboardOperation();
        break;
      case HeaderOutputEnum.BUTTON_RIGHT:
        this.showPopover(output.data);
        break;
      case HeaderOutputEnum.SEGMENT:
        this.segmentChanged(output.data);
        break;
    }
  }

  /* SKELETON */

  changeLoadedHeader(load: boolean) {
    this.loadedHeader = load;
    this.skeletonInput.time = this.skeletonInput.time / 2;
  }

  changeLoadedBody(load: boolean) {
    this.loadedBody = load;
  }
}
