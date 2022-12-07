import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { Constants, ActionDBEnum, ConstantsColumns, PageEnum, ToastTypeEnum } from '@utils/index';
import {
  ModalInputModel, VehicleModel, OperationModel, OperationTypeModel, MaintenanceElementModel
} from '@models/index';
import {
  DataBaseService, OperationService, CommonService, ConfigurationService, ControlService,
  CalendarService, SettingsService, VehicleService
} from '@services/index';

@Component({
  selector: 'app-add-edit-operation',
  templateUrl: 'add-edit-operation.component.html',
  styleUrls: []
})
export class AddEditOperationComponent implements OnInit {

  // MODAL MODELS
  modalInputModel: ModalInputModel<OperationModel> = new ModalInputModel<OperationModel>();

  // MODEL FORM
  operation: OperationModel = new OperationModel();
  submited = false;

  // DATA
  operations: OperationModel[] = [];
  operationType: OperationTypeModel[] = [];
  vehicles: VehicleModel[] = [];
  maintenanceElement: MaintenanceElementModel[] = [];
  maintenanceElementSelect: MaintenanceElementModel[] = [];
  idMaintenanceElementSelect: number[] = [];
  owners: any [] = [];
  formatDate = this.calendarService.getFormatCalendar();
  measure: any = {};
  coin: any = {};

  // Translate
  translateWorkshop = '';
  translateMe = '';
  translateAccept = '';
  translateCancel = '';
  translateSelect = '';

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private translator: TranslateService,
    private operationService: OperationService,
    private commonService: CommonService,
    private calendarService: CalendarService,
    private controlService: ControlService,
    private configurationService: ConfigurationService,
    private settingsService: SettingsService,
    private vehicleService: VehicleService
  ) {
    this.translateWorkshop = this.translator.instant('COMMON.WORKSHOP');
    this.translateMe = this.translator.instant('COMMON.ME');
    this.translateAccept = this.translator.instant('COMMON.ACCEPT');
    this.translateCancel = this.translator.instant('COMMON.CANCEL');
    this.translateSelect = this.translator.instant('COMMON.SELECT');
   }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel<OperationModel>(this.navParams.data);

    this.operation = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.isCreate) {
      this.operation.id = -1;
      this.operation.date = this.calendarService.getDateStringToDB(new Date());
      this.operation.operationType.id = null;
    }

    // GET SETTINGS
    const settings = this.dbService.getSystemConfigurationData();
    if (!!settings && settings.length > 0) {
      this.measure = this.settingsService.getDistanceSelected(settings);
      this.coin = this.settingsService.getMoneySelected(settings);
    }

    // GET VEHICLES
    this.vehicles = this.dbService.getVehiclesData();

    // GET OPERATION TYPE
    this.operationType = this.commonService.orderBy(
      this.dbService.getOperationTypeData(), ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION);

    // GET MAINTENANCE ELEMENT
    this.maintenanceElement = this.configurationService.orderMaintenanceElement(this.dbService.getMaintenanceElementData());
    this.idMaintenanceElementSelect = [];
    this.maintenanceElementSelect = [];
    if (!!this.operation.listMaintenanceElement && this.operation.listMaintenanceElement.length > 0) {
      this.maintenanceElementSelect = this.operation.listMaintenanceElement;
      this.idMaintenanceElementSelect = this.operation.listMaintenanceElement.map(x => x.id);
    }

    // GET OPERATIONS
    this.operations = this.dbService.getOperationsData();

    // OWNERS
    this.loadOwner();
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      const result = this.validateDateToKm();
      if (result !== '') {
        this.controlService.showToast(PageEnum.MODAL_OPERATION, ToastTypeEnum.WARNING, result, null, Constants.DELAY_TOAST_HIGHER);
      } else {
        if (!this.modalInputModel.isCreate && this.idMaintenanceElementSelect.length > 0 &&
          !this.isOperationTypeWithReplacement()) {
          this.showConfirmSaveWithDelete();
        } else {
          this.checkUpdateBeforeSaveOperation();
        }
      }
    }
  }

  checkUpdateBeforeSaveOperation() {
    const vehicle: VehicleModel = this.vehicles.find(x => x.id === this.operation.vehicle.id);
    if (vehicle.km < this.operation.km) {
      this.controlService.showConfirm(PageEnum.MODAL_OPERATION, this.translator.instant('COMMON.OPERATION'),
        this.translator.instant('PAGE_OPERATION.ConfitmUpdateVehicleKm', {measure: this.measure.valueLarge, kmFin: vehicle.km}),
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.saveOperation();
          }
        }
      );
    } else {
      this.saveOperation();
    }
  }

  saveOperation() {
    if (!this.isOperationTypeWithReplacement()) {
      this.operation.listMaintenanceElement = [];
    } else {
      this.operation.listMaintenanceElement = this.maintenanceElementSelect;
      this.operation.listMaintenanceElement.forEach(x => {
        if (x.price === null) {
          x.price = 0;
        } else {
          x.price = (x.price.toString().includes(',') ? Number(x.price.toString().replace(',', '.')) : x.price);
        }
      });
    }
    this.updateKmVehicle();
    this.operation.price = (this.operation.price.toString().includes(',') ?
      Number(this.operation.price.toString().replace(',', '.')) : this.operation.price);
    this.operationService.saveOperation(this.operation,
      (this.modalInputModel.isCreate ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
      this.closeModal();
      this.controlService.showToast(PageEnum.MODAL_OPERATION, ToastTypeEnum.SUCCESS,
        this.modalInputModel.isCreate ? 'PAGE_OPERATION.AddSaveOperation' : 'PAGE_OPERATION.EditSaveOperation',
          { operation: this.operation.description });
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_OPERATION, ToastTypeEnum.DANGER, 'PAGE_OPERATION.ErrorSaveOperation');
    });
  }

  updateKmVehicle() {
    const vehicle: VehicleModel = this.vehicles.find(x => x.id === this.operation.vehicle.id);
    if (vehicle.km < this.operation.km) {
      vehicle.km = this.operation.km;
      vehicle.dateKms = new Date();
      this.vehicleService.saveVehicle([vehicle], ActionDBEnum.UPDATE).then(res => {
        console.log('UPDATE VEHICLE KM');
      }).catch(e => {
        this.controlService.showToast(PageEnum.MODAL_VEHICLE, ToastTypeEnum.DANGER, 'PAGE_VEHICLE.ErrorSaveVehicle');
      });
    }
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
  }

  moveCursorToEnd(event: any) {
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    if (isIEOrEdge) {
      const textarea: HTMLTextAreaElement = event.target;
      const data: string = this.operation.details;
      textarea.value = 'p';
      textarea.value = null;
      textarea.value = data;
    }
  }

  changeReplacement() {
    const oldList: MaintenanceElementModel[] = Object.assign([], this.maintenanceElementSelect);
    this.maintenanceElementSelect = [];
    this.idMaintenanceElementSelect.forEach(x => {
      const replacement: MaintenanceElementModel = this.maintenanceElement.find(y => y.id === x);
      const oldReplacement: MaintenanceElementModel = oldList.find(y => y.id === x);
      this.maintenanceElementSelect = [...this.maintenanceElementSelect, {
        id: replacement.id,
        name: replacement.name,
        description: replacement.description,
        master: replacement.master,
        price: (oldReplacement ? oldReplacement.price : null),
        icon: replacement.icon
      }];
    });
  }

  showConfirmSaveWithDelete() {
    this.controlService.showConfirm(PageEnum.MODAL_OPERATION, this.translator.instant('COMMON.OPERATION'),
      this.translator.instant('PAGE_OPERATION.ConfirmSaveToDeleteReplacement'),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.checkUpdateBeforeSaveOperation();
        }
      }
    );
  }

  isValidForm(f: any): boolean {
    return this.isValidDescription(f) && this.isValidDetails(f) && this.isValidVehicle(f) &&
      this.isValidOperationType(f) && this.isValidPrice(f) && this.isValidKm(f) &&
      this.isValidDate(f);
  }

  isValidDescription(f: any): boolean {
    return f.opDescription !== undefined && f.opDescription.validity.valid;
  }

  isValidDetails(f: any): boolean {
    return f.opDetails !== undefined && f.opDetails.validity.valid;
  }

  isValidOperationType(f: any): boolean {
    return f.opType !== undefined && f.opType.validity.valid && !!f.opType.value;
  }

  isValidVehicle(f: any): boolean {
    return f.opVehicle !== undefined && f.opVehicle.validity.valid && !!f.opVehicle.value;
  }

  isValidPrice(f: any): boolean {
    return f.opPrice !== undefined && f.opPrice.validity.valid;
  }

  isValidKm(f: any): boolean {
    return f.opKm !== undefined && f.opKm.validity.valid;
  }

  isValidDate(f: any): boolean {
    return f.opDate !== undefined && f.opDate.validity.valid;
  }

  isOperationTypeWithReplacement(): boolean {
    return this.operationType.some(x => x.id === this.operation.operationType.id &&
      (Constants.OPERATION_TYPE_FAILURE_HOME === x.code || Constants.OPERATION_TYPE_FAILURE_WORKSHOP === x.code ||
      Constants.OPERATION_TYPE_MAINTENANCE_HOME === x.code || Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP === x.code));
  }

  validateDateToKm(): string {
    let msgResult = '';
    const vehicle: VehicleModel = this.vehicles.find(x => x.id === this.operation.vehicle.id);

    // Validate not future
    if (new Date(this.operation.date) > new Date()) {
      msgResult = this.translator.instant('PAGE_OPERATION.AddDateNotFuture');
    } else {
      // Validate min and max date operation
      msgResult = this.validateMinMaxDateOperation(vehicle);

      // Validate min and max km operation
      msgResult += this.validateMinMaxKmOperation(vehicle);
    }

    // Validate max km vehicle
    msgResult += this.validateMaxKmVehicle(vehicle);

    return msgResult;
  }

  validateMinMaxDateOperation(vehicle: VehicleModel): string {
    const dateSelected = new Date(this.operation.date);
    const minDate = this.calculateMinDate(this.operation);
    const maxDate = this.calculateMaxDate(this.operation);
    let msgResult = '';
    if (!!minDate && !!maxDate && (dateSelected < minDate || dateSelected > maxDate)) {
      msgResult = `${this.translator.instant('PAGE_OPERATION.AddDateBetween',
                {
                  dateIni: this.calendarService.getDateString(minDate),
                  dateFin: this.calendarService.getDateString(maxDate)
                })} `;
    } else if (!!minDate && !(!!maxDate) && dateSelected < minDate) {
      msgResult = `${this.translator.instant('PAGE_OPERATION.AddDateHigher',
                { dateIni: this.calendarService.getDateString(minDate) })} `;
    } else if (!(!!minDate) && !!maxDate && dateSelected > maxDate) {
      msgResult = `${this.translator.instant('PAGE_OPERATION.AddDateBetween',
                {
                  dateIni: this.calendarService.getDateString(vehicle.datePurchase),
                  dateFin: this.calendarService.getDateString(maxDate)
                })} `;
    }
    return msgResult;
  }

  validateMinMaxKmOperation(vehicle: VehicleModel): string {
    const kmSelected = this.operation.km;
    const minKm = this.calculateMinKm(this.operation);
    const maxKm = this.calculateMaxKm(this.operation);
    let msgResult = '';
    if (!!maxKm && (kmSelected < minKm || kmSelected > maxKm)) {
      msgResult += (msgResult === '' ? '' : `${this.translator.instant('COMMON.OR')} `);
      msgResult += this.translator.instant('PAGE_OPERATION.AddKmBetween',
        {measure: this.measure.valueLarge, kmIni: minKm, kmFin: maxKm});
    } else if (!(!!maxKm) && kmSelected < minKm) {
      msgResult += (msgResult === '' ? '' : `${this.translator.instant('COMMON.OR')} `);
      msgResult += this.translator.instant('PAGE_OPERATION.AddKmBetween',
        {measure: this.measure.valueLarge, kmIni: minKm, kmFin: vehicle.km});
    }
    return msgResult;
  }

  validateMaxKmVehicle(vehicle: VehicleModel): string {
    let msgResult = '';
    if (!!this.vehicles && this.vehicles.length > 0 && msgResult === '') {
      if (new Date(vehicle.datePurchase) > new Date(this.operation.date)) {
        msgResult = `${this.translator.instant('PAGE_OPERATION.AddDateHigher',
                { dateIni: this.calendarService.getDateString(vehicle.datePurchase) })}`;
      }
    }
    return msgResult;
  }

  calculateMinKm(op: OperationModel): number {
    let resultKm = 0;
    const date = new Date(op.date);
    const operationsDateBefore: OperationModel[] = this.operations.filter(x =>
      x.vehicle.id === op.vehicle.id && new Date(x.date) <= date &&
      x.id !== op.id);

    if (!!operationsDateBefore && operationsDateBefore.length > 0) {
      resultKm = this.commonService.max(operationsDateBefore, ConstantsColumns.COLUMN_MTM_OPERATION_KM);
    }

    return resultKm;
  }

  calculateMaxKm(op: OperationModel): number {
    let resultKm: number = null;
    const date = new Date(op.date);
    const operationsDateAfter: OperationModel[] = this.operations.filter(x =>
      x.vehicle.id === op.vehicle.id && new Date(x.date) > date &&
      x.id !== op.id);

    if (!!operationsDateAfter && operationsDateAfter.length > 0) {
      resultKm = this.commonService.min(operationsDateAfter, ConstantsColumns.COLUMN_MTM_OPERATION_KM);
    }

    return resultKm;
  }

  calculateMinDate(op: OperationModel): Date {
    let resultDate: Date = null;
    const operationsKmBefore: OperationModel[] = this.operations.filter(x =>
      x.vehicle.id === op.vehicle.id && x.km <= op.km &&
      x.id !== op.id);

    if (!!operationsKmBefore && operationsKmBefore.length > 0) {
      resultDate = new Date(this.commonService.max(operationsKmBefore, ConstantsColumns.COLUMN_MTM_OPERATION_DATE), 0, 0, 0);
    }

    return resultDate;
  }

  calculateMaxDate(op: OperationModel): Date {
    let resultDate: Date = null;
    const operationsKmAfter: OperationModel[] = this.operations.filter(x =>
      x.vehicle.id === op.vehicle.id && x.km > op.km &&
      x.id !== op.id);

    if (!!operationsKmAfter && operationsKmAfter.length > 0) {
      resultDate = new Date(this.commonService.min(operationsKmAfter, ConstantsColumns.COLUMN_MTM_OPERATION_DATE), 0, 0, 0);
    }

    return resultDate;
  }

  loadOwner() {
    if (this.operation.owner) {
      if (this.operation.owner.toLowerCase() === Constants.OWNER_ME ||
          this.operation.owner.toLowerCase() === Constants.OWNER_YO) {
        this.operation.owner = Constants.OWNER_YO;
      } else if (this.operation.owner.toLowerCase() === Constants.OWNER_OTHER ||
                  this.operation.owner.toLowerCase() === Constants.OWNER_OTRO) {
        this.operation.owner = Constants.OWNER_OTRO;
      } else {
        this.operation.owner = Constants.OWNER_YO;
      }
    } else {
      this.operation.owner = Constants.OWNER_YO;
    }
    this.operation.owner = (this.operation.owner ? this.operation.owner.toLowerCase() : Constants.OWNER_YO);
    this.owners = [
      { id: Constants.OWNER_YO, value: 'COMMON.ME' },
      { id: Constants.OWNER_OTRO, value: 'DB.OTHER' }
    ];
  }
 }
