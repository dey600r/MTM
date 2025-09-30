import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// UTILS
import { ActionDBEnum, ModalTypeEnum, PageEnum, ToastTypeEnum } from '@utils/index';
import { ModalInputModel, MaintenanceElementModel, HeaderInputModel } from '@models/index';
import { ConfigurationService, ControlService } from '@services/index';

@Component({
    selector: 'app-add-edit-maintenance-element',
    templateUrl: 'add-edit-maintenance-element.component.html',
    styleUrls: [],
    standalone: false
})
export class AddEditMaintenanceElementComponent implements OnInit {

  // INJECTIONS
  private readonly modalController: ModalController = inject(ModalController);
  private readonly controlService: ControlService = inject(ControlService);
  private readonly configurationService: ConfigurationService = inject(ConfigurationService);

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<MaintenanceElementModel> = new ModalInputModel<MaintenanceElementModel>();
  headerInput: HeaderInputModel = new HeaderInputModel();
  
  // MODEL FORM
  maintenanceElement: MaintenanceElementModel = new MaintenanceElementModel();
  submited = false;

  ngOnInit() {
    this.headerInput = new HeaderInputModel({
      title: (this.modalInputModel.type == ModalTypeEnum.CREATE ? 'PAGE_CONFIGURATION.AddNewReplacement': 'PAGE_CONFIGURATION.EditReplacement')
    });

    this.maintenanceElement = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.type === ModalTypeEnum.CREATE) {
      this.maintenanceElement.id = -1;
    }
  }

  saveData(f: HTMLFormElement) {
    this.submited = true;
    if (this.isValidForm(f)) {
      this.configurationService.saveMaintenanceElement(this.maintenanceElement,
          (this.modalInputModel.type === ModalTypeEnum.CREATE ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
        this.closeModal();
        this.controlService.showToast(PageEnum.MODAL_MAINTENANCE_ELEMENT, ToastTypeEnum.SUCCESS, 
          (this.modalInputModel.type === ModalTypeEnum.CREATE ? 'PAGE_CONFIGURATION.AddSaveReplacement' : 'PAGE_CONFIGURATION.EditSaveReplacement'),
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
