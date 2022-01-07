import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, ConstantsColumns, PageEnum, Constants, ToastTypeEnum } from '@utils/index';
import { DataBaseService, VehicleService, CommonService, ControlService, DashboardService, SettingsService } from '@services/index';
import { VehicleModel, ModalInputModel, ModalOutputModel, OperationModel } from '@models/index';

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

  // MODEL
  rowSelected: VehicleModel = new VehicleModel();

  // DATA
  vehicles: VehicleModel[] = [];
  operations: OperationModel[] = [];
  loaded = false;
  measure: any = {};
  iconNameHeaderLeft = '';

  constructor(public platform: Platform,
              private dbService: DataBaseService,
              public translator: TranslateService,
              private vehicleService: VehicleService,
              private commonService: CommonService,
              private controlService: ControlService,
              private dashboardService: DashboardService,
              private settingsService: SettingsService,
              private detector: ChangeDetectorRef) {
      super(platform, translator);
  }

  /** INIT */

  ngOnInit() {
    this.initPage();
  }

  ionViewDidEnter() {
    if (document.getElementById('custom-overlay').style.display === 'flex' ||
    document.getElementById('custom-overlay').style.display === '') {
      document.getElementById('custom-overlay').style.display = 'none';
    }
    if (!this.loaded) {
      setTimeout(() => { this.loaded = true; }, 1000);
    }
  }

  /** INIT */
  initPage() {
    this.input = new ModalInputModel(false, null, [], PageEnum.HOME, Constants.STATE_INFO_VEHICLE_EMPTY);

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
      this.detector.detectChanges();
    });

    this.dbService.getOperations().subscribe(op => {
      this.operations = op;
    });
  }

  /** MODALS */

  openVehicleModal(row: VehicleModel = new VehicleModel(), create: boolean = true) {
    this.rowSelected = row;
    this.controlService.openModal(PageEnum.VEHICLE,
      AddEditVehicleComponent, new ModalInputModel(create, this.rowSelected, [], PageEnum.VEHICLE));
  }

  openInfoVehicle() {
    if (this.vehicles.length === 0) {
      this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.INFO, 'ALERT.AddVehicleToInfo', Constants.DELAY_TOAST_NORMAL);
    }
    else {
      this.controlService.openModal(PageEnum.VEHICLE,
          InfoVehicleComponent, new ModalInputModel(true, null, this.vehicles, PageEnum.VEHICLE));
    }
  }

  deleteVehicle(row: VehicleModel) {
    this.rowSelected = row;
    this.showConfirmDelete();
  }

  openDashboardVehicle() {
    if (this.vehicles.length === 0) {
      this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.INFO, 'ALERT.AddVehicleToExpenses', Constants.DELAY_TOAST_NORMAL);
    } else {
      this.controlService.openModal(PageEnum.VEHICLE,
        DashboardComponent, new ModalInputModel(false, null, this.operations, PageEnum.VEHICLE));
    }
  }

  showConfirmDelete() {
    let ops: OperationModel[] = [];
    if (!!this.operations && this.operations.length > 0) {
      ops = this.operations.filter(x => x.vehicle.id === this.rowSelected.id);
    }
    const message: string = (!!ops && ops.length > 0 ?
      'PAGE_VEHICLE.ConfirmDeleteVehicleOperation' : 'PAGE_VEHICLE.ConfirmDeleteVehicle');

    this.controlService.showConfirm(PageEnum.VEHICLE, this.translator.instant('COMMON.VEHICLES'),
      this.translator.instant(message, {vehicle: `${this.rowSelected.brand} ${this.rowSelected.model}`}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.vehicleService.saveVehicle([this.rowSelected], ActionDBEnum.DELETE, ops).then(x => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.SUCCESS, 'PAGE_VEHICLE.DeleteSaveVehicle',
              { vehicle: `${this.rowSelected.brand} ${this.rowSelected.model}` });
          }).catch(e => {
            this.controlService.showToast(PageEnum.VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle');
          });
        }
      }
    );
  }

  getIconVehicle(vehicle: VehicleModel): string {
    return this.vehicleService.getIconVehicle(vehicle);
  }

  activateNotificationVehicle(itemSliding: any, vehicle: VehicleModel) {
    this.rowSelected = vehicle;
    const message: string = (this.rowSelected.active ? 'PAGE_VEHICLE.ConfirmDesactivateNotificationVehicle' : 'PAGE_VEHICLE.ConfirmActivateNotificationVehicle');
    this.controlService.showConfirm(PageEnum.VEHICLE, this.translator.instant('COMMON.VEHICLES'),
      this.translator.instant(message, {vehicle: `${this.rowSelected.brand} ${this.rowSelected.model}`}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          const resMsg: string = (this.rowSelected.active ? 'PAGE_VEHICLE.DesactivatedNotificationVehicle' : 'PAGE_VEHICLE.ActivatedNotificationVehicle');
          this.rowSelected.active = !this.rowSelected.active;
          this.vehicleService.saveVehicle([this.rowSelected], ActionDBEnum.UPDATE).then(x => {
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
    this.iconNameHeaderLeft = this.vehicleService.loadIconDashboard<VehicleModel>(this.vehicles);
  }

}
