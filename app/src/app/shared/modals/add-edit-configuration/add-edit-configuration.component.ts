import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDB } from '@app/core/utils';
import { ModalInputModel, ModalOutputModel, ConfigurationModel } from '@models/index';
import { DataBaseService, CommonService } from '@services/index';

@Component({
  selector: 'app-add-edit-configuration',
  templateUrl: 'add-edit-configuration.component.html',
  styleUrls: ['add-edit-configuration.component.scss', '../../../app.component.scss']
})
export class AddEditConfigurationComponent implements OnInit {

  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  configuration: ConfigurationModel = new ConfigurationModel();

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
    this.configuration = Object.assign({}, this.modalInputModel.data);
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
    return this.isValidName(f) && this.isValidDescription(f);
  }

  isValidName(f: any): boolean {
    return f.configurationName !== undefined && f.configurationName.validity.valid;
  }

  isValidDescription(f: any): boolean {
    return f.configurationDescription !== undefined && f.configurationDescription.validity.valid;
  }
}
