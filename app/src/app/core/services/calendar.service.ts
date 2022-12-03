import { Injectable } from '@angular/core';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';
import * as Moment from 'moment';

// SERVICES
import { IconService } from './icon.service';

// MODELS
import {
    WearVehicleProgressBarViewModel, InfoCalendarVehicleViewModel, InfoCalendarMaintenanceViewModel,
    InfoCalendarReplacementViewModel, WearMaintenanceProgressBarViewModel, VehicleModel, WearReplacementProgressBarViewModel
} from '@models/index';

// UTILS
import { Constants, WarningWearEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private translator: TranslateService,
                private iconSercive: IconService) {
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

    // INFO CALENDAR

    getInfoCalendar(listWearsNotification: WearVehicleProgressBarViewModel[]): InfoCalendarVehicleViewModel[] {
        let result: InfoCalendarVehicleViewModel[] = [];

        if (!!listWearsNotification && listWearsNotification.length > 0) {
            listWearsNotification.forEach(wear => {
                let calMain: InfoCalendarMaintenanceViewModel[] = [];
                wear.listWearMaintenance.forEach(wearMain => {
                    let rep: InfoCalendarMaintenanceViewModel =
                        calMain.find(x => x.idMaintenance === wearMain.idMaintenance);
                    if (!!!rep) {
                        calMain = [...calMain, {
                            idMaintenance: wearMain.idMaintenance,
                            descriptionMaintenance: wearMain.descriptionMaintenance,
                            codeMaintenanceFreq: wearMain.codeMaintenanceFreq,
                            iconMaintenance: wearMain.iconMaintenance,
                            fromKmMaintenance: wearMain.fromKmMaintenance,
                            toKmMaintenance: wearMain.toKmMaintenance,
                            initMaintenance: wearMain.initMaintenance,
                            wearMaintenance: wearMain.wearMaintenance,
                            listInfoCalendarReplacement: []
                        }];
                        rep = calMain.find(x => x.idMaintenance === wearMain.idMaintenance);
                    }
                    wearMain.listWearReplacement.forEach(wearRep => {
                        const calendarKm: InfoCalendarReplacementViewModel =
                            this.createInfoCalendarReplacement(wear, wearMain, wearRep, true);
                        rep.listInfoCalendarReplacement = [...rep.listInfoCalendarReplacement, calendarKm];
                        if (wearMain.timeMaintenance !== 0 && wearMain.timeMaintenance !== null) {
                            rep.listInfoCalendarReplacement = [...rep.listInfoCalendarReplacement,
                                this.createInfoCalendarReplacement(wear, wearMain, wearRep, false)];
                        }
                    });
                });
                result = [...result, {
                    idVehicle: wear.idVehicle,
                    nameVehicle: wear.nameVehicle,
                    typeVehicle: wear.typeVehicle,
                    iconVehicle: wear.iconVehicle,
                    listInfoCalendarMaintenance: calMain
                }];
            });
        }

        return result;
    }

    createInfoCalendarReplacement(wear: WearVehicleProgressBarViewModel, wearMain: WearMaintenanceProgressBarViewModel,
                                  wearRep: WearReplacementProgressBarViewModel, km: boolean): InfoCalendarReplacementViewModel {
        let dateResult: Date;
        let kms = 0;
        let times = 0;
        let warnings: WarningWearEnum;
        if (km) {
            kms = wear.kmEstimatedVehicle + wearRep.calculateKms;
            warnings = wearRep.warningKms;
            dateResult = this.getDateCalculatingKm(wear, wearMain, wearRep, wear.kmEstimatedVehicle);
        } else {
            times = wearRep.calculateMonths;
            warnings = wearRep.warningMonths;
            dateResult = this.getDateCalculatingTime(wear, wearMain, wearRep);
        }
        return {
            idReplacement: wearRep.idMaintenanceElement,
            nameReplacement: wearRep.nameMaintenanceElement,
            iconReplacement: wearRep.iconMaintenanceElement,
            price: (wearRep.priceOperation === null ? 0 : wearRep.priceOperation),
            km: kms,
            time: times,
            warning: warnings,
            warningIconClass: this.iconSercive.getClassIcon(warnings),
            date: dateResult,
            dateFormat: this.getDateString(dateResult),
        };
    }

    getDateCalculatingKm(wear: WearVehicleProgressBarViewModel, wearMain: WearMaintenanceProgressBarViewModel,
                         wearRep: WearReplacementProgressBarViewModel, kmVehicle: number): Date {
        let dateResult: Date;
        if (wearRep.calculateKms > 0) {
            dateResult = this.calculateKmInfoNotification(new VehicleModel(null, null, null, wear.kmVehicle, null, null,
                wear.kmsPerMonthVehicle, wear.dateKmsVehicle, wear.datePurchaseVehicle), 0, wearRep.calculateKms);
        } else {
            let diffVehiclePurchase = 0;
            let monthsEstimated = 0;
            let dateCompare: Date = new Date();
            if (wearRep.kmOperation === null) {
                dateCompare = wear.datePurchaseVehicle;
                diffVehiclePurchase = this.monthDiff(dateCompare, new Date());
                monthsEstimated = (wearMain.kmMaintenance * diffVehiclePurchase) / kmVehicle;
            } else {
                dateCompare = new Date(wearRep.dateOperation);
                diffVehiclePurchase = this.monthDiff(dateCompare, new Date());
                monthsEstimated = (wearMain.kmMaintenance * diffVehiclePurchase) / (kmVehicle - wearRep.kmOperation);
            }
            dateResult = this.calculateTimeInfoCalendar(dateCompare, Math.floor(monthsEstimated));
        }
        return dateResult;
    }

    getDateCalculatingTime(wear: WearVehicleProgressBarViewModel, wearMain: WearMaintenanceProgressBarViewModel,
                           wearRep: WearReplacementProgressBarViewModel): Date {
        let dateResult: Date;
        if (wearRep.calculateMonths > 0) {
            dateResult = this.calculateTimeInfoCalendar(new Date(), wearRep.calculateMonths);
        } else {
            dateResult = (wearRep.kmOperation === null ?
                this.calculateTimeInfoCalendar(wear.datePurchaseVehicle, wearMain.timeMaintenance) :
                this.calculateTimeInfoCalendar(new Date(wearRep.dateOperation), wearMain.timeMaintenance));
        }
        return dateResult;
    }

    calculateKmInfoNotification(vehicle: VehicleModel, kmInit: number, km: number): Date {
        const kmPerM: number = this.calculateKmsPerMonth(vehicle);
        const diffInDays: number = Math.round((km - kmInit) / (kmPerM / 30));
        const date: Date = new Date(vehicle.dateKms);
        date.setDate(date.getDate() + diffInDays);
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
                    const rVehicle: InfoCalendarMaintenanceViewModel[] = this.calculateVehicleReplacementCalendar(x, date);
                    result = [...result, {
                        idVehicle: x.idVehicle,
                        nameVehicle: x.nameVehicle,
                        typeVehicle: x.typeVehicle,
                        iconVehicle: x.iconVehicle,
                        listInfoCalendarMaintenance: rVehicle
                    }];
                }
            });
        }
        return result;
    }

    calculateVehicleReplacementCalendar(x: InfoCalendarVehicleViewModel, date: Date[]) {
        let rVehicle: InfoCalendarMaintenanceViewModel[] = [];
        x.listInfoCalendarMaintenance.forEach(y => {
            if (y.listInfoCalendarReplacement.some(r => this.isDateEquals(r.date, date))) {
                let rMaint: InfoCalendarReplacementViewModel[] = [];
                y.listInfoCalendarReplacement.forEach(z => {
                    if (this.isDateEquals(z.date, date)) {
                        rMaint = [...rMaint, {
                            idReplacement: z.idReplacement,
                            nameReplacement: z.nameReplacement,
                            iconReplacement: z.iconReplacement,
                            price: z.price,
                            km: z.km,
                            time: z.time,
                            warning: z.warning,
                            warningIconClass: this.iconSercive.getClassIcon(z.warning),
                            date: z.date,
                            dateFormat: z.dateFormat
                        }];
                    }
                });
                rVehicle = [...rVehicle, {
                    idMaintenance: y.idMaintenance,
                    descriptionMaintenance: y.descriptionMaintenance,
                    codeMaintenanceFreq: y.codeMaintenanceFreq,
                    iconMaintenance: y.iconMaintenance,
                    fromKmMaintenance: y.fromKmMaintenance,
                    toKmMaintenance: y.toKmMaintenance,
                    initMaintenance: y.initMaintenance,
                    wearMaintenance: y.wearMaintenance,
                    listInfoCalendarReplacement: rMaint
                }];
            }
        });
        return rVehicle;
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
