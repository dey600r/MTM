import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';

// SERVICES
import { ControlService } from '@services/index';

// UTILS
import { HeaderInputModel, HeaderOutputModel } from '@models/index';
import { HeaderOutputEnum } from '@utils/index';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: false
})
export class HeaderComponent implements OnChanges {

  // INJECTIONS
  private readonly modalController: ModalController = inject(ModalController);
  private readonly controlService: ControlService = inject(ControlService);

  // INPUTS / OUTPUTS
  @Input() input: HeaderInputModel = new HeaderInputModel();
  @Output() output: EventEmitter<HeaderOutputModel> = new EventEmitter();

  // DATA
  selectedSegment: number;

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
    this.controlService.closeModal(this.modalController);
  }

}
