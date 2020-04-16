import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';

// LIBRARIES

// UTILS
import { ModalInputModel, ModalOutputModel } from '@models/index';
import { Constants, PageEnum } from '@utils/index';

@Component({
  selector: 'app-info',
  templateUrl: 'app-info.component.html',
  styleUrls: ['app-info.component.scss', '../../../app.component.scss']
})
export class AppInfoComponent implements OnInit, OnDestroy {

  // MODAL MODELS
  @Input() inputInfo: ModalInputModel = new ModalInputModel();
  @Output() modalOutputModel: ModalOutputModel = new ModalOutputModel();

  constructor() {
   }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  isMotoEmpty(): boolean {
    return this.inputInfo.parentPage !== PageEnum.MOTO && this.isMotoPageEmpty();
  }

  isMotoPageEmpty(): boolean {
    return this.inputInfo.action === Constants.STATE_INFO_MOTO_EMPTY;
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
