import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import {
    DashboardModel, OperationModel, SearchDashboardModel, VehicleModel, WearVehicleProgressBarViewModel,
    WearMaintenanceProgressBarViewModel, OperationTypeModel, MaintenanceElementModel, WearReplacementProgressBarViewModel,
    InfoVehicleConfigurationModel
} from '@models/index';

// SERVICES
import { CommonService, CalendarService } from '../common/index';

// UTILS
import { ConstantsColumns, FilterMonthsEnum, Constants, FilterKmTimeEnum, WarningWearEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private searchDashboard: SearchDashboardModel = new SearchDashboardModel();
    public behaviourSearchOperation: BehaviorSubject<SearchDashboardModel>
        = new BehaviorSubject<SearchDashboardModel>(this.searchDashboard);
    public behaviourSearchDashboard: BehaviorSubject<SearchDashboardModel>
        = new BehaviorSubject<SearchDashboardModel>(this.searchDashboard);
    public behaviourSearchDashboardRecords: BehaviorSubject<SearchDashboardModel>
        = new BehaviorSubject<SearchDashboardModel>(this.searchDashboard);

    constructor(private commonService: CommonService,
                private calendarService: CalendarService,
                private translator: TranslateService,
                private platform: Platform) {
    }

    getSizeWidthHeight(w: number, h: number): any[] {
        const width: number = (w > 768 && h > 600 ? 600 : w);
        const height: number = (w > 768 && h > 600 ? 600 : h);
        return [width - 15, height / 3 + 35];
    }

    /** DASHBOADS */

    // VEHICLE OP TYPE EXPENSES
    getDashboardModelVehicleExpenses(view: any[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardVehicleExpenses(data, filter), null,
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.VEHICLES'),
            filter.showAxisLabel, this.translator.instant('COMMON.VEHICLES'),
            filter.showAxisLabel, this.translator.instant('COMMON.EXPENSE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardVehicleExpenses(data: OperationModel[], filter: SearchDashboardModel): any[] {
        let result: any[] = [];
        const operationPreFilter: OperationModel[] = this.getPrefilterOperation(data, filter);
        operationPreFilter.forEach(x => {
            if (!result.some((z: any) => z.id === x.vehicle.id)) {
                const operationSum: OperationModel[] = operationPreFilter.filter(z => z.vehicle.id === x.vehicle.id &&
                    this.getFilterOperationType(z, filter));
                let sumPrice = 0;
                operationSum.forEach(os => {
                    sumPrice += os.price;
                    if (!!os.listMaintenanceElement && os.listMaintenanceElement.length > 0) {
                        const sumPriceRepl: MaintenanceElementModel[] = this.getFilterReplacement(os.listMaintenanceElement, filter);
                        if (!!sumPriceRepl && sumPriceRepl.length > 0) {
                            sumPrice += this.commonService.sum(sumPriceRepl, ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE);
                        }
                    }
                });
                const resultPrice: number = (filter.expensePerKm ? Math.round((sumPrice / x.vehicle.km) * 100) / 100 : sumPrice);
                result = [...result, this.getDataDashboard(`${x.vehicle.brand}-${x.vehicle.model}`, resultPrice, x.vehicle.id)];
            }
        });
        return result;
    }

    // VEHICLE PER MONTH EXPENSES
    getDashboardModelVehiclePerTime(view: any[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardVehiclePerTimeExpenses(data, filter), null,
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.DATE'),
            filter.showAxisLabel, this.translator.instant('COMMON.DATE'),
            filter.showAxisLabel, this.translator.instant('COMMON.EXPENSE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardVehiclePerTimeExpenses(data: OperationModel[], filter: SearchDashboardModel): any[] {
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
                            this.getFilterOperationType(x, filter));
                        if (!!ops && ops.length > 0) {
                            let sumPrice = 0;
                            ops.forEach(os => {
                                sumPrice += os.price;
                                if (!!os.listMaintenanceElement && os.listMaintenanceElement.length > 0) {
                                    const sumPriceRepl: MaintenanceElementModel[] =
                                        this.getFilterReplacement(os.listMaintenanceElement, filter);
                                    if (!!sumPriceRepl && sumPriceRepl.length > 0) {
                                        sumPrice += this.commonService.sum(sumPriceRepl,
                                            ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE);
                                    }
                                }
                            });
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
                const listOperationsSum: OperationModel[] = operationPreFilter.filter(z => z.operationType.id === x.operationType.id &&
                    this.getFilterOperationType(z, filter));
                let sumPrice = 0;
                listOperationsSum.forEach(os => {
                    sumPrice += os.price;
                    if (!!os.listMaintenanceElement && os.listMaintenanceElement.length > 0) {
                        const sumPriceRepl: MaintenanceElementModel[] = this.getFilterReplacement(os.listMaintenanceElement, filter);
                        if (!!sumPriceRepl && sumPriceRepl.length > 0) {
                            sumPrice += this.commonService.sum(sumPriceRepl, ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE);
                        }
                    }
                });
                let resultPrice: number = sumPrice;
                if (filter.expensePerKm) {
                    let vehiclesSum: VehicleModel[] = [];
                    listOperationsSum.forEach(op => {
                        if (!vehiclesSum.some((v: VehicleModel) => v.id === op.vehicle.id)) {
                            vehiclesSum = [...vehiclesSum, op.vehicle];
                        }
                    });
                    const sumKm: number = this.commonService.sum(vehiclesSum, ConstantsColumns.COLUMN_MTM_VEHICLE_KM);
                    resultPrice = Math.round((sumPrice / sumKm) * 100) / 100;
                }
                result = [...result, this.getDataDashboard(x.operationType.description, resultPrice, x.operationType.id)];
            }
        });
        return result;
    }

    // REPLACEMENTS EXPENSES
    getDashboardModelReplacementExpenses(view: any[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardReplacementExpenses(data, filter), null,
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.OPERATION_TYPE'),
            filter.showAxisLabel, this.translator.instant('COMMON.OPERATION_TYPE'),
            filter.showAxisLabel, this.translator.instant('COMMON.EXPENSE'), true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapOperationToDashboardReplacementExpenses(data: OperationModel[], filter: SearchDashboardModel): any[] {
        let result: any[] = [];
        const operationPreFilter: OperationModel[] = this.getPrefilterOperation(data, filter);
        operationPreFilter.forEach(op => {
            if (!!op.listMaintenanceElement && op.listMaintenanceElement.length > 0) {
                this.getFilterReplacement(op.listMaintenanceElement, filter).forEach(m => {
                    const replacementFind: any = result.find((z: any) => z.id === m.id);
                    if (!!replacementFind) {
                        replacementFind.value += m.price;
                    } else {
                        result = [...result, this.getDataDashboard(m.name, m.price, m.id)];
                    }
                });
            }
        });
        if (filter.expensePerKm) {
            let vehiclesSum: VehicleModel[] = [];
            operationPreFilter.forEach(op => {
                if (!vehiclesSum.some((v: VehicleModel) => v.id === op.vehicle.id)) {
                    vehiclesSum = [...vehiclesSum, op.vehicle];
                }
            });
            const sumKm: number = this.commonService.sum(vehiclesSum, ConstantsColumns.COLUMN_MTM_VEHICLE_KM);
            result.forEach(expenses => {
                expenses.value = Math.round((expenses.value / sumKm) * 100) / 100;
            });
        }
        return result;
    }

    getPrefilterOperation(data: OperationModel[], filter: SearchDashboardModel): OperationModel[] {
        let operationPreFilter: OperationModel[] = [];
        if (filter.showMyData) {
            operationPreFilter = data.filter(x => x.owner === null || x.owner === '' || x.owner.toLowerCase() === Constants.OWNER_ME ||
                x.owner.toLowerCase() === Constants.OWNER_YO);
        } else {
            operationPreFilter = data.filter(x => x.owner !== null && x.owner !== '' && x.owner.toLowerCase() !== Constants.OWNER_ME &&
                x.owner.toLowerCase() !== Constants.OWNER_YO);
        }
        operationPreFilter = operationPreFilter.filter(z => data.some(x => z.operationType.id === x.operationType.id &&
            this.getFilterOperationType(z, filter) && this.getFilterOpReplacement(z, filter)));
        return operationPreFilter;
    }

    getFilterOperationType(op: OperationModel, filter: SearchDashboardModel): boolean {
        return (filter.searchOperationType.length === 0 ||
            filter.searchOperationType.some(f => f.id === op.operationType.id));
    }

    getFilterOpReplacement(op: OperationModel, filter: SearchDashboardModel): boolean {
        return (filter.searchMaintenanceElement.length === 0 ||
            filter.searchMaintenanceElement.some(f => op.listMaintenanceElement.some(y => y.id === f.id)));
    }

    getFilterReplacement(rep: MaintenanceElementModel[], filter: SearchDashboardModel): MaintenanceElementModel[] {
        return rep.filter(x => (filter.searchMaintenanceElement.length === 0 ||
            filter.searchMaintenanceElement.some(f => x.id === f.id)));
    }

    // RECORDS MAINTENANCES
    getDashboardRecordMaintenances(view: any[], data: WearVehicleProgressBarViewModel, filter: SearchDashboardModel,
                                   measure: any): DashboardModel {
        let dataDashboard: any[] = [];
        let translateY = measure.valueLarge;
        if (filter.filterKmTime === FilterKmTimeEnum.KM) {
            dataDashboard = this.mapWearToDashboardKmRecordMaintenances(data, measure);
        } else {
            dataDashboard = this.mapWearToDashboardTimeRecordMaintenances(data, measure);
            translateY = this.translator.instant('COMMON.MONTHS');
        }
        return new DashboardModel(view, dataDashboard, ['#D91CF6', '#1CEAF6', '#5FF61C'],
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.OPERATIONS'),
            filter.showAxisLabel, this.translator.instant('PAGE_CONFIGURATION.MAINTENANCES'),
            filter.showAxisLabel, translateY, true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapWearToDashboardKmRecordMaintenances(data: WearVehicleProgressBarViewModel, measure: any): any[] {
        let result: any[] = [];
        if (!!data && data.listWearMaintenance.length > 0) {
            const firstMain: WearMaintenanceProgressBarViewModel = data.listWearMaintenance[0];
            const lastMain: WearMaintenanceProgressBarViewModel = data.listWearMaintenance[data.listWearMaintenance.length - 1];
            let initKm: number = firstMain.fromKmMaintenance;
            const estimated: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.ESTIMATED'), []);
            const real: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.REAL'), []);
            if (initKm === 0) {
                estimated.series = [...estimated.series, this.getDataDashboard(`0${measure.value}`, 0 )];
                real.series = [...estimated.series, this.getDataDashboard(`0${measure.value}`, 0 )];
                initKm = 0;
            }
            data.listWearMaintenance.forEach((main, index) => {
                const rep: WearReplacementProgressBarViewModel = main.listWearReplacement[0];
                estimated.series = [...estimated.series, this.getDataDashboard(`${rep.kmAcumulateMaintenance}${measure.value}`,
                    (initKm !== 0 && main.kmMaintenance > initKm && index === 0 ? initKm : main.kmMaintenance))];
                let realSerie: number = 0;
                if (rep.kmOperation === null) {
                    realSerie = (rep.kmAcumulateMaintenance < data.kmEstimatedVehicle ? 0 : data.kmEstimatedVehicle % main.kmMaintenance);
                } else {
                    realSerie = ((initKm !== 0 && main.kmMaintenance > initKm && index === 0 ? initKm : main.kmMaintenance) - rep.calculateKms);
                }
                real.series = [...real.series,
                    this.getDataDashboard(`${rep.kmAcumulateMaintenance}${measure.value}`, (realSerie < 0 ? 0 : realSerie))];

            });
            if (firstMain.toKmMaintenance === null || lastMain.listWearReplacement[0].kmAcumulateMaintenance < data.kmEstimatedVehicle) {
                const kmMaintenance: number = lastMain.kmMaintenance;
                const kmAcumMaintenance: number = lastMain.listWearReplacement[0].kmAcumulateMaintenance;
                const lastMaintenance: number = kmAcumMaintenance + kmMaintenance;
                estimated.series = [...estimated.series, this.getDataDashboard(`${lastMaintenance}${measure.value}`, kmMaintenance)];
                real.series = [...real.series, this.getDataDashboard(`${lastMaintenance}${measure.value}`,
                    (kmAcumMaintenance > data.kmEstimatedVehicle ? 0 : data.kmEstimatedVehicle % kmMaintenance))];
            }
            result = [estimated, real];
        }
        return result;
    }

    mapWearToDashboardTimeRecordMaintenances(data: WearVehicleProgressBarViewModel, measure: any): any[] {
        let result: any[] = [];
        if (!!data && data.listWearMaintenance.length > 0) {
            const firstMain: WearMaintenanceProgressBarViewModel = data.listWearMaintenance[0];
            const lastMain: WearMaintenanceProgressBarViewModel = data.listWearMaintenance[data.listWearMaintenance.length - 1];
            const initKm: number = firstMain.fromKmMaintenance;
            const estimated: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.ESTIMATED'), []);
            const real: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.REAL'), []);
            if (initKm === 0) {
                estimated.series = [...estimated.series, this.getDataDashboard(`0${measure.value}`, 0 )];
                real.series = [...estimated.series, this.getDataDashboard(`0${measure.value}`, 0 )];
            }
            data.listWearMaintenance.forEach(main => {
                const rep: WearReplacementProgressBarViewModel = main.listWearReplacement[0];
                estimated.series = [...estimated.series,
                    this.getDataDashboard(`${rep.kmAcumulateMaintenance}${measure.value}`, rep.timeAcumulateMaintenance)];
                let realSerie: number = 0;
                if (rep.kmOperation === null) {
                    realSerie = (main.kmMaintenance < data.kmEstimatedVehicle ? 0 : this.calendarService.monthDiff(data.datePurchaseVehicle, new Date()));
                } else {
                    realSerie = (rep.timeAcumulateMaintenance - rep.calculateMonths);
                }
                real.series = [...real.series,
                this.getDataDashboard(`${rep.kmAcumulateMaintenance}${measure.value}`, (realSerie < 0 ? 0 : realSerie))];
            });
            if (data.listWearMaintenance.length === 0 || lastMain.listWearReplacement[0].kmAcumulateMaintenance < data.kmEstimatedVehicle) {
                const kmMaintenance: number = lastMain.kmMaintenance;
                const timeMaintenance: number = lastMain.timeMaintenance;
                const lastMaintenance: number = lastMain.listWearReplacement[0].kmAcumulateMaintenance + kmMaintenance;
                estimated.series = [...estimated.series, this.getDataDashboard(`${lastMaintenance}${measure.value}`,
                    timeMaintenance + lastMain.listWearReplacement[0].timeAcumulateMaintenance)];
                real.series = [...real.series,
                    this.getDataDashboard(`${lastMaintenance}${measure.value}`,
                    this.calendarService.monthDiff(data.datePurchaseVehicle, new Date()))];
            }
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

    // CHART INFO VEHICLE
    getDashboardInfoVehicle(view: any[], data: InfoVehicleConfigurationModel): DashboardModel {
        let result: any[] = [];
        let colors: string[] = [];
        const dataFiltered = data.listMaintenance.filter(x => x.active);
        const windows: boolean = this.platform.is('desktop');
        const numSuccess = dataFiltered.filter(x => x.warning === WarningWearEnum.SUCCESS).length;
        if (numSuccess > 0) {
            result = [...result, this.getDataDashboard(this.translator.instant('COMMON.SUCCESS'), numSuccess)];
            colors = [...colors, (windows ? '#387F57' : 'rgba(var(--ion-color-progressbar-success-progress), 0.7)')];
        }
        const numWarning = dataFiltered.filter(x => x.warning === WarningWearEnum.WARNING).length;
        if (numWarning > 0) {
            result = [...result, this.getDataDashboard(this.translator.instant('COMMON.WARNING'), numWarning)];
            colors = [...colors, (windows ? '#B69B57' : 'rgba(var(--ion-color-progressbar-warning-progress), 0.7)')];
        }
        const numDanger = dataFiltered.filter(x => x.warning === WarningWearEnum.DANGER).length;
        if (numDanger > 0) {
            result = [...result, this.getDataDashboard(this.translator.instant('COMMON.DANGER'), numDanger)];
            colors = [...colors, (windows ? '#882B1C' : 'rgba(var(--ion-color-progressbar-danger-progress), 0.5)')];
        }
        const numUnusable = dataFiltered.filter(x => x.warning === WarningWearEnum.SKULL).length;
        if (numUnusable > 0) {
            result = [...result, this.getDataDashboard(this.translator.instant('COMMON.UNUSABLE'), numUnusable)];
            colors = [...colors, (windows ? '#7F4339' : 'rgba(var(--ion-color-progressbar-danger-progress), 1)')];
        }
        const numInactive = data.listMaintenance.filter(x => !x.active).length;
        if (numInactive > 0) {
            result = [...result, this.getDataDashboard(this.translator.instant('COMMON.INACTIVE'), numInactive)];
            colors = [...colors, '#7D7D7D'];
        }
        return new DashboardModel(view, result, colors);
    }

    // SEARCHER DASHBOARD

    getObserverSearchDashboard(): Observable<SearchDashboardModel> {
        return this.behaviourSearchDashboard.asObservable();
    }

    getObserverSearchDashboardRecords(): Observable<SearchDashboardModel> {
        return this.behaviourSearchDashboardRecords.asObservable();
    }

    getObserverSearchOperation(): Observable<SearchDashboardModel> {
        return this.behaviourSearchOperation.asObservable();
    }

    getSearchDashboard(): SearchDashboardModel {
        return this.searchDashboard;
    }

    setSearchOperation(sot: OperationTypeModel[] = [],
                       sme: MaintenanceElementModel[] = [], st: string = '') {
        this.searchDashboard.searchOperationType = sot;
        this.searchDashboard.searchMaintenanceElement = sme;
        this.searchDashboard.searchText = st;
        this.behaviourSearchOperation.next(this.searchDashboard);
    }

    setSearchDashboard(filter: SearchDashboardModel) {
        this.searchDashboard = filter;
        this.behaviourSearchDashboard.next(this.searchDashboard);
    }

    setSearchDashboardRecords(filterKmTime: FilterKmTimeEnum, strict: boolean) {
        this.searchDashboard.filterKmTime = filterKmTime;
        this.searchDashboard.showStrict = strict;
        this.behaviourSearchDashboardRecords.next(this.searchDashboard);
    }
}
