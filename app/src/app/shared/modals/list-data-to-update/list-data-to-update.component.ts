import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// MODELS
import { ModalInputModel, ModalOutputModel, ListModalModel, HeaderInputModel } from '@models/index';

// SERVICES
import { ControlService } from '@services/index';

// UTILS
import { ModalOutputEnum } from '@utils/index';

@Component({
    selector: 'app-list-data-to-update',
    templateUrl: './list-data-to-update.component.html',
    styleUrls: [],
    standalone: false
})
export class ListDataToUpdateComponent implements OnInit {

  // INJECTIONS
  private readonly controlService: ControlService = inject(ControlService);
  private readonly modalController: ModalController = inject(ModalController);

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<ListModalModel> = new ModalInputModel<ListModalModel>();
  headerInput: HeaderInputModel = new HeaderInputModel();

  ngOnInit(): void {
    this.headerInput = new HeaderInputModel({
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
