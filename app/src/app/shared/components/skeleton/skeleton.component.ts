import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

// MODELS
import { SkeletonInputModel } from '@models/index';

@Component({
    selector: 'app-skeleton',
    templateUrl: './skeleton.component.html',
    styleUrls: ['./skeleton.component.scss'],
    standalone: false
})
export class SkeletonComponent implements OnChanges {
  
  @Input() loadedHeader: boolean;
  @Input() loadedBody: boolean;
  @Input() input: SkeletonInputModel = new SkeletonInputModel();
  @Output() loadedHeaderOutput: EventEmitter<boolean> = new EventEmitter();
  @Output() loadedBodyOutput: EventEmitter<boolean> = new EventEmitter();

  ngOnChanges(changes: any): void {
    if(changes.loadedHeader !== undefined && !changes.loadedHeader.currentValue) {
      this.showSkeletonHeader(this.input.time);
    }
    if(changes.loadedBody !== undefined && !changes.loadedBody.currentValue) {
      this.showSkeletonBody(this.input.time);
    }
  }

  showSkeletonHeader(time: number) {
    setTimeout(() => { 
      this.loadedHeader = true;  
      this.loadedHeaderOutput.emit(this.loadedHeader);
    }, time);
  }

  showSkeletonBody(time: number) {
    setTimeout(() => { 
      this.loadedBody = true; 
      this.loadedBodyOutput.emit(this.loadedBody);
    }, time);
  }
}
