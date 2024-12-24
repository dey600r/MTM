import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// MODELS
import { ModalInputModel, ModalOutputModel, ListModalModel, ModalHeaderInputModel } from '@models/index';

// SERVICES
import { ControlService } from '@services/index';

// UTILS
import { ModalOutputEnum } from '@utils/index';

@Component({
  selector: 'app-list-data-to-update',
  templateUrl: './list-data-to-update.component.html',
  styleUrls: [],
})
export class ListDataToUpdateComponent implements OnInit {

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<ListModalModel> = new ModalInputModel<ListModalModel>();
  modalHeaderInput: ModalHeaderInputModel = new ModalHeaderInputModel();

  constructor(private readonly controlService: ControlService,
              private readonly modalController: ModalController) {
    
  }

  ngOnInit(): void {
    this.modalHeaderInput = new ModalHeaderInputModel({
      title: this.modalInputModel.data.titleHeader
    });
  }

  save() {
    this.controlService.closeModal(this.modalController, new ModalOutputModel<ListModalModel>({
        action: ModalOutputEnum.SAVE, 
        data: this.modalInputModel.data
      }));
  }

}
