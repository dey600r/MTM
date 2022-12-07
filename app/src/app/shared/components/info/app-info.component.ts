import { Component, Input } from '@angular/core';

// LIBRARIES

// UTILS
import { ModalInputModel } from '@models/index';
import { IInfoModel } from '@utils/index';

@Component({
  selector: 'app-info',
  templateUrl: 'app-info.component.html',
  styleUrls: ['app-info.component.scss']
})
export class AppInfoComponent {
  // MODAL MODELS
  @Input() inputInfo: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
 }
