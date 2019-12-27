import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ModalInputModel, ModalOutputModel, MotoModel } from '@models/index';

@Component({
  selector: 'app-add-edit-moto',
  templateUrl: 'add-edit-moto.component.html',
  styleUrls: ['add-edit-moto.component.scss', '../../../app.component.scss']
})
export class AddEditMotoComponent implements OnInit {

  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  moto: MotoModel = new MotoModel();

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate, 
      this.navParams.data.data, this.navParams.data.dataList);
    this.moto = this.modalInputModel.data;
  }

  saveData(event: any) {

  }

  handleFirstNameValue(event: any) {

  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }
}
