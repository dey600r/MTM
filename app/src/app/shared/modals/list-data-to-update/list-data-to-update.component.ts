import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

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
  @Input() modalInputModel: ModalInputModel<ListModalModel> = new ModalInputModel<ListModalModel>();

  constructor(private readonly controlService: ControlService,
              private readonly modalController: ModalController) {
  }

  save() {
    this.controlService.closeModal(this.modalController, new ModalOutputModel<ListModalModel>({
        action: ModalOutputEnum.SAVE, 
        data: this.modalInputModel.data
      }));
  }

  closeModal() {
    this.controlService.closeModal(this.modalController, new ModalOutputModel<ListModalModel>({
      action: ModalOutputEnum.CANCEL, 
      data: this.modalInputModel.data
    }));
  }

}
