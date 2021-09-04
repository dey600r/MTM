import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
    DashboardModel, OperationModel, SearchDashboardModel,
    ConfigurationModel, VehicleModel, MaintenanceModel, WearVehicleProgressBarViewModel,
    WearMaintenanceProgressBarViewModel, OperationTypeModel, MaintenanceElementModel, WearReplacementProgressBarViewModel, WearNotificationReplacementProgressBarViewModel
} from '@models/index';
import { CommonService } from './common.service';
import { CalendarService } from './calendar.service';
import { ConstantsColumns, WarningWearEnum, FilterMonthsEnum, Constants, FilterKmTimeEnum } from '../utils';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private searchDashboard: SearchDashboardModel = new SearchDashboardModel();
    public behaviourSearchOperation: BehaviorSubject<SearchDashboardModel>
        = new BehaviorSubject<SearchDashboardModel>(this.searchDashboard);
    public behaviourSearchDashboard: BehaviorSubject<SearchDashboardModel>
        = new BehaviorSubject<SearchDashboardModel>(this.searchDashboard);

    constructor(private commonService: CommonService,
                private calendarService: CalendarService,
                private translator: TranslateService) {
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
        return new DashboardModel(view, dataDashboard, { domain: ['#D91CF6', '#1CEAF6', '#5FF61C']},
            filter.showAxis, filter.showAxis, true, filter.showLegend, this.translator.instant('COMMON.OPERATIONS'),
            filter.showAxisLabel, this.translator.instant('PAGE_CONFIGURATION.MAINTENANCES'),
            filter.showAxisLabel, translateY, true, filter.doghnut, 'below', filter.showDataLabel);
    }

    mapWearToDashboardKmRecordMaintenances(data: WearVehicleProgressBarViewModel, measure: any): any[] {
        let result: any[] = [];
        if (!!data && data.listWearMaintenance.length > 0) {
            let initKm: number = data.listWearMaintenance[0].fromKmMaintenance;
            const estimated: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.ESTIMATED'), []);
            const real: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.REAL'), []);
            if (initKm === 0) {
                estimated.series = [...estimated.series, this.getDataDashboard(`0${measure.value}`, 0 )];
                real.series = [...estimated.series, this.getDataDashboard(`0${measure.value}`, 0 )];
                initKm = 0;
            }
            const kmEstimated: number = this.calendarService.calculateWearKmVehicleEstimated(data);
            data.listWearMaintenance.forEach(main => {
                main.listWearReplacement.forEach((rep, index) => {
                    estimated.series = [...estimated.series, this.getDataDashboard(`${rep.kmAcumulateMaintenance}${measure.value}`,
                        (initKm !== 0 && main.kmMaintenance > initKm && index === 0 ? initKm : main.kmMaintenance))];
                    const realSerie: number = (rep.kmOperation === null ?
                        (rep.kmAcumulateMaintenance < kmEstimated ? 0 : kmEstimated % main.kmMaintenance) :
                        (initKm !== 0 && main.kmMaintenance > initKm && index === 0 ? initKm : main.kmMaintenance) - rep.calculateKms);
                    real.series = [...real.series,
                        this.getDataDashboard(`${rep.kmAcumulateMaintenance}${measure.value}`, (realSerie < 0 ? 0 : realSerie))];
                });
            });
            if (data.listWearMaintenance[0].toKmMaintenance === null ||
                data.listWearMaintenance[data.listWearMaintenance.length - 1]
                .listWearReplacement[data.listWearMaintenance[data.listWearMaintenance.length - 1].listWearReplacement.length - 1]
                .kmAcumulateMaintenance < kmEstimated) {
                const kmMaintenance: number = data.listWearMaintenance[data.listWearMaintenance.length - 1].kmMaintenance;
                const kmAcumMaintenance: number = data.listWearMaintenance[data.listWearMaintenance.length - 1]
                    .listWearReplacement[data.listWearMaintenance[data.listWearMaintenance.length - 1].listWearReplacement.length - 1]
                    .kmAcumulateMaintenance;
                const lastMaintenance: number = kmAcumMaintenance + kmMaintenance;
                estimated.series = [...estimated.series, this.getDataDashboard(`${lastMaintenance}${measure.value}`, kmMaintenance)];
                real.series = [...real.series, this.getDataDashboard(`${lastMaintenance}${measure.value}`,
                    (kmAcumMaintenance > kmEstimated ? 0 : kmEstimated % kmMaintenance))];
            }
            result = [estimated, real];
        }
        return result;
    }

    mapWearToDashboardTimeRecordMaintenances(data: WearVehicleProgressBarViewModel, measure: any): any[] {
        let result: any[] = [];
        if (!!data && data.listWearMaintenance.length > 0) {
            const initKm: number = data.listWearMaintenance[0].fromKmMaintenance;
            const estimated: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.ESTIMATED'), []);
            const real: any = this.getDataSeriesDashboard(this.translator.instant('COMMON.REAL'), []);
            if (initKm === 0) {
                estimated.series = [...estimated.series, this.getDataDashboard(`0${measure.value}`, 0 )];
                real.series = [...estimated.series, this.getDataDashboard(`0${measure.value}`, 0 )];
            }
            const kmEstimated: number = this.calendarService.calculateWearKmVehicleEstimated(data);
            data.listWearMaintenance.forEach(main => {
                main.listWearReplacement.forEach(rep => {
                    estimated.series = [...estimated.series,
                        this.getDataDashboard(`${rep.kmAcumulateMaintenance}${measure.value}`, rep.timeAcumulateMaintenance)];
                    const realSerie: number = (rep.kmOperation === null ?
                        (main.kmMaintenance < kmEstimated ? 0 : this.calendarService.monthDiff(data.datePurchaseVehicle, new Date())) :
                        (rep.timeAcumulateMaintenance - rep.calculateMonths));
                    real.series = [...real.series,
                    this.getDataDashboard(`${rep.kmAcumulateMaintenance}${measure.value}`, (realSerie < 0 ? 0 : realSerie))];
                });
            });
            if (data.listWearMaintenance.length === 0 ||
                data.listWearMaintenance[data.listWearMaintenance.length - 1]
                    .listWearReplacement[data.listWearMaintenance[data.listWearMaintenance.length - 1].listWearReplacement.length - 1]
                    .kmAcumulateMaintenance < kmEstimated) {
                const kmMaintenance: number = data.listWearMaintenance[data.listWearMaintenance.length - 1].kmMaintenance;
                const timeMaintenance: number = data.listWearMaintenance[data.listWearMaintenance.length - 1].timeMaintenance;
                const lastMaintenance: number =
                    data.listWearMaintenance[data.listWearMaintenance.length - 1]
                    .listWearReplacement[data.listWearMaintenance[data.listWearMaintenance.length - 1].listWearReplacement.length - 1]
                    .kmAcumulateMaintenance + kmMaintenance;
                estimated.series = [...estimated.series, this.getDataDashboard(`${lastMaintenance}${measure.value}`,
                    timeMaintenance + data.listWearMaintenance[data.listWearMaintenance.length - 1]
                    .listWearReplacement[data.listWearMaintenance[data.listWearMaintenance.length - 1].listWearReplacement.length - 1]
                    .timeAcumulateMaintenance)];
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

    /** NOTIFICATIONS */

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
                    let totalMaintenanceReplacementNotSuccess = 0;
                    let totalMaintenanceReplacementSuccess = 0;
                    maintenancesVehicle.forEach(x => total += x.listMaintenanceElement.length);
                    wearMaintenance.filter(main => (main.fromKmMaintenance >= kmVehicleEstimated ||
                        (main.toKmMaintenance !== null && main.toKmMaintenance <= kmVehicleEstimated))).forEach(main => 
                        main.listWearNotificationReplacement.filter(notif => notif.warning !== WarningWearEnum.SUCCESS)
                        .forEach(notif => totalMaintenanceReplacementNotSuccess += notif.numWarning));
                    wearMaintenance.forEach(main =>
                            main.listWearNotificationReplacement.filter(notif => notif.warning === WarningWearEnum.SUCCESS)
                            .forEach(notif => totalMaintenanceReplacementSuccess += notif.numWarning));
                    result = [...result, {
                        idVehicle: vehicle.id,
                        nameVehicle: `${vehicle.brand} ${vehicle.model}`,
                        kmVehicle: vehicle.km,
                        datePurchaseVehicle: new Date(vehicle.datePurchase),
                        kmsPerMonthVehicle: vehicle.kmsPerMonth,
                        dateKmsVehicle: vehicle.dateKms,
                        typeVehicle: vehicle.vehicleType.code,
                        percent: ((total - wearMaintenance.length) +
                            totalMaintenanceReplacementNotSuccess + totalMaintenanceReplacementSuccess),
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
            if (aux === null) {
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
        const wearReplacementDanger: WearMaintenanceProgressBarViewModel[] =
            maintenanceWear.filter(main => main.listWearReplacement.some(rep =>
                    rep.warningKms === WarningWearEnum.DANGER || rep.warningKms === WarningWearEnum.SKULL));
        const wearReplacementWarning: WearMaintenanceProgressBarViewModel[] =
            maintenanceWear.filter(main => main.listWearReplacement.some(rep => rep.warningKms === WarningWearEnum.WARNING));
        const wearReplacementSuccess: WearMaintenanceProgressBarViewModel[] =
            maintenanceWear.filter(main => main.listWearReplacement.some(rep => rep.warningKms === WarningWearEnum.SUCCESS));

        result = this.commonService.orderBy(wearReplacementDanger, ConstantsColumns.COLUMN_MODEL_CALCULATE_KMS);
        this.commonService.orderBy(wearReplacementWarning, ConstantsColumns.COLUMN_MODEL_CALCULATE_KMS).forEach(x =>
            result = [...result, x]);
        this.commonService.orderBy(wearReplacementSuccess, ConstantsColumns.COLUMN_MODEL_CALCULATE_KMS).forEach(x =>
            result = [...result, x]);

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
            } else if (main.wear) {
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
                    warningKms: this.getWarningWear(percentKm),
                    percentMonths: percentMonth,
                    warningMonths: this.getWarningWear(percentMonth)
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
            let wearReplacement: WearReplacementProgressBarViewModel[] = [];
            let percentVehicleKm = 0;
            let percentVehicleTime = 0;
            let timeCalculate = 0;
            if (listWear.some(x => x.codeMaintenanceFreq === Constants.MAINTENANCE_FREQ_CALENDAR_CODE)) {
                listWear.forEach((wearMain: WearMaintenanceProgressBarViewModel) => {
                    const estimatedKmOperation: number = wearMain.kmMaintenance / 2; // km estimated maintenance
                    const lastKmVehicle: number = (wearMain.toKmMaintenance === null ? kmVehicle : wearMain.toKmMaintenance);
                    wearMain.listWearReplacement.forEach((wearRep, index) => {
                        // Operation with maintenance selected
                        const operationsVehicle: OperationModel[] = operations.filter(x => x.vehicle.id === vehicleWear.idVehicle &&
                        x.listMaintenanceElement.some(m => m.id === wearRep.idMaintenanceElement));
                        const max: number = (lastKmVehicle +
                        (wearMain.listWearReplacement.length === 1 || index + 1 === wearMain.listWearReplacement.length ?
                            0 : - wearMain.kmMaintenance * 2));
                        timeCalculate = this.getInitTime(wearMain, vehicle, operationsVehicle, timeCalculate);
                        let opLast = new OperationModel();
                        for (let kmCalculate = this.getInitKm(wearMain); kmCalculate < max; kmCalculate += wearMain.kmMaintenance) {
                            const calcKm: number = (kmCalculate + wearMain.kmMaintenance); // km should maintenance
                            const calcCompKm: number = (calcKm + estimatedKmOperation); // km max should maintenance
                            const calcTime: number = (timeCalculate + wearMain.timeMaintenance); // time should maintenance
                            // OPERATIONS: km and time aprox to maintenance
                            const ops: OperationModel[] = this.getOperationsFilteredKmTime(operationsVehicle, wearReplacement, kmCalculate,
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
                                wearReplacement = [... wearReplacement, {
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
                                }];
                            }
    
                            if (!!op && op.id !== null) {
                                percentVehicleKm += (calculateKmEstimate >= 0 ? 1 : 1 - (percentKm > 1 ? 1 : percentKm));
                                percentVehicleTime += (calculateTimeEstimate >= 0 ? 1 : 1 - (percentTime > 1 ? 1 : percentTime));
                            }
                            timeCalculate += wearMain.timeMaintenance;
                        }
                    });

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
                        listWearReplacement:
                            this.commonService.orderBy(wearReplacement, ConstantsColumns.COLUMN_MODEL_KM_ACUMULATE_MAINTENANCE)
                    }];
                });
                const perKm: number = percentVehicleKm * 100 / wearReplacement.length;
                const perTime: number = percentVehicleTime * 100 / wearReplacement.length;
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

    getOperationsFilteredKmTime(operationsVehicle: OperationModel[], wearReplacement: WearReplacementProgressBarViewModel[],
                                kmCalculate: number, calcCompKm: number, calcTime: number, opLast: OperationModel,
                                datePurchaseVehicle: Date): OperationModel[] {
        return operationsVehicle.filter(x =>
                !wearReplacement.some(y => y.idOperation === x.id) &&
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

    // SEARCHER DASHBOARD

    getObserverSearchDashboard(): Observable<SearchDashboardModel> {
        return this.behaviourSearchDashboard.asObservable();
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
}
