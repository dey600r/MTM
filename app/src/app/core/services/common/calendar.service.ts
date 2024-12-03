import { Injectable } from '@angular/core';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

// UTILS
import { Constants } from '@utils/index';

// MODELS
import { VehicleModel } from '@models/index';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private readonly translator: TranslateService) {
    }

    // COMMON UTILS METHODS STRINGS

    getDateString(date: Date): any {
        return moment(date).format(this.getFormatCalendar());
    }

    getDateStringToDB(date: Date): any {
        return moment(date).format(Constants.DATE_FORMAT_DB);
    }

    getDateTimeStringToDB(date: Date): any {
        return moment(date).format(Constants.DATE_TIME_FORMAT_DB);
    }

    getFormatCalendar() {
        return this.translator.currentLang === 'es' ? Constants.DATE_FORMAT_ES : Constants.DATE_FORMAT_EN;
    }

    getFormatCalendarWeekStart() {
        return this.translator.currentLang === 'es' ? 1 : 0;
    }

    getFormatCalendarWeek() {
        return this.translator.currentLang === 'es' ?
            ['D', 'L', 'M', 'X', 'J', 'V', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    }

    getFormatCalendarMonth() {
        return this.translator.currentLang === 'es' ?
            ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DEC'] :
            ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    }

    // COMMON UTILS METHODS

    monthDiff(dateIni: Date, dateFin: Date): number {
        let months: number = (dateFin.getFullYear() - dateIni.getFullYear()) * 12;
        months -= dateIni.getMonth() + 1;
        months += dateFin.getMonth() + 1;
        return months <= 0 ? 0 : months;
    }

    dayDiff(dateIni: Date, dateFin: Date): number {
        const diffc: number = dateFin.getTime() - dateIni.getTime();
        const days: number = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
        return days <= 0 ? 0 : days;
    }

    sumTimeToDate(date: Date, time: number): Date {
        const dateResult: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        dateResult.setMonth(dateResult.getMonth() + time);
        return dateResult;
    }
        
    // CALCULATE VEHICLE

    calculateKmVehicleEstimated(vehicle: VehicleModel): number {
        const kmPerM: number = this.calculateKmsPerMonth(vehicle);
        const dateKm: Date = new Date(vehicle.dateKms);
        return vehicle.km + (vehicle.active ? (Math.round((kmPerM / 30) * this.dayDiff(dateKm, new Date()))) : 0 );
    }

    calculateKmsPerMonth(vehicle: VehicleModel): number {
        let kmPerM: number = vehicle.kmsPerMonth;
        const dateKm: Date = new Date(vehicle.dateKms);
        if (!kmPerM || kmPerM === 0) {
            const diffMonts: number = this.monthDiff(new Date(vehicle.datePurchase), dateKm);
            kmPerM = Math.round(vehicle.km / (diffMonts === 0 ? 1 : diffMonts));
        }
        return (kmPerM === 0 ? 1 : kmPerM);
    }
}
