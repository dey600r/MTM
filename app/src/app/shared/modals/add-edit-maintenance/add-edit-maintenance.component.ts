import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, Constants, ModalTypeEnum, PageEnum, ToastTypeEnum } from '@utils/index';
import {
  ModalInputModel, MaintenanceModel, ISettingModel,
  MaintenanceFreqModel, MaintenanceElementModel,
  HeaderInputModel
} from '@models/index';
import { DataService, ConfigurationService, ControlService, SettingsService } from '@services/index';

@Component({
    selector: 'app-add-edit-maintenance',
    templateUrl: 'add-edit-maintenance.component.html',
    styleUrls: [],
    standalone: false
})
export class AddEditMaintenanceComponent implements OnInit {

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<MaintenanceModel, number> = new ModalInputModel<MaintenanceModel, number>();
  headerInput: HeaderInputModel = new HeaderInputModel();

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
  measure: ISettingModel;

  // TRANSLATE
  translateSelect = '';
  translateAccept = '';
  translateCancel = '';
  customActionSheetOptions: any = {};

  constructor(
    private readonly modalController: ModalController,
    private readonly dataService: DataService,
    private readonly configurationService: ConfigurationService,
    private readonly translator: TranslateService,
    private readonly controlService: ControlService,
    private readonly settingsService: SettingsService
  ) {
    this.customActionSheetOptions = { header: this.translator.instant('COMMON.REPLACEMENT') };
    this.translateSelect = this.translator.instant('COMMON.SELECT');
    this.translateAccept = this.translator.instant('COMMON.ACCEPT');
    this.translateCancel = this.translator.instant('COMMON.CANCEL');
  }

  ngOnInit() {
    this.headerInput = new HeaderInputModel({
      title: (this.modalInputModel.type == ModalTypeEnum.CREATE ? 'PAGE_CONFIGURATION.AddNewMaintenance' : 'PAGE_CONFIGURATION.EditMaintenance')
    });

    const settings = this.dataService.getSystemConfigurationData();
    if (!!settings && settings.length > 0) {
      this.measure = this.settingsService.getDistanceSelected(settings);
    }

    this.maintenance = Object.assign({}, this.modalInputModel.data);
    this.maxKm = (this.modalInputModel.dataList[0] === null ? 100000 : Math.round(this.modalInputModel.dataList[0] / 1000) * 1000 + 30000);
    this.valueRange.lower = this.maintenance.fromKm;
    this.valueRange.upper = this.maintenance.toKm === null ? this.maxKm : this.maintenance.toKm;
    this.changeRange();
    if (this.modalInputModel.type === ModalTypeEnum.CREATE) {
      this.maintenance.id = -1;
      this.maintenance.maintenanceFreq.id = null;
    }

    // MAINTENANCE ELEMENTS
    this.maintenanceElements = this.configurationService.orderMaintenanceElement(this.dataService.getMaintenanceElementData());
    this.maintenanceElementSelect = [];
    if (!!this.maintenance.listMaintenanceElement && this.maintenance.listMaintenanceElement.length > 0) {
      this.maintenanceElementSelect = this.maintenance.listMaintenanceElement.map(x => x.id);
    }

    // MAINTENANCE FREQ
    this.maintenanceFreqs = this.dataService.getMaintenanceFreqData();
  }

  saveData(f: HTMLFormElement) {
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
          (this.modalInputModel.type === ModalTypeEnum.CREATE ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
        this.closeModal();
        this.controlService.showToast(PageEnum.MODAL_MAINTENANCE, ToastTypeEnum.SUCCESS,
          (this.modalInputModel.type === ModalTypeEnum.CREATE ? 'PAGE_CONFIGURATION.AddSaveMaintenance' : 'PAGE_CONFIGURATION.EditSaveMaintenance'),
          { maintenance: this.maintenance.description });
      }).catch(e => {
        this.controlService.showToast(PageEnum.MODAL_MAINTENANCE, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveMaintenance', e);
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

  closeModal() {
    this.controlService.closeModal(this.modalController);
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
