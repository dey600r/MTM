import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';

// SERVICES
import { ControlService } from '@services/index';

// UTILS
import { ModalHeaderInputModel, ModalHeaderOutputModel } from '@models/index';
import { ModalHeaderOutputEnum } from '@utils/index';

@Component({
  selector: 'app-header-modal',
  templateUrl: './header-modal.component.html',
})
export class HeaderModalComponent implements OnChanges {

  @Input() input: ModalHeaderInputModel = new ModalHeaderInputModel();
  @Output() output: EventEmitter<ModalHeaderOutputModel> = new EventEmitter();

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

  emitButtonHeader(event: any) {
    this.output.emit(new ModalHeaderOutputModel(ModalHeaderOutputEnum.BUTTON, event));
  }

  emitSegmentHeader(event: any) {
    this.output.emit(new ModalHeaderOutputModel(ModalHeaderOutputEnum.SEGMENT, event));
  }

  activeSegmentScroll(): boolean {
    return this.controlService.activeSegmentScroll(this.input.dataSegment.length);
  }

  async closeModal() {
    await this.controlService.closeModal(this.modalController);
  }

}
