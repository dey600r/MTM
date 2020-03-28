import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { ModalInputModel, ModalOutputModel, MotoModel, ConfigurationModel } from '@models/index';
import { DataBaseService, MotoService } from '@services/index';
import { Form } from '@angular/forms';
import { ActionDB, Constants } from '@app/core/utils';
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

  // TRANSLATE
  translateYearBetween = '';

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private toastController: ToastController,
    private translator: TranslateService,
    private motoService: MotoService
  ) {
    this.translateYearBetween = this.translator.instant('AddYearBetween', { year: new Date().getFullYear()});
  }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList);
    this.moto = Object.assign({}, this.modalInputModel.data);

    this.dbService.getConfigurations().subscribe(x => {
      this.configurations = x;
    });
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      // Save date to change km to calculate maintenance
      if (!this.modalInputModel.isCreate && this.modalInputModel.data.km !== this.moto.km) {
        this.moto.dateKms = new Date();
      }

      this.motoService.saveMoto(this.moto, (this.modalInputModel.isCreate ? ActionDB.create : ActionDB.update)).then(res => {
        this.closeModal();
        if (this.modalInputModel.isCreate) {
          this.showSaveToast('AddSaveMoto', { moto: this.moto.model });
        } else {
          this.showSaveToast('EditSaveMoto', { moto: this.moto.model });
        }
      }).catch(e => {
        this.showSaveToast('ErrorSaveMoto');
      });
    }
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  async showSaveToast(msg: string, data: any = null) {
    const toast = await this.toastController.create({
      message: this.translator.instant(msg, data),
      duration: Constants.DELAY_TOAST
    });
    toast.present();
  }

  isValidForm(f: any): boolean {
    return this.isValidBrand(f) && this.isValidModel(f) && this.isValidYearBetween(f) &&
           this.isValidKmMin(f) && this.isValidConfiguration(f) && this.isValidKmsPerMonth(f);
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

  isValidYearBetween(f: any): boolean {
    return this.isValidYear(f) && f.motoYear.valueAsNumber >= 1900 &&
      f.motoYear.valueAsNumber <= new Date().getFullYear();
  }

  isValidKm(f: any): boolean {
    return f.motoKm !== undefined && f.motoKm.validity.valid;
  }

  isValidKmMin(f: any): boolean {
    return this.isValidKm(f) && f.motoKm.valueAsNumber >= 0;
  }

  isValidConfiguration(f: any): boolean {
    return f.motoConfiguration !== undefined && f.motoConfiguration.validity.valid;
  }

  isValidKmsPerMonth(f: any): boolean {
    return f.motoKmsPerMonth !== undefined && f.motoKmsPerMonth.validity.valid;
  }
}
