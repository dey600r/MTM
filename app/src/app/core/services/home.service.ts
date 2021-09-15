import { Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
    OperationModel,
    ConfigurationModel, VehicleModel, MaintenanceModel, WearVehicleProgressBarViewModel,
    WearMaintenanceProgressBarViewModel, WearReplacementProgressBarViewModel, WearNotificationReplacementProgressBarViewModel
} from '@models/index';
import { CommonService } from './common.service';
import { CalendarService } from './calendar.service';
import { ConstantsColumns, WarningWearEnum, Constants } from '../utils';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private commonService: CommonService,
                private calendarService: CalendarService,
                private translator: TranslateService) {
    }

    /** HOME NOTIFICATIONS */

    // VEHICLE REPLACEMENTS WEAR
    getWearReplacementToVehicle(operations: OperationModel[], vehicles: VehicleModel[],
                                configurations: ConfigurationModel[],
                                maintenances: MaintenanceModel[]): WearVehicleProgressBarViewModel[] {
        let result: WearVehicleProgressBarViewModel[] = [];

        if (!!vehicles && vehicles.length > 0) {
            vehicles.forEach(vehicle => { // Replacement per vehicle
                const config: ConfigurationModel = configurations.find(x => x.id === vehicle.configuration.id);
                if (config.listMaintenance.length > 0) {
                    let wearMaintenance: WearMaintenanceProgressBarViewModel[] = [];
                    const maintenancesVehicle: MaintenanceModel[] =
                        maintenances.filter(x => config.listMaintenance.some(y => y.id === x.id));
                    const kmVehicleEstimated: number = this.calendarService.calculateKmVehicleEstimated(vehicle);
                    maintenancesVehicle.forEach(main => { // Maintenaces of vehicle
                        const listReplacementWear: WearReplacementProgressBarViewModel[] =
                            this.calculateReplacement(vehicle, operations, main);
                        if (!!listReplacementWear && listReplacementWear.length > 0) {
                            wearMaintenance = [...wearMaintenance, {
                                codeMaintenanceFreq: main.maintenanceFreq.code,
                                idMaintenance: main.id,
                                descriptionMaintenance: main.description,
                                kmMaintenance: main.km,
                                timeMaintenance: main.time,
                                fromKmMaintenance: main.fromKm,
                                toKmMaintenance: main.toKm,
                                initMaintenance: main.init,
                                wearMaintenance: main.wear,
                                listWearNotificationReplacement: this.calculateWearNotificationReplacement(listReplacementWear),
                                listWearReplacement: listReplacementWear
                            }];
                        }
                    });
                    let total = 0;
                    let totalWarning = 0;
                    let totalDone = 0;
                    const totalWear = wearMaintenance.filter(main => (main.fromKmMaintenance <= kmVehicleEstimated ||
                        (main.toKmMaintenance !== null && main.toKmMaintenance >= kmVehicleEstimated)));
                    totalWear.forEach(main => total += main.listWearReplacement.length);
                    totalWear.forEach(main => main.listWearNotificationReplacement.filter(notif =>
                        notif.warning === WarningWearEnum.WARNING)
                            .forEach(notif => totalWarning += (notif.numWarning * 0.75)));
                    totalWear.forEach(main => main.listWearNotificationReplacement.filter(notif =>
                        notif.warning === WarningWearEnum.SUCCESS)
                            .forEach(notif => totalDone += notif.numWarning));
                    result = [...result, {
                        idVehicle: vehicle.id,
                        nameVehicle: `${vehicle.brand} ${vehicle.model}`,
                        kmVehicle: vehicle.km,
                        datePurchaseVehicle: new Date(vehicle.datePurchase),
                        kmsPerMonthVehicle: vehicle.kmsPerMonth,
                        dateKmsVehicle: vehicle.dateKms,
                        typeVehicle: vehicle.vehicleType.code,
                        percent: (totalDone + totalWarning) / total,
                        percentKm: 0,
                        percentTime: 0,
                        warning: this.getPercentVehicle(wearMaintenance, kmVehicleEstimated),
                        idConfiguration: config.id,
                        nameConfiguration: config.name,
                        listWearMaintenance: this.orderMaintenanceWear(wearMaintenance)
                    }];
                }
            });
        }

        return this.commonService.orderBy(result, ConstantsColumns.COLUMN_MODEL_NAME_VEHICLE);
    }

    calculateWearNotificationReplacement(replacementWear: WearReplacementProgressBarViewModel[]):
                                         WearNotificationReplacementProgressBarViewModel[] {
        let result: WearNotificationReplacementProgressBarViewModel[] = [];
        let warningWear: WarningWearEnum = WarningWearEnum.SKULL;
        let aux: WearNotificationReplacementProgressBarViewModel = new WearNotificationReplacementProgressBarViewModel();
        replacementWear.forEach(rep => {
            warningWear = this.calculateWearNotificationPriority(rep.warningKms, rep.warningMonths);
            aux = result.find(x => x.warning === warningWear);
            if (!aux) {
                result = [...result, {
                    numWarning: 1,
                    totalWarning: replacementWear.length,
                    warning: warningWear
                }];
            } else {
                aux.numWarning += 1;
            }
        });

        return result;
    }

    calculateWearNotificationPriority(warningKm: WarningWearEnum, warningTime: WarningWearEnum): WarningWearEnum {
        if (warningKm === WarningWearEnum.SKULL || warningTime === WarningWearEnum.SKULL) {
            return WarningWearEnum.SKULL;
        } else if (warningKm === WarningWearEnum.DANGER || warningTime === WarningWearEnum.DANGER) {
            return WarningWearEnum.DANGER;
        } else if (warningKm === WarningWearEnum.WARNING || warningTime === WarningWearEnum.WARNING) {
            return WarningWearEnum.WARNING;
        } else {
            return WarningWearEnum.SUCCESS;
        }
    }

    orderMaintenanceWear(maintenanceWear: WearMaintenanceProgressBarViewModel[]): WearMaintenanceProgressBarViewModel[] {
        let result: WearMaintenanceProgressBarViewModel[] = [];
        const wearMaintenanceDanger: WearMaintenanceProgressBarViewModel[] =
            maintenanceWear.filter(main => main.listWearNotificationReplacement.some(notif =>
                notif.warning === WarningWearEnum.DANGER || notif.warning === WarningWearEnum.SKULL));
        const wearMaintenanceWarning: WearMaintenanceProgressBarViewModel[] =
            maintenanceWear.filter(main =>
                !wearMaintenanceDanger.some(x => x.idMaintenance === main.idMaintenance) &&
                main.listWearNotificationReplacement.some(notif => notif.warning === WarningWearEnum.WARNING));
        const wearMaintenanceSuccess: WearMaintenanceProgressBarViewModel[] =
            maintenanceWear.filter(main =>
                !wearMaintenanceDanger.some(x => x.idMaintenance === main.idMaintenance) &&
                !wearMaintenanceWarning.some(x => x.idMaintenance === main.idMaintenance) &&
                main.listWearNotificationReplacement.some(notif => notif.warning === WarningWearEnum.SUCCESS));

        result = this.commonService.orderBy(wearMaintenanceDanger, ConstantsColumns.COLUMN_MODEL_KM_MAINTENANCE);
        this.commonService.orderBy(wearMaintenanceWarning, ConstantsColumns.COLUMN_MODEL_KM_MAINTENANCE).forEach(x =>
            result = [...result, x]);
        this.commonService.orderBy(wearMaintenanceSuccess, ConstantsColumns.COLUMN_MODEL_KM_MAINTENANCE).forEach(x =>
            result = [...result, x]);

        result.forEach(x => x.listWearReplacement = this.commonService.orderBy(x.listWearReplacement,
            ConstantsColumns.COLUMN_MODEL_CALCULATE_KMS, true));

        return result;
    }

    getPercentVehicle(wearMaintenance: WearMaintenanceProgressBarViewModel[], kmVehicle: number): WarningWearEnum {
        let warninSuccess: WarningWearEnum = WarningWearEnum.SUCCESS;
        if (wearMaintenance.some(x =>
            (x.fromKmMaintenance <= kmVehicle && (x.toKmMaintenance === null || x.toKmMaintenance >= kmVehicle)) &&
            x.listWearReplacement.some(y =>
                (y.warningKms === WarningWearEnum.DANGER || y.warningMonths === WarningWearEnum.DANGER ||
                y.warningKms === WarningWearEnum.SKULL || y.warningMonths === WarningWearEnum.SKULL)))) {
            warninSuccess = WarningWearEnum.DANGER;
        } else if (wearMaintenance.some(x => (x.fromKmMaintenance <= kmVehicle &&
            (x.toKmMaintenance === null || x.toKmMaintenance >= kmVehicle)) &&
            x.listWearReplacement.some(y => (y.warningKms === WarningWearEnum.WARNING ||
            y.warningMonths === WarningWearEnum.WARNING)))) {
            warninSuccess = WarningWearEnum.WARNING;
        }
        return warninSuccess;
    }

    calculateReplacement(vehicle: VehicleModel, operations: OperationModel[],
                         main: MaintenanceModel): WearReplacementProgressBarViewModel[] {
        if (main.maintenanceFreq.code === Constants.MAINTENANCE_FREQ_ONCE_CODE) {
            if (main.init) {
                return this.calculateInitReplacement(vehicle, operations, main);
            } else {
                return this.calculateWearReplacement(vehicle, operations, main);
            }
        } else {
            return this.calculateNormalReplacement(vehicle, operations, main);
        }
    }

    calculateInitReplacement(vehicle: VehicleModel, operations: OperationModel[],
                             main: MaintenanceModel): WearReplacementProgressBarViewModel[] {
        let result: WearReplacementProgressBarViewModel[] = [];
        main.listMaintenanceElement.forEach(rep => {
            const ops: OperationModel[] = operations.filter(x => x.vehicle.id === vehicle.id &&
                x.listMaintenanceElement.some(y => y.id === rep.id));
            if (ops.length === 0) {
                const calKms = (main.km - this.calendarService.calculateKmVehicleEstimated(vehicle));
                const calMonths = this.calculateMontVehicleReplacement(main.time, vehicle.datePurchase);
                const percentKm: number = this.calculatePercent(main.km, calKms);
                const percentMonth: number = this.calculatePercent(main.time, calMonths);
                result = [... result, {
                    idMaintenanceElement: rep.id,
                    nameMaintenanceElement: rep.name,
                    idOperation: -1,
                    descriptionOperation: '',
                    kmOperation: null,
                    dateOperation: null,
                    priceOperation: 0,
                    kmAcumulateMaintenance: 0,
                    timeAcumulateMaintenance: 0,
                    calculateKms: calKms,
                    calculateMonths: calMonths,
                    percentKms: percentKm,
                    warningKms: this.getWarningMaintenance(percentKm, calKms < (main.km * -1)),
                    percentMonths: percentMonth,
                    warningMonths: this.getWarningMaintenance(percentMonth, calMonths < (main.time * -1))
                }];
            }
        });
        return result;
    }

    calculateWearReplacement(vehicle: VehicleModel, operations: OperationModel[],
                             main: MaintenanceModel): WearReplacementProgressBarViewModel[] {
        let result: WearReplacementProgressBarViewModel[] = [];
        main.listMaintenanceElement.forEach(rep => {
            const ops: OperationModel[] = operations.filter(x => x.vehicle.id === vehicle.id &&
                x.listMaintenanceElement.some(y => y.id === rep.id) &&
                x.km >= (main.km - 2000));
            if (ops.length === 0) {
                const calKms = (main.km - this.calendarService.calculateKmVehicleEstimated(vehicle));
                const calMonths = this.calculateMontVehicleReplacement(main.time, vehicle.datePurchase);
                const percentKm: number = this.calculatePercent(main.km, calKms);
                const percentMonth: number = this.calculatePercent(main.time, calMonths);
                result = [... result, {
                    idMaintenanceElement: rep.id,
                    nameMaintenanceElement: rep.name,
                    idOperation: -1,
                    descriptionOperation: '',
                    kmOperation: null,
                    dateOperation: null,
                    priceOperation: 0,
                    kmAcumulateMaintenance: 0,
                    timeAcumulateMaintenance: 0,
                    calculateKms: calKms,
                    calculateMonths: calMonths,
                    percentKms: percentKm,
                    warningKms: this.getWarningWearNormal(main.wear, percentKm, calKms, null, main.km),
                    percentMonths: percentMonth,
                    warningMonths: this.getWarningWearNormal(main.wear, percentMonth, calMonths, null, main.time)
                }];
            }
        });
        return result;
    }

    getWarningWear(percent: number): WarningWearEnum {
        if (percent >= 1) {
            return WarningWearEnum.WARNING;
        } else {
            return WarningWearEnum.SUCCESS;
        }
    }

    calculateNormalReplacement(vehicle: VehicleModel, operations: OperationModel[],
                               main: MaintenanceModel): WearReplacementProgressBarViewModel[] {
        let result: WearReplacementProgressBarViewModel[] = [];
        main.listMaintenanceElement.forEach(rep => {
            const ops: OperationModel[] = operations.filter(x => x.vehicle.id === vehicle.id &&
                x.listMaintenanceElement.some(y => y.id === rep.id));
            let maxKm = 0;
            let op: OperationModel = new OperationModel();
            let calKms = 0;
            let calMonths = 0;
            if (!!ops && ops.length > 0) {
                maxKm = this.commonService.max(ops, ConstantsColumns.COLUMN_MTM_OPERATION_KM);
                op = ops.find(x => x.km === maxKm);
                calKms = this.calculateKmVehicleReplacement(vehicle, op, main);
                calMonths = this.calculateMontVehicleReplacement(main.time, op.date);
            } else {
                calKms = (main.km - this.calendarService.calculateKmVehicleEstimated(vehicle));
                calMonths = this.calculateMontVehicleReplacement(main.time, vehicle.datePurchase);
            }
            const percentKm: number = this.calculatePercent(main.km, calKms);
            const percentMonth: number = this.calculatePercent(main.time, calMonths);
            let priceSum: number = op.price;
            if (!!op.listMaintenanceElement && op.listMaintenanceElement.length > 0) {
                priceSum += this.commonService.sum(op.listMaintenanceElement, ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE);
            }
            result = [... result, {
                idMaintenanceElement: rep.id,
                nameMaintenanceElement: rep.name,
                idOperation: op.id,
                descriptionOperation: op.description,
                kmOperation: op.km,
                dateOperation: op.date,
                priceOperation: Math.round(priceSum * 100) / 100 ,
                kmAcumulateMaintenance: 0,
                timeAcumulateMaintenance: 0,
                calculateKms: calKms,
                calculateMonths: calMonths,
                percentKms: percentKm,
                warningKms: this.getWarningWearNormal(main.wear, percentKm, calKms, op.km, main.km),
                percentMonths: percentMonth,
                warningMonths: this.getWarningWearNormal(main.wear, percentMonth, calMonths, op.km, main.time)
            }];
        });
        return result;
    }

    getWarningWearNormal(wear: boolean, percent: number, calc: number, opKm: number, main: number): WarningWearEnum {
        return (wear ? this.getWarningWear(percent) : this.getWarningMaintenance(percent,
            (opKm == null && calc < 0) || calc < (main * -1)));
    }

    getWarningMaintenance(percent: number, opNotFound: boolean): WarningWearEnum {
        if (opNotFound) {
            return WarningWearEnum.SKULL;
        } else if (percent >= 0.8 && percent < 1) {
            return WarningWearEnum.WARNING;
        } else if (percent >= 1) {
            return WarningWearEnum.DANGER;
        } else {
            return WarningWearEnum.SUCCESS;
        }
    }

    calculateKmVehicleReplacement(vehicle: VehicleModel, op: OperationModel, main: MaintenanceModel): number {
        return (op.km + main.km) - this.calendarService.calculateKmVehicleEstimated(vehicle);
    }

    calculateMontVehicleReplacement(time: number, date: Date): number {
        return (time !== null ? time - this.calendarService.monthDiff(new Date(date), new Date()) : 0);
    }

    calculatePercent(total: number, value: number): number {
        return (total === 0 || total === null ? 0 : (value >= 0 ? (total - value) / total : 1));
    }

    calculatePercentNegative(total: number, value: number): number {
        return (total === 0 || total === null ? 0 : (value >= 0 ? value / total : 1));
    }

    getDateCalculateMonths(time: number): string {
        let date = '';
        const months: number = time * (time < 0 ? -1 : 1);
        if (months >= 12) {
          const years: number = Math.round(months / 12);
          date = `${years} ${this.translator.instant(years > 1 ? 'COMMON.YEARS' : 'COMMON.YEAR')}`;
        } else {
          date = `${months} ${this.translator.instant(months > 1 ? 'COMMON.MONTHS' : 'COMMON.MONTH')}`;
        }
        return date;
    }

    /* INFO NOTIFICATIONS */

    getWearReplacement(vehicleWear: WearVehicleProgressBarViewModel, operations: OperationModel[]): WearVehicleProgressBarViewModel {
        let result: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();

        if (vehicleWear.listWearMaintenance.length > 0) {
            // Km vehicle estimated
            const vehicle: VehicleModel = new VehicleModel(null, null, 0, vehicleWear.kmVehicle,
                null, null, vehicleWear.kmsPerMonthVehicle, vehicleWear.dateKmsVehicle, vehicleWear.datePurchaseVehicle);
            const kmVehicle: number = this.calendarService.calculateKmVehicleEstimated(vehicle);
            const diffDateToday: number = this.calendarService.monthDiff(vehicleWear.datePurchaseVehicle, new Date());
            const listWear: WearMaintenanceProgressBarViewModel[] = this.commonService.orderBy(
                vehicleWear.listWearMaintenance, ConstantsColumns.COLUMN_MODEL_FROM_KM_MAINTENANCE);
            // INIT VARIABLES
            let wearMaintenance: WearMaintenanceProgressBarViewModel[] = [];
            let percentVehicleKm = 0;
            let percentVehicleTime = 0;
            let timeCalculate = 0;
            if (listWear.some(x => x.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE)) {
                listWear.forEach((wearMain: WearMaintenanceProgressBarViewModel, index) => {
                    const estimatedKmOperation: number = wearMain.kmMaintenance / 2; // km estimated maintenance
                    const lastKmVehicle: number = (wearMain.toKmMaintenance === null ? kmVehicle : wearMain.toKmMaintenance);
                    const wearRep: WearReplacementProgressBarViewModel = wearMain.listWearReplacement[0];

                    // Operation with maintenance selected
                    const operationsVehicle: OperationModel[] = operations.filter(x => x.vehicle.id === vehicleWear.idVehicle &&
                    x.listMaintenanceElement.some(m => m.id === wearRep.idMaintenanceElement));
                    const max: number = (lastKmVehicle +
                        (listWear.length === 1 || index + 1 === listWear.length ? 0 : - wearMain.kmMaintenance * 2));
                    timeCalculate = this.getInitTime(wearMain, vehicle, operationsVehicle, timeCalculate);
                    let opLast = new OperationModel();
                    for (let kmCalculate = this.getInitKm(wearMain); kmCalculate < max; kmCalculate += wearMain.kmMaintenance) {
                        const calcKm: number = (kmCalculate + wearMain.kmMaintenance); // km should maintenance
                        const calcCompKm: number = (calcKm + estimatedKmOperation); // km max should maintenance
                        const calcTime: number = (timeCalculate + wearMain.timeMaintenance); // time should maintenance
                        // OPERATIONS: km and time aprox to maintenance
                        const ops: OperationModel[] = this.getOperationsFilteredKmTime(operationsVehicle, wearMaintenance, kmCalculate,
                            calcCompKm, calcTime, opLast, vehicleWear.datePurchaseVehicle);
                        let op = new OperationModel();
                        op.id = null;
                        let calcDiffTime = 0;
                        let calculateKmEstimate = 0;
                        let calculateTimeEstimate = 0;
                        let percentKm = 1;
                        let percentTime = 1;
                        if (!!ops && ops.length > 0) {
                            opLast = this.getOperationsNearKmTime(vehicle, ops, calcKm, calcTime);
                            op = opLast;
                            calcDiffTime = this.calendarService.monthDiff(vehicleWear.datePurchaseVehicle, new Date(op.date));
                            calculateKmEstimate = calcKm - op.km;
                            calculateTimeEstimate = calcTime - calcDiffTime;
                            percentKm = (calculateKmEstimate >= 0 ?
                                this.calculatePercent(wearMain.kmMaintenance, calculateKmEstimate) :
                                this.calculatePercentNegative(wearMain.kmMaintenance, calculateKmEstimate * -1));
                            percentTime = (calculateTimeEstimate >= 0 ?
                                this.calculatePercent(calcTime, calculateTimeEstimate) :
                                this.calculatePercentNegative(calcTime, calculateTimeEstimate * -1));
                        } else {
                            calculateKmEstimate = -estimatedKmOperation;
                            calculateTimeEstimate = calcTime - diffDateToday;
                        }
                        if ((wearMain.toKmMaintenance === null || wearMain.toKmMaintenance >= calcKm) &&
                            (calcKm < kmVehicle || (!!op && op.id !== null))) {
                            wearMaintenance = [... wearMaintenance, {
                                codeMaintenanceFreq: wearMain.codeMaintenanceFreq,
                                idMaintenance: wearMain.idMaintenance,
                                descriptionMaintenance: wearMain.descriptionMaintenance,
                                kmMaintenance: wearMain.kmMaintenance,
                                timeMaintenance: wearMain.timeMaintenance,
                                fromKmMaintenance: wearMain.fromKmMaintenance,
                                toKmMaintenance: wearMain.toKmMaintenance,
                                initMaintenance: wearMain.initMaintenance,
                                wearMaintenance: wearMain.wearMaintenance,
                                listWearNotificationReplacement: wearMain.listWearNotificationReplacement,
                                listWearReplacement: [{
                                    idMaintenanceElement: wearRep.idMaintenanceElement,
                                    nameMaintenanceElement: wearRep.nameMaintenanceElement,
                                    idOperation: op.id,
                                    descriptionOperation: op.description,
                                    kmOperation: op.km,
                                    dateOperation: op.date,
                                    priceOperation: op.price,
                                    kmAcumulateMaintenance: calcKm,
                                    timeAcumulateMaintenance: calcTime,
                                    calculateKms: calculateKmEstimate,
                                    calculateMonths: calculateTimeEstimate,
                                    percentKms: percentKm,
                                    warningKms: this.getWarningRecord(wearMain.wearMaintenance, calculateKmEstimate, percentKm, op.km),
                                    percentMonths: percentTime,
                                    warningMonths:
                                        this.getWarningRecord(wearMain.wearMaintenance, calculateTimeEstimate, percentTime, op.km)
                                }]
                            }];
                        }

                        if (!!op && op.id !== null) {
                            percentVehicleKm += (calculateKmEstimate >= 0 ? 1 : 1 - (percentKm > 1 ? 1 : percentKm));
                            percentVehicleTime += (calculateTimeEstimate >= 0 ? 1 : 1 - (percentTime > 1 ? 1 : percentTime));
                        }
                        timeCalculate += wearMain.timeMaintenance;
                    }
                });
                const perKm: number = percentVehicleKm * 100 / wearMaintenance.length;
                const perTime: number = percentVehicleTime * 100 / wearMaintenance.length;
                result = {
                    idVehicle: vehicleWear.idVehicle,
                    nameVehicle: vehicleWear.nameVehicle,
                    kmVehicle: vehicleWear.kmVehicle,
                    datePurchaseVehicle: vehicleWear.datePurchaseVehicle,
                    kmsPerMonthVehicle: vehicleWear.kmsPerMonthVehicle,
                    dateKmsVehicle: vehicleWear.dateKmsVehicle,
                    typeVehicle: vehicleWear.typeVehicle,
                    percent: Math.round((perKm + perTime) / 2),
                    percentKm: Math.floor(perKm),
                    percentTime: Math.floor(perTime),
                    warning: this.getPercentVehicle(wearMaintenance, kmVehicle),
                    idConfiguration: vehicleWear.idConfiguration,
                    nameConfiguration: vehicleWear.nameConfiguration,
                    listWearMaintenance: this.commonService.orderBy(wearMaintenance, ConstantsColumns.COLUMN_MODEL_KM_ACUMULATE_MAINTENANCE)
                };
            }
        }

        return result;
    }

    getInitKm(wear: WearMaintenanceProgressBarViewModel): number {
        return wear.fromKmMaintenance - (wear.fromKmMaintenance > 0 ? wear.kmMaintenance : 0);
    }

    getInitTime(wear: WearMaintenanceProgressBarViewModel, vehicle: VehicleModel, operations: OperationModel[], time: number): number {
        let result: number = time;
        if (wear.fromKmMaintenance !== 0 && time === 0) {
            const opCalc: OperationModel = this.getOperationsNearKmTime(vehicle, operations, wear.fromKmMaintenance, 0);
            result = opCalc === null ? 0 : this.calendarService.monthDiff(vehicle.datePurchase, new Date(opCalc.date));
        }
        return result;
    }

    getOperationsFilteredKmTime(operationsVehicle: OperationModel[], wearMaintenance: WearMaintenanceProgressBarViewModel[],
                                kmCalculate: number, calcCompKm: number, calcTime: number, opLast: OperationModel,
                                datePurchaseVehicle: Date): OperationModel[] {
        return operationsVehicle.filter(x =>
                !wearMaintenance.some(main => main.listWearReplacement[0].idOperation === x.id) &&
                ((x.km >= kmCalculate && x.km < calcCompKm) ||
                ((opLast.id === null ? 0 : opLast.km) <= x.km && x.km < calcCompKm &&
                this.calendarService.monthDiff(datePurchaseVehicle, new Date(x.date)) <= calcTime)));
    }

    getOperationsNearKmTime(vehicle: VehicleModel, operations: OperationModel[], km: number, time: number): OperationModel {
        let operation: OperationModel = null;
        let percent = 1;
        operations.forEach(x => {
            const near: number = (km - x.km) * (km < x.km ? -1 : 1);
            const perc: number = near / km;
            if (percent > perc) {
                percent = perc;
                operation = x;
            } else if (time !== 0) {
                const datePurchase: Date = new Date(vehicle.datePurchase);
                datePurchase.setMonth(datePurchase.getMonth() + time);
                if (new Date(x.date) < datePurchase) {
                    const timeMaint: number = this.calendarService.monthDiff(new Date(vehicle.datePurchase), new Date(x.date));
                    const nearT: number = (time - timeMaint) * (time < timeMaint ? -1 : 1);
                    const percT: number = nearT / time;
                    if (percent > percT) {
                        percent = perc;
                        operation = x;
                    }
                }
            }
        });
        return operation;
    }

    getWarningRecord(wear: boolean, calculateEstimate: number, percent: number, km: number): WarningWearEnum {
        return (wear ? this.getWarningWearRecordsMaintenance(percent * (calculateEstimate >= 0 ? 1 : -1), km === null) :
            this.getWarningRecordsMaintenance(percent * (calculateEstimate >= 0 ? 1 : -1), km === null));
    }

    getWarningRecordsMaintenance(percent: number, opNotFound: boolean): WarningWearEnum {
        if (opNotFound) {
            return WarningWearEnum.SKULL;
        } else if (percent >= 0.8 && percent <= 1) {
            return WarningWearEnum.WARNING;
        } else if (percent >= 1 || percent <= 0) {
            return WarningWearEnum.DANGER;
        } else {
            return WarningWearEnum.SUCCESS;
        }
    }

    getWarningWearRecordsMaintenance(percent: number, opNotFound: boolean): WarningWearEnum {
        if (opNotFound) {
            return WarningWearEnum.SKULL;
        } else if (percent === -1) {
            return WarningWearEnum.DANGER;
        } else if (percent < 0 || percent === 1) {
            return WarningWearEnum.WARNING;
        } else {
            return WarningWearEnum.SUCCESS;
        }
    }

    // ICONS CSS

    getClassProgressbar(warning: WarningWearEnum, styles: string): string {
        switch (warning) {
            case WarningWearEnum.SUCCESS:
                return `${styles} quizz-progress-success`;
            case WarningWearEnum.WARNING:
                return `${styles} quizz-progress-warning`;
            case WarningWearEnum.DANGER:
            case WarningWearEnum.SKULL:
                return `${styles} quizz-progress-danger`;
        }
    }

    getClassIcon(warning: WarningWearEnum, styles: string): string {
        switch (warning) {
            case WarningWearEnum.SUCCESS:
                return `${styles} icon-color-success`;
            case WarningWearEnum.WARNING:
                return `${styles} icon-color-warning`;
            case WarningWearEnum.DANGER:
                return `${styles} icon-color-danger`;
            case WarningWearEnum.SKULL:
                return `${styles} icon-color-skull`;
        }
    }

    getIconKms(warning: WarningWearEnum): string {
        switch (warning) {
            case WarningWearEnum.SUCCESS:
                return 'checkmark-circle';
            case WarningWearEnum.WARNING:
                return 'warning';
            case WarningWearEnum.DANGER:
                return 'nuclear';
            case WarningWearEnum.SKULL:
                return 'skull';
        }
    }
}