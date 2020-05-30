import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, ConstantsColumns, Constants, PageEnum } from '@utils/index';
import { ModalInputModel, ModalOutputModel, VehicleModel, ConfigurationModel, OperationModel, VehicleTypeModel } from '@models/index';
import {
  DataBaseService, VehicleService, CommonService, CalendarService, ControlService, DashboardService
} from '@services/index';

@Component({
  selector: 'app-add-edit-vehicle',
  templateUrl: 'add-edit-vehicle.component.html',
  styleUrls: ['../../../app.component.scss']
})
export class AddEditVehicleComponent implements OnInit, OnDestroy {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  // MODEL FORM
  vehicle: VehicleModel = new VehicleModel();
  submited = false;

  // DATA
  configurations: ConfigurationModel[] = [];
  operations: OperationModel[] = [];
  vehicleTypes: VehicleTypeModel[] = [];
  formatDate = this.calendarService.getFormatCalendar();

  // SUBSCRIPTION
  operationSubscription: Subscription = new Subscription();
  configurationSubscription: Subscription = new Subscription();
  vehicleTypeSubscription: Subscription = new Subscription();

  // TRANSLATE
  translateYearBetween = '';
  translateSelect = '';

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private translator: TranslateService,
    private vehicleService: VehicleService,
    private commonService: CommonService,
    private calendarService: CalendarService,
    private controlService: ControlService,
    private dashboardService: DashboardService
  ) {
    this.translateYearBetween = this.translator.instant('PAGE_VEHICLE.AddYearBetween', { year: new Date().getFullYear()});
    this.translateSelect = this.translator.instant('COMMON.SELECT');
  }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);
    this.vehicle = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.isCreate) {
      this.vehicle.id = -1;
      this.vehicle.datePurchase = this.calendarService.getDateStringToDB(new Date());
    }

    this.configurationSubscription = this.dbService.getConfigurations().subscribe(data => {
      this.configurations = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    });

    this.vehicleTypeSubscription = this.dbService.getVehicleType().subscribe(data => {
      if (!!data && data.length > 0 && this.modalInputModel.isCreate) {
        this.vehicle.vehicleType = new VehicleTypeModel(data[0].code, data[0].description, data[0].id);
      }
      this.vehicleTypes = data;
    });

    this.operationSubscription = this.dbService.getOperations().subscribe(data => {
      // Filter to get less elemnts to better perfomance
      this.operations = data.filter(x => x.vehicle.id === this.vehicle.id);
    });
  }

  ngOnDestroy() {
    this.configurationSubscription.unsubscribe();
    this.operationSubscription.unsubscribe();
    this.vehicleTypeSubscription.unsubscribe();
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      const result = this.validateDateAndKmToOperations();
      if (result !== '') {
        this.controlService.showToast(PageEnum.MODAL_VEHICLE, result, null, Constants.DELAY_TOAST_HIGHER);
      } else {
        // Save date to change km to calculate maintenance
        if (!this.modalInputModel.isCreate && this.modalInputModel.data.km !== this.vehicle.km) {
          this.vehicle.dateKms = new Date();
        }
        this.vehicleService.saveVehicle(this.vehicle,
          (this.modalInputModel.isCreate ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
          this.closeModal();
          if (this.vehicle.id !== -1) { // Change filter operation to easy
            this.dashboardService.setSearchOperation(this.vehicle);
          }
          this.controlService.showToast(PageEnum.MODAL_VEHICLE, (
            this.modalInputModel.isCreate ? 'PAGE_VEHICLE.AddSaveVehicle' : 'PAGE_VEHICLE.EditSaveVehicle'),
            { vehicle: this.vehicle.model });
        }).catch(e => {
          this.controlService.showToast(PageEnum.MODAL_VEHICLE, 'PAGE_VEHICLE.ErrorSaveVehicle');
        });
      }
    }
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  isValidForm(f: any): boolean {
    return this.isValidBrand(f) && this.isValidModel(f) && this.isValidYearBetween(f) &&
           this.isValidKmMin(f) && this.isValidConfiguration(f) && this.isValidVehicleType(f);
  }

  isValidBrand(f: any): boolean {
    return f.vehicleBrand !== undefined && f.vehicleBrand.validity.valid;
  }

  isValidModel(f: any): boolean {
    return f.vehicleModel !== undefined && f.vehicleModel.validity.valid;
  }

  isValidYear(f: any): boolean {
    return f.vehicleYear !== undefined && f.vehicleYear.validity.valid;
  }

  isValidYearBetween(f: any): boolean {
    return this.isValidYear(f) && f.vehicleYear.valueAsNumber >= 1900 &&
      f.vehicleYear.valueAsNumber <= new Date().getFullYear();
  }

  isValidKm(f: any): boolean {
    return f.vehicleKm !== undefined && f.vehicleKm.validity.valid;
  }

  isValidDate(f: any): boolean {
    return f.vehicleDate !== undefined && f.vehicleDate.validity.valid;
  }

  isValidKmMin(f: any): boolean {
    return this.isValidKm(f) && f.vehicleKm.valueAsNumber > 0;
  }

  isValidConfiguration(f: any): boolean {
    return f.vehicleConfiguration !== undefined && f.vehicleConfiguration.validity.valid;
  }

  isValidVehicleType(f: any): boolean {
    return f.vehicleType !== undefined && f.vehicleType.validity.valid;
  }

  validateDateAndKmToOperations(): string {
    let msg = '';

    if (!!this.operations && this.operations.length > 0) {
      const purchase: Date = new Date(this.vehicle.datePurchase);
      if (this.operations.some(x => this.vehicle.km < x.km)) {
        msg = this.translator.instant('PAGE_VEHICLE.AddKmHigher',
        { km: this.commonService.max(this.operations, ConstantsColumns.COLUMN_MTM_OPERATION_KM)});
      } else if (this.operations.some(x => purchase > new Date(x.date))) {
        msg = this.translator.instant('PAGE_OPERATION.AddDateLower',
        { dateFin: this.calendarService.getDateString(
            this.commonService.min(this.operations, ConstantsColumns.COLUMN_MTM_OPERATION_DATE))});
      }
    }

    return msg;
  }
}
