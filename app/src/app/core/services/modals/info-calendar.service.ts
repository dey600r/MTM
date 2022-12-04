import { Injectable } from '@angular/core';

// SERVICES
import { IconService, CalendarService } from '../common/index';

// MODELS
import {
    WearVehicleProgressBarViewModel, InfoCalendarVehicleViewModel, InfoCalendarMaintenanceViewModel,
    InfoCalendarReplacementViewModel, WearMaintenanceProgressBarViewModel, VehicleModel, WearReplacementProgressBarViewModel
} from '@models/index';

// UTILS
import { WarningWearEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class InfoCalendarService {

    constructor(private calendarService: CalendarService,
                private iconService: IconService) {
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
            warningIcon: this.iconService.getIconKms(warnings),
            warningIconClass: this.iconService.getClassIcon(warnings),
            date: dateResult,
            dateFormat: this.calendarService.getDateString(dateResult),
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
                diffVehiclePurchase = this.calendarService.monthDiff(dateCompare, new Date());
                monthsEstimated = (wearMain.kmMaintenance * diffVehiclePurchase) / kmVehicle;
            } else {
                dateCompare = new Date(wearRep.dateOperation);
                diffVehiclePurchase = this.calendarService.monthDiff(dateCompare, new Date());
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
        const kmPerM: number = this.calendarService.calculateKmsPerMonth(vehicle);
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
                            warningIcon: this.iconService.getIconKms(z.warning),
                            warningIconClass: this.iconService.getClassIcon(z.warning),
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
