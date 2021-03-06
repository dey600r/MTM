import { Injectable } from '@angular/core';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';
import * as Moment from 'moment';

// UTILS
import { Constants, WarningWearEnum } from '@utils/index';
import {
    WearVehicleProgressBarViewModel, InfoCalendarVehicleViewModel, InfoCalendarMaintenanceViewModel,
    InfoCalendarReplacementViewModel, WearReplacementProgressBarViewModel, VehicleModel
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private translator: TranslateService) {
    }

    // COMMON UTILS METHODS STRINGS

    getDateString(date: Date): any {
        return Moment(date).format(this.getFormatCalendar());
    }

    getDateStringToDB(date: Date): any {
        return Moment(date).format(Constants.DATE_FORMAT_DB);
    }

    getDateTimeStringToDB(date: Date): any {
        return Moment(date).format(Constants.DATE_TIME_FORMAT_DB);
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

    calculateWearKmVehicleEstimated(wear: WearVehicleProgressBarViewModel): number {
        return this.calculateKmVehicleEstimated(new VehicleModel(null, null, 0, wear.kmVehicle,
            null, null, wear.kmsPerMonthVehicle, wear.dateKmsVehicle, wear.datePurchaseVehicle));
    }

    calculateKmVehicleEstimated(vehicle: VehicleModel): number {
        const kmPerM: number = this.calculateKmsPerMonth(vehicle);
        const dateKm: Date = new Date(vehicle.dateKms);
        return vehicle.km + (Math.round((kmPerM / 30) * this.dayDiff(dateKm, new Date())));
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

    // INFO CALENDAR

    getInfoCalendar(listWearsNotification: WearVehicleProgressBarViewModel[]): InfoCalendarVehicleViewModel[] {
        let result: InfoCalendarVehicleViewModel[] = [];

        if (!!listWearsNotification && listWearsNotification.length > 0) {
            listWearsNotification.forEach(wear => {
                let replacements: InfoCalendarMaintenanceViewModel[] = [];
                wear.listWearReplacement.forEach(replacement => {
                    let rep: InfoCalendarMaintenanceViewModel = replacements.find(x => x.idMaintenance === replacement.idMaintenance);
                    const calendarKm: InfoCalendarReplacementViewModel = this.createInfoCalendarReplacement(wear, replacement, true);
                    if (!!!rep) {
                        replacements = [...replacements, {
                            idMaintenance: replacement.idMaintenance,
                            descriptionMaintenance: replacement.descriptionMaintenance,
                            codeMaintenanceFreq: replacement.codeMaintenanceFreq,
                            fromKmMaintenance: replacement.fromKmMaintenance,
                            toKmMaintenance: replacement.toKmMaintenance,
                            initMaintenance: replacement.initMaintenance,
                            wearMaintenance: replacement.wearMaintenance,
                            listInfoCalendarReplacement: []
                        }];
                        rep = replacements.find(x => x.idMaintenance === replacement.idMaintenance);
                    }
                    rep.listInfoCalendarReplacement = [...rep.listInfoCalendarReplacement, calendarKm];
                    if (replacement.timeMaintenance !== 0) {
                        rep.listInfoCalendarReplacement = [...rep.listInfoCalendarReplacement,
                            this.createInfoCalendarReplacement(wear, replacement, false)];
                    }
                });
                result = [...result, {
                    idVehicle: wear.idVehicle,
                    nameVehicle: wear.nameVehicle,
                    typeVehicle: wear.typeVehicle,
                    listInfoCalendarMaintenance: replacements
                }];
            });
        }

        return result;
    }

    createInfoCalendarReplacement(wear: WearVehicleProgressBarViewModel, replacement: WearReplacementProgressBarViewModel,
                                  km: boolean): InfoCalendarReplacementViewModel {
        let dateResult: Date;
        let kms = 0;
        let times = 0;
        let warnings: WarningWearEnum;
        if (km) {
            const kmVehicle: number = this.calculateWearKmVehicleEstimated(wear);
            kms = kmVehicle + replacement.calculateKms;
            warnings = replacement.warningKms;
            if (replacement.calculateKms > 0) {
                dateResult = this.calculateKmInfoNotification(new VehicleModel(null, null, null, wear.kmVehicle, null, null,
                    wear.kmsPerMonthVehicle, wear.dateKmsVehicle, wear.datePurchaseVehicle), 0, replacement.calculateKms);
            } else {
                let diffVehiclePurchase = 0;
                let monthsEstimated = 0;
                let dateCompare: Date = new Date();
                if (replacement.kmOperation === null) {
                    dateCompare = wear.datePurchaseVehicle;
                    diffVehiclePurchase = this.monthDiff(dateCompare, new Date());
                    monthsEstimated = (replacement.kmMaintenance * diffVehiclePurchase) / kmVehicle;
                } else {
                    dateCompare = new Date(replacement.dateOperation);
                    diffVehiclePurchase = this.monthDiff(dateCompare, new Date());
                    monthsEstimated = (replacement.kmMaintenance * diffVehiclePurchase) / (kmVehicle - replacement.kmOperation);
                }
                dateResult = this.calculateTimeInfoCalendar(dateCompare, Math.floor(monthsEstimated));
            }
        } else {
            times = replacement.calculateMonths;
            warnings = replacement.warningMonths;
            if (replacement.calculateMonths > 0) {
                dateResult = this.calculateTimeInfoCalendar(new Date(), replacement.calculateMonths);
            } else {
                dateResult = (replacement.kmOperation === null ?
                    this.calculateTimeInfoCalendar(wear.datePurchaseVehicle, replacement.timeMaintenance) :
                    this.calculateTimeInfoCalendar(new Date(replacement.dateOperation), replacement.timeMaintenance));
            }
        }
        return {
            idReplacement: replacement.idMaintenanceElement,
            nameReplacement: replacement.nameMaintenanceElement,
            price: (replacement.priceOperation === null ? 0 : replacement.priceOperation),
            km: kms,
            time: times,
            warning: warnings,
            date: dateResult,
            dateFormat: this.getDateString(dateResult),
        };
    }

    calculateKmInfoNotification(vehicle: VehicleModel, kmInit: number, km: number): Date {
        const kmPerM: number = this.calculateKmsPerMonth(vehicle);
        const diff: number = Math.round((km - kmInit) / kmPerM);
        const date: Date = new Date(vehicle.dateKms);
        date.setMonth(date.getMonth() + diff);
        return date;
    }

    calculateTimeInfoCalendar(dateInit: Date, time: number): Date {
        const date: Date = new Date(dateInit);
        date.setMonth(date.getMonth() + time);
        return date;
    }

    getInfoCalendarReplacementDate(data: InfoCalendarVehicleViewModel[], date: Date[]): InfoCalendarVehicleViewModel[] {
        let result: InfoCalendarVehicleViewModel[] = [];
        if (!!data && data.length > 0) {
            data.forEach(x => {
                if (x.listInfoCalendarMaintenance.some(m =>
                    m.listInfoCalendarReplacement.some(r => this.isDateEquals(r.date, date)))) {
                    let rVehicle: InfoCalendarMaintenanceViewModel[] = [];
                    x.listInfoCalendarMaintenance.forEach(y => {
                        if (y.listInfoCalendarReplacement.some(r => this.isDateEquals(r.date, date))) {
                            let rMaint: InfoCalendarReplacementViewModel[] = [];
                            y.listInfoCalendarReplacement.forEach(z => {
                                if (this.isDateEquals(z.date, date)) {
                                    rMaint = [...rMaint, {
                                        idReplacement: z.idReplacement,
                                        nameReplacement: z.nameReplacement,
                                        price: z.price,
                                        km: z.km,
                                        time: z.time,
                                        warning: z.warning,
                                        date: z.date,
                                        dateFormat: z.dateFormat
                                    }];
                                }
                            });
                            rVehicle = [...rVehicle, {
                                idMaintenance: y.idMaintenance,
                                descriptionMaintenance: y.descriptionMaintenance,
                                codeMaintenanceFreq: y.codeMaintenanceFreq,
                                fromKmMaintenance: y.fromKmMaintenance,
                                toKmMaintenance: y.toKmMaintenance,
                                initMaintenance: y.initMaintenance,
                                wearMaintenance: y.wearMaintenance,
                                listInfoCalendarReplacement: rMaint
                            }];
                        }
                    });
                    result = [...result, {
                        idVehicle: x.idVehicle,
                        nameVehicle: x.nameVehicle,
                        typeVehicle: x.typeVehicle,
                        listInfoCalendarMaintenance: rVehicle
                    }];
                }
            });
        }
        return result;
    }

    isDateEquals(date: Date, dateRange: Date[]): boolean {
        const dateCompare: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dateInit: Date = new Date(dateRange[0].getFullYear(), dateRange[0].getMonth(), dateRange[0].getDate());
        let dateFin: Date = null;
        if (dateRange.length > 1) {
            dateFin = new Date(dateRange[1].getFullYear(), dateRange[1].getMonth(), dateRange[1].getDate());
        }
        return (dateFin === null && dateCompare.getFullYear() === dateInit.getFullYear() &&
            dateCompare.getMonth() === dateInit.getMonth() && dateCompare.getDate() === dateInit.getDate()) ||
            (dateFin !== null && dateCompare >= dateInit && dateCompare <= dateFin);
    }

    getCircleColor(listInfoCalendarVehicle: InfoCalendarVehicleViewModel[], replacement: InfoCalendarReplacementViewModel): string {
        let listWarning: WarningWearEnum[] = [];
        listInfoCalendarVehicle.forEach(x => {
            x.listInfoCalendarMaintenance.forEach(y => {
                y.listInfoCalendarReplacement.forEach(z => {
                    if (!listWarning.some(w => w === z.warning) && this.isDateEquals(z.date, [replacement.date])) {
                        listWarning = [...listWarning, z.warning];
                    }
                });
            });
        });
        if (listWarning.length > 1 || listWarning.length === 0) {
            return 'day-circle-config-all';
        } else if (listWarning[0] === WarningWearEnum.SKULL) {
            return 'day-circle-config-skull';
        } else if (listWarning[0] === WarningWearEnum.DANGER) {
            return 'day-circle-config-danger';
        } else if (listWarning[0] === WarningWearEnum.WARNING) {
            return 'day-circle-config-warning';
        } else {
            return 'day-circle-config-success';
        }
    }
}
