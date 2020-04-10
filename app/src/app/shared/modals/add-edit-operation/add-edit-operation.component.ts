import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Form } from '@angular/forms';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { Constants, ActionDBEnum, ConstantsColumns } from '@utils/index';
import {
  ModalInputModel, ModalOutputModel, MotoModel, OperationModel, OperationTypeModel, MaintenanceElementModel
} from '@models/index';
import { DataBaseService, OperationService, CommonService, ConfigurationService } from '@services/index';

@Component({
  selector: 'app-add-edit-operation',
  templateUrl: 'add-edit-operation.component.html',
  styleUrls: ['add-edit-operation.component.scss', '../../../app.component.scss']
})
export class AddEditOperationComponent implements OnInit, OnDestroy {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  // MODEL FORM
  operation: OperationModel = new OperationModel();
  submited = false;

  // DATA
  operations: OperationModel[] = [];
  operationType: OperationTypeModel[] = [];
  motos: MotoModel[] = [];
  maintenanceElement: MaintenanceElementModel[] = [];
  maintenanceElementSelect: number[] = [];
  formatDate = this.commonService.getFormatCalendar();

  // SUBSCRIPTION
  operationSubscription: Subscription = new Subscription();
  operationTypeSubscription: Subscription = new Subscription();
  motoSubscription: Subscription = new Subscription();
  maintenanceElementSubscription: Subscription = new Subscription();

  // Translate
  translateWorkshop = '';
  translateMe = '';
  translateAccept = '';
  translateCancel = '';
  translateSelect = '';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private translator: TranslateService,
    private operationService: OperationService,
    private commonService: CommonService,
    private configurationService: ConfigurationService
  ) {
    this.translateWorkshop = this.translator.instant('COMMON.WORKSHOP');
    this.translateMe = this.translator.instant('COMMON.ME');
    this.translateAccept = this.translator.instant('COMMON.ACCEPT');
    this.translateCancel = this.translator.instant('COMMON.CANCEL');
    this.translateSelect = this.translator.instant('COMMON.SELECT');
   }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    this.operation = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.isCreate) {
      this.operation.id = -1;
      this.operation.date = this.commonService.getDateStringToDB(new Date());
      this.operation.operationType.id = null;
    }

    this.motoSubscription = this.dbService.getMotos().subscribe(data => {
      this.motos = data;
    });

    this.operationTypeSubscription = this.dbService.getOperationType().subscribe(data => {
      this.operationType = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION);
    });

    this.maintenanceElementSubscription = this.dbService.getMaintenanceElement().subscribe(data => {
      this.maintenanceElement = this.configurationService.orderMaintenanceElement(data);
      this.maintenanceElementSelect = [];
      if (!!this.operation.listMaintenanceElement && this.operation.listMaintenanceElement.length > 0) {
        this.maintenanceElementSelect = this.operation.listMaintenanceElement.map(x => x.id);
      }
    });

    this.operationSubscription = this.dbService.getOperations().subscribe(data => {
      this.operations = data;
    });
  }

  ngOnDestroy() {
    this.operationSubscription.unsubscribe();
    this.motoSubscription.unsubscribe();
    this.operationTypeSubscription.unsubscribe();
    this.maintenanceElementSubscription.unsubscribe();
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      const result = this.validateDateToKm();
      if (result !== '') {
        this.commonService.showToast(result, null, Constants.DELAY_TOAST_HIGHER);
      } else {
        if (!this.modalInputModel.isCreate && this.maintenanceElementSelect.length > 0 &&
          !this.isOperationTypeWithReplacement()) {
          this.showConfirmSaveWithDelete();
        } else {
          this.saveOperation();
        }
      }
    }
  }

  saveOperation() {
    if (!this.isOperationTypeWithReplacement()) {
      this.operation.listMaintenanceElement = [];
    } else if (!!this.maintenanceElementSelect && this.maintenanceElementSelect.length > 0) {
      this.operation.listMaintenanceElement = this.maintenanceElement.filter(x =>
        this.maintenanceElementSelect.some(y => y === x.id)
      );
    }
    this.operationService.saveOperation(this.operation,
      (this.modalInputModel.isCreate ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
      this.closeModal();
      this.commonService.showToast(
        this.modalInputModel.isCreate ? 'PAGE_OPERATION.AddSaveOperation' : 'PAGE_OPERATION.EditSaveOperation',
          { operation: this.operation.description });
    }).catch(e => {
      this.commonService.showToast('PAGE_OPERATION.ErrorSaveOperation');
    });
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  async showConfirmSaveWithDelete() {
    const alert = await this.alertController.create({
      header: this.translator.instant('COMMON.OPERATION'),
      message: this.translator.instant('PAGE_OPERATION.ConfirmDeleteOperation'),
      buttons: [
        {
          text: this.translator.instant('COMMON.CANCEL'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.saveOperation();
          }
        }
      ]
    });

    await alert.present();
  }

  isValidForm(f: any): boolean {
    return this.isValidDescription(f) && this.isValidDetails(f) && this.isValidMoto(f) &&
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

  isValidMoto(f: any): boolean {
    return f.opMoto !== undefined && f.opMoto.validity.valid && !!f.opMoto.value;
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

  isOperationTypeMaintenanceReplacement(f: any): boolean {
    return this.isValidOperationType(f) && this.isOperationTypeWithReplacement();
  }

  isOperationTypeWithReplacement(): boolean {
    return this.operationType.some(x => x.id === this.operation.operationType.id &&
      (Constants.OPERATION_TYPE_FAILURE_HOME === x.code || Constants.OPERATION_TYPE_FAILURE_WORKSHOP === x.code ||
      Constants.OPERATION_TYPE_MAINTENANCE_HOME === x.code || Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP === x.code));
  }

  validateDateToKm(): string {
    let msgResult = '';
    const dateSelected = new Date(this.operation.date);
    const kmSelected = this.operation.km;
    const minDate = this.calculateMinDate(this.operation);
    const maxDate = this.calculateMaxDate(this.operation);
    const minKm = this.calculateMinKm(this.operation);
    const maxKm = this.calculateMaxKm(this.operation);
    const moto: MotoModel = this.motos.find(x => x.id === this.operation.moto.id);

    // Validate min and max date operation
    if (!!minDate && !!maxDate && (dateSelected < minDate || dateSelected > maxDate)) {
      msgResult = `${this.translator.instant('PAGE_OPERATION.AddDateBetween',
                {
                  dateIni: this.commonService.getDateString(minDate),
                  dateFin: this.commonService.getDateString(maxDate)
                })} ` +
                `${this.translator.instant('COMMON.OR')} `;
    } else if (!!minDate && !(!!maxDate) && dateSelected < minDate) {
      msgResult = `${this.translator.instant('PAGE_OPERATION.AddDateHigher',
                { dateIni: this.commonService.getDateString(minDate) })} ` +
                `${this.translator.instant('COMMON.OR')} `;
    } else if (!(!!minDate) && !!maxDate && dateSelected > maxDate) {
      msgResult = `${this.translator.instant('PAGE_OPERATION.AddDateBetween',
                {
                  dateIni: this.commonService.getDateString(moto.datePurchase),
                  dateFin: this.commonService.getDateString(maxDate)
                })} ` +
                `${this.translator.instant('COMMON.OR')} `;
    }

    // Validate min and max km operation
    if (!!maxKm && (kmSelected < minKm || kmSelected > maxKm)) {
      msgResult += this.translator.instant('PAGE_OPERATION.AddKmBetween', {kmIni: minKm, kmFin: maxKm});
    } else if (!(!!maxKm) && kmSelected < minKm) {
      msgResult += this.translator.instant('PAGE_OPERATION.AddKmBetween', {kmIni: minKm, kmFin: moto.km});
    }

    // Validate max km moto
    if (!!this.motos && this.motos.length > 0 && msgResult === '') {
      if (moto.km < this.operation.km) {
        msgResult = this.translator.instant('PAGE_OPERATION.AddKmLower', { kmFin: moto.km});
      } else if (new Date(moto.datePurchase) > new Date(this.operation.date)) {
        msgResult = `${this.translator.instant('PAGE_OPERATION.AddDateHigher',
                { dateIni: this.commonService.getDateString(moto.datePurchase) })}`;
      }
    }

    return msgResult;
  }

  calculateMinKm(op: OperationModel): number {
    let resultKm = 0;
    const date = new Date(op.date);
    const operationsDateBefore: OperationModel[] = this.operations.filter(x =>
      x.moto.id === op.moto.id && new Date(x.date) <= date &&
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
      x.moto.id === op.moto.id && new Date(x.date) > date &&
      x.id !== op.id);

    if (!!operationsDateAfter && operationsDateAfter.length > 0) {
      resultKm = this.commonService.min(operationsDateAfter, ConstantsColumns.COLUMN_MTM_OPERATION_KM);
    }

    return resultKm;
  }

  calculateMinDate(op: OperationModel): Date {
    let resultDate: Date = null;
    const operationsKmBefore: OperationModel[] = this.operations.filter(x =>
      x.moto.id === op.moto.id && x.km <= op.km &&
      x.id !== op.id);

    if (!!operationsKmBefore && operationsKmBefore.length > 0) {
      resultDate = new Date(this.commonService.max(operationsKmBefore, ConstantsColumns.COLUMN_MTM_OPERATION_DATE));
    }

    return resultDate;
  }

  calculateMaxDate(op: OperationModel): Date {
    let resultDate: Date = null;
    const operationsKmAfter: OperationModel[] = this.operations.filter(x =>
      x.moto.id === op.moto.id && x.km > op.km &&
      x.id !== op.id);

    if (!!operationsKmAfter && operationsKmAfter.length > 0) {
      resultDate = new Date(this.commonService.min(operationsKmAfter, ConstantsColumns.COLUMN_MTM_OPERATION_DATE));
    }

    return resultDate;
  }
 }
