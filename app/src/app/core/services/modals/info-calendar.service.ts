import { Injectable } from '@angular/core';

// SERVICES
import { IconService, CalendarService } from '../common/index';

// MODELS
import {
    WearVehicleProgressBarViewModel, InfoCalendarVehicleViewModel, InfoCalendarMaintOpViewModel,
    InfoCalendarReplacementViewModel, WearMaintenanceProgressBarViewModel, VehicleModel, 
    WearReplacementProgressBarViewModel, OperationModel
} from '@models/index';

// UTILS
import { CalendarTypeEnum, WarningWearEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class InfoCalendarService {

    constructor(private readonly calendarService: CalendarService,
                private readonly iconService: IconService) {
    }

    // INFO CALENDAR

    private getInfoCalendarNotifications(listWearsNotification: WearVehicleProgressBarViewModel[]): InfoCalendarVehicleViewModel[] {
        let result: InfoCalendarVehicleViewModel[] = [];
        if (!!listWearsNotification && listWearsNotification.length > 0) {
            listWearsNotification.forEach(wear => { // VEHICLE ITERATION
                let calMain: InfoCalendarMaintOpViewModel[] = [];
                wear.listWearMaintenance.forEach(wearMain => { // MAINTENANCE ITERATION
                    let rep: InfoCalendarMaintOpViewModel =
                        calMain.find(x => x.id === wearMain.idMaintenance);
                    if (!rep) {
                        calMain = [...calMain, {
                            id: wearMain.idMaintenance,
                            type: CalendarTypeEnum.MAINTENANCE,
                            description: wearMain.descriptionMaintenance,
                            detailOperation: '',
                            codeMaintenanceFreq: wearMain.codeMaintenanceFreq,
                            codeOperationType: '',
                            icon: wearMain.iconMaintenance,
                            priceOperation: 0,
                            kmOperation: 0,
                            dateOperation: null,
                            dateFormatOperation: '',
                            fromKmMaintenance: wearMain.fromKmMaintenance,
                            toKmMaintenance: wearMain.toKmMaintenance,
                            initMaintenance: wearMain.initMaintenance,
                            wearMaintenance: wearMain.wearMaintenance,
                            listInfoCalendarReplacement: []
                        }];
                        rep = calMain.find(x => x.id === wearMain.idMaintenance);
                    }
                    wearMain.listWearReplacement.forEach(wearRep => { // STATUS REPLACEMENTE ITERATION
                        // CALENDAR FOR KMS
                        rep.listInfoCalendarReplacement = [...rep.listInfoCalendarReplacement,
                            this.createInfoCalendarReplacement(wear, wearMain, wearRep, true)];
                        if (wearMain.timeMaintenance !== 0 && wearMain.timeMaintenance !== null) {
                            // CALENDAR FOR TIME
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
                    listInfoCalendarMaintOp: calMain,
                }];
            });
        }
        return result;
    }

    getInfoCalendarOperation(listOperations: OperationModel[], listCalendar: InfoCalendarVehicleViewModel[]): InfoCalendarVehicleViewModel[] {
        let result: InfoCalendarVehicleViewModel[] = listCalendar;
        if(!!listOperations && listOperations.length > 0) {
            listOperations.forEach(op => { // OPERATION ITERATOR
                if(!!op.listMaintenanceElement && op.listMaintenanceElement.length > 0) {
                    let listInfoOpReplacements: InfoCalendarReplacementViewModel[] = [];
                    op.listMaintenanceElement.forEach(rep => { // REPLACEMENT OPERATOR
                        listInfoOpReplacements = [...listInfoOpReplacements, {
                            idReplacement: rep.id,
                            nameReplacement: rep.name,
                            iconReplacement: this.iconService.getIconReplacement(rep.id),
                            price: rep.price,
                            km: op.km,
                            time: 0,
                            warning: WarningWearEnum.SUCCESS,
                            warningIcon: this.iconService.getIconKms(WarningWearEnum.SUCCESS),
                            warningIconClass: this.iconService.getClassIcon(WarningWearEnum.SUCCESS),
                            date: new Date(op.date),
                            dateFormat: this.calendarService.getDateString(op.date),
                        }];
                    });
                    let infoOp: InfoCalendarMaintOpViewModel = {
                        id: op.id,
                        type: CalendarTypeEnum.OPERATION,
                        description: op.description,
                        detailOperation: op.details,
                        codeMaintenanceFreq: '',
                        codeOperationType: op.operationType.code,
                        icon: this.iconService.getIconOperationType(op.operationType.code),
                        priceOperation: op.price,
                        kmOperation: op.km,
                        dateOperation: new Date(op.date),
                        dateFormatOperation: this.calendarService.getDateString(op.date),
                        fromKmMaintenance: 0,
                        toKmMaintenance: null,
                        initMaintenance: false,
                        wearMaintenance: false,
                        listInfoCalendarReplacement: listInfoOpReplacements
                    };

                    const infoCalendarVehicle = result.find(x => x.idVehicle == op.vehicle.id);
                    if(infoCalendarVehicle) {
                        infoCalendarVehicle.listInfoCalendarMaintOp = [...infoCalendarVehicle.listInfoCalendarMaintOp, infoOp];
                    } else {
                        result = [...result, {
                            idVehicle: op.vehicle.id,
                            nameVehicle: `${op.vehicle.brand} ${op.vehicle.model}`,
                            typeVehicle: op.vehicle.vehicleType.code,
                            iconVehicle: op.vehicle.vehicleType.icon,
                            listInfoCalendarMaintOp: [infoOp],
                        }];
                    }

                }
            });
        }
        return result;
    }

    getInfoCalendar(listWearsNotification: WearVehicleProgressBarViewModel[], listOperations: OperationModel[]): InfoCalendarVehicleViewModel[] {
        const listCalendarNotifications: InfoCalendarVehicleViewModel[] = this.getInfoCalendarNotifications(listWearsNotification);
        return this.getInfoCalendarOperation(listOperations, listCalendarNotifications);
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
            dateResult = this.getDateCalculatingKm(wear, wearMain, wearRep);
        } else {
            times = wearRep.calculateMonths;
            warnings = wearRep.warningMonths;
            dateResult = this.getDateCalculatingTime(wear, wearMain, wearRep);
        }
        const today = new Date();
        if(today > dateResult)
            dateResult = today;

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
                         wearRep: WearReplacementProgressBarViewModel): Date {
        let dateResult: Date;
        if (wearRep.calculateKms > 0) {
            dateResult = this.calculateKmInfoNotification(new VehicleModel({
                km: wear.kmVehicle,
                configuration: null,
                vehicleType: null,
                kmsPerMonth: wear.kmsPerMonthVehicle,
                dateKms: wear.dateKmsVehicle,
                datePurchase: wear.datePurchaseVehicle
            }), 0, wearRep.calculateKms);
        } else {
            let diffVehiclePurchase = 0;
            let monthsEstimated = 0;
            let dateCompare: Date = new Date();
            if (wearRep.kmOperation === null) {
                dateCompare = wear.datePurchaseVehicle;
                diffVehiclePurchase = this.calendarService.monthDiff(dateCompare, new Date());
                monthsEstimated = (wearMain.kmMaintenance * diffVehiclePurchase) / wear.kmEstimatedVehicle;
            } else {
                dateCompare = new Date(wearRep.dateOperation);
                diffVehiclePurchase = this.calendarService.monthDiff(dateCompare, new Date());
                monthsEstimated = (wearMain.kmMaintenance * diffVehiclePurchase) / (wear.kmEstimatedVehicle - wearRep.kmOperation);
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
                if (x.listInfoCalendarMaintOp.some(m =>
                    m.listInfoCalendarReplacement.some(r => this.isDateEquals(r.date, date)))) {
                    const rVehicle: InfoCalendarMaintOpViewModel[] = this.calculateVehicleReplacementCalendar(x, date);
                    result = [...result, {
                        idVehicle: x.idVehicle,
                        nameVehicle: x.nameVehicle,
                        typeVehicle: x.typeVehicle,
                        iconVehicle: x.iconVehicle,
                        listInfoCalendarMaintOp: rVehicle
                    }];
                }
            });
        }
        return result;
    }

    calculateVehicleReplacementCalendar(x: InfoCalendarVehicleViewModel, date: Date[]) {
        let rVehicle: InfoCalendarMaintOpViewModel[] = [];
        x.listInfoCalendarMaintOp.forEach(y => {
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
                    id: y.id,
                    type: y.type,
                    description: y.description,
                    detailOperation: y.detailOperation,
                    codeMaintenanceFreq: y.codeMaintenanceFreq,
                    codeOperationType: y.codeOperationType,
                    icon: y.icon,
                    priceOperation: y.priceOperation,
                    kmOperation: y.kmOperation,
                    dateOperation: y.dateOperation,
                    dateFormatOperation: y.dateFormatOperation,
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
            x.listInfoCalendarMaintOp.forEach(y => {
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
