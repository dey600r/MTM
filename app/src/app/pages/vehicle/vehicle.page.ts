import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, ConstantsColumns, PageEnum, Constants } from '@utils/index';
import { DataBaseService, VehicleService, CommonService, ControlService, DashboardService, SettingsService } from '@services/index';
import { VehicleModel, ModalInputModel, ModalOutputModel, OperationModel } from '@models/index';

// COMPONENTS
import { AddEditVehicleComponent } from '@modals/add-edit-vehicle/add-edit-vehicle.component';
import { DashboardComponent } from '@modals/dashboard/dashboard.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: 'vehicle.page.html',
  styleUrls: ['vehicle.page.scss', '../../app.component.scss']
})
export class VehiclePage implements OnInit {

  // MODAL
  dataReturned: ModalOutputModel;

  // MODEL
  rowSelected: VehicleModel = new VehicleModel();
  activateInfo = false;

  // DATA
  vehicles: VehicleModel[] = [];
  operations: OperationModel[] = [];
  loaded = false;
  measure: any = {};

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private vehicleService: VehicleService,
              private commonService: CommonService,
              private controlService: ControlService,
              private dashboardService: DashboardService,
              private settingsService: SettingsService,
              private detector: ChangeDetectorRef) {
      this.platform.ready().then(() => {
        let userLang = navigator.language.split('-')[0];
        userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
        this.translator.use(userLang);
      });
  }

  /** INIT */

  ngOnInit() {
    this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });

    this.dbService.getVehicles().subscribe(data => {
      if (!!data && data.length > 0) {
        if (this.dashboardService.getSearchDashboard().searchVehicle.brand === null ||
          data.length === this.vehicles.length - 1) {
          this.dashboardService.setSearchOperation(data[0]);
        } else if (data.length === this.vehicles.length + 1) {
          // Insert new vehicle, change filter to easy
          this.dashboardService.setSearchOperation(data.find(x => !this.vehicles.some(y => x.id === y.id)));
        }
      } else {
        this.dashboardService.setSearchOperation();
      }
      this.vehicles = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND);
      this.detector.detectChanges();
    });

    this.dbService.getOperations().subscribe(op => {
      this.operations = op;
    });

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

  /** MODALS */

  openVehicleModal(row: VehicleModel = new VehicleModel(), create: boolean = true) {
    this.rowSelected = row;
    this.controlService.openModal(PageEnum.VEHICLE,
      AddEditVehicleComponent, new ModalInputModel(create, this.rowSelected, [], PageEnum.VEHICLE));
  }

  deleteVehicle(row: VehicleModel) {
    this.rowSelected = row;
    this.showConfirmDelete();
  }

  openDashboardVehicle() {
    this.controlService.openModal(PageEnum.VEHICLE,
      DashboardComponent, new ModalInputModel(false, null, this.operations, PageEnum.VEHICLE));
  }

  showModalInfo() {
    this.controlService.showToast(PageEnum.VEHICLE, 'ALERT.AddVehicleToExpenses', Constants.DELAY_TOAST_NORMAL);
  }

  changeFilterOperation(idVehicle: number) {
    this.dashboardService.setSearchOperation(this.vehicles.find(x => x.id === idVehicle));
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
          this.vehicleService.saveVehicle(this.rowSelected, ActionDBEnum.DELETE, ops).then(x => {
            this.controlService.showToast(PageEnum.VEHICLE, 'PAGE_VEHICLE.DeleteSaveVehicle',
              { vehicle: `${this.rowSelected.brand} ${this.rowSelected.model}` });
          }).catch(e => {
            this.controlService.showToast(PageEnum.VEHICLE, 'PAGE_VEHICLE.ErrorSaveVehicle');
          });
        }
      }
    );
  }

  getIconVehicle(vehicle: VehicleModel): string {
    return this.vehicleService.getIconVehicle(vehicle);
  }

}
