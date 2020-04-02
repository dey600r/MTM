import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDB, ConstantsColumns } from '@utils/index';
import { DataBaseService, MotoService, CommonService, OperationService } from '@services/index';
import { MotoModel, ModalInputModel, ModalOutputModel, OperationModel } from '@models/index';

// COMPONENTS
import { AddEditMotoComponent } from '@modals/add-edit-moto/add-edit-moto.component';


@Component({
  selector: 'app-moto',
  templateUrl: 'moto.page.html',
  styleUrls: ['moto.page.scss', '../../app.component.scss']
})
export class MotoPage implements OnInit {

  motos: MotoModel[] = [];
  operations: OperationModel[] = [];
  dataInputModel: ModalInputModel;
  dataReturned: ModalOutputModel;
  rowSelected: MotoModel = new MotoModel();

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private modalController: ModalController,
              private translator: TranslateService,
              private alertController: AlertController,
              private motoService: MotoService,
              private commonService: CommonService,
              private operationService: OperationService) {
      this.platform.ready().then(() => {
        let userLang = navigator.language.split('-')[0];
        userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
        this.translator.use(userLang);
      });
  }

  /** INIT */

  ngOnInit() {
    this.dbService.getMotos().subscribe(data => {
      if (!!data && data.length > 0 && this.operationService.getSearchOperation().searchMoto.brand === null) {
        this.operationService.setSearchOperation(data[0]);
      } else {
        this.operationService.setSearchOperation();
      }
      this.motos = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MOTO_BRAND);
    });

    this.dbService.getOperations().subscribe(data => {
      this.operations = data;
    });
  }

  /** MODALS */

  openMotoModal(row: MotoModel = new MotoModel(), create: boolean = true) {
    this.rowSelected = row;
    this.dataInputModel = new ModalInputModel(create, this.rowSelected);
    this.openModal();
  }

  deleteMoto(row: MotoModel) {
    this.rowSelected = row;
    this.showConfirmDelete();
  }

  changeFilterOperation(idMoto: number) {
    this.operationService.setSearchOperation(this.motos.find(x => x.id === idMoto));
  }

  async openModal() {

    const modal = await this.modalController.create({
      component: AddEditMotoComponent,
      componentProps: this.dataInputModel
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
    });

    return await modal.present();
  }

  async showConfirmDelete() {
    let ops: OperationModel[] = [];
    if (!!this.operations && this.operations.length > 0) {
      ops = this.operations.filter(x => x.moto.id === this.rowSelected.id);
    }
    const message: string = (!!ops && ops.length > 0 ?
      'PAGE_MOTO.ConfirmDeleteMotoOperation' : 'PAGE_MOTO.ConfirmDeleteMoto');
    const alert = await this.alertController.create({
      header: this.translator.instant('COMMON.MOTORBIKE'),
      message: this.translator.instant(message, {moto: `${this.rowSelected.brand} ${this.rowSelected.model}`}),
      buttons: [
        {
          text: this.translator.instant('COMMON.CANCEL'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.motoService.saveMoto(this.rowSelected, ActionDB.delete, ops).then(x => {
              this.commonService.showToast('PAGE_MOTO.DeleteSaveMoto',
                { moto: `${this.rowSelected.brand} ${this.rowSelected.model}` });
            }).catch(e => {
              this.commonService.showToast('PAGE_MOTO.ErrorSaveMoto');
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
