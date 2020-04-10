import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';
import { Subscription } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, Constants } from '@utils/index';
import {
  ModalInputModel, ModalOutputModel, MaintenanceModel,
  MaintenanceFreqModel, MaintenanceElementModel
} from '@models/index';
import { DataBaseService, CommonService, ConfigurationService } from '@services/index';

@Component({
  selector: 'app-add-edit-maintenance',
  templateUrl: 'add-edit-maintenance.component.html',
  styleUrls: ['add-edit-maintenance.component.scss', '../../../app.component.scss']
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

  // SUBSCRIPTION
  maintenanceElmentSubscription: Subscription = new Subscription();
  maintenanceFreqSubscription: Subscription = new Subscription();

  // TRANSLATE
  translateSelect = '';

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private configurationService: ConfigurationService,
    private translator: TranslateService,
    private commonService: CommonService
  ) {
    this.translateSelect = this.translator.instant('COMMON.SELECT');
  }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);
    this.maintenance = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.isCreate) {
      this.maintenance.id = -1;
      this.maintenance.maintenanceElement.id = null;
      this.maintenance.maintenanceFreq.id = null;
    }

    this.maintenanceElmentSubscription = this.dbService.getMaintenanceElement().subscribe(data => {
      this.maintenanceElements = this.configurationService.orderMaintenanceElement(data);
    });

    this.maintenanceFreqSubscription = this.dbService.getMaintenanceFreq().subscribe(data => {
      this.maintenanceFreqs = data;
    });
  }

  ngOnDestroy() {
    this.maintenanceElmentSubscription.unsubscribe();
    this.maintenanceFreqSubscription.unsubscribe();
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      if (this.isInitDisabled()) {
        this.maintenance.init = false;
      }
      this.configurationService.saveMaintenance(this.maintenance,
          (this.modalInputModel.isCreate ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
        this.closeModal();
        this.commonService.showToast((this.modalInputModel.isCreate ?
            'PAGE_CONFIGURATION.AddSaveMaintenance' : 'PAGE_CONFIGURATION.EditSaveMaintenance'),
          { maintenance: this.maintenance.description });
      }).catch(e => {
        this.commonService.showToast('PAGE_CONFIGURATION.ErrorSaveMaintenance');
      });
    }
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
    return f.maintenanceReplacement !== undefined && f.maintenanceReplacement.validity.valid && !!f.maintenanceReplacement.value;
  }

  isValidFreq(f: any): boolean {
    return f.maintenanceFreq !== undefined && f.maintenanceFreq.validity.valid && !!f.maintenanceFreq.value;
  }

  isValidKm(f: any): boolean {
    return f.maintenanceKm !== undefined && f.maintenanceKm.validity.valid;
  }
}
