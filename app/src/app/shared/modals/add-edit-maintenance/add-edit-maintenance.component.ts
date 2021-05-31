import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, Constants, PageEnum, ToastTypeEnum } from '@utils/index';
import {
  ModalInputModel, ModalOutputModel, MaintenanceModel,
  MaintenanceFreqModel, MaintenanceElementModel
} from '@models/index';
import { DataBaseService, ConfigurationService, ControlService, SettingsService } from '@services/index';

@Component({
  selector: 'app-add-edit-maintenance',
  templateUrl: 'add-edit-maintenance.component.html',
  styleUrls: ['../../../app.component.scss']
})
export class AddEditMaintenanceComponent implements OnInit, OnDestroy {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  // MODEL FORM
  maintenance: MaintenanceModel = new MaintenanceModel();
  submited = false;

  // DATA
  maintenanceElements: MaintenanceElementModel[] = [];
  maintenanceFreqs: MaintenanceFreqModel[] = [];
  maxKm = 100000;
  valueRange: any = { lower: 0 , upper: 100000 };
  showRange = '';
  maintenanceElementSelect: number[] = [];
  measure: any = {};

  // SUBSCRIPTION
  maintenanceElmentSubscription: Subscription = new Subscription();
  maintenanceFreqSubscription: Subscription = new Subscription();
  settingsSubscription: Subscription = new Subscription();

  // TRANSLATE
  translateSelect = '';
  translateAccept = '';
  translateCancel = '';
  customActionSheetOptions: any = {
    header: this.translator.instant('COMMON.REPLACEMENT'),
  };

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private configurationService: ConfigurationService,
    private translator: TranslateService,
    private controlService: ControlService,
    private settingsService: SettingsService
  ) {
    this.translateSelect = this.translator.instant('COMMON.SELECT');
    this.translateAccept = this.translator.instant('COMMON.ACCEPT');
    this.translateCancel = this.translator.instant('COMMON.CANCEL');
  }

  ngOnInit() {

    this.settingsSubscription = this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.measure = this.settingsService.getDistanceSelected(settings);
      }
    });

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);
    this.maintenance = Object.assign({}, this.modalInputModel.data);
    this.maxKm = (this.modalInputModel.dataList[0] === null ? 100000 : Math.round(this.modalInputModel.dataList[0] / 1000) * 1000 + 30000);
    this.valueRange.lower = this.maintenance.fromKm;
    this.valueRange.upper = this.maintenance.toKm === null ? this.maxKm : this.maintenance.toKm;
    this.changeRange();
    if (this.modalInputModel.isCreate) {
      this.maintenance.id = -1;
      this.maintenance.maintenanceFreq.id = null;
    }

    this.maintenanceElmentSubscription = this.dbService.getMaintenanceElement().subscribe(data => {
      this.maintenanceElements = this.configurationService.orderMaintenanceElement(data);
      this.maintenanceElementSelect = [];
      if (!!this.maintenance.listMaintenanceElement && this.maintenance.listMaintenanceElement.length > 0) {
        this.maintenanceElementSelect = this.maintenance.listMaintenanceElement.map(x => x.id);
      }
    });

    this.maintenanceFreqSubscription = this.dbService.getMaintenanceFreq().subscribe(data => {
      this.maintenanceFreqs = data;
    });
  }

  ngOnDestroy() {
    this.maintenanceElmentSubscription.unsubscribe();
    this.maintenanceFreqSubscription.unsubscribe();
    this.settingsSubscription.unsubscribe();
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      if (this.isInitDisabled()) {
        this.maintenance.init = false;
        this.maintenance.fromKm = this.valueRange.lower;
        this.maintenance.toKm = (this.valueRange.upper === this.maxKm ? null : this.valueRange.upper);
      } else {
        this.maintenance.fromKm = 0;
        this.maintenance.toKm = null;
      }
      this.maintenance.listMaintenanceElement = this.maintenanceElements.filter(x =>
        this.maintenanceElementSelect.some(y => y === x.id));
      this.configurationService.saveMaintenance(this.maintenance,
          (this.modalInputModel.isCreate ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
        this.closeModal();
        this.controlService.showToast(PageEnum.MODAL_MAINTENANCE, ToastTypeEnum.SUCCESS, (this.modalInputModel.isCreate ?
            'PAGE_CONFIGURATION.AddSaveMaintenance' : 'PAGE_CONFIGURATION.EditSaveMaintenance'),
          { maintenance: this.maintenance.description });
      }).catch(e => {
        this.controlService.showToast(PageEnum.MODAL_MAINTENANCE, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveMaintenance');
      });
    }
  }

  showInfoInit() {
    this.controlService.showMsgToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO,
      this.translator.instant('ALERT.InfoMaintenanceInit'), Constants.DELAY_TOAST_HIGH);
  }

  showInfoWear() {
    this.controlService.showToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO, 'ALERT.InfoMaintenanceWear',
    { measurelarge: this.measure.valueLarge }, Constants.DELAY_TOAST_HIGH);
  }

  isInitDisabled(): boolean {
    return !this.maintenanceFreqs.some(x => x.id === this.maintenance.maintenanceFreq.id &&
      x.code === Constants.MAINTENANCE_FREQ_ONCE_CODE);
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  isValidForm(f: any): boolean {
    return this.isValidDescription(f) && this.isValidReplacement(f) && this.isValidFreq(f) &&
      this.isValidKm(f);
  }

  isValidDescription(f: any): boolean {
    return f.maintenanceDescription !== undefined && f.maintenanceDescription.validity.valid;
  }

  isValidReplacement(f: any): boolean {
    return f.maintenanceReplacement !== undefined && f.maintenanceReplacement.validity.valid && !!f.maintenanceReplacement.value &&
      !!this.maintenanceElementSelect && this.maintenanceElementSelect.length > 0;
  }

  isValidFreq(f: any): boolean {
    return f.maintenanceFreq !== undefined && f.maintenanceFreq.validity.valid && !!f.maintenanceFreq.value;
  }

  isValidKm(f: any): boolean {
    return f.maintenanceKm !== undefined && f.maintenanceKm.validity.valid;
  }

  changeRange() {
    const valueUpperMax: boolean = this.valueRange.upper === this.maxKm;
    if (valueUpperMax && this.valueRange.lower === 0) {
      this.showRange = '';
    } else {
      const value = `${this.valueRange.upper}${this.measure.value}`;
      this.showRange = `[ ${this.valueRange.lower}${this.measure.value} - ${(valueUpperMax ? '∞' : value)} ]`;
    }
  }
}
