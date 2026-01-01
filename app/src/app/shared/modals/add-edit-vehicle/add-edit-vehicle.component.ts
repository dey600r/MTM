import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, ConstantsColumns, Constants, PageEnum, ToastTypeEnum, ModalTypeEnum } from '@utils/index';
import { ModalInputModel, VehicleModel, ConfigurationModel, OperationModel, VehicleTypeModel, ISettingModel, HeaderInputModel } from '@models/index';
import {
  DataService, VehicleService, UtilsService, CalendarService, ControlService, SettingsService
} from '@services/index';

@Component({
    selector: 'app-add-edit-vehicle',
    templateUrl: 'add-edit-vehicle.component.html',
    styleUrls: [],
    standalone: false
})
export class AddEditVehicleComponent implements OnInit {

  // INJECTIONS
  private readonly modalController: ModalController = inject(ModalController);
  private readonly dataService: DataService = inject(DataService);
  private readonly translator: TranslateService = inject(TranslateService);
  private readonly vehicleService: VehicleService = inject(VehicleService);
  private readonly utilsService: UtilsService = inject(UtilsService);
  private readonly calendarService: CalendarService = inject(CalendarService);
  private readonly controlService: ControlService = inject(ControlService);
  private readonly settingsService: SettingsService = inject(SettingsService);

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<VehicleModel> = new ModalInputModel<VehicleModel>();
  headerInput: HeaderInputModel = new HeaderInputModel();
  
  // MODEL FORM
  vehicle: VehicleModel = new VehicleModel();
  submited = false;

  // DATA
  configurations: ConfigurationModel[] = [];
  operations: OperationModel[] = [];
  vehicleTypes: VehicleTypeModel[] = [];
  formatDate = '';
  measure: ISettingModel;

  // TRANSLATE
  translateYearBetween = '';
  translateSelect = '';

  constructor() {
    this.formatDate = this.calendarService.getFormatCalendar();
    this.translateYearBetween = this.translator.instant('PAGE_VEHICLE.AddYearBetween', { year: new Date().getFullYear()});
    this.translateSelect = this.translator.instant('COMMON.SELECT');
  }

  ngOnInit() {
    this.headerInput = new HeaderInputModel({
      title: (this.modalInputModel.type == ModalTypeEnum.CREATE ? 'PAGE_VEHICLE.AddNewVehicle' : 'PAGE_VEHICLE.EditVehicle')
    });

    this.vehicle = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.type === ModalTypeEnum.CREATE) {
      this.vehicle.id = -1;
      this.vehicle.datePurchase = this.calendarService.getDateStringToDB(new Date());
    }

    // GET SETTINGS
    const settings = this.dataService.getSystemConfigurationData();
    if (!!settings && settings.length > 0) {
      this.measure = this.settingsService.getDistanceSelected(settings);
    }

    // GET CONFIGURATIONS
    this.configurations = this.utilsService.orderBy(
      this.dataService.getConfigurationsData(), ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    if (!!this.configurations && this.configurations.length > 0) {
      if(this.modalInputModel.type === ModalTypeEnum.CREATE)
        this.vehicle.configuration = this.configurations[0];
      else
        this.vehicle.configuration = this.configurations.find(x => x.id === this.vehicle.configuration.id);
    }

    // GET VEHICLE TYPE
    this.vehicleTypes = this.dataService.getVehicleTypeData();
    if (!!this.vehicleTypes && this.vehicleTypes.length > 0 && this.modalInputModel.type === ModalTypeEnum.CREATE) {
      this.vehicle.vehicleType = this.vehicleTypes[0];
    }

    // GET OPERATIONS
    // Filter to get less elemnts to better perfomance
    this.operations = this.dataService.getOperationsData().filter(x => x.vehicle.id === this.vehicle.id);
  }

  saveData(f: HTMLFormElement) {
    this.submited = true;
    if (this.isValidForm(f)) {
      const result = this.validateDateAndKmToOperations();
      if (result !== '') {
        this.controlService.showToast(PageEnum.MODAL_VEHICLE, ToastTypeEnum.WARNING, result, null, Constants.DELAY_TOAST_HIGHER);
      } else {
        // Save date to change km to calculate maintenance
        if (this.modalInputModel.type === ModalTypeEnum.UPDATE && this.modalInputModel.data.km !== this.vehicle.km) {
          this.vehicle.dateKms = new Date();
        }
        this.vehicleService.saveVehicle([this.vehicle],
          (this.modalInputModel.type === ModalTypeEnum.CREATE ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
          this.closeModal();
          this.controlService.showToast(PageEnum.MODAL_VEHICLE, ToastTypeEnum.SUCCESS,
            (this.modalInputModel.type === ModalTypeEnum.CREATE ? 'PAGE_VEHICLE.AddSaveVehicle' : 'PAGE_VEHICLE.EditSaveVehicle'),
            { vehicle: this.vehicle.model });
        }).catch(e => {
          this.controlService.showToast(PageEnum.MODAL_VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle', e);
        });
      }
    }
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
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
    const purchase: Date = new Date(this.vehicle.datePurchase);
    const today: Date = new Date();

    if (new Date(purchase.getFullYear(), purchase.getMonth(), purchase.getDate()) >
        new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      msg = this.translator.instant('PAGE_OPERATION.AddDateLower', { dateFin: this.calendarService.getDateString(today)});
    } else if (!!this.operations && this.operations.length > 0) {
      if (this.operations.some(x => this.vehicle.km < x.km)) {
        msg = this.translator.instant('PAGE_VEHICLE.AddKmHigher',
        { km: this.utilsService.max(this.operations, ConstantsColumns.COLUMN_MTM_OPERATION_KM), measure: this.measure.value});
      } else if (this.operations.some(x => purchase > new Date(x.date))) {
        msg = this.translator.instant('PAGE_OPERATION.AddDateLower',
        { dateFin: this.calendarService.getDateString(
            this.utilsService.min(this.operations, ConstantsColumns.COLUMN_MTM_OPERATION_DATE))});
      }
    }

    const maxKM = 999999;
    if (msg === '' && this.vehicle.km > maxKM) {
      msg = this.translator.instant('PAGE_VEHICLE.AddKmLowerMax', { km: maxKM, measure: this.measure.value});
    }

    return msg;
  }
}
