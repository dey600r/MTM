import { Component, Input } from '@angular/core';

// LIBRARIES

// UTILS
import { ModalInputModel } from '@models/index';
import { Constants, PageEnum } from '@utils/index';

@Component({
  selector: 'app-info',
  templateUrl: 'app-info.component.html',
  styleUrls: ['app-info.component.scss', '../../../app.component.scss']
})
export class AppInfoComponent {

  // MODAL MODELS
  @Input() inputInfo: ModalInputModel = new ModalInputModel();

  isVehicleEmpty(): boolean {
    return this.inputInfo.parentPage !== PageEnum.VEHICLE && this.isVehiclePageEmpty();
  }

  isVehiclePageEmpty(): boolean {
    return this.inputInfo.action === Constants.STATE_INFO_VEHICLE_EMPTY;
  }

  isOperationEmpty(): boolean {
    return this.inputInfo.parentPage !== PageEnum.OPERATION && this.isOperationPageEmpty();
  }

  isOperationPageEmpty(): boolean {
    return this.inputInfo.action === Constants.STATE_INFO_OPERATION_EMPTY;
  }

  isNotificationEmpty(): boolean {
    return this.inputInfo.parentPage !== PageEnum.CONFIGURATION && this.isNotificationPageEmpty();
  }

  isNotificationPageEmpty(): boolean {
    return this.inputInfo.action === Constants.STATE_INFO_NOTIFICATION_EMPTY;
  }
 }
