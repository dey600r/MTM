import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDB, ConstantsColumns, Constants } from '@app/core/utils';
import { ModalInputModel, ModalOutputModel, MotoModel, ConfigurationModel, OperationModel } from '@models/index';
import { DataBaseService, MotoService, CommonService } from '@services/index';

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
  operations: OperationModel[] = [];

  // TRANSLATE
  translateYearBetween = '';

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private translator: TranslateService,
    private motoService: MotoService,
    private commonService: CommonService
  ) {
    this.translateYearBetween = this.translator.instant('PAGE_MOTO.AddYearBetween', { year: new Date().getFullYear()});
  }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList);
    this.moto = Object.assign({}, this.modalInputModel.data);

    this.dbService.getConfigurations().subscribe(data => {
      this.configurations = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME);
    });

    this.dbService.getOperations().subscribe(data => {
      // Filter to get less elemnts to better perfomance
      this.operations = data.filter(x => x.moto.id === this.moto.id);
    });
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      const result = this.validateDateAndKmToOperations();
      if (result !== '') {
        this.commonService.showToast(result, null, Constants.DELAY_TOAST_HIGHER);
      } else {
        // Save date to change km to calculate maintenance
        if (!this.modalInputModel.isCreate && this.modalInputModel.data.km !== this.moto.km) {
          this.moto.dateKms = new Date();
        }

        this.motoService.saveMoto(this.moto, (this.modalInputModel.isCreate ? ActionDB.create : ActionDB.update)).then(res => {
          this.closeModal();
          this.commonService.showToast((
            this.modalInputModel.isCreate ? 'PAGE_MOTO.AddSaveMoto' : 'PAGE_MOTO.EditSaveMoto'),
            { moto: this.moto.model });
        }).catch(e => {
          this.commonService.showToast('PAGE_MOTO.ErrorSaveMoto');
        });
      }
    }
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
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

  validateDateAndKmToOperations(): string {
    let msg = '';

    if (!!this.operations && this.operations.length > 0 && this.operations.some(x => this.moto.km < x.km)) {
      msg = this.translator.instant('PAGE_MOTO.AddKmHigher',
        { km: this.commonService.max(this.operations, ConstantsColumns.COLUMN_MTM_OPERATION_KM)});
    }

    return msg;
  }
}
