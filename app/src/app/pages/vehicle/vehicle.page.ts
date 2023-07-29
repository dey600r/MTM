import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, ConstantsColumns, PageEnum, Constants, ToastTypeEnum, InfoButtonEnum } from '@utils/index';
import { DataBaseService, VehicleService, CommonService, ControlService, DashboardService, SettingsService, IconService } from '@services/index';
import { VehicleModel, ModalInputModel, ModalOutputModel, OperationModel, IInfoModel, ISettingModel } from '@models/index';

// COMPONENTS
import { AddEditVehicleComponent } from '@modals/add-edit-vehicle/add-edit-vehicle.component';
import { DashboardComponent } from '@modals/dashboard/dashboard.component';
import { InfoVehicleComponent } from '@modals/info-vehicle/info-vehicle.component';
import { BasePage } from '@pages/base.page';

@Component({
  selector: 'app-vehicle',
  templateUrl: 'vehicle.page.html',
  styleUrls: ['vehicle.page.scss']
})
export class VehiclePage extends BasePage implements OnInit {

  // MODAL
  input: ModalInputModel = new ModalInputModel();
  dataReturned: ModalOutputModel;

  // DATA
  vehicles: VehicleModel[] = [];
  operations: OperationModel[] = [];
  initLoaded = true;
  loadedHeader = false;
  loadedBody = false;
  measure: ISettingModel;
  iconNameHeaderLeft = '';

  constructor(public platform: Platform,
              private dbService: DataBaseService,
              public translator: TranslateService,
              private vehicleService: VehicleService,
              private commonService: CommonService,
              private controlService: ControlService,
              private dashboardService: DashboardService,
              private settingsService: SettingsService,
              private detector: ChangeDetectorRef,
              private iconService: IconService) {
      super(platform, translator);
  }

  /** INIT */

  ngOnInit() {
    this.initPage();
  }

  ionViewDidEnter() {
    if (this.initLoaded) {
      this.showSkeleton();
    }
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

    this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });

    this.dbService.getVehicles().subscribe(data => {
      if (!data || data.length === 0) {
        this.dashboardService.setSearchOperation();
      }
      this.vehicles = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND);
      this.loadIconDashboard();
      this.showSkeletonBodyNotInit(500);
      this.detector.detectChanges();
    });

    this.dbService.getOperations().subscribe(op => {
      this.operations = op;
    });
  }

  /** MODALS */

  openVehicleModal(row: VehicleModel = new VehicleModel(), create: boolean = true) {
    this.controlService.openModal(PageEnum.VEHICLE, AddEditVehicleComponent, new ModalInputModel<VehicleModel>({
        isCreate: create,
        data: row,
        parentPage: PageEnum.VEHICLE
      }));
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
      this.controlService.openModal(PageEnum.VEHICLE, DashboardComponent, new ModalInputModel<any, OperationModel>({
          isCreate: false,
          dataList: this.operations,
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
      this.translator.instant(message, {vehicle: `${row.brand} ${row.model}`}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.vehicleService.saveVehicle([row], ActionDBEnum.DELETE, ops).then(x => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.SUCCESS, 'PAGE_VEHICLE.DeleteSaveVehicle',
              { vehicle: `${row.brand} ${row.model}` });
          }).catch(e => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle');
          });
        }
      }
    );
  }

  activateNotificationVehicle(itemSliding: any, vehicle: VehicleModel) {
    let vehicleToSave: VehicleModel = vehicle;
    const message: string = (vehicleToSave.active ? 'PAGE_VEHICLE.ConfirmDesactivateNotificationVehicle' : 'PAGE_VEHICLE.ConfirmActivateNotificationVehicle');
    this.controlService.showConfirm(PageEnum.VEHICLE, this.translator.instant('COMMON.VEHICLES'),
      this.translator.instant(message, {vehicle: `${vehicleToSave.brand} ${vehicleToSave.model}`}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          const resMsg: string = (vehicleToSave.active ? 'PAGE_VEHICLE.DesactivatedNotificationVehicle' : 'PAGE_VEHICLE.ActivatedNotificationVehicle');
          vehicleToSave.active = !vehicleToSave.active;
          this.vehicleService.saveVehicle([vehicleToSave], ActionDBEnum.UPDATE).then(x => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.SUCCESS, resMsg);
          }).catch(e => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle');
          });
        }
      }
    );
    if (itemSliding) { itemSliding.close(); }
  }

  loadIconDashboard(): void {
    this.iconNameHeaderLeft = this.iconService.loadIconDashboard<VehicleModel>(this.vehicles);
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
