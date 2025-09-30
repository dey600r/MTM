import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

// UTILS
import { 
  ActionDBEnum, ConstantsColumns, PageEnum, Constants, ToastTypeEnum, InfoButtonEnum, ModalTypeEnum, HeaderOutputEnum, 
  VehicleSkeletonSetting
} from '@utils/index';
import { DataService, VehicleService, CommonService, ControlService, DashboardService, SettingsService, IconService } from '@services/index';
import { 
  VehicleModel, ModalInputModel, ModalOutputModel, OperationModel, IInfoModel, ISettingModel, 
  DashboardInputModal, HeaderInputModel, HeaderOutputModel, HeaderSegmentInputModel,
  SkeletonInputModel
} from '@models/index';

// COMPONENTS
import { AddEditVehicleComponent } from '@modals/add-edit-vehicle/add-edit-vehicle.component';
import { DashboardComponent } from '@modals/dashboard/dashboard.component';
import { InfoVehicleComponent } from '@modals/info-vehicle/info-vehicle.component';
import { BasePage } from '@pages/base.page';

@Component({
    selector: 'app-vehicle',
    templateUrl: 'vehicle.page.html',
    styleUrls: ['vehicle.page.scss'],
    standalone: false
})
export class VehiclePage extends BasePage implements OnInit {

  // INJECTIONS
  private readonly dataService: DataService = inject(DataService);
  private readonly vehicleService: VehicleService = inject(VehicleService);
  private readonly commonService: CommonService = inject(CommonService);
  private readonly controlService: ControlService = inject(ControlService);
  private readonly dashboardService: DashboardService = inject(DashboardService);
  private readonly settingsService: SettingsService = inject(SettingsService);
  private readonly detector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly iconService: IconService = inject(IconService);

  // MODAL
  input: ModalInputModel = new ModalInputModel();
  skeletonInput: SkeletonInputModel = VehicleSkeletonSetting;
  headerInput: HeaderInputModel = new HeaderInputModel();
  dataReturned: ModalOutputModel;

  // DATA
  vehicles: VehicleModel[] = [];
  operations: OperationModel[] = [];
  loadedHeader = false;
  loadedBody = false;
  measure: ISettingModel;

  constructor() {
      super();
  }

  /** INIT */

  ngOnInit() {
    this.initPage();
  }

  /** INIT */
  initPage() {
    this.input = new ModalInputModel<IInfoModel>({
        parentPage: PageEnum.VEHICLE,
        data: {
          text: 'ALERT.VehicleEmpty',
          icon: 'home',
          info: InfoButtonEnum.NONE
        }
      });

    this.dataService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });

    this.dataService.getVehicles().subscribe(data => {
      if (!data || data.length === 0) {
        this.dashboardService.setSearchOperation();
      }
      this.vehicles = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND);
      this.loadHeader(this.iconService.loadIconDashboard<VehicleModel>(this.vehicles));
      this.changeLoadedBody(false);
      this.detector.detectChanges();
    });

    this.dataService.getOperations().subscribe(op => {
      this.operations = op;
    });
  }

  /** MODALS */

  private openVehicleModal(row: VehicleModel, type: ModalTypeEnum) {
    this.controlService.openModal(PageEnum.VEHICLE, AddEditVehicleComponent, new ModalInputModel<VehicleModel>({
        type: type,
        data: row,
        parentPage: PageEnum.VEHICLE
      }));
  }

  openCreateVehicleModal() {
    this.openVehicleModal(new VehicleModel(), ModalTypeEnum.CREATE);
  }

  openUpdateVehicleModal(row: VehicleModel) {
    this.openVehicleModal(row, ModalTypeEnum.UPDATE);
  }

  openInfoVehicle() {
    if (this.vehicles.length === 0) {
      this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.INFO, 'ALERT.AddVehicleToInfo', Constants.DELAY_TOAST_NORMAL);
    }
    else {
      this.controlService.openModal(PageEnum.VEHICLE, InfoVehicleComponent, new ModalInputModel<any, VehicleModel>({
          dataList: this.vehicles,
          parentPage: PageEnum.VEHICLE
        }));
    }
  }

  deleteVehicle(row: VehicleModel) {
    this.showConfirmDelete(row);
  }

  openDashboardVehicle() {
    if (this.vehicles.length === 0) {
      this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.INFO, 'ALERT.AddVehicleToExpenses', Constants.DELAY_TOAST_NORMAL);
    } else {
      this.controlService.openModal(PageEnum.VEHICLE, DashboardComponent, new ModalInputModel<Partial<DashboardInputModal>>({
          type: ModalTypeEnum.UPDATE,
          data: {
            operations: this.operations
          },
          parentPage: PageEnum.VEHICLE
        }));
    }
  }

  showConfirmDelete(row: VehicleModel) {
    let ops: OperationModel[] = [];
    if (!!this.operations && this.operations.length > 0) {
      ops = this.operations.filter(x => x.vehicle.id === row.id);
    }
    const message: string = (!!ops && ops.length > 0 ?
      'PAGE_VEHICLE.ConfirmDeleteVehicleOperation' : 'PAGE_VEHICLE.ConfirmDeleteVehicle');

    this.controlService.showConfirm(PageEnum.VEHICLE, this.translator.instant('COMMON.VEHICLES'),
      this.translator.instant(message, {vehicle: row.$getName}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.vehicleService.saveVehicle([row], ActionDBEnum.DELETE, ops).then(x => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.SUCCESS, 'PAGE_VEHICLE.DeleteSaveVehicle',
              { vehicle: row.$getName });
          }).catch(e => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle', e);
          });
        }
      }
    );
  }

  activateNotificationVehicle(itemSliding: any, vehicle: VehicleModel) {
    let vehicleToSave: VehicleModel = vehicle;
    const message: string = (vehicleToSave.active ? 'PAGE_VEHICLE.ConfirmDesactivateNotificationVehicle' : 'PAGE_VEHICLE.ConfirmActivateNotificationVehicle');
    this.controlService.showConfirm(PageEnum.VEHICLE, this.translator.instant('COMMON.VEHICLES'),
      this.translator.instant(message, {vehicle: vehicleToSave.$getName}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          const resMsg: string = (vehicleToSave.active ? 'PAGE_VEHICLE.DesactivatedNotificationVehicle' : 'PAGE_VEHICLE.ActivatedNotificationVehicle');
          vehicleToSave.active = !vehicleToSave.active;
          this.vehicleService.saveVehicle([vehicleToSave], ActionDBEnum.UPDATE).then(x => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.SUCCESS, resMsg);
          }).catch(e => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle', e);
          });
        }
      }
    );
    if (itemSliding) { itemSliding.close(); }
  }

  /* HEADER */

  loadHeader(iconLeft: string): void {
    this.headerInput = new HeaderInputModel({
      title: 'COMMON.GARAGE',
      iconButtonLeft: iconLeft,
      iconButtonRight: 'analytics',
      dataSegment: [new HeaderSegmentInputModel({
        id: 1,
        name: 'PAGE_VEHICLE.YOURS_VEHICLES',
        icon: 'home',
        selected: true
      })]
    });
  }

  eventEmitHeader(output: HeaderOutputModel) {
    switch(output.type) {
      case HeaderOutputEnum.BUTTON_LEFT:
        this.openDashboardVehicle();
        break;
      case HeaderOutputEnum.BUTTON_RIGHT:
        this.openInfoVehicle();
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
