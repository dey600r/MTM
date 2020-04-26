import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
    DashboardModel, OperationModel, SearchDashboardModel,
    ConfigurationModel, MotoModel, MaintenanceModel, WearMotoProgressBarModel,
    WearReplacementProgressBarModel, OperationTypeModel, MaintenanceElementModel
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
        return (w < h ? [w - 5, (h / 3) - 10] : [w - 10, h / 3 + 20]);
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
                        (filter.searchOperationType.length === 0 ||
                        filter.searchOperationType.some(f => f.id === z.operationType.id))),
                    ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
                result = [...result, this.getDataDashboard(x.moto.model, sumPrice, x.moto.id)];
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
                            (filter.searchOperationType.length === 0 ||
                            filter.searchOperationType.some(f => f.id === x.operationType.id)));
                        if (!!ops && ops.length > 0) {
                            const sumPrice: number = this.commonService.sum(ops, ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
                            result = [...result, this.getDataDashboard(this.getRangeDates(i, j, iterator), sumPrice)];
                        }
                    }
                }
            }
        }
        return result;
    }

    getRangeDates(i: number, j: number, iterator: number): string {
        let range = `${(j < 9 ? '0' : '')}${(j + 1)}/${i}`;
        if (iterator === FilterMonthsEnum.QUARTER) {
            const cal: number = (j + iterator);
            range = `${(j < 9 ? '0' : '')}${(j + 1)}/${i.toString().substring(2)}-` +
                    `${(cal < 9 ? '0' : '')}${(cal)}/${i.toString().substring(2)}`;
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
                    (filter.searchOperationType.length === 0 ||
                    filter.searchOperationType.some(f => f.id === z.operationType.id))),
                ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
            if (sumPrice > 0) {
                if (!!dash) {
                    if (!dash.series.some((z: any) => z.id === x.operationType.id)) {
                        dash.series = [...dash.series, this.getDataDashboard(x.operationType.description, sumPrice, x.operationType.id)];
                    }
                } else {
                    dash = this.getDataSeriesDashboard(x.moto.model,
                        [this.getDataDashboard(x.operationType.description, sumPrice, x.operationType.id)]);
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
                        (filter.searchOperationType.length === 0 ||
                        filter.searchOperationType.some(f => f.id === z.operationType.id))),
                    ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
                result = [...result, this.getDataDashboard(x.operationType.description, sumPrice, x.operationType.id)];
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
            const estimated: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.ESTIMATED'),
                [this.getDataDashboard('0km', 0 )]);
            const real: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.REAL'),
                [this.getDataDashboard('0km', 0 )]);
            const kmMaintenance: number =
                data.listWearReplacement[data.listWearReplacement.length - 1].kmMaintenance / data.listWearReplacement.length;
            const kmEstimated: number = this.calculateKmMotoEstimated(new MotoModel(null, null, 0, data.kmMoto,
                null, data.kmsPerMonthMoto, data.dateKmsMoto, data.datePurchaseMoto));
            const lastMaintenance: number = data.listWearReplacement[data.listWearReplacement.length - 1].kmMaintenance + kmMaintenance;
            data.listWearReplacement.forEach((x, index) => {
                estimated.series = [...estimated.series, this.getDataDashboard(`${x.kmMaintenance}km`, kmMaintenance)];
                real.series = [...real.series,
                    this.getDataDashboard(`${x.kmMaintenance}km`,
                    (x.kmOperation === null ? 0 : (x.kmMaintenance - x.calculateKms) - (kmMaintenance * index)))];
            });
            estimated.series = [...estimated.series, this.getDataDashboard(`${lastMaintenance}km`, kmMaintenance)];
            real.series = [...real.series, this.getDataDashboard(`${lastMaintenance}km`, kmEstimated % kmMaintenance)];
            result = [estimated, real];
        }
        return result;
    }

    mapWearToDashboardTimeRecordMaintenances(data: WearMotoProgressBarModel): any[] {
        let result: any[] = [];
        if (!!data && data.listWearReplacement.length > 0) {
            const estimated: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.ESTIMATED'),
                [this.getDataDashboard('0km', 0 )]);
            const real: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.REAL'),
                [this.getDataDashboard('0km', 0 )]);
            const timeMaintenance: number =
                data.listWearReplacement[data.listWearReplacement.length - 1].timeMaintenance / data.listWearReplacement.length;
            const kmEstimated: number = this.calculateKmMotoEstimated(new MotoModel(null, null, 0, data.kmMoto,
                null, data.kmsPerMonthMoto, data.dateKmsMoto, data.datePurchaseMoto));
            const kmMaintenance: number =
                data.listWearReplacement[data.listWearReplacement.length - 1].kmMaintenance / data.listWearReplacement.length;
            const lastMaintenance: number = data.listWearReplacement[data.listWearReplacement.length - 1].kmMaintenance + kmMaintenance;
            data.listWearReplacement.forEach(x => {
                estimated.series = [...estimated.series, this.getDataDashboard(`${x.kmMaintenance}km`, x.timeMaintenance)];
                real.series = [...real.series,
                    this.getDataDashboard(`${x.kmMaintenance}km`, (x.kmOperation === null ? 0 : (x.timeMaintenance - x.calculateMonths)))];
            });
            estimated.series = [...estimated.series, this.getDataDashboard(`${lastMaintenance}km`,
                timeMaintenance + data.listWearReplacement[data.listWearReplacement.length - 1].timeMaintenance)];
            real.series = [...real.series,
                this.getDataDashboard(`${lastMaintenance}km`, this.commonService.monthDiff(data.datePurchaseMoto, new Date()))];
            result = [estimated, real];
        }
        return result;
    }

    getDataDashboard(n: string, v: any, i: number = -1): any {
        return { id: i, name: n, value: v};
    }

    getDataSeriesDashboard(n: string, s: any[], i: number = -1): any {
        return { id: i, name: n, series: s};
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
                        percentKm: 0,
                        percentTime: 0,
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
            maintenanceWear.filter(x => x.warningKms === WarningWearEnum.DANGER || x.warningKms === WarningWearEnum.SKULL);
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
        if (wearReplacement.some(x => x.warningKms === WarningWearEnum.DANGER || x.warningMonths === WarningWearEnum.DANGER ||
            x.warningKms === WarningWearEnum.SKULL || x.warningMonths === WarningWearEnum.SKULL)) {
            warninSuccess = WarningWearEnum.DANGER;
        } else if (wearReplacement.some(x => x.warningKms === WarningWearEnum.WARNING ||
            x.warningMonths === WarningWearEnum.WARNING)) {
            warninSuccess = WarningWearEnum.WARNING;
        }
        return warninSuccess;
    }

    calculateMaintenace(moto: MotoModel, operations: OperationModel[],
                        main: MaintenanceModel): WearReplacementProgressBarModel {
        if (main.maintenanceFreq.code === Constants.MAINTENANCE_FREQ_ONCE_CODE) {
            if (main.init) {
                return this.calculateInitMaintenace(moto, operations, main);
            } else if (main.wear) {
                return this.calculateWearMaintenace(moto, operations, main);
            }
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
                warningKms: this.getWarningMaintenance(percentKm, calKms < (main.km * -1)),
                percentMonths: percentMonth,
                warningMonths: this.getWarningMaintenance(percentMonth, calMonths < (main.time * -1)),
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
            warningKms: (main.wear ? this.getWarningWear(percentKm) : this.getWarningMaintenance(percentKm,
                op.km == null || calKms < (main.km * -1))),
            percentMonths: percentMonth,
            warningMonths: (main.wear ? this.getWarningWear(percentMonth) : this.getWarningMaintenance(percentMonth,
                op.km == null || calMonths < (main.time * -1)))
        };
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

    calculateKmMotoReplacement(moto: MotoModel, op: OperationModel, main: MaintenanceModel): number {
        return (op.km + main.km) - this.calculateKmMotoEstimated(moto);
    }

    calculateMontMotoReplacement(time: number, date: Date): number {
        return (time !== null ? time - this.commonService.monthDiff(new Date(date), new Date()) : 0);
    }

    calculatePercent(total: number, value: number): number {
        return (total === 0 ? 0 : (value >= 0 ? (total - value) / total : 1));
    }

    calculatePercentNegative(total: number, value: number): number {
        return (total === 0 ? 0 : (value >= 0 ? value / total : 1));
    }

    calculateKmMotoEstimated(moto: MotoModel): number {
        return moto.km + (Math.round((moto.kmsPerMonth / 30) * this.commonService.dayDiff(new Date(moto.dateKms), new Date())));
    }

    calculateDateMaintenanceKmMotoEstimated(moto: MotoModel, km: number): Date {
        const diff: number = (km - moto.km) / moto.kmsPerMonth;
        const date: Date = new Date(moto.dateKms);
        date.setMonth(date.getMonth() + diff);
        return date;
    }

    getDateCalculateMonths(wear: WearReplacementProgressBarModel): string {
        let date = '';
        const months: number = wear.calculateMonths * (wear.calculateMonths < 0 ? -1 : 1);
        if (months >= 12) {
          const years: number = Math.round(months / 12);
          date = `${years} ${this.translator.instant(years > 1 ? 'COMMON.YEARS' : 'COMMON.YEAR')}`;
        } else {
          date = `${months} ${this.translator.instant(months > 1 ? 'COMMON.MONTHS' : 'COMMON.MONTH')}`;
        }
        return date;
      }

    getWearReplacement(motoWear: WearMotoProgressBarModel, operations: OperationModel[]): WearMotoProgressBarModel {
        let result: WearMotoProgressBarModel = new WearMotoProgressBarModel();

        // Km Moto estimated
        const moto: MotoModel = new MotoModel(null, null, 0, motoWear.kmMoto,
            null, motoWear.kmsPerMonthMoto, motoWear.dateKmsMoto, motoWear.datePurchaseMoto);
        const kmMoto: number = this.calculateKmMotoEstimated(moto);
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
            let percentMotoKm = 0;
            let percentMotoTime = 0;
            const iterations: number = (kmMoto - wear.kmMaintenance) / wear.kmMaintenance;
            let opLast = new OperationModel();
            for (let i = 0; i < iterations; i++) {
                const calcKm: number = (kmCalculate + wear.kmMaintenance); // km should maintenance
                const estimatedKmOperation: number = wear.kmMaintenance / 2; // km estimated maintenance
                const calcCompKm: number = (calcKm + estimatedKmOperation); // km max should maintenance
                const calcTime: number = (timeCalculate + wear.timeMaintenance); // time should maintenance
                // OPERATIONS: km and time aprox to maintenance
                const ops: OperationModel[] = operationsMoto.filter(x =>
                    !wearReplacement.some(y => y.idOperation === x.id) &&
                    ((x.km >= kmCalculate && x.km < calcCompKm) ||
                    ((opLast.id === null ? 0 : opLast.km) <= x.km && x.km < calcCompKm &&
                    this.commonService.monthDiff(motoWear.datePurchaseMoto, new Date(x.date)) <= calcTime)));
                let op = new OperationModel();
                op.id = null;
                let calcDiffTime = 0;
                let calculateKmEstimate = 0;
                let calculateTimeEstimate = 0;
                let percentKm = 1;
                let percentTime = 1;
                if (!!ops && ops.length > 0) {
                    opLast = this.getOperationsNearKmTime(moto, ops, calcKm, calcTime);
                    op = opLast;
                    calcDiffTime = this.commonService.monthDiff(motoWear.datePurchaseMoto, new Date(op.date));
                    calculateKmEstimate = calcKm - op.km;
                    calculateTimeEstimate = calcTime - calcDiffTime;
                    percentKm = (calculateKmEstimate >= 0 ?
                        this.calculatePercent(wear.kmMaintenance, calculateKmEstimate) :
                        this.calculatePercentNegative(wear.kmMaintenance, calculateKmEstimate * -1));
                    percentTime = (calculateTimeEstimate >= 0 ?
                        this.calculatePercent(calcTime, calculateTimeEstimate) :
                        this.calculatePercentNegative(calcTime, calculateTimeEstimate * -1));
                } else {
                    calculateKmEstimate = -estimatedKmOperation;
                    calculateTimeEstimate = calcTime - diffDateToday;
                }
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
                    warningKms: (wear.wearMaintenance ?
                        this.getWarningWearRecordsMaintenance(percentKm * (calculateKmEstimate >= 0 ? 1 : -1), op.km === null) :
                        this.getWarningRecordsMaintenance(percentKm * (calculateKmEstimate >= 0 ? 1 : -1), op.km === null)),
                    percentMonths: percentTime,
                    warningMonths: (wear.wearMaintenance ?
                        this.getWarningWearRecordsMaintenance(percentTime * (calculateTimeEstimate >= 0 ? 1 : -1), op.km === null) :
                        this.getWarningRecordsMaintenance(percentTime * (calculateTimeEstimate >= 0 ? 1 : -1), op.km === null)),
                }];

                if (!!op && op.id !== null) {
                    const sumKm: number = (calculateKmEstimate >= 0 ? 1 : 1 - (percentKm > 1 ? 1 : percentKm));
                    const sumTime: number = (calculateTimeEstimate >= 0 ? 1 : 1 - (percentTime > 1 ? 1 : percentTime));
                    percentMotoKm += sumKm;
                    percentMotoTime += sumTime;
                    if (percentKm > percentTime) {
                        percentMoto += sumKm;
                    } else {
                        percentMoto += sumTime;
                    }
                }
                kmCalculate += wear.kmMaintenance;
                timeCalculate += wear.timeMaintenance;
            }
            const diffOpMaint: number = (wearReplacement.length > operationsMoto.length ?
                0 : wearReplacement.length - operationsMoto.length);
            const percentTotal: number = ((percentMoto + diffOpMaint +
                (1 - (wear.percentKms > wear.percentMonths ? wear.percentKms : wear.percentMonths))) /
                (wearReplacement.length + diffOpMaint + 1));
            result = {
                idMoto: motoWear.idMoto,
                nameMoto: motoWear.nameMoto,
                kmMoto: motoWear.kmMoto,
                datePurchaseMoto: motoWear.datePurchaseMoto,
                kmsPerMonthMoto: motoWear.kmsPerMonthMoto,
                dateKmsMoto: motoWear.dateKmsMoto,
                percent: Math.round(percentTotal * 100),
                percentKm: Math.floor(percentMotoKm * 100 / wearReplacement.length),
                percentTime: Math.floor(percentMotoTime * 100 / wearReplacement.length),
                warning: this.getPercentMoto(wearReplacement),
                listWearReplacement: this.commonService.orderBy(wearReplacement, 'kmMaintenance')
            };
        }
        return result;
    }

    getOperationsNearKmTime(moto: MotoModel, operations: OperationModel[], km: number, time: number) {
        let operation: OperationModel = null;
        let percent = 1;
        operations.forEach(x => {
            const near: number = (km - x.km) * (km < x.km ? -1 : 1);
            const perc: number = near / km;
            if (percent > perc) {
                percent = perc;
                operation = x;
            } else if (time !== 0) {
                const datePurchase: Date = new Date(moto.datePurchase);
                datePurchase.setMonth(datePurchase.getMonth() + time);
                if (new Date(x.date) < datePurchase) {
                    const timeMaint: number = this.commonService.monthDiff(new Date(moto.datePurchase), new Date(x.date));
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
        } else if (percent === 1 || percent === -1) {
            return WarningWearEnum.DANGER;
        } else if (percent < 0) {
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

    // SEARCHER DASHBOARD

    getObserverSearchODashboard(): Observable<SearchDashboardModel> {
        return this.behaviourSearchDashboard.asObservable();
    }

    getSearchDashboard(): SearchDashboardModel {
        return this.searchDashboard;
    }

    setSearchOperation(sm: MotoModel = new MotoModel(), sot: OperationTypeModel[] = [],
                       sme: MaintenanceElementModel[] = []) {
        this.setSearchDashboard(new SearchDashboardModel(FilterMonthsEnum.MONTH, sm, sot, sme));
    }

    setSearchDashboard(filter: SearchDashboardModel) {
        this.searchDashboard = filter;
        this.behaviourSearchDashboard.next(this.searchDashboard);
    }
}
