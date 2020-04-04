import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDB } from '@app/core/utils';
import { ModalInputModel, ModalOutputModel, MaintenanceModel } from '@models/index';
import { DataBaseService, CommonService } from '@services/index';

@Component({
  selector: 'app-add-edit-maintenance',
  templateUrl: 'add-edit-maintenance.component.html',
  styleUrls: ['add-edit-maintenance.component.scss', '../../../app.component.scss']
})
export class AddEditMaintenanceComponent implements OnInit {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  // MODEL FORM
  maintenance: MaintenanceModel = new MaintenanceModel();
  submited = false;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private translator: TranslateService,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList);
    this.maintenance = Object.assign({}, this.modalInputModel.data);
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
    //   this.motoService.saveMoto(this.moto, (this.modalInputModel.isCreate ? ActionDB.create : ActionDB.update)).then(res => {
    //     this.closeModal();
    //     this.commonService.showToast((this.modalInputModel.isCreate ? 'AddSaveMoto' : 'EditSaveMoto'),
    //       { moto: this.moto.model });
    //   }).catch(e => {
    //     this.commonService.showToast('ErrorSaveMoto');
    //   });
    }
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  isValidForm(f: any): boolean {
    return this.isValidDescription(f);
  }

  isValidDescription(f: any): boolean {
    return f.maintenanceDescription !== undefined && f.maintenanceDescription.validity.valid;
  }
}
