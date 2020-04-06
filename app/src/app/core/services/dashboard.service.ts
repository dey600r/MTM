import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
    DashboardModel, OperationModel, SearchDashboardModel, FilterGroupMotoOpTypeReplacement,
    ConfigurationModel, MotoModel, MaintenanceModel, WearMotoProgressBarModel, WearReplacementProgressBarModel
} from '@models/index';
import { CommonService } from './common.service';
import { ConstantsColumns } from '../utils';

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

    // MOTO OP TYPE EXPENSES
    getDashboardModelMotoExpenses(view: any[], data: OperationModel[]): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardMotoExpenses(data));
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
    getDashboardModelMotoPerTime(view: any[], data: OperationModel[]): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardMotoPerTimeExpenses(data));
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
    getDashboardModelMotoOpTypeExpenses(view: any[], data: OperationModel[]): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardMotoOpTypeExpenses(data));
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
    getDashboardModelOpTypeExpenses(view: any[], data: OperationModel[]): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardOpTypeExpenses(data), null, true, true, true, false,
        this.translator.instant('COMMON.OP_TYPE'), false, '', false, '', true, false, 'right');
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

    // MOTO REPLACEMENTS WEAR
    getWearReplacementToMoto(operations: OperationModel[], motos: MotoModel[],
                             configurations: ConfigurationModel[],
                             maintenances: MaintenanceModel[]): WearMotoProgressBarModel[] {
        let result: WearMotoProgressBarModel[] = [];

        if (!!operations && operations.length > 0) {
            motos.forEach(moto => { // Replacement per moto
                const config: ConfigurationModel = configurations.find(x => x.id === moto.configuration.id);
                if (config.listMaintenance.length > 0) {
                    let wearReplacement: WearReplacementProgressBarModel[] = [];
                    const maintenancesMoto: MaintenanceModel[] =
                        maintenances.filter(x => config.listMaintenance.some(y => y.id === x.id));
                    maintenancesMoto.forEach(main => { // Maintenaces of moto
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
                        wearReplacement = [... wearReplacement, {
                            idMaintenanceElement: main.maintenanceElement.id,
                            nameMaintenanceElement: main.maintenanceElement.name,
                            codeMaintenanceFreq: main.maintenanceFreq.code,
                            idOperation: op.id,
                            kmOperation: op.km,
                            dateOperation: op.date,
                            idMaintenance: main.id,
                            kmMaintenance: main.km,
                            timeMaintenace: main.time,
                            calculateKms: calKms,
                            calculateMonths: calMonths,
                            percentKms: (calKms >= 0 ? (main.km - calKms) / main.km : 1),
                            percentMonths: (calMonths >= 0 ? (main.time - calMonths) / main.time : 1)
                        }];
                    });
                    result = [...result, {
                        idMoto: moto.id,
                        nameMoto: `${moto.brand} ${moto.model}`,
                        listWearReplacement: this.commonService.orderBy(wearReplacement, 'calculateKms')
                    }];
                }
            });
        }

        return this.commonService.orderBy(result, 'nameMoto');
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

    setSearchDashboard(f: FilterGroupMotoOpTypeReplacement = FilterGroupMotoOpTypeReplacement.MOTO) {
        this.searchDashboard = new SearchDashboardModel(f);
        this.behaviourSearchDashboard.next(this.searchDashboard);
    }
}
