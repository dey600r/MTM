import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { ModalInputModel, ModalOutputModel, MotoModel, ConfigurationModel } from '@models/index';
import { DataBaseService } from '@services/index';
import { Form } from '@angular/forms';
import { ActionDB } from '@app/core/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-moto',
  templateUrl: 'add-edit-moto.component.html',
  styleUrls: ['add-edit-moto.component.scss', '../../../app.component.scss']
})
export class AddEditMotoComponent implements OnInit {

  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  moto: MotoModel = new MotoModel();

  submited = false;

  configurations: ConfigurationModel[] = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private toastController: ToastController,
    private translator: TranslateService
  ) { }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList);
    this.moto = this.modalInputModel.data;

    this.dbService.getConfigurations().subscribe(x => {
      this.configurations = x;
    });
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      this.dbService.saveMoto(this.moto, (this.modalInputModel.data.isCreate ? ActionDB.create : ActionDB.update)).then(res => {
        this.closeModal();
        this.showSaveToast();
      });
    }
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  async showSaveToast() {
    const toast = await this.toastController.create({
      message: (this.modalInputModel.data.isCreate ?
                this.translator.instant('AddSaveMoto', { moto: this.moto.model }) :
                this.translator.instant('EditSaveMoto', { moto: this.moto.model })),
      duration: 2000
    });
    toast.present();
  }

  isValidForm(f: any): boolean {
    return this.isValidBrand(f) && this.isValidModel(f) && this.isValidYear && this.isValidKm(f) &&
            this.isValidConfiguration(f) && this.isValidKmsPerMonth(f);
  }

  isValidBrand(f: any): boolean {
    return f.motoBrand !== undefined && f.motoBrand.validity.valid;
  }

  isValidModel(f: any): boolean {
    return f.motoModel !== undefined && f.motoModel.validity.valid;
  }

  isValidYear(f: any): boolean {
    return f.motoYear !== undefined && f.motoYear.validity.valid;
  }

  isValidKm(f: any): boolean {
    return f.motoKm !== undefined && f.motoKm.validity.valid;
  }

  isValidConfiguration(f: any): boolean {
    return f.motoConfiguration !== undefined && f.motoConfiguration.validity.valid;
  }

  isValidKmsPerMonth(f: any): boolean {
    return f.motoKmsPerMonth !== undefined && f.motoKmsPerMonth.validity.valid;
  }
}
