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
import { 
    ConstantsColumns, FilterMonthsEnum, Constants, FilterKmTimeEnum, WarningWearEnum, PageEnum,
    IDisplaySearcherControlModel, IObserverSearcherControlModel, ISearcherControlModel, IDashboardModel, IDashboardSerieModel, ISettingModel
} from '@utils/index';

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
    public behaviourSearchConfiguration: BehaviorSubject<SearchDashboardModel>
        = new BehaviorSubject<SearchDashboardModel>(this.searchDashboard);

    constructor(private commonService: CommonService,
                private calendarService: CalendarService,
                private translator: TranslateService,
                private platform: Platform) {
    }

    getSizeWidthHeight(w: number, h: number): number[] {
        const width: number = (w > 768 && h > 600 ? 600 : w);
        const height: number = (w > 768 && h > 600 ? 600 : h);
        return [width - 15, height / 3 + 35];
    }

    /** DASHBOADS */

    // VEHICLE OP TYPE EXPENSES
    getDashboardModelVehicleExpenses(view: number[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel<IDashboardModel> {
        return new DashboardModel<IDashboardModel>({
            view: view,
            data: this.mapOperationToDashboardVehicleExpenses(data, filter), 
            showXAxis: filter.showAxis, 
            showYAxis: filter.showAxis,
            showLegend: filter.showLegend,
            legendTitle: this.translator.instant('COMMON.VEHICLES'),
            showXAxisLabel: filter.showAxisLabel,
            xAxisLabel: this.translator.instant('COMMON.VEHICLES'),
            showYAxisLabel: filter.showAxisLabel,
            yAxisLabel: this.translator.instant('COMMON.EXPENSE'),
            isDoughnut: filter.doghnut,
            legendPosition: 'below',
            showDataLabel: filter.showDataLabel
        });
    }

    mapOperationToDashboardVehicleExpenses(data: OperationModel[], filter: SearchDashboardModel): IDashboardModel[] {
        let result: IDashboardModel[] = [];
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
    getDashboardModelVehiclePerTime(view: number[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel<IDashboardModel> {
        return new DashboardModel<IDashboardModel>({
            view: view,
            data: this.mapOperationToDashboardVehiclePerTimeExpenses(data, filter), 
            showXAxis: filter.showAxis, 
            showYAxis: filter.showAxis,
            showLegend: filter.showLegend,
            legendTitle: this.translator.instant('COMMON.DATE'),
            showXAxisLabel: filter.showAxisLabel,
            xAxisLabel: this.translator.instant('COMMON.DATE'),
            showYAxisLabel: filter.showAxisLabel,
            yAxisLabel: this.translator.instant('COMMON.EXPENSE'),
            isDoughnut: filter.doghnut,
            legendPosition: 'below',
            showDataLabel: filter.showDataLabel
        });
    }

    mapOperationToDashboardVehiclePerTimeExpenses(data: OperationModel[], filter: SearchDashboardModel): IDashboardModel[] {
        let result: IDashboardModel[] = [];
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
    getDashboardModelOpTypeExpenses(view: number[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel<IDashboardModel> {
        return new DashboardModel<IDashboardModel>({
            view: view,
            data: this.mapOperationToDashboardOpTypeExpenses(data, filter), 
            showXAxis: filter.showAxis, 
            showYAxis: filter.showAxis,
            showLegend: filter.showLegend,
            legendTitle: this.translator.instant('COMMON.OPERATION_TYPE'),
            showXAxisLabel: filter.showAxisLabel,
            xAxisLabel: this.translator.instant('COMMON.OPERATION_TYPE'),
            showYAxisLabel: filter.showAxisLabel,
            yAxisLabel: this.translator.instant('COMMON.EXPENSE'),
            isDoughnut: filter.doghnut,
            legendPosition: 'below',
            showDataLabel: filter.showDataLabel
        });
    }

    mapOperationToDashboardOpTypeExpenses(data: OperationModel[], filter: SearchDashboardModel): IDashboardModel[] {
        let result: IDashboardModel[] = [];
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
    getDashboardModelReplacementExpenses(view: number[], data: OperationModel[], filter: SearchDashboardModel): DashboardModel<IDashboardModel> {
        return new DashboardModel<IDashboardModel>({
            view: view,
            data: this.mapOperationToDashboardReplacementExpenses(data, filter), 
            showXAxis: filter.showAxis, 
            showYAxis: filter.showAxis,
            showLegend: filter.showLegend,
            legendTitle: this.translator.instant('COMMON.OPERATION_TYPE'),
            showXAxisLabel: filter.showAxisLabel,
            xAxisLabel: this.translator.instant('COMMON.OPERATION_TYPE'),
            showYAxisLabel: filter.showAxisLabel,
            yAxisLabel: this.translator.instant('COMMON.EXPENSE'),
            isDoughnut: filter.doghnut,
            legendPosition: 'below',
            showDataLabel: filter.showDataLabel
        });
    }

    mapOperationToDashboardReplacementExpenses(data: OperationModel[], filter: SearchDashboardModel): IDashboardModel[] {
        let result: IDashboardModel[] = [];
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
    getDashboardRecordMaintenances(view: number[], data: WearVehicleProgressBarViewModel, filter: SearchDashboardModel,
                                   measure: ISettingModel): DashboardModel<IDashboardSerieModel> {
        let dataDashboard: IDashboardSerieModel[] = [];
        let translateY = measure.valueLarge;
        if (filter.filterKmTime === FilterKmTimeEnum.KM) {
            dataDashboard = this.mapWearToDashboardKmRecordMaintenances(data, measure);
        } else {
            dataDashboard = this.mapWearToDashboardTimeRecordMaintenances(data, measure);
            translateY = this.translator.instant('COMMON.MONTHS');
        }
        return new DashboardModel<IDashboardSerieModel>({
            view: view,
            data: dataDashboard, 
            colorScheme: ['#D91CF6', '#1CEAF6', '#5FF61C'],
            showXAxis: filter.showAxis, 
            showYAxis: filter.showAxis,
            showLegend: filter.showLegend,
            legendTitle: this.translator.instant('COMMON.OPERATIONS'),
            showXAxisLabel: filter.showAxisLabel,
            xAxisLabel: this.translator.instant('PAGE_CONFIGURATION.MAINTENANCES'),
            showYAxisLabel: filter.showAxisLabel,
            yAxisLabel: translateY,
            isDoughnut: filter.doghnut,
            legendPosition: 'below',
            showDataLabel: filter.showDataLabel
        });
    }

    mapWearToDashboardKmRecordMaintenances(data: WearVehicleProgressBarViewModel, measure: ISettingModel): IDashboardSerieModel[] {
        let result: IDashboardSerieModel[] = [];
        if (!!data && data.listWearMaintenance.length > 0) {
            const firstMain: WearMaintenanceProgressBarViewModel = data.listWearMaintenance[0];
            const lastMain: WearMaintenanceProgressBarViewModel = data.listWearMaintenance[data.listWearMaintenance.length - 1];
            let initKm: number = firstMain.fromKmMaintenance;
            const estimated: IDashboardSerieModel = this.getDataSeriesDashboard(this.translator.instant('COMMON.ESTIMATED'), []);
            const real: IDashboardSerieModel = this.getDataSeriesDashboard(this.translator.instant('COMMON.REAL'), []);
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

    mapWearToDashboardTimeRecordMaintenances(data: WearVehicleProgressBarViewModel, measure: ISettingModel): IDashboardSerieModel[] {
        let result: IDashboardSerieModel[] = [];
        if (!!data && data.listWearMaintenance.length > 0) {
            const firstMain: WearMaintenanceProgressBarViewModel = data.listWearMaintenance[0];
            const lastMain: WearMaintenanceProgressBarViewModel = data.listWearMaintenance[data.listWearMaintenance.length - 1];
            const initKm: number = firstMain.fromKmMaintenance;
            const estimated: IDashboardSerieModel = this.getDataSeriesDashboard(this.translator.instant('COMMON.ESTIMATED'), []);
            const real: IDashboardSerieModel = this.getDataSeriesDashboard(this.translator.instant('COMMON.REAL'), []);
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

    getDataDashboard(n: string, v: any, i: number = -1): IDashboardModel {
        return { id: i, name: n, value: v};
    }

    getDataSeriesDashboard(n: string, s: any[], i: number = -1): IDashboardSerieModel {
        return { id: i, name: n, series: s};
    }

    //#region INFO VEHICLE

    // CHART INFO VEHICLE
    getDashboardInformationVehicle(view: number[], vehicle: VehicleModel, operations: OperationModel[]): DashboardModel<IDashboardModel> {
        return new DashboardModel<IDashboardModel>({
            view: view,
            data: this.calculaterKmPerYear(vehicle, operations)
        });
    }

    calculaterKmPerYear(vehicle: VehicleModel, operations: OperationModel[]): IDashboardModel[] {
        let result: IDashboardModel[] = this.calculateKmPerYearWithOperations(vehicle, operations);
        return this.calculateKmPerYearWithOutOperations(result, vehicle);
    }

    calculateKmPerYearWithOperations(vehicle: VehicleModel, operations: OperationModel[]): IDashboardModel[] {
        let result: IDashboardModel[] = [];
        const datePurchase: Date = new Date(vehicle.datePurchase);
        const initYear: number = datePurchase.getFullYear();
        const todayYear: number = new Date().getFullYear();
        const kmPerMonth: number = this.calendarService.calculateKmsPerMonth(vehicle);
        for (let i = initYear; i <= todayYear; i++) {
            let averageKm: number = -1;
            let operationsYear: OperationModel[] = operations.filter(x => x.date && new Date(x.date).getFullYear() === i);
            if (operationsYear.length > 0) {
                averageKm = this.calculateInitalkmSumPerYear(datePurchase, operationsYear[0].date, kmPerMonth, i) + // INIT
                            (operationsYear[operationsYear.length - 1].km - operationsYear[0].km) + // MEDIA
                            this.calculateFinalkmSumPerYear(operationsYear[operationsYear.length - 1].date, kmPerMonth, i); // END
            }
            result = [...result, this.getDataDashboard(i.toString(), averageKm)];
        }
        return result;
    }

    calculateKmPerYearWithOutOperations(result: IDashboardModel[], vehicle: VehicleModel): IDashboardModel[] {
        const countYearsWithoutOperation: number = result.filter(x => x.value === -1).length;
        if (countYearsWithoutOperation > 0) {
            const model = <IDashboardModel>{};
            const kmCounted: number = this.commonService.sum(result.filter(x => x.value !== -1), this.commonService.nameOf(() => model.value));
            let kmRemains: number = (vehicle.kmEstimated - kmCounted);
            const kmPerYear: number = Math.floor(kmRemains / countYearsWithoutOperation);
            result.filter(x => x.value === -1).forEach((x: IDashboardModel) => {
                x.value = this.calculateValueKm(x, result, kmRemains, kmPerYear, countYearsWithoutOperation, vehicle);
                kmRemains -= x.value;
            });

            result = this.calculateRemainKm(result, kmRemains);
        }
        return result;
    }

    calculateValueKm(x: IDashboardModel, result: IDashboardModel[], kmRemains: number, kmPerYear: number, 
                    countYearsWithoutOperation: number, vehicle: VehicleModel): number {
        let value: number = 0;
        const index: number = result.findIndex(data => data.name === x.name);
        if (index < result.length - 1) {
            const averagePrev: number = this.calculateAveragekm(result, index - 5, index);
            const averagePost: number = this.calculateAveragekm(result, index + 1, index + 5);
            const sumAverage: number = Math.floor(averagePost + averagePrev / 2);
            if (sumAverage > 0 && (countYearsWithoutOperation * sumAverage) < kmRemains) {
                value = (sumAverage > kmRemains ? kmRemains : sumAverage);
            } else {
                value = kmPerYear;
            }
        } else {
            const kmPerMonth: number = this.calendarService.calculateKmsPerMonth(vehicle);
            value = Math.floor(this.calendarService.dayDiff(new Date(Number(x.name), 0, 1), new Date()) * (kmPerMonth / 30));
        }
        return value;
    }

    calculateRemainKm(result: IDashboardModel[], kmRemains: number): IDashboardModel[] {
        if (kmRemains > 0) {
            const remainTotal: number = Math.floor(kmRemains / (result.length - 1));
            result.forEach((x: IDashboardModel, index: number) => {
                if (index < result.length - 1){
                    x.value += remainTotal;
                }
            });
        }
        return result;
    }

    calculateAveragekm(result: IDashboardModel[], init: number, end: number): number {
        let sum: number = 0;
        const initial: number = (init < 0 ? 0 : init);
        const final: number = (result.length < end ? result.length : end);
        let items: number = 0;
        for(let i = initial; i < final; i++) {
            if (result[i].value !== -1){
                sum += result[i].value;
                items += 1;
            }
        }
        return Math.floor(sum / (items === 0 ? 1 : items));
    }

    calculateInitalkmSumPerYear(datePurchase: Date, dateOperation: Date, kmPerMonth: number, year: number): number {
        const initialDate: Date = new Date(year, 0, 1);
        const initDate: Date = (datePurchase > initialDate ? datePurchase : initialDate);
        return Math.floor(this.calendarService.dayDiff(initDate, new Date(dateOperation)) * (kmPerMonth / 30));
    }

    calculateFinalkmSumPerYear(dateOperation: Date, kmPerMonth: number, year: number): number {
        const finalDate: Date = new Date(year, 11, 31);
        const finDate: Date = (new Date() < finalDate ? new Date() : finalDate);
        return Math.floor(this.calendarService.dayDiff(new Date(dateOperation), finDate) * (kmPerMonth / 30));
    }

    // CHART CONFIGURATION VEHICLE

    getDashboardConfigurationVehicle(view: number[], data: InfoVehicleConfigurationModel): DashboardModel<IDashboardModel> {
        let result: IDashboardModel[] = [];
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
        return new DashboardModel<IDashboardModel>({
            view: view,
            data: result,
            colorScheme: colors
        });
    }

    //#endregion INFO VEHICLE

    //#region GET OBSERVER SEARCHER

    getObserverSearchDashboard(): Observable<SearchDashboardModel> {
        return this.behaviourSearchDashboard.asObservable();
    }

    getObserverSearchDashboardRecords(): Observable<SearchDashboardModel> {
        return this.behaviourSearchDashboardRecords.asObservable();
    }

    getObserverSearchOperation(): Observable<SearchDashboardModel> {
        return this.behaviourSearchOperation.asObservable();
    }

    getObserverSearchConfiguration(): Observable<SearchDashboardModel> {
        return this.behaviourSearchConfiguration.asObservable();
    }

    getSearchDashboard(): SearchDashboardModel {
        return this.searchDashboard;
    }

    //#endregion

    //#region SET OBSERVER SEARCHER

    setSearchOperation(sot: OperationTypeModel[] = [],
                       sme: MaintenanceElementModel[] = [], st: string = '') {
        this.searchDashboard.searchOperationType = sot;
        this.searchDashboard.searchMaintenanceElement = sme;
        this.searchDashboard.searchText = st;
        this.behaviourSearchOperation.next(this.searchDashboard);
    }

    setSearchConfiguration(vehicles: VehicleModel[] = [], st: string = '') {
        this.searchDashboard.searchVehicle = vehicles;
        this.searchDashboard.searchText = st;
        this.behaviourSearchConfiguration.next(this.searchDashboard);
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

    //#endregion

    //#region IS SEARCHER APPLIED

    getConfigSearcher(): ISearcherControlModel {
        return {
            controls: this.getConfigDisplay(),
            observers: this.getConfigObservers()
        }
    }

    getConfigDisplay(): IDisplaySearcherControlModel {
        return {
            showFilterKmTime: [PageEnum.HOME],
            showSearchText: [PageEnum.OPERATION, PageEnum.CONFIGURATION],
            showFilterOpType: [PageEnum.HOME, PageEnum.OPERATION, PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION],
            showFilterVehicle: [PageEnum.CONFIGURATION],
            showFilterMaintElement: [PageEnum.OPERATION, PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION],
            showFilterMonth: [PageEnum.HOME, PageEnum.MODAL_DASHBOARD_OPERATION],
            showStrict: [PageEnum.HOME],
            showExpensePerKm: [PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION],
            showAxis: [PageEnum.HOME, PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION],
            showLegend: [PageEnum.HOME, PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION],
            showAxisLabel: [PageEnum.HOME, PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION],
            showDataLabel: [PageEnum.HOME, PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION],
            showDoghnut: [PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION],
            showMyData: [PageEnum.HOME, PageEnum.MODAL_DASHBOARD_VEHICLE, PageEnum.MODAL_DASHBOARD_OPERATION]
        };
    }

    getConfigObservers(): IObserverSearcherControlModel {
        const aux: IDisplaySearcherControlModel = this.getConfigDisplay();
        const showFilterKmTime: string = this.commonService.nameOf(() => aux.showFilterKmTime);
        const showSearchText: string = this.commonService.nameOf(() => aux.showSearchText);
        const showFilterOpType: string = this.commonService.nameOf(() => aux.showFilterOpType);
        const showFilterVehicle: string = this.commonService.nameOf(() => aux.showFilterVehicle);
        const showFilterMaintElement: string = this.commonService.nameOf(() => aux.showFilterMaintElement);
        const showFilterMonth: string = this.commonService.nameOf(() => aux.showFilterMonth);
        const showStrict: string = this.commonService.nameOf(() => aux.showStrict);
        const showExpensePerKm: string = this.commonService.nameOf(() => aux.showExpensePerKm);
        const showAxis: string = this.commonService.nameOf(() => aux.showAxis);
        const showLegend: string = this.commonService.nameOf(() => aux.showLegend);
        const showAxisLabel: string = this.commonService.nameOf(() => aux.showAxisLabel);
        const showDataLabel: string = this.commonService.nameOf(() => aux.showDataLabel);
        const showDoghnut: string = this.commonService.nameOf(() => aux.showDoghnut);
        const showMyData: string = this.commonService.nameOf(() => aux.showMyData);
        return {
            filterDashboardGrouper: [showFilterOpType, showFilterMaintElement, showFilterMonth, showExpensePerKm, showAxis, showLegend, showAxisLabel, showDataLabel, showDoghnut, showMyData],
            filterDashboardRecordsGrouper: [showFilterKmTime, showFilterOpType, showFilterMaintElement, showStrict],
            filterOperationGrouper: [showSearchText, showFilterOpType, showFilterMaintElement],
            filterConfigurationGrouper: [showSearchText, showFilterVehicle]
        }
    }

    isEmptySearchDashboard(parentPage: PageEnum): boolean {
        if (!this.isEmptyFilters(parentPage))
            return false;
        return this.isEmptyShowers(parentPage);
    }

    private isEmptyFilters(parentPage: PageEnum): boolean {
        const config: IDisplaySearcherControlModel = this.getConfigDisplay();
        const emptyFilter: SearchDashboardModel = new SearchDashboardModel();
        let filterApplied: boolean = false;
        if(config.showFilterKmTime.some(x => x === parentPage)) {
            filterApplied = (this.searchDashboard.filterKmTime !== emptyFilter.filterKmTime);
        }
        if(config.showSearchText.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.searchText !== emptyFilter.searchText);
        }
        if(config.showFilterOpType.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.searchOperationType.length !== emptyFilter.searchOperationType.length);
        }
        if(config.showFilterVehicle.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.searchVehicle.length !== emptyFilter.searchVehicle.length);
        }
        if(config.showFilterMaintElement.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.searchMaintenanceElement.length !== emptyFilter.searchMaintenanceElement.length);
        }
        if(config.showFilterMonth.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.showPerMont !== emptyFilter.showPerMont);
        }
        if(config.showExpensePerKm.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.expensePerKm !== emptyFilter.expensePerKm);
        }
        return !filterApplied;
    }

    private isEmptyShowers(parentPage: PageEnum): boolean {
        const config: IDisplaySearcherControlModel = this.getConfigDisplay();
        const emptyFilter: SearchDashboardModel = new SearchDashboardModel();
        let filterApplied: boolean = false;
        if(config.showStrict.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.showStrict !== emptyFilter.showStrict);
        }
        if(config.showAxis.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.showAxis !== emptyFilter.showAxis);
        }
        if(config.showLegend.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.showLegend !== emptyFilter.showLegend);
        }
        if(config.showAxisLabel.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.showAxisLabel !== emptyFilter.showAxisLabel);
        }
        if(config.showDataLabel.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.showDataLabel !== emptyFilter.showDataLabel);
        }
        if(config.showDoghnut.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.doghnut !== emptyFilter.doghnut);
        }
        if(config.showMyData.some(x => x === parentPage)) {
            filterApplied = filterApplied || (this.searchDashboard.showMyData !== emptyFilter.showMyData);
        }
        return !filterApplied;
    }

    //#endregion
}
