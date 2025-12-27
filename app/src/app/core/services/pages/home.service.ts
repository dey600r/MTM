import { inject, Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
    OperationModel,
    ConfigurationModel, VehicleModel, MaintenanceModel, WearVehicleProgressBarViewModel,
    WearMaintenanceProgressBarViewModel, WearReplacementProgressBarViewModel, WearNotificationReplacementProgressBarViewModel,
    IReplaclementEventFailurePrediction, MaintenanceElementModel
} from '@models/index';
import { ConstantsColumns, WarningWearEnum, Constants, FailurePredictionTypeEnum } from '@utils/index';

// SERVICES
import { CommonService, CalendarService, IconService } from '../common/index';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    // IJECTIONS
    private readonly commonService: CommonService = inject(CommonService);
    private readonly calendarService: CalendarService = inject(CalendarService);
    private readonly translator: TranslateService = inject(TranslateService);
    private readonly iconService: IconService = inject(IconService);

    /** HOME NOTIFICATIONS */

    calculatePercentWearVehicle(wearMaintenance: WearMaintenanceProgressBarViewModel[]): number {
        let total = 0;
        let totalWarning = 0;
        let totalDone = 0;
        wearMaintenance.forEach(main => total += main.listWearReplacement.length);
        wearMaintenance.forEach(main => main.listWearNotificationReplacement.filter(notif =>
            notif.warning === WarningWearEnum.WARNING)
                .forEach(notif => totalWarning += (notif.numWarning * 0.75)));
        wearMaintenance.forEach(main => main.listWearNotificationReplacement.filter(notif =>
            notif.warning === WarningWearEnum.SUCCESS)
                .forEach(notif => totalDone += notif.numWarning));
        return (total === 0 ? 0 : (totalDone + totalWarning) / total);     
    }

    calculatePercentWearMaintenance(listNotif: WearNotificationReplacementProgressBarViewModel[]): number {
        let total = 0;
        let totalDone = 0;
        listNotif.forEach(x => {
            total += x.totalWarning;
            if(x.warning === WarningWearEnum.SUCCESS || x.warning === WarningWearEnum.WARNING) {
                totalDone += x.numWarning;
            }
        });
        return (total === 0 ? 0 : (totalDone * 100 / total));
    }

    calculateWarningWearMaintenance(listNotif: WearNotificationReplacementProgressBarViewModel[]): WarningWearEnum {
        if (listNotif.some(x => x.warning === WarningWearEnum.SKULL || x.warning === WarningWearEnum.DANGER)) {
            return WarningWearEnum.DANGER;
        } else if (listNotif.some(x => x.warning === WarningWearEnum.WARNING)) {
            return WarningWearEnum.WARNING;
        } else {
            return WarningWearEnum.SUCCESS;
        }
    }

    // VEHICLE REPLACEMENTS WEAR
    getWearReplacementToVehicle(operations: OperationModel[], vehicles: VehicleModel[],
                                configurations: ConfigurationModel[],
                                maintenances: MaintenanceModel[]): WearVehicleProgressBarViewModel[] {
        let result: WearVehicleProgressBarViewModel[] = [];

        if (!!vehicles && vehicles.length > 0) {
            vehicles.forEach(vehicle => { // Replacement per vehicle
                const config: ConfigurationModel = configurations.find(x => x.id === vehicle.configuration.id);
                if (config && config.listMaintenance && config.listMaintenance.length > 0) {
                    let wearMaintenance: WearMaintenanceProgressBarViewModel[] = [];
                    const maintenancesVehicle: MaintenanceModel[] =
                        maintenances.filter(x => config.listMaintenance.some(y => y.id === x.id));
                    maintenancesVehicle.forEach(main => { // Maintenaces of vehicle
                        const listReplacementWear: WearReplacementProgressBarViewModel[] =
                            this.calculateReplacement(vehicle, operations, main);
                        if (!!listReplacementWear && listReplacementWear.length > 0) {
                            const listNotif = this.calculateWearNotificationReplacement(listReplacementWear);
                            const totalPercent = this.calculatePercentWearMaintenance(listNotif);
                            const warning = this.calculateWarningWearMaintenance(listNotif);
                            wearMaintenance = [...wearMaintenance, {
                                codeMaintenanceFreq: main.maintenanceFreq.code,
                                iconMaintenance: main.maintenanceFreq.icon,
                                idMaintenance: main.id,
                                descriptionMaintenance: main.description,
                                kmMaintenance: main.km,
                                timeMaintenance: main.time,
                                fromKmMaintenance: main.fromKm,
                                toKmMaintenance: main.toKm,
                                initMaintenance: main.init,
                                wearMaintenance: main.wear,
                                percent: totalPercent,
                                warning: warning,
                                warningProgressBarIcon: this.iconService.getClassCardProgressbar(warning),
                                listWearNotificationReplacement: listNotif,
                                listWearReplacement: listReplacementWear
                            }];
                        }
                    });
                    const totalPercent = this.calculatePercentWearVehicle(
                        wearMaintenance.filter(main => (main.fromKmMaintenance <= vehicle.kmEstimated ||
                            (main.toKmMaintenance !== null && main.toKmMaintenance >= vehicle.kmEstimated))));
                    const warningWear: WarningWearEnum = this.getPercentVehicle(wearMaintenance, vehicle.kmEstimated);
                    result = [...result, {
                        idVehicle: vehicle.id,
                        nameVehicle: `${vehicle.brand} ${vehicle.model}`,
                        kmVehicle: vehicle.km,
                        kmEstimatedVehicle: vehicle.kmEstimated,
                        datePurchaseVehicle: new Date(vehicle.datePurchase),
                        kmsPerMonthVehicle: vehicle.kmsPerMonth,
                        dateKmsVehicle: vehicle.dateKms,
                        typeVehicle: vehicle.vehicleType.code,
                        iconVehicle: vehicle.vehicleType.icon,
                        percent: totalPercent,
                        percentKm: 0,
                        percentTime: 0,
                        warning: warningWear,
                        warningProgressBarIcon: this.iconService.getClassCardProgressbar(warningWear),
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
                    warning: warningWear,
                    warningIcon: this.iconService.getIconKms(warningWear),
                    warningIconClass: this.iconService.getClassIcon(warningWear)
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
            this.validateKmIntoMaintenance(kmVehicle, x.fromKmMaintenance, x.toKmMaintenance) &&
            x.listWearReplacement.some(y =>
                (y.warningKms === WarningWearEnum.DANGER || y.warningMonths === WarningWearEnum.DANGER ||
                y.warningKms === WarningWearEnum.SKULL || y.warningMonths === WarningWearEnum.SKULL)))) {
            warninSuccess = WarningWearEnum.DANGER;
        } else if (wearMaintenance.some(x =>
            this.validateKmIntoMaintenance(kmVehicle, x.fromKmMaintenance, x.toKmMaintenance) &&
            x.listWearReplacement.some(y => (y.warningKms === WarningWearEnum.WARNING ||
            y.warningMonths === WarningWearEnum.WARNING)))) {
            warninSuccess = WarningWearEnum.WARNING;
        }
        return warninSuccess;
    }

    validateKmIntoMaintenance(kmVehicle: number, fromKm: number, toKm: number): boolean {
        return (fromKm <= kmVehicle && (toKm === null || toKm >= kmVehicle));
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

    initReplacement({
        rep, 
        calKms, op = null, priceSum = 0, calMonths, percentKm, warningKms, warningMonths, percentMonth}) {
        return {
            idMaintenanceElement: rep.id,
            nameMaintenanceElement: rep.name,
            iconMaintenanceElement: rep.icon,
            idOperation: (op == null ? -1 : op.id),
            descriptionOperation: (op == null ? '' : op.description),
            kmOperation: (op == null ? null : op.km),
            dateOperation: (op == null ? null : op.date),
            priceOperation: (priceSum == 0 ? 0 : Math.round(priceSum * 100) / 100),
            kmAcumulateMaintenance: 0,
            timeAcumulateMaintenance: 0,
            calculateKms: calKms,
            calculateMonths: calMonths,
            percentKms: percentKm,
            warningIconClass: this.iconService.getClassIcon(this.calculateWearNotificationPriority(warningKms, warningMonths)),
            warningKms: warningKms,
            warningKmsProgressBarIcon: this.iconService.getClassProgressbar(warningKms),
            warningKmsIcon: this.iconService.getIconKms(warningKms),
            warningKmsIconClass: this.iconService.getClassIcon(warningKms),
            percentMonths: percentMonth,
            warningMonths: warningMonths,
            warningMonthsProgressBarIcon: this.iconService.getClassProgressbar(warningMonths),
            warningMonthsIcon: this.iconService.getIconKms(warningMonths),
            warningMonthsIconClass: this.iconService.getClassIcon(warningMonths)
        };
    }

    calculateInitReplacement(vehicle: VehicleModel, operations: OperationModel[],
                             main: MaintenanceModel): WearReplacementProgressBarViewModel[] {
        let result: WearReplacementProgressBarViewModel[] = [];
        main.listMaintenanceElement.forEach(rep => {
            const ops: OperationModel[] = operations.filter(x => x.vehicle.id === vehicle.id &&
                x.listMaintenanceElement.some(y => y.id === rep.id));
            if (ops.length === 0) {
                const calKms = (main.km - vehicle.kmEstimated);
                const calMonths = this.calculateMontVehicleReplacement(main.time, vehicle.datePurchase);
                const percentKm: number = this.calculatePercent(main.km, calKms);
                const percentMonth: number = this.calculatePercent(main.time, calMonths);
                const warningKms: WarningWearEnum = this.getWarningMaintenance(percentKm, calKms < (main.km * -1));
                const warningMonths: WarningWearEnum = this.getWarningMaintenance(percentMonth, calMonths < (main.time * -1));
                result = [... result, this.initReplacement({rep, calKms, calMonths, percentKm, warningKms, warningMonths, percentMonth})];
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
                const calKms = (main.km - vehicle.kmEstimated);
                const calMonths = this.calculateMontVehicleReplacement(main.time, vehicle.datePurchase);
                const percentKm: number = this.calculatePercent(main.km, calKms);
                const percentMonth: number = this.calculatePercent(main.time, calMonths);
                const warningKms: WarningWearEnum = this.getWarningWearNormal(main.wear, percentKm, calKms, null, main.km);
                const warningMonths: WarningWearEnum = this.getWarningWearNormal(main.wear, percentMonth, calMonths, null, main.time);
                result = [... result, this.initReplacement({rep, calKms, calMonths, percentKm, warningKms, warningMonths, percentMonth})];
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
                calKms = this.calculateKmVehicleReplacement(vehicle.kmEstimated, op.km, main.km);
                calMonths = this.calculateMontVehicleReplacement(main.time, op.date);
            } else {
                calKms = (main.km - vehicle.kmEstimated);
                calMonths = this.calculateMontVehicleReplacement(main.time, vehicle.datePurchase);
            }
            const percentKm: number = this.calculatePercent(main.km, calKms);
            const percentMonth: number = this.calculatePercent(main.time, calMonths);
            let priceSum: number = op.price;
            if (!!op.listMaintenanceElement && op.listMaintenanceElement.length > 0) {
                priceSum += this.commonService.sum(op.listMaintenanceElement, ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE);
            }
            const warningKms: WarningWearEnum = this.getWarningWearNormal(main.wear, percentKm, calKms, op.km, main.km);
            const warningMonths: WarningWearEnum = this.getWarningWearNormal(main.wear, percentMonth, calMonths, op.km, main.time);
        
            result = [... result, this.initReplacement({rep, op, priceSum, calKms, calMonths, percentKm, warningKms, warningMonths, percentMonth})];
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

    calculateKmVehicleReplacement(kmEstimated: number, kmOp: number, kmMain: number): number {
        return (kmOp + kmMain) - kmEstimated;
    }

    calculateMontVehicleReplacement(time: number, date: Date): number {
        return (time !== null ? time - this.calendarService.monthDiff(new Date(date), new Date()) : 0);
    }

    calculatePercent(total: number, value: number): number {
        return (total === 0 || total === null ? 0 : this.formatPercent(value, (total - value), total));
    }

    calculatePercentNegative(total: number, value: number): number {
        return (total === 0 || total === null ? 0 : this.formatPercent(value, value, total));
    }

    formatPercent(condition: number, value: number, total: number): number {
        return (condition >= 0 ? value / total : 1);
    }

    getDateCalculateMonths(time: number): string {
        let date = '';
        const months: number = time * (time < 0 ? -1 : 1);
        if (months >= 12) {
          const years: number = this.commonService.round((months / 12), 10);
          date = `${years} ${this.translator.instant(years > 1 ? 'COMMON.YEARS' : 'COMMON.YEAR')}`;
        } else {
          date = `${months} ${this.translator.instant(months > 1 ? 'COMMON.MONTHS' : 'COMMON.MONTH')}`;
        }
        return date;
    }

    /** INFO NOTIFICATIONS */

    getWearReplacement(strict: boolean, vehicleWear: WearVehicleProgressBarViewModel,
                       operations: OperationModel[]): WearVehicleProgressBarViewModel {
        let result: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();

        if (vehicleWear.listWearMaintenance.length > 0) {
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
                    const lastKmVehicle: number = (wearMain.toKmMaintenance === null ? vehicleWear.kmEstimatedVehicle : wearMain.toKmMaintenance);
                    const wearRep: WearReplacementProgressBarViewModel = wearMain.listWearReplacement[0];

                    // Operation with maintenance selected
                    const operationsVehicle: OperationModel[] = operations.filter(x => x.vehicle.id === vehicleWear.idVehicle &&
                    x.listMaintenanceElement.some(m => m.id === wearRep.idMaintenanceElement));
                    const max: number = (lastKmVehicle +
                        (listWear.length === 1 || index + 1 === listWear.length ? 0 : - wearMain.kmMaintenance * 2));
                    timeCalculate = this.getInitTime(wearMain, operationsVehicle, vehicleWear.datePurchaseVehicle, timeCalculate);
                    let opLast = new OperationModel();
                    for (let kmCalculate = this.getInitKm(wearMain); kmCalculate < max; kmCalculate += wearMain.kmMaintenance) {
                        let calcKm: number = (kmCalculate + wearMain.kmMaintenance); // km should maintenance
                        let calcTime: number = (timeCalculate + wearMain.timeMaintenance); // time should maintenance
                        if (!strict && opLast && opLast.km != null) { // Calculate flexible
                            kmCalculate = opLast.km;
                            calcKm = (kmCalculate + wearMain.kmMaintenance);
                            calcTime = (this.calendarService.monthDiff(vehicleWear.datePurchaseVehicle, new Date(opLast.date))
                                + wearMain.timeMaintenance);
                        }
                        const calcCompKm: number = (calcKm + estimatedKmOperation); // km max should maintenance
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
                            opLast = this.getOperationsNearKmTime(ops, vehicleWear.datePurchaseVehicle, calcKm, calcTime);
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
                            opLast = null;
                        }
                        if ((wearMain.toKmMaintenance === null || wearMain.toKmMaintenance >= calcKm) &&
                            (calcKm < vehicleWear.kmEstimatedVehicle || (!!op && op.id !== null)) &&
                            (strict || !wearMaintenance.some(wm => wm.listWearReplacement.some(wmr =>
                                wmr.kmAcumulateMaintenance === calcKm && wmr.timeAcumulateMaintenance === calcTime &&
                                wmr.calculateKms === calculateKmEstimate && wmr.calculateMonths === calculateTimeEstimate)))) {
                            const warningKms: WarningWearEnum = this.getWarningRecord(wearMain.wearMaintenance, calculateKmEstimate, percentKm, op.km);
                            const warningMonths: WarningWearEnum = this.getWarningRecord(wearMain.wearMaintenance, calculateTimeEstimate, percentTime, op.km);
                            wearMaintenance = [... wearMaintenance, {
                                codeMaintenanceFreq: wearMain.codeMaintenanceFreq,
                                iconMaintenance: wearMain.iconMaintenance,
                                idMaintenance: wearMain.idMaintenance,
                                descriptionMaintenance: wearMain.descriptionMaintenance,
                                kmMaintenance: wearMain.kmMaintenance,
                                timeMaintenance: wearMain.timeMaintenance,
                                fromKmMaintenance: wearMain.fromKmMaintenance,
                                toKmMaintenance: wearMain.toKmMaintenance,
                                initMaintenance: wearMain.initMaintenance,
                                wearMaintenance: wearMain.wearMaintenance,
                                percent: wearMain.percent,
                                warning: wearMain.warning,
                                warningProgressBarIcon: wearMain.warningProgressBarIcon,
                                listWearNotificationReplacement: wearMain.listWearNotificationReplacement,
                                listWearReplacement: [{
                                    idMaintenanceElement: wearRep.idMaintenanceElement,
                                    nameMaintenanceElement: wearRep.nameMaintenanceElement,
                                    iconMaintenanceElement: wearRep.iconMaintenanceElement,
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
                                    warningIconClass: this.iconService.getClassIcon(this.calculateWearNotificationPriority(warningKms, warningMonths)),
                                    warningKms: warningKms,
                                    warningKmsProgressBarIcon: this.iconService.getClassProgressbar(warningKms),
                                    warningKmsIcon: this.iconService.getIconKms(warningKms),
                                    warningKmsIconClass: this.iconService.getClassIcon(warningKms),
                                    percentMonths: percentTime,
                                    warningMonths: warningMonths,
                                    warningMonthsProgressBarIcon: this.iconService.getClassProgressbar(warningMonths),
                                    warningMonthsIcon: this.iconService.getIconKms(warningMonths),
                                    warningMonthsIconClass: this.iconService.getClassIcon(warningMonths)
                                }]
                            }];
                        }

                        if (!!op && op.id !== null) {
                            const valPercentKm: number = (percentKm > 1 ? 1 : percentKm);
                            percentVehicleKm += (calculateKmEstimate >= 0 ? 1 : 1 - valPercentKm);
                            const valPercentTime: number = (percentTime > 1 ? 1 : percentTime);
                            percentVehicleTime += (calculateTimeEstimate >= 0 ? 1 : 1 - valPercentTime);
                        }
                        timeCalculate += wearMain.timeMaintenance;
                    }
                });
                const perKm: number = percentVehicleKm * 100 / wearMaintenance.length;
                const perTime: number = percentVehicleTime * 100 / wearMaintenance.length;
                const warningWear: WarningWearEnum = this.getPercentVehicle(wearMaintenance, vehicleWear.kmEstimatedVehicle);
                result = {
                    idVehicle: vehicleWear.idVehicle,
                    nameVehicle: vehicleWear.nameVehicle,
                    kmVehicle: vehicleWear.kmVehicle,
                    kmEstimatedVehicle: vehicleWear.kmEstimatedVehicle,
                    datePurchaseVehicle: vehicleWear.datePurchaseVehicle,
                    kmsPerMonthVehicle: vehicleWear.kmsPerMonthVehicle,
                    dateKmsVehicle: vehicleWear.dateKmsVehicle,
                    typeVehicle: vehicleWear.typeVehicle,
                    iconVehicle: vehicleWear.iconVehicle,
                    percent: Math.round((perKm + perTime) / 2),
                    percentKm: Math.floor(perKm),
                    percentTime: Math.floor(perTime),
                    warning: warningWear,
                    warningProgressBarIcon: warningWear,
                    idConfiguration: vehicleWear.idConfiguration,
                    nameConfiguration: vehicleWear.nameConfiguration,
                    listWearMaintenance: wearMaintenance
                };
            }
        }

        return result;
    }

    getInitKm(wear: WearMaintenanceProgressBarViewModel): number {
        return wear.fromKmMaintenance - (wear.fromKmMaintenance > 0 ? wear.kmMaintenance : 0);
    }

    getInitTime(wear: WearMaintenanceProgressBarViewModel, operations: OperationModel[], datePurchase: Date, time: number): number {
        let result: number = time;
        if (wear.fromKmMaintenance !== 0 && time === 0) {
            const opCalc: OperationModel = this.getOperationsNearKmTime(operations, datePurchase, wear.fromKmMaintenance, 0);
            result = opCalc === null ? 0 : this.calendarService.monthDiff(datePurchase, new Date(opCalc.date));
        }
        return result;
    }

    getOperationsFilteredKmTime(operationsVehicle: OperationModel[], wearMaintenance: WearMaintenanceProgressBarViewModel[],
                                kmCalculate: number, calcCompKm: number, calcTime: number, opLast: OperationModel,
                                datePurchaseVehicle: Date): OperationModel[] {
        return operationsVehicle.filter(x =>
                !wearMaintenance.some(main => main.listWearReplacement[0].idOperation === x.id) &&
                ((x.km >= kmCalculate && x.km < calcCompKm) ||
                ((opLast === null || opLast.id === null ? 0 : opLast.km) <= x.km && x.km < calcCompKm &&
                this.calendarService.monthDiff(datePurchaseVehicle, new Date(x.date)) <= calcTime)));
    }

    getOperationsNearKmTime(operations: OperationModel[], date: Date, km: number, time: number): OperationModel {
        let operation: OperationModel = null;
        let percent = 1;
        operations.forEach(x => {
            const near: number = (km - x.km) * (km < x.km ? -1 : 1);
            const perc: number = near / km;
            if (percent > perc) {
                percent = perc;
                operation = x;
            } else if (time !== 0) {
                const datePurchase: Date = new Date(date);
                datePurchase.setMonth(datePurchase.getMonth() + time);
                if (new Date(x.date) < datePurchase) {
                    const timeMaint: number = this.calendarService.monthDiff(new Date(datePurchase), new Date(x.date));
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
        const estimate: number = (calculateEstimate >= 0 ? 1 : -1);
        return (wear ? this.getWarningWearRecordsMaintenance(percent * estimate, km === null) :
            this.getWarningRecordsMaintenance(percent * estimate, km === null));
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

    // HELPER METHODS FOR MACHINE LERNING TYPES

    isEventFailure(code: string): boolean {
        return code === Constants.OPERATION_TYPE_FAILURE_HOME ||
            code === Constants.OPERATION_TYPE_FAILURE_WORKSHOP;
    }

    isEventPreventive(code: string): boolean {
        return code === Constants.OPERATION_TYPE_MAINTENANCE_HOME ||
            code === Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP;
    }

    calculateEventFailurePrediction(operations: OperationModel[], idReplacement: number = 0): IReplaclementEventFailurePrediction[] {
        if(!operations || operations.length === 0) return [];
        
        const vehicleEventsPerReplacement: IReplaclementEventFailurePrediction[] = [];
        const mapEvent = (op: OperationModel, me: MaintenanceElementModel) => {
        return { 
                tkm: op.km, 
                ttime: this.calendarService.monthDiff(new Date(op.vehicle.datePurchase), new Date(op.date)),
                type: this.isEventFailure(op.operationType.code) ? FailurePredictionTypeEnum.FAIL : FailurePredictionTypeEnum.MAINT,
                cost: me.price + op.price
            }
            };
        
        const opPrefiltered = operations.filter(op => 
        this.isEventFailure(op.operationType.code) ||
        this.isEventPreventive(op.operationType.code));
        opPrefiltered.forEach(op => {
        op.listMaintenanceElement.forEach(me => {
            if(idReplacement == 0 || idReplacement === me.id) {
            const repEvent = vehicleEventsPerReplacement.find(e => e.idReplacement === me.id && e.idVehicle === op.vehicle.id);
            if(!repEvent) {
                vehicleEventsPerReplacement.push({ 
                idReplacement: me.id, 
                nameReplacement: me.name,
                idVehicle: op.vehicle.id,
                brandVehicle: op.vehicle.brand,
                modelVehicle: op.vehicle.model,
                events: [mapEvent(op, me)]
                });
            } else {
                repEvent.events.push(mapEvent(op, me));
            }
            }
        });
        });

        vehicleEventsPerReplacement.forEach(x => {
        const listevent = [...x.events];
        x.events = [];
        listevent.forEach((ev, index) => x.events.push({
            tkm: (index == 0 ? ev.tkm : ev.tkm - listevent[index - 1].tkm),
            ttime: (index == 0 ? ev.ttime : ev.ttime - listevent[index - 1].ttime),
            cost: ev.cost,
            type: ev.type
        }));
        })

        return vehicleEventsPerReplacement;
    }
}
