import { Component, Input } from '@angular/core';

// MODELS
import { BodySkeletonInputModel } from '@models/index';

@Component({
  selector: 'app-body-skeleton',
  templateUrl: './body-skeleton.component.html',
})
export class BodySkeletonComponent {
  
  @Input() input: BodySkeletonInputModel = new BodySkeletonInputModel();
  
}
