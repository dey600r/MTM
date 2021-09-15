
import { Pipe, PipeTransform } from '@angular/core';
import { CalendarService } from '@services/index';


@Pipe({name: 'dateFormatCalendarPipe'})
export class DateFormatCalendarPipe implements PipeTransform {
    constructor(private calendarService: CalendarService) {

    }

    transform(date: Date = new Date()): string {
        return this.calendarService.getDateString(date);
    }
}
