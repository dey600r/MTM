import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataBaseService, MotoService, CommonService, OperationService } from '@services/index';
import { MotoModel, ModalInputModel, ModalOutputModel, OperationModel } from '@models/index';
import { ModalController, Platform, AlertController, ToastController } from '@ionic/angular';

import { AddEditMotoComponent } from '@modals/add-edit-moto/add-edit-moto.component';
import { ActionDB, ConstantsTable, ConstantsColumns, Constants } from '@utils/index';

@Component({
  selector: 'app-moto',
  templateUrl: 'moto.page.html',
  styleUrls: ['moto.page.scss', '../../app.component.scss']
})
export class MotoPage implements OnInit, OnChanges {

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
              private toastController: ToastController,
              private motoService: MotoService,
              private commonService: CommonService,
              private operationService: OperationService) {
      this.platform.ready().then(() => {
        let userLang = navigator.language.split('-')[0];
        userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
        this.translator.use(userLang);
      });
  }

  ngOnInit() {
    this.dbService.getMotos().subscribe(x => {
      this.motos = this.commonService.orderBy(x, ConstantsColumns.COLUMN_MTM_MOTO_BRAND);
    });

    this.dbService.getOperations().subscribe(data => {
      this.operations = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  openCreateModal() {
    this.rowSelected = new MotoModel();
    this.dataInputModel = new ModalInputModel(true, this.rowSelected);
    this.openModal();
  }

  openEditModal(row: MotoModel) {
    this.rowSelected = row;
    this.dataInputModel = new ModalInputModel(false, this.rowSelected);
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
    const message: string = (!!ops && ops.length > 0 ? 'ConfirmDeleteMotoOperation' : 'ConfirmDeleteMoto');
    const alert = await this.alertController.create({
      header: this.translator.instant('MOTORBIKE'),
      message: this.translator.instant(message, {moto: `${this.rowSelected.brand} ${this.rowSelected.model}`}),
      buttons: [
        {
          text: this.translator.instant('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translator.instant('ACCEPT'),
          handler: () => {
            this.motoService.saveMoto(this.rowSelected, ActionDB.delete, ops).then(x => {
              this.showSaveToast('DeleteSaveMoto', { moto: `${this.rowSelected.brand} ${this.rowSelected.model}` });
            }).catch(e => {
              this.showSaveToast('ErrorSaveMoto');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showSaveToast(msg: string, data: any = null) {
    const toast = await this.toastController.create({
      message: this.translator.instant(msg, data),
      duration: Constants.DELAY_TOAST
    });
    toast.present();
  }

}
