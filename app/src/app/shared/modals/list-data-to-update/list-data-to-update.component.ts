import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

// MODELS
import { ModalInputModel, ModalOutputModel, ListModalModel } from '@models/index';

// SERVICES
import { ControlService } from '@services/index';

// UTILS
import { ModalOutputEnum } from '@utils/index';

@Component({
  selector: 'app-list-data-to-update',
  templateUrl: './list-data-to-update.component.html',
  styleUrls: [],
})
export class ListDataToUpdateComponent {

  // MODAL MODELS
  modalInputModel: ModalInputModel<ListModalModel> = new ModalInputModel<ListModalModel>();

  constructor(private controlService: ControlService,
              private modalController: ModalController,
              private navParams: NavParams) {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);
  }

  save() {
    this.controlService.closeModal(this.modalController, new ModalOutputModel(ModalOutputEnum.SAVE, this.modalInputModel.data));
  }

  closeModal() {
    this.controlService.closeModal(this.modalController, new ModalOutputModel(ModalOutputEnum.CANCEL));
  }

}
