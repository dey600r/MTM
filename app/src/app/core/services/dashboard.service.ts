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
import { ConstantsColumns, WarningWearEnum } from '../utils';

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
        return new DashboardModel(view, this.mapOperationToDashboardMotoExpenses(data), null,
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.MOTORBIKE'),
            filter.showAxisLabel, this.translator.instant('COMMON.MOTORBIKE'),
            filter.showAxisLabel, this.translator.instant('COMMON.PRICE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardMotoExpenses(data: OperationModel[]): any[] {
        let result: any[] = [];
        data.forEach(x => {
            if (!result.some((z: any) => z.id === x.moto.id)) {
                const sumPrice: number = this.commonService.sum(
                    data.filter(z => z.moto.id === x.moto.id),
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
        return new DashboardModel(view, this.mapOperationToDashboardMotoPerTimeExpenses(data), null,
        filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.MOTORBIKE'),
        filter.showAxisLabel, this.translator.instant('COMMON.MOTORBIKE'),
        filter.showAxisLabel, this.translator.instant('COMMON.PRICE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardMotoPerTimeExpenses(data: OperationModel[]): any[] {
        let result: any[] = [];
        if (!!data && data.length > 0) {
            const minYear: number = new Date(this.commonService.min(data, ConstantsColumns.COLUMN_MTM_OPERATION_DATE)).getFullYear();
            const maxYear: number = new Date(this.commonService.max(data, ConstantsColumns.COLUMN_MTM_OPERATION_DATE)).getFullYear();
            for (let i = minYear; i <= maxYear; i++) {
                for (let j = 0; j < 12; j++) {
                    const ops: OperationModel[] = data.filter(x =>
                        new Date(x.date).getMonth() === j && new Date(x.date).getFullYear() === i);
                    if (!!ops && ops.length > 0) {
                        const sumPrice: number = this.commonService.sum(ops, ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
                        result = [...result, {
                            name: `${(j < 10 ? '0' : '')}${(j + 1)}/${i}`,
                            value: sumPrice
                        }];
                    }
                }
            }
        }
        return result;
    }

    // MOTO OP TYPE EXPENSES
    getDashboardModelMotoOpTypeExpenses(view: any[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardMotoOpTypeExpenses(data), null,
        filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.MOTORBIKE'),
        filter.showAxisLabel, this.translator.instant('COMMON.MOTORBIKE'),
        filter.showAxisLabel, this.translator.instant('COMMON.PRICE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardMotoOpTypeExpenses(data: OperationModel[]): any[] {
        let result: any[] = [];
        data.forEach(x => {
            let dash: any = result.find(y => y.name === x.moto.model);
            const sumPrice: number = this.commonService.sum(
                data.filter(z => z.moto.id === x.moto.id && z.operationType.id === x.operationType.id),
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
        return new DashboardModel(view, this.mapOperationToDashboardOpTypeExpenses(data), null,
        filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.OP_TYPE'),
        filter.showAxisLabel, this.translator.instant('COMMON.OPERATION_TYPE'),
        filter.showAxisLabel, this.translator.instant('COMMON.PRICE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardOpTypeExpenses(data: OperationModel[]): any[] {
        let result: any[] = [];
        data.forEach(x => {
            if (!result.some((z: any) => z.id === x.operationType.id)) {
                const sumPrice: number = this.commonService.sum(
                    data.filter(z => z.operationType.id === x.operationType.id),
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
            const percentKm: number = (calKms >= 0 ? (main.km - calKms) / main.km : 1);
            result = {
                idMaintenanceElement: main.maintenanceElement.id,
                nameMaintenanceElement: main.maintenanceElement.name,
                codeMaintenanceFreq: main.maintenanceFreq.code,
                idOperation: 0,
                kmOperation: 0,
                dateOperation: null,
                idMaintenance: main.id,
                descriptionMaintenance: main.description,
                kmMaintenance: main.km,
                timeMaintenace: 0,
                calculateKms: calKms,
                calculateMonths: 0,
                percentKms: percentKm,
                warningKms: this.getWarningMaintenance(percentKm),
                percentMonths: 0,
                warningMonths: WarningWearEnum.WARNING,
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
            const percentKm: number = (calKms >= 0 ? (main.km - calKms) / main.km : 1);
            result = {
                idMaintenanceElement: main.maintenanceElement.id,
                nameMaintenanceElement: main.maintenanceElement.name,
                codeMaintenanceFreq: main.maintenanceFreq.code,
                idOperation: 0,
                kmOperation: 0,
                dateOperation: null,
                idMaintenance: main.id,
                descriptionMaintenance: main.description,
                kmMaintenance: main.km,
                timeMaintenace: 0,
                calculateKms: calKms,
                calculateMonths: 0,
                percentKms: percentKm,
                warningKms: this.getWarningWear(percentKm),
                percentMonths: 0,
                warningMonths: WarningWearEnum.WARNING,
            };
        }
        return result;
    }

    getWarningWear(percent: number): WarningWearEnum {
        if (percent >= 0.9) {
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
            calMonths = this.calculateMontMotoReplacement(op, main);
        }
        const percentKm: number = (calKms >= 0 ? (main.km - calKms) / main.km : 1);
        const percentMonth: number = (calMonths >= 0 ? (main.time - calMonths) / main.time : 1);
        return {
            idMaintenanceElement: main.maintenanceElement.id,
            nameMaintenanceElement: main.maintenanceElement.name,
            codeMaintenanceFreq: main.maintenanceFreq.code,
            idOperation: op.id,
            kmOperation: op.km,
            dateOperation: op.date,
            idMaintenance: main.id,
            descriptionMaintenance: main.description,
            kmMaintenance: main.km,
            timeMaintenace: main.time,
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

    calculateMontMotoReplacement(op: OperationModel, main: MaintenanceModel): number {
        return (main.time !== null ? main.time - this.commonService.monthDiff(new Date(op.date), new Date()) : 0);
    }

    calculateKmMotoEstimated(moto: MotoModel): number {
        return moto.km + (moto.kmsPerMonth * this.commonService.monthDiff(new Date(moto.dateKms), new Date()));
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
