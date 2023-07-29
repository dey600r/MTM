import { Component, Input } from '@angular/core';

// LIBRARIES

// UTILS
import { ModalInputModel, IInfoModel } from '@models/index';

@Component({
  selector: 'app-info',
  templateUrl: 'app-info.component.html',
  styleUrls: ['app-info.component.scss']
})
export class AppInfoComponent {
  // MODAL MODELS
  @Input() inputInfo: ModalInputModel<IInfoModel> = new ModalInputModel<IInfoModel>();
 }
