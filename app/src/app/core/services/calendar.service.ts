import { Injectable } from '@angular/core';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';
import * as Moment from 'moment';

// UTILS
import { Constants, WarningWearEnum } from '@utils/index';
import {
    WearMotoProgressBarViewModel, InfoCalendarMotoViewModel, InfoCalendarMaintenanceViewModel,
    InfoCalendarReplacementViewModel, WearReplacementProgressBarViewModel, MotoModel
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

    // INFO CALENDAR

    getInfoCalendar(listWearsNotification: WearMotoProgressBarViewModel[]): InfoCalendarMotoViewModel[] {
        let result: InfoCalendarMotoViewModel[] = [];

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
                    idMoto: wear.idMoto,
                    nameMoto: wear.nameMoto,
                    listInfoCalendarMaintenance: replacements
                }];
            });
        }

        return result;
    }

    createInfoCalendarReplacement(wear: WearMotoProgressBarViewModel, replacement: WearReplacementProgressBarViewModel,
                                  km: boolean): InfoCalendarReplacementViewModel {
        let dateResult: Date = new Date();
        let kms = 0;
        let times = 0;
        let warnings: WarningWearEnum = WarningWearEnum.DANGER;
        if (km) {
            const kmMoto: number = wear.kmMoto + (Math.round((wear.kmsPerMonthMoto / 30) *
                    this.dayDiff(new Date(wear.dateKmsMoto), new Date())));
            kms = kmMoto + replacement.calculateKms;
            warnings = replacement.warningKms;
            if (replacement.calculateKms > 0) {
                dateResult = this.calculateKmInfoNotification(new MotoModel(null, null, null, 0, null,
                    wear.kmsPerMonthMoto, wear.dateKmsMoto), replacement.calculateKms);
            } else {
                let diffMotoPurchase = 0;
                let monthsEstimated = 0;
                let dateCompare: Date = new Date();
                if (replacement.kmOperation === null) {
                    dateCompare = wear.datePurchaseMoto;
                    diffMotoPurchase = this.monthDiff(dateCompare, new Date());
                    monthsEstimated = (replacement.kmMaintenance * diffMotoPurchase) / kmMoto;
                } else {
                    dateCompare = new Date(replacement.dateOperation);
                    diffMotoPurchase = this.monthDiff(dateCompare, new Date());
                    monthsEstimated = ((kmMoto - replacement.kmOperation) * diffMotoPurchase) / replacement.kmMaintenance;
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
                    this.calculateTimeInfoCalendar(wear.datePurchaseMoto, replacement.timeMaintenance) :
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

    calculateKmInfoNotification(moto: MotoModel, km: number): Date {
        const diff: number = (km - moto.km) / moto.kmsPerMonth;
        const date: Date = new Date(moto.dateKms);
        date.setMonth(date.getMonth() + diff);
        return date;
    }

    calculateTimeInfoCalendar(dateInit: Date, time: number): Date {
        const date: Date = new Date(dateInit);
        date.setMonth(date.getMonth() + time);
        return date;
    }

    getInfoCalendarReplacementDate(data: InfoCalendarMotoViewModel[], date: Date[]): InfoCalendarMotoViewModel[] {
        let result: InfoCalendarMotoViewModel[] = [];
        if (!!data && data.length > 0) {
            data.forEach(x => {
                if (x.listInfoCalendarMaintenance.some(m =>
                    m.listInfoCalendarReplacement.some(r => this.isDateEquals(r.date, date)))) {
                    let rMoto: InfoCalendarMaintenanceViewModel[] = [];
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
                            rMoto = [...rMoto, {
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
                        idMoto: x.idMoto,
                        nameMoto: x.nameMoto,
                        listInfoCalendarMaintenance: rMoto
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

    getCircleColor(listInfoCalendarMoto: InfoCalendarMotoViewModel[], moto: InfoCalendarMotoViewModel,
                   maintenance: InfoCalendarMaintenanceViewModel,
                   replacement: InfoCalendarReplacementViewModel): string {
        if (listInfoCalendarMoto.some(x => x.listInfoCalendarMaintenance.some(y =>
                y.listInfoCalendarReplacement.some(z => this.isDateEquals(z.date, [replacement.date]) &&
                    ((x.idMoto !== moto.idMoto) ||
                    (x.idMoto === moto.idMoto && y.idMaintenance !== maintenance.idMaintenance) ||
                    (x.idMoto === moto.idMoto && y.idMaintenance === maintenance.idMaintenance &&
                    z.idReplacement !== replacement.idReplacement)))))) {
            return 'day-circle-config-all';
        } else if (replacement.warning === WarningWearEnum.SKULL) {
            return 'day-circle-config-skull';
        } else if (replacement.warning === WarningWearEnum.DANGER) {
            return 'day-circle-config-danger';
        } else if (replacement.warning === WarningWearEnum.WARNING) {
            return 'day-circle-config-warning';
        } else {
            return 'day-circle-config-success';
        }
    }
}
