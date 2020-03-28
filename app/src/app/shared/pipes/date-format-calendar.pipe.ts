
import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '@services/index';


@Pipe({name: 'dateFormatCalendarPipe'})
export class DateFormatCalendarPipe implements PipeTransform {
    constructor(private commonService: CommonService) {

    }

    transform(date: Date = new Date()): string {
    return this.commonService.getDateString(date);
    }
}
