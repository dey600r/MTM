import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataBaseService } from '@services/index';
import { MotoModel, ModalInputModel, ModalOutputModel } from '@models/index';
import { ModalController } from '@ionic/angular';

import { AddEditMotoComponent } from '@modals/add-edit-moto/add-edit-moto.component';

@Component({
  selector: 'app-moto',
  templateUrl: 'moto.page.html',
  styleUrls: ['moto.page.scss', '../../app.component.scss']
})
export class MotoPage implements OnInit, OnChanges {

  motos: MotoModel[] = [];
  dataReturned: ModalOutputModel;
  rowSelected: MotoModel = new MotoModel();

  constructor(private dbService: DataBaseService,
              private modalController: ModalController) {}

  ngOnInit() {
    this.dbService.getMotos().subscribe(x => {
      this.motos = x;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  openCreateModal() {
    this.rowSelected = new MotoModel();
    this.openModal();
  }

  openEditModal(row: MotoModel) {
    this.rowSelected = row;
    this.openModal();
  }

  async openModal() {
    console.log('OPEN MODAL');

    const modal = await this.modalController.create({
      component: AddEditMotoComponent,
      componentProps: new ModalInputModel(true, this.rowSelected)
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
      console.log('CLOSE MODAL');
    });

    return await modal.present();
  }
}
