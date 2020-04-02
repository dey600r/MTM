import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDB } from '@app/core/utils';
import { ModalInputModel, ModalOutputModel, MaintenanceElementModel } from '@models/index';
import { DataBaseService, CommonService, ConfigurationService } from '@services/index';

@Component({
  selector: 'app-add-edit-maintenance-element',
  templateUrl: 'add-edit-maintenance-element.component.html',
  styleUrls: ['add-edit-maintenance-element.component.scss', '../../../app.component.scss']
})
export class AddEditMaintenanceElementComponent implements OnInit {

  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  maintenanceElement: MaintenanceElementModel = new MaintenanceElementModel();

  submited = false;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private translator: TranslateService,
    private commonService: CommonService,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList);
    this.maintenanceElement = Object.assign({}, this.modalInputModel.data);
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      this.configurationService.saveMaintenanceElement(this.maintenanceElement,
          (this.modalInputModel.isCreate ? ActionDB.create : ActionDB.update)).then(res => {
        this.closeModal();
        this.commonService.showToast((this.modalInputModel.isCreate ?
          'PAGE_CONFIGURATION.AddSaveReplacement' : 'PAGE_CONFIGURATION.EditSaveReplacement'),
          { replacement: this.maintenanceElement.name });
      }).catch(e => {
        this.commonService.showToast('PAGE_CONFIGURATION.ErrorSaveReplacement');
      });
    }
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  isValidForm(f: any): boolean {
    return this.isValidName(f) && this.isValidDescription(f);
  }

  isValidName(f: any): boolean {
    return f.replacementName !== undefined && f.replacementName.validity.valid;
  }

  isValidDescription(f: any): boolean {
    return f.replacementDescription !== undefined && f.replacementDescription.validity.valid;
  }
}
