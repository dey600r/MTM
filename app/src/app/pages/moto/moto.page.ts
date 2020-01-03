import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataBaseService, MotoService, CommonService } from '@services/index';
import { MotoModel, ModalInputModel, ModalOutputModel } from '@models/index';
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
              private commonService: CommonService) {
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
    const alert = await this.alertController.create({
      header: this.translator.instant('MOTORBIKE'),
      message: this.translator.instant('ConfirmDeleteMoto', {moto: `${this.rowSelected.brand} ${this.rowSelected.model}`}),
      buttons: [
        {
          text: this.translator.instant('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translator.instant('ACCEPT'),
          handler: () => {
            this.motoService.saveMoto(this.rowSelected, ActionDB.delete).then(x => {
              this.showSaveToast();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showSaveToast() {
    const toast = await this.toastController.create({
      message: this.translator.instant('DeleteSaveMoto', { moto: `${this.rowSelected.brand} ${this.rowSelected.model}` }),
      duration: Constants.DELAY_TOAST
    });
    toast.present();
  }

}
