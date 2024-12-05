import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

// UTILS
import { ActionDBEnum, PageEnum, ToastTypeEnum } from '@app/core/utils';
import { ModalInputModel, MaintenanceElementModel } from '@models/index';
import { ConfigurationService, ControlService } from '@services/index';

@Component({
  selector: 'app-add-edit-maintenance-element',
  templateUrl: 'add-edit-maintenance-element.component.html',
  styleUrls: []
})
export class AddEditMaintenanceElementComponent implements OnInit {

  // MODAL MODELS
  modalInputModel: ModalInputModel<MaintenanceElementModel> = new ModalInputModel<MaintenanceElementModel>();

  // MODEL FORM
  maintenanceElement: MaintenanceElementModel = new MaintenanceElementModel();
  submited = false;

  constructor(
    private readonly modalController: ModalController,
    private readonly navParams: NavParams,
    private readonly controlService: ControlService,
    private readonly configurationService: ConfigurationService
  ) {
  }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel<MaintenanceElementModel>(this.navParams.data);
    this.maintenanceElement = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.isCreate) {
      this.maintenanceElement.id = -1;
    }
  }

  saveData(f: HTMLFormElement) {
    this.submited = true;
    if (this.isValidForm(f)) {
      this.configurationService.saveMaintenanceElement(this.maintenanceElement,
          (this.modalInputModel.isCreate ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
        this.closeModal();
        this.controlService.showToast(PageEnum.MODAL_MAINTENANCE_ELEMENT, ToastTypeEnum.SUCCESS, (this.modalInputModel.isCreate ?
          'PAGE_CONFIGURATION.AddSaveReplacement' : 'PAGE_CONFIGURATION.EditSaveReplacement'),
          { replacement: this.maintenanceElement.name });
      }).catch(e => {
        this.controlService.showToast(PageEnum.MODAL_MAINTENANCE_ELEMENT, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveReplacement', e);
      });
    }
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
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
