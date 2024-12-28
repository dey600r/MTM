import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';

// SERVICES
import { ControlService } from '@services/index';

// UTILS
import { HeaderInputModel, HeaderOutputModel } from '@models/index';
import { HeaderOutputEnum } from '@utils/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnChanges {

  @Input() input: HeaderInputModel = new HeaderInputModel();
  @Output() output: EventEmitter<HeaderOutputModel> = new EventEmitter();

  selectedSegment: number;

  constructor(
    private readonly modalController: ModalController,
    private readonly controlService: ControlService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(this.input.dataSegment && this.input.dataSegment.length > 0) {
        const selected = this.input.dataSegment.find(x => x.selected);
        this.selectedSegment = (selected ? selected.id : 0);
      }
  }

  emitButtonLeft(event: any) {
    this.output.emit(new HeaderOutputModel(HeaderOutputEnum.BUTTON_LEFT, event));
  }

  emitButtonRight(event: any) {
    this.output.emit(new HeaderOutputModel(HeaderOutputEnum.BUTTON_RIGHT, event));
  }

  emitSegmentHeader(event: any) {
    this.output.emit(new HeaderOutputModel(HeaderOutputEnum.SEGMENT, event));
  }

  activeSegmentScroll(): boolean {
    return this.controlService.activeSegmentScroll(this.input.dataSegment.length);
  }

  closeModal() {
    return this.controlService.closeModal(this.modalController);
  }

}
