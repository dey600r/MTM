import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
    DashboardModel, OperationModel, SearchDashboardModel,
    ConfigurationModel, MotoModel, MaintenanceModel, WearMotoProgressBarModel, WearReplacementProgressBarModel
} from '@models/index';
import { CommonService } from './common.service';
import { ConstantsColumns, WarningWearEnum, FilterMonthsEnum, Constants, FilterKmTimeEnum } from '../utils';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private searchDashboard: SearchDashboardModel = new SearchDashboardModel();
    public behaviourSearchDashboard: BehaviorSubject<SearchDashboardModel>
        = new BehaviorSubject<SearchDashboardModel>(this.searchDashboard);

    constructor(private commonService: CommonService,
                private translator: TranslateService) {
    }

    getSizeWidthHeight(w: number, h: number): any[] {
        return (w < h ? [w - 5, (h / 3) - 10] : [w - 5, h - 10]);
    }

    /** DASHBOADS */

    // MOTO OP TYPE EXPENSES
    getDashboardModelMotoExpenses(view: any[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardMotoExpenses(data, filter), null,
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.MOTORBIKE'),
            filter.showAxisLabel, this.translator.instant('COMMON.MOTORBIKE'),
            filter.showAxisLabel, this.translator.instant('COMMON.EXPENSE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardMotoExpenses(data: OperationModel[], filter: SearchDashboardModel): any[] {
        let result: any[] = [];
        const operationPreFilter: OperationModel[] = this.getPrefilterOperation(data, filter);
        operationPreFilter.forEach(x => {
            if (!result.some((z: any) => z.id === x.moto.id)) {
                const sumPrice: number = this.commonService.sum(
                    operationPreFilter.filter(z => z.moto.id === x.moto.id &&
                        (filter.showOpType.length === 0 ||
                        filter.showOpType.some(f => f.id === z.operationType.id))),
                    ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
                result = [...result, {
                    id: x.moto.id,
                    name: x.moto.model,
                    value: sumPrice
                }];
            }
        });
        return result;
    }

    // MOTO PER MONTH EXPENSES
    getDashboardModelMotoPerTime(view: any[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardMotoPerTimeExpenses(data, filter), null,
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.DATE'),
            filter.showAxisLabel, this.translator.instant('COMMON.DATE'),
            filter.showAxisLabel, this.translator.instant('COMMON.EXPENSE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardMotoPerTimeExpenses(data: OperationModel[], filter: SearchDashboardModel): any[] {
        let result: any[] = [];
        if (!!data && data.length > 0) {
            const operationPreFilter: OperationModel[] = this.getPrefilterOperation(data, filter);
            if (!!operationPreFilter && operationPreFilter.length > 0) {
                const iterator: number = filter.showPerMont;
                const minYear: number =
                    new Date(this.commonService.min(operationPreFilter, ConstantsColumns.COLUMN_MTM_OPERATION_DATE)).getFullYear();
                const maxYear: number =
                    new Date(this.commonService.max(operationPreFilter, ConstantsColumns.COLUMN_MTM_OPERATION_DATE)).getFullYear();
                for (let i = minYear; i <= maxYear; i++) {
                    for (let j = 0; j < 12; j += iterator) {
                        const ops: OperationModel[] = operationPreFilter.filter(x =>
                            new Date(x.date).getMonth() >= j && new Date(x.date).getMonth() < (j + iterator) &&
                            new Date(x.date).getFullYear() === i &&
                            (filter.showOpType.length === 0 ||
                            filter.showOpType.some(f => f.id === x.operationType.id)));
                        if (!!ops && ops.length > 0) {
                            const sumPrice: number = this.commonService.sum(ops, ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
                            result = [...result, {
                                name: this.getRangeDates(i, j, iterator),
                                value: sumPrice
                            }];
                        }
                    }
                }
            }
        }
        return result;
    }

    getRangeDates(i: number, j: number, iterator: number): string {
        let range = `${(j < 10 ? '0' : '')}${(j + 1)}/${i}`;
        if (iterator === FilterMonthsEnum.QUARTER) {
            const cal: number = (j + iterator);
            range = `${(j < 10 ? '0' : '')}${(j + 1)}/${i.toString().substring(2)}-` +
                    `${(cal < 10 ? '0' : '')}${(cal)}/${i.toString().substring(2)}`;
        } else if (iterator === FilterMonthsEnum.YEAR) {
            range = `${i}`;
        }
        return range;
    }

    // MOTO OP TYPE EXPENSES
    getDashboardModelMotoOpTypeExpenses(view: any[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardMotoOpTypeExpenses(data, filter), null,
        filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.MOTORBIKE'),
        filter.showAxisLabel, this.translator.instant('COMMON.MOTORBIKE'),
        filter.showAxisLabel, this.translator.instant('COMMON.EXPENSE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardMotoOpTypeExpenses(data: OperationModel[], filter: SearchDashboardModel): any[] {
        let result: any[] = [];
        const operationPreFilter: OperationModel[] = this.getPrefilterOperation(data, filter);
        operationPreFilter.forEach(x => {
            let dash: any = result.find(y => y.name === x.moto.model);
            const sumPrice: number = this.commonService.sum(
                operationPreFilter.filter(z => z.moto.id === x.moto.id && z.operationType.id === x.operationType.id &&
                    (filter.showOpType.length === 0 ||
                    filter.showOpType.some(f => f.id === z.operationType.id))),
                ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
            if (sumPrice > 0) {
                if (!!dash) {
                    if (!dash.series.some((z: any) => z.id === x.operationType.id)) {
                        dash.series = [...dash.series, {
                            id: x.operationType.id,
                            name: x.operationType.description,
                            value: sumPrice
                        }];
                    }
                } else {
                    dash = {
                        name: x.moto.model,
                        series: [{
                            id: x.operationType.id,
                            name: x.operationType.description,
                            value: sumPrice
                        }]
                    };
                    result = [...result, dash];
                }
            }
        });
        return result;
    }

    // OPERATION TYPE EXPENSES
    getDashboardModelOpTypeExpenses(view: any[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardOpTypeExpenses(data, filter), null,
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.OPERATION_TYPE'),
            filter.showAxisLabel, this.translator.instant('COMMON.OPERATION_TYPE'),
            filter.showAxisLabel, this.translator.instant('COMMON.EXPENSE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardOpTypeExpenses(data: OperationModel[], filter: SearchDashboardModel): any[] {
        let result: any[] = [];
        const operationPreFilter: OperationModel[] = this.getPrefilterOperation(data, filter);
        operationPreFilter.forEach(x => {
            if (!result.some((z: any) => z.id === x.operationType.id)) {
                const sumPrice: number = this.commonService.sum(
                    operationPreFilter.filter(z => z.operationType.id === x.operationType.id &&
                        (filter.showOpType.length === 0 ||
                        filter.showOpType.some(f => f.id === z.operationType.id))),
                    ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
                result = [...result, {
                    id: x.operationType.id,
                    name: x.operationType.description,
                    value: sumPrice
                }];
            }
        });
        return result;
    }

    getPrefilterOperation(data: OperationModel[], filter: SearchDashboardModel): OperationModel[] {
        let operationPreFilter: OperationModel[] = [];
        if (filter.showMyData) {
            operationPreFilter = data.filter(x => x.owner === null || x.owner.toLowerCase() === Constants.OWNER_ME ||
                x.owner.toLowerCase() === Constants.OWNER_YO);
        } else {
            operationPreFilter = data.filter(x => x.owner !== null && x.owner.toLowerCase() !== Constants.OWNER_ME &&
                x.owner.toLowerCase() !== Constants.OWNER_YO);
        }
        return operationPreFilter;
    }

    // RECORDS MAINTENANCES
    getDashboardRecordMaintenances(view: any[], data: WearMotoProgressBarModel, filter: SearchDashboardModel): DashboardModel {
        let dataDashboard: any[] = [];
        let translateY = 'COMMON.KM';
        if (filter.filterKmTime === FilterKmTimeEnum.KM) {
            dataDashboard = this.mapWearToDashboardKmRecordMaintenances(data);
        } else {
            dataDashboard = this.mapWearToDashboardTimeRecordMaintenances(data);
            translateY = 'COMMON.MONTHS';
        }
        return new DashboardModel(view, dataDashboard, { domain: ['#D91CF6', '#1CEAF6']},
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.OPERATIONS'),
            filter.showAxisLabel, this.translator.instant('PAGE_CONFIGURATION.MAINTENANCES'),
            filter.showAxisLabel, this.translator.instant(translateY), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapWearToDashboardKmRecordMaintenances(data: WearMotoProgressBarModel): any[] {
        let result: any[] = [];
        if (!!data && data.listWearReplacement.length > 0) {
            const estimated: any = {
                name: this.translator.instant('COMMON.ESTIMATED'),
                series: []
            };
            const real: any = {
                name: this.translator.instant('COMMON.REAL'),
                series: []
            };
            const kmMaintenance: number =
                data.listWearReplacement[data.listWearReplacement.length - 1].kmMaintenance / data.listWearReplacement.length;
            const kmEstimated: number = this.calculateKmMotoEstimated(new MotoModel(null, null, 0, data.kmMoto,
                null, data.kmsPerMonthMoto, data.dateKmsMoto, data.datePurchaseMoto));
            data.listWearReplacement.forEach((x, index) => {
                estimated.series = [...estimated.series, {
                    name: `${x.kmMaintenance}km`,
                    value: kmMaintenance
                }];
                real.series = [...real.series, {
                    name: `${x.kmMaintenance}km`,
                    value: (x.kmOperation === null ? 0 : (x.kmMaintenance - x.calculateKms) - (kmMaintenance * index))
                }];
            });
            estimated.series = [...estimated.series, {
                name: `${kmEstimated}km`,
                value: kmMaintenance
            }];
            real.series = [...real.series, {
                name: `${kmEstimated}km`,
                value: 0
            }];
            result = [estimated, real];
        }
        return result;
    }

    mapWearToDashboardTimeRecordMaintenances(data: WearMotoProgressBarModel): any[] {
        let result: any[] = [];
        if (!!data && data.listWearReplacement.length > 0) {
            const estimated: any = {
                name: this.translator.instant('COMMON.ESTIMATED'),
                series: []
            };
            const real: any = {
                name: this.translator.instant('COMMON.REAL'),
                series: []
            };
            const timeMaintenance: number =
                data.listWearReplacement[data.listWearReplacement.length - 1].timeMaintenance / data.listWearReplacement.length;
            const kmEstimated: number = this.calculateKmMotoEstimated(new MotoModel(null, null, 0, data.kmMoto,
                null, data.kmsPerMonthMoto, data.dateKmsMoto, data.datePurchaseMoto));
            data.listWearReplacement.forEach(x => {
                estimated.series = [...estimated.series, {
                    name: `${x.kmMaintenance}km`,
                    value: x.timeMaintenance
                }];
                real.series = [...real.series, {
                    name: `${x.kmMaintenance}km`,
                    value: (x.kmOperation === null ? 0 : (x.timeMaintenance - x.calculateMonths))
                }];
            });
            estimated.series = [...estimated.series, {
                name: `${kmEstimated}km`,
                value: timeMaintenance + data.listWearReplacement[data.listWearReplacement.length - 1].timeMaintenance
            }];
            real.series = [...real.series, {
                name: `${kmEstimated}km`,
                value: 0
            }];
            result = [estimated, real];
        }
        return result;
    }

    /** NOTIFICATIONS */

    // MOTO REPLACEMENTS WEAR
    getWearReplacementToMoto(operations: OperationModel[], motos: MotoModel[],
                             configurations: ConfigurationModel[],
                             maintenances: MaintenanceModel[]): WearMotoProgressBarModel[] {
        let result: WearMotoProgressBarModel[] = [];

        if (!!motos && motos.length > 0) {
            motos.forEach(moto => { // Replacement per moto
                const config: ConfigurationModel = configurations.find(x => x.id === moto.configuration.id);
                if (config.listMaintenance.length > 0) {
                    let wearReplacement: WearReplacementProgressBarModel[] = [];
                    const maintenancesMoto: MaintenanceModel[] =
                        maintenances.filter(x => config.listMaintenance.some(y => y.id === x.id));
                    maintenancesMoto.forEach(main => { // Maintenaces of moto
                        const maintenanceWear: WearReplacementProgressBarModel = this.calculateMaintenace(moto, operations, main);
                        if (!!maintenanceWear) {
                            wearReplacement = [... wearReplacement, maintenanceWear];
                        }
                    });
                    const sumSuccess: number = ((maintenancesMoto.length - wearReplacement.length) +
                        wearReplacement.filter(x => x.warningKms === WarningWearEnum.SUCCESS &&
                                                    x.warningMonths === WarningWearEnum.SUCCESS).length) / maintenancesMoto.length;
                    result = [...result, {
                        idMoto: moto.id,
                        nameMoto: `${moto.brand} ${moto.model}`,
                        kmMoto: moto.km,
                        datePurchaseMoto: new Date(moto.datePurchase),
                        kmsPerMonthMoto: moto.kmsPerMonth,
                        dateKmsMoto: moto.dateKms,
                        percent: sumSuccess,
                        warning: this.getPercentMoto(wearReplacement),
                        listWearReplacement: this.orderMaintenanceWear(wearReplacement)
                    }];
                }
            });
        }

        return this.commonService.orderBy(result, 'nameMoto');
    }

    orderMaintenanceWear(maintenanceWear: WearReplacementProgressBarModel[]): WearReplacementProgressBarModel[] {
        let result: WearReplacementProgressBarModel[] = [];
        const wearReplacementDanger: WearReplacementProgressBarModel[] =
            maintenanceWear.filter(x => x.warningKms === WarningWearEnum.DANGER);
        const wearReplacementWarning: WearReplacementProgressBarModel[] =
            maintenanceWear.filter(x => x.warningKms === WarningWearEnum.WARNING);
        const wearReplacementSuccess: WearReplacementProgressBarModel[] =
            maintenanceWear.filter(x => x.warningKms === WarningWearEnum.SUCCESS);

        result = this.commonService.orderBy(wearReplacementDanger, 'calculateKms');
        this.commonService.orderBy(wearReplacementWarning, 'calculateKms').forEach(x => result = [...result, x]);
        this.commonService.orderBy(wearReplacementSuccess, 'calculateKms').forEach(x => result = [...result, x]);

        return result;
    }

    getPercentMoto(wearReplacement: WearReplacementProgressBarModel[]): WarningWearEnum {
        let warninSuccess: WarningWearEnum = WarningWearEnum.SUCCESS;
        if (wearReplacement.some(x => x.warningKms === WarningWearEnum.DANGER ||
            x.warningMonths === WarningWearEnum.DANGER)) {
            warninSuccess = WarningWearEnum.DANGER;
        } else if (wearReplacement.some(x => x.warningKms === WarningWearEnum.WARNING ||
            x.warningMonths === WarningWearEnum.WARNING)) {
            warninSuccess = WarningWearEnum.WARNING;
        }
        return warninSuccess;
    }

    calculateMaintenace(moto: MotoModel, operations: OperationModel[],
                        main: MaintenanceModel): WearReplacementProgressBarModel {
        if (main.init) {
            return this.calculateInitMaintenace(moto, operations, main);
        } else if (main.wear) {
            return this.calculateWearMaintenace(moto, operations, main);
        } else {
            return this.calculateNormalMaintenace(moto, operations, main);
        }
    }

    calculateInitMaintenace(moto: MotoModel, operations: OperationModel[],
                            main: MaintenanceModel): WearReplacementProgressBarModel {
        let result: WearReplacementProgressBarModel = null;
        const ops: OperationModel[] = operations.filter(x => x.moto.id === moto.id &&
            x.listMaintenanceElement.some(y => y.id === main.maintenanceElement.id));
        if (ops.length === 0) {
            const calKms = (main.km - this.calculateKmMotoEstimated(moto));
            const calMonths = this.calculateMontMotoReplacement(main.time, moto.datePurchase);
            const percentKm: number = this.calculatePercent(main.km, calKms);
            const percentMonth: number = this.calculatePercent(main.time, calMonths);
            result = {
                idMaintenanceElement: main.maintenanceElement.id,
                nameMaintenanceElement: main.maintenanceElement.name,
                codeMaintenanceFreq: main.maintenanceFreq.code,
                idOperation: 0,
                descriptionOperation: '',
                kmOperation: 0,
                dateOperation: null,
                idMaintenance: main.id,
                descriptionMaintenance: main.description,
                kmMaintenance: main.km,
                timeMaintenance: main.time,
                initMaintenance: main.init,
                wearMaintenance: main.wear,
                calculateKms: calKms,
                calculateMonths: calMonths,
                percentKms: percentKm,
                warningKms: this.getWarningMaintenance(percentKm),
                percentMonths: percentMonth,
                warningMonths: this.getWarningMaintenance(percentMonth),
            };
        }
        return result;
    }

    calculateWearMaintenace(moto: MotoModel, operations: OperationModel[],
                            main: MaintenanceModel): WearReplacementProgressBarModel {
        let result: WearReplacementProgressBarModel = null;
        const ops: OperationModel[] = operations.filter(x => x.moto.id === moto.id &&
            x.listMaintenanceElement.some(y => y.id === main.maintenanceElement.id) &&
            x.km >= (main.km - 2000));
        if (ops.length === 0) {
            const calKms = (main.km - this.calculateKmMotoEstimated(moto));
            const calMonths = this.calculateMontMotoReplacement(main.time, moto.datePurchase);
            const percentKm: number = this.calculatePercent(main.km, calKms);
            const percentMonth: number = this.calculatePercent(main.time, calMonths);
            result = {
                idMaintenanceElement: main.maintenanceElement.id,
                nameMaintenanceElement: main.maintenanceElement.name,
                codeMaintenanceFreq: main.maintenanceFreq.code,
                idOperation: 0,
                descriptionOperation: '',
                kmOperation: 0,
                dateOperation: null,
                idMaintenance: main.id,
                descriptionMaintenance: main.description,
                kmMaintenance: main.km,
                timeMaintenance: main.time,
                initMaintenance: main.init,
                wearMaintenance: main.wear,
                calculateKms: calKms,
                calculateMonths: calMonths,
                percentKms: percentKm,
                warningKms: this.getWarningWear(percentKm),
                percentMonths: percentMonth,
                warningMonths: this.getWarningWear(percentMonth),
            };
        }
        return result;
    }

    getWarningWear(percent: number): WarningWearEnum {
        if (percent >= 1) {
            return WarningWearEnum.WARNING;
        } else {
            return WarningWearEnum.SUCCESS;
        }
    }

    calculateNormalMaintenace(moto: MotoModel, operations: OperationModel[],
                              main: MaintenanceModel): WearReplacementProgressBarModel {
        const ops: OperationModel[] = operations.filter(x => x.moto.id === moto.id &&
            x.listMaintenanceElement.some(y => y.id === main.maintenanceElement.id));
        let maxKm = 0;
        let op: OperationModel = new OperationModel();
        let calKms = 0;
        let calMonths = 0;
        if (!!ops && ops.length > 0) {
            maxKm = this.commonService.max(ops, ConstantsColumns.COLUMN_MTM_OPERATION_KM);
            op = ops.find(x => x.km === maxKm);
            calKms = this.calculateKmMotoReplacement(moto, op, main);
            calMonths = this.calculateMontMotoReplacement(main.time, op.date);
        } else {
            calKms = (main.km - this.calculateKmMotoEstimated(moto));
            calMonths = this.calculateMontMotoReplacement(main.time, moto.datePurchase);
        }
        const percentKm: number = this.calculatePercent(main.km, calKms);
        const percentMonth: number = this.calculatePercent(main.time, calMonths);
        return {
            idMaintenanceElement: main.maintenanceElement.id,
            nameMaintenanceElement: main.maintenanceElement.name,
            codeMaintenanceFreq: main.maintenanceFreq.code,
            idOperation: op.id,
            descriptionOperation: op.description,
            kmOperation: op.km,
            dateOperation: op.date,
            idMaintenance: main.id,
            descriptionMaintenance: main.description,
            kmMaintenance: main.km,
            timeMaintenance: main.time,
            initMaintenance: main.init,
            wearMaintenance: main.wear,
            calculateKms: calKms,
            calculateMonths: calMonths,
            percentKms: percentKm,
            warningKms: this.getWarningMaintenance(percentKm),
            percentMonths: percentMonth,
            warningMonths: this.getWarningMaintenance(percentMonth),
        };
    }

    getWarningMaintenance(percent: number): WarningWearEnum {
        if (percent >= 0.8 && percent < 1) {
            return WarningWearEnum.WARNING;
        } else if (percent >= 1) {
            return WarningWearEnum.DANGER;
        } else {
            return WarningWearEnum.SUCCESS;
        }
    }

    calculateKmMotoReplacement(moto: MotoModel, op: OperationModel, main: MaintenanceModel): number {
        return (op.km + main.km) - this.calculateKmMotoEstimated(moto);
    }

    calculateMontMotoReplacement(time: number, date: Date): number {
        return (time !== null ? time - this.commonService.monthDiff(new Date(date), new Date()) : 0);
    }

    calculatePercent(total: number, value: number): number {
        return (value >= 0 ? (total - value) / total : 1);
    }

    calculateKmMotoEstimated(moto: MotoModel): number {
        return moto.km + (moto.kmsPerMonth * this.commonService.monthDiff(new Date(moto.dateKms), new Date()));
    }

    getWearReplacement(motoWear: WearMotoProgressBarModel, operations: OperationModel[]): WearMotoProgressBarModel {
        let result: WearMotoProgressBarModel = new WearMotoProgressBarModel();

        // Km Moto estimated
        const kmMoto: number = this.calculateKmMotoEstimated(new MotoModel(null, null, 0, motoWear.kmMoto,
            null, motoWear.kmsPerMonthMoto, motoWear.dateKmsMoto, motoWear.datePurchaseMoto));
        const wear: WearReplacementProgressBarModel = motoWear.listWearReplacement[0];
        // Operation with maintenance selected
        const operationsMoto: OperationModel[] = operations.filter(x => x.moto.id === motoWear.idMoto &&
            x.listMaintenanceElement.some(y => y.id === wear.idMaintenanceElement));
        const diffDateToday: number = this.commonService.monthDiff(motoWear.datePurchaseMoto, new Date());

        if (wear.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE) {
            let kmCalculate = 0;
            let timeCalculate = 0;
            let wearReplacement: WearReplacementProgressBarModel[] = [];
            let percentMoto = 0;
            const iterations: number = (kmMoto - wear.kmMaintenance) / wear.kmMaintenance;
            for (let i = 0; i < iterations; i++) {
                const calcKm: number = (kmCalculate + wear.kmMaintenance); // km should maintenance
                const estimatedKmOperation: number = wear.kmMaintenance / 2; // km estimated maintenance
                const calcCompKm: number = (calcKm + estimatedKmOperation); // km max should maintenance
                const calcTime: number = (timeCalculate + wear.timeMaintenance); // time should maintenance
                // OPERATIONS: km and time aprox to maintenance
                const ops: OperationModel[] = operationsMoto.filter(x =>
                    !wearReplacement.some(y => y.idOperation === x.id) &&
                    ((x.km >= kmCalculate && x.km < calcCompKm) ||
                    (x.km < calcCompKm &&
                    this.commonService.monthDiff(motoWear.datePurchaseMoto, new Date(x.date)) <= calcTime)));
                let op = new OperationModel();
                op.id = null;
                let calcDiffTime = 0;
                let calculateKmEstimate = 0;
                let calculateTimeEstimate = 0;
                if (!!ops && ops.length > 0) {
                    const min: number = this.commonService.min(ops, ConstantsColumns.COLUMN_MTM_OPERATION_KM);
                    op = ops.find(x => x.km === min);
                    calcDiffTime = this.commonService.monthDiff(motoWear.datePurchaseMoto, new Date(op.date));
                    calculateKmEstimate = calcKm - op.km;
                    calculateTimeEstimate = calcTime - calcDiffTime;
                } else {
                    calculateKmEstimate = -estimatedKmOperation;
                    calculateTimeEstimate = calcTime - diffDateToday;
                }
                const percentKm: number =
                    this.calculatePercent(wear.kmMaintenance,
                        (calculateKmEstimate >= 0 ? calculateKmEstimate : estimatedKmOperation + calculateKmEstimate));
                const percentTime: number =
                    this.calculatePercent(calcTime,
                        (calculateTimeEstimate >= 0 ? calculateTimeEstimate : calcTime - diffDateToday + calculateTimeEstimate));
                wearReplacement = [... wearReplacement, {
                    idMaintenanceElement: wear.idMaintenanceElement,
                    nameMaintenanceElement: wear.nameMaintenanceElement,
                    codeMaintenanceFreq: wear.codeMaintenanceFreq,
                    idOperation: op.id,
                    descriptionOperation: op.description,
                    kmOperation: op.km,
                    dateOperation: op.date,
                    idMaintenance: wear.idMaintenance,
                    descriptionMaintenance: wear.descriptionMaintenance,
                    kmMaintenance: calcKm,
                    timeMaintenance: calcTime,
                    initMaintenance: wear.initMaintenance,
                    wearMaintenance: wear.wearMaintenance,
                    calculateKms: calculateKmEstimate,
                    calculateMonths: calculateTimeEstimate,
                    percentKms: percentKm,
                    warningKms: this.getWarningRecordsMaintenance(percentKm * (calculateKmEstimate >= 0 ? 1 : -1)),
                    percentMonths: percentTime,
                    warningMonths: this.getWarningRecordsMaintenance(percentTime * (calculateTimeEstimate >= 0 ? 1 : -1)),
                }];

                if (!!op && op.id !== null) {
                    percentMoto += (calculateKmEstimate >= 0 ? 1 : 1 - percentKm);
                }
                kmCalculate += wear.kmMaintenance;
                timeCalculate += wear.timeMaintenance;
            }
            result = {
                idMoto: motoWear.idMoto,
                nameMoto: motoWear.nameMoto,
                kmMoto: motoWear.kmMoto,
                datePurchaseMoto: motoWear.datePurchaseMoto,
                kmsPerMonthMoto: motoWear.kmsPerMonthMoto,
                dateKmsMoto: motoWear.dateKmsMoto,
                percent: Math.round((percentMoto / wearReplacement.length) * 100),
                warning: this.getPercentMoto(wearReplacement),
                listWearReplacement: this.commonService.orderBy(wearReplacement, 'kmMaintenance')
            };
        }
        return result;
    }

    getWarningRecordsMaintenance(percent: number): WarningWearEnum {
        if (percent >= 0.8 && percent <= 1) {
            return WarningWearEnum.WARNING;
        } else if (percent >= 1 || percent <= 0) {
            return WarningWearEnum.DANGER;
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
        }
    }

    getColorKms(warning: WarningWearEnum) {
        switch (warning) {
            case WarningWearEnum.SUCCESS:
            return 'success';
            case WarningWearEnum.WARNING:
            return 'warning';
            case WarningWearEnum.DANGER:
            return 'nuclear';
        }
    }

    // SEARCHER DASHBOARD

    getObserverSearchODashboard(): Observable<SearchDashboardModel> {
        return this.behaviourSearchDashboard.asObservable();
    }

    getSearchDashboard(): SearchDashboardModel {
        return this.searchDashboard;
    }

    setSearchDashboard(filter: SearchDashboardModel) {
        this.searchDashboard = filter;
        this.behaviourSearchDashboard.next(this.searchDashboard);
    }
}
