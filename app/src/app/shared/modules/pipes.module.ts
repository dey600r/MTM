import { NgModule } from '@angular/core';

import { DateFormatCalendarPipe } from '../pipes/date-format-calendar.pipe';

@NgModule({
    imports: [],
    exports: [DateFormatCalendarPipe],
    providers: [DateFormatCalendarPipe],
    declarations: [DateFormatCalendarPipe]
  })
  export class PipeModule {}
