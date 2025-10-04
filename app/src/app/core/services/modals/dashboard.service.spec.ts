import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Platform } from '@ionic/angular';

// SERVICES
import { DashboardService } from './dashboard.service';
import { InfoVehicleService } from './info-vehicle.service';
import { SettingsService } from './settings.service';
import { HomeService } from '../pages/index';
import { CalendarService } from '../common/index';

// CONFIGURATIONS
import { MockAppData, MockTranslate, SetupTest, SpyMockConfig } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';
import { LegendPosition } from '@swimlane/ngx-charts';

// MODELS
import {
    DashboardModel, InfoVehicleConfigurationModel, MaintenanceModel, OperationModel, SearchDashboardModel, 
    VehicleModel, WearVehicleProgressBarViewModel,
    IDashboardModel, IDashboardSerieModel, ISettingModel, IDashboardExpensesModel
} from '@models/index';
import { FilterMonthsEnum, Constants, PageEnum, FilterKmTimeEnum } from '@utils/index';

describe('DashboardService', () => {
    let service: DashboardService;
    let homeService: HomeService;
    let calendarService: CalendarService;
    let serviceInfoVehicle: InfoVehicleService;
    let settingService: SettingsService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(DashboardService);
        serviceInfoVehicle = TestBed.inject(InfoVehicleService);
        homeService = TestBed.inject(HomeService);
        calendarService = TestBed.inject(CalendarService);
        settingService = TestBed.inject(SettingsService);
        translate = TestBed.inject(TranslateService);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // VEHICLE EXPENSES

    it('should calculate other vehicle expenses dashboard - ES', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: false,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelVehicleExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toEqual(2);
        expect(dashboard.legendTitle).toEqual(MockTranslate.ES.COMMON.VEHICLES);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.ES.COMMON.VEHICLES);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.ES.COMMON.EXPENSE);
        const vehicle1: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(8155.35);
        expect(vehicle1.name).toEqual(`${MockAppData.Vehicles[0].brand}-${MockAppData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(352);
        expect(vehicle2.name).toEqual(`${MockAppData.Vehicles[1].brand}-${MockAppData.Vehicles[1].model}`);
    });

    it('should calculate other vehicle expenses dashboard - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: false,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelVehicleExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toEqual(2);
        expect(dashboard.legendTitle).toEqual(MockTranslate.EN.COMMON.VEHICLES);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.EN.COMMON.VEHICLES);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.EN.COMMON.EXPENSE);
        const vehicle1: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(8155.35);
        expect(vehicle1.name).toEqual(`${MockAppData.Vehicles[0].brand}-${MockAppData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(352);
        expect(vehicle2.name).toEqual(`${MockAppData.Vehicles[1].brand}-${MockAppData.Vehicles[1].model}`);
    });

    it('should calculate my vehicle expenses dashboard', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: true,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelVehicleExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.data.length).toEqual(2);
        const vehicle1: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(2772);
        expect(vehicle1.name).toEqual(`${MockAppData.Vehicles[0].brand}-${MockAppData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(5007);
        expect(vehicle2.name).toEqual(`${MockAppData.Vehicles[1].brand}-${MockAppData.Vehicles[1].model}`);
    });

    it('should calculate vehicle expenses per km dashboard', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: false,
            expensePerKm: true,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelVehicleExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.data.length).toEqual(2);
        const vehicle1: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(0.07);
        expect(vehicle1.name).toEqual(`${MockAppData.Vehicles[0].brand}-${MockAppData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(0);
        expect(vehicle2.name).toEqual(`${MockAppData.Vehicles[1].brand}-${MockAppData.Vehicles[1].model}`);
    });

    it('should calculate vehicle other expenses dashboard with filter operations type maintenance home', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            searchOperationType: [MockAppData.OperationTypes[6]],
            showMyData: false,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelVehicleExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.data.length).toEqual(0);
    });

    it('should calculate vehicle my expenses dashboard with filter operations type maintenance home', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            searchOperationType: [MockAppData.OperationTypes[0]],
            showMyData: true,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelVehicleExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.data.length).toEqual(2);
        const vehicle1: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(1234);
        expect(vehicle1.name).toEqual(`${MockAppData.Vehicles[0].brand}-${MockAppData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(1225);
        expect(vehicle2.name).toEqual(`${MockAppData.Vehicles[1].brand}-${MockAppData.Vehicles[1].model}`);
    });

    it('should calculate vehicle my expenses dashboard with filter replacement oil filter', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            searchMaintenanceElement: [MockAppData.MaintenanceElements[4]],
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelVehicleExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.data.length).toEqual(2);
        const vehicle1: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(2007);
        expect(vehicle1.name).toEqual(`${MockAppData.Vehicles[0].brand}-${MockAppData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockAppData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(452);
        expect(vehicle2.name).toEqual(`${MockAppData.Vehicles[1].brand}-${MockAppData.Vehicles[1].model}`);
    });

    // VEHICLE PER MONTH EXPENSES

    it('should calculate other vehicle per month expenses dashboard - ES', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const operationVehicle = MockAppData.Operations.filter(x => x.vehicle.id === MockAppData.Vehicles[0].id);
        const dashboard: IDashboardExpensesModel<DashboardModel<IDashboardModel>> = service.getDashboardModelVehiclePerTime(windows, operationVehicle, filter);
        expect(dashboard.allSum.isDoughnut).toBeFalsy();
        expect(dashboard.allSum.showLegend).toBeFalsy();
        expect(dashboard.allSum.data.length).toBeGreaterThanOrEqual(3);
        expect(dashboard.allSum.legendTitle).toEqual(MockTranslate.ES.COMMON.DATE);
        expect(dashboard.allSum.xAxisLabel).toEqual(MockTranslate.ES.COMMON.DATE);
        expect(dashboard.allSum.yAxisLabel).toEqual(MockTranslate.ES.COMMON.EXPENSE);
        const name1: string = '2018';
        const name2: string = '2019';
        const name3: string = '2020';
        expect(dashboard.allSum.data[0].name).toEqual(name1);
        expect(dashboard.allSum.data[0].value).toEqual(dashboard.operationSum.data[0].value + dashboard.replacementSum.data[0].value);
        expect(dashboard.allSum.data[1].name).toEqual(name2);
        expect(dashboard.allSum.data[1].value).toEqual(dashboard.operationSum.data[1].value + dashboard.replacementSum.data[1].value);
        expect(dashboard.allSum.data[2].name).toEqual(name3);
        expect(dashboard.allSum.data[2].value).toEqual(dashboard.operationSum.data[2].value + dashboard.replacementSum.data[2].value);

        expect(dashboard.operationSum.isDoughnut).toBeFalsy();
        expect(dashboard.operationSum.showLegend).toBeFalsy();
        expect(dashboard.operationSum.data.length).toBeGreaterThanOrEqual(3);
        expect(dashboard.operationSum.legendTitle).toEqual(MockTranslate.ES.COMMON.DATE);
        expect(dashboard.operationSum.xAxisLabel).toEqual(MockTranslate.ES.COMMON.DATE);
        expect(dashboard.operationSum.yAxisLabel).toEqual(MockTranslate.ES.COMMON.LABOR_EXPENSE);
        expect(dashboard.operationSum.data[0].name).toEqual(name1);
        expect(dashboard.operationSum.data[0].value).toBeGreaterThanOrEqual(650);
        expect(dashboard.operationSum.data[1].name).toEqual(name2);
        expect(dashboard.operationSum.data[1].value).toBeGreaterThanOrEqual(333);
        expect(dashboard.operationSum.data[2].name).toEqual(name3);
        expect(dashboard.operationSum.data[2].value).toBeGreaterThanOrEqual(300);

        expect(dashboard.replacementSum.isDoughnut).toBeFalsy();
        expect(dashboard.replacementSum.showLegend).toBeFalsy();
        expect(dashboard.replacementSum.data.length).toBeGreaterThanOrEqual(3);
        expect(dashboard.replacementSum.legendTitle).toEqual(MockTranslate.ES.COMMON.DATE);
        expect(dashboard.replacementSum.xAxisLabel).toEqual(MockTranslate.ES.COMMON.DATE);
        expect(dashboard.replacementSum.yAxisLabel).toEqual(MockTranslate.ES.COMMON.REPLACEMENT_EXPENSE);
        expect(dashboard.replacementSum.data[0].name).toEqual(name1);
        expect(dashboard.replacementSum.data[0].value).toBeGreaterThanOrEqual(362);
        expect(dashboard.replacementSum.data[1].name).toEqual(name2);
        expect(dashboard.replacementSum.data[1].value).toBeGreaterThanOrEqual(193);
        expect(dashboard.replacementSum.data[2].name).toEqual(name3);
        expect(dashboard.replacementSum.data[2].value).toBeGreaterThanOrEqual(117);
    });

    it('should calculate other vehicle per month expenses dashboard - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const operationVehicle = MockAppData.Operations.filter(x => x.vehicle.id === MockAppData.Vehicles[0].id);
        const dashboard: IDashboardExpensesModel<DashboardModel<IDashboardModel>> = service.getDashboardModelVehiclePerTime(windows, operationVehicle, filter);
        expect(dashboard.allSum.data.length).toBeGreaterThanOrEqual(3);
        expect(dashboard.allSum.legendTitle).toEqual(MockTranslate.EN.COMMON.DATE);
        expect(dashboard.allSum.xAxisLabel).toEqual(MockTranslate.EN.COMMON.DATE);
        expect(dashboard.allSum.yAxisLabel).toEqual(MockTranslate.EN.COMMON.EXPENSE);
        expect(dashboard.operationSum.yAxisLabel).toEqual(MockTranslate.EN.COMMON.LABOR_EXPENSE);
        expect(dashboard.replacementSum.yAxisLabel).toEqual(MockTranslate.EN.COMMON.REPLACEMENT_EXPENSE);
    });

    it('should get range dates per months, quarter and years', () => {
        expect(service.getRangeDates(2020, 10, FilterMonthsEnum.MONTH)).toEqual('11/2020');
        expect(service.getRangeDates(2020, 7, FilterMonthsEnum.QUARTER)).toEqual('08/20-11/20');
        expect(service.getRangeDates(2020, 10, FilterMonthsEnum.YEAR)).toEqual('2020');
    });

    it('should calculate operation type expenses dashboard - ES', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: false,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelOpTypeExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toEqual(2);
        expect(dashboard.legendTitle).toEqual(MockTranslate.ES.COMMON.OPERATION_TYPE);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.ES.COMMON.OPERATION_TYPE);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.ES.COMMON.EXPENSE);
        const opt1: any = dashboard.data.find(x => x.id === MockAppData.OperationTypes[5].id);
        expect(opt1.value).toEqual(8155.35);
        expect(opt1.name).toEqual(MockAppData.OperationTypes[5].description);
        const vehicle2: any = dashboard.data.find(x => x.id === MockAppData.OperationTypes[0].id);
        expect(vehicle2.value).toEqual(352);
        expect(vehicle2.name).toEqual(MockAppData.OperationTypes[0].description);
    });

    it('should calculate operation type expenses dashboard - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: true,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel<IDashboardModel> = service.getDashboardModelOpTypeExpenses(windows, MockAppData.Operations, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toEqual(3);
        expect(dashboard.legendTitle).toEqual(MockTranslate.EN.COMMON.OPERATION_TYPE);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.EN.COMMON.OPERATION_TYPE);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.EN.COMMON.EXPENSE);
        const opt1: any = dashboard.data.find(x => x.id === MockAppData.OperationTypes[5].id);
        expect(opt1.value).toEqual(3500);
        expect(opt1.name).toEqual(MockAppData.OperationTypes[5].description);
        const opt2: any = dashboard.data.find(x => x.id === MockAppData.OperationTypes[0].id);
        expect(opt2.value).toEqual(2459);
        expect(opt2.name).toEqual(MockAppData.OperationTypes[0].description);
        const opt3: any = dashboard.data.find(x => x.id === MockAppData.OperationTypes[6].id);
        expect(opt3.value).toEqual(1820);
        expect(opt3.name).toEqual(MockAppData.OperationTypes[6].description);
    });

    it('should prefilter operations', () => {
        const op1 = service.getPrefilterOperation(MockAppData.Operations, new SearchDashboardModel({
            searchOperationType: [MockAppData.OperationTypes[0]],
            showStrict: false
        }));
        expect(op1.some(x => x.operationType.id !== MockAppData.OperationTypes[0].id)).toBeFalsy();
        
        const op2 = service.getPrefilterOperation(MockAppData.Operations, new SearchDashboardModel({
            searchMaintenanceElement: [MockAppData.MaintenanceElements[0]],
            showStrict: false
        }));
        expect(op2.every(x => x.listMaintenanceElement.some(y => y.id === MockAppData.MaintenanceElements[0].id))).toBeTruthy();
        
        const op3 = service.getPrefilterOperation(MockAppData.Operations, new SearchDashboardModel());
        expect(op3.some(x => x.owner !== null && x.owner !== '' && x.owner.toLowerCase() !== Constants.OWNER_ME &&
            x.owner.toLowerCase() !== Constants.OWNER_YO)).toBeFalsy();
    });

    it('should refresh search dashboard operation', () => {
        service.setSearchOperation(MockAppData.OperationTypes, MockAppData.MaintenanceElements, 'hola');
        expect(service.behaviourSearchOperation.value.searchOperationType).toEqual(MockAppData.OperationTypes);
        expect(service.behaviourSearchOperation.value.searchMaintenanceElement).toEqual(MockAppData.MaintenanceElements);
        expect(service.behaviourSearchOperation.value.searchText).toEqual('hola');
    });

    it('should refresh search dashboard vehicles', () => {
        service.setSearchConfiguration(MockAppData.Vehicles);
        expect(service.behaviourSearchOperation.value.searchVehicle).toEqual(MockAppData.Vehicles);
    });

    it('should is empty search dashboard operation', () => {
        service.setSearchOperation();
        expect(service.isEmptySearchDashboard(PageEnum.OPERATION)).toBeTruthy();
    });
    
    it('should is not empty search dashboard operation', () => {
        service.setSearchOperation([], [], 'hola');
        expect(service.isEmptySearchDashboard(PageEnum.OPERATION)).toBeFalse();
        service.setSearchOperation([], [MockAppData.MaintenanceElements[0]]);
        expect(service.isEmptySearchDashboard(PageEnum.OPERATION)).toBeFalse();
        service.setSearchOperation([MockAppData.OperationTypes[0]]);
        expect(service.isEmptySearchDashboard(PageEnum.OPERATION)).toBeFalse();
    });
    
    it('should is empty search dashboard configuration', () => {
        service.setSearchConfiguration();
        expect(service.isEmptySearchDashboard(PageEnum.CONFIGURATION)).toBeTruthy();
    });
    
    it('should is not empty search dashboard configuration', () => {
        service.setSearchConfiguration([MockAppData.Vehicles[0]], 'hola');
        expect(service.isEmptySearchDashboard(PageEnum.CONFIGURATION)).toBeFalse();
        service.setSearchConfiguration([], 'hola');
        expect(service.isEmptySearchDashboard(PageEnum.CONFIGURATION)).toBeFalse();
        service.setSearchConfiguration([MockAppData.Vehicles[0]]);
        expect(service.isEmptySearchDashboard(PageEnum.CONFIGURATION)).toBeFalse();
    });

    it('should is empty search dashboard operation/vehicle dashboard', () => {
        service.setSearchDashboard(new SearchDashboardModel());
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeTruthy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeTruthy();
    });

    it('should is not empty search dashboard operation/vehicle dashboard', () => {
        service.setSearchDashboard(new SearchDashboardModel({ searchOperationType: [MockAppData.OperationTypes[0]] }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ searchMaintenanceElement: [MockAppData.MaintenanceElements[0]] }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ showPerMont: FilterMonthsEnum.YEAR }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeTruthy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeTruthy();
        service.setSearchDashboard(new SearchDashboardModel({ expensePerKm: true }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ showAxis: false }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ showLegend: true }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ showAxisLabel: true }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ showDataLabel: true }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ doghnut: true }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ showMyData: false }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
    });

    it('should is empty search dashboard home info notification', () => {
        service.setSearchDashboardRecords(FilterKmTimeEnum.KM, true);
        expect(service.isEmptySearchDashboard(PageEnum.HOME)).toBeTruthy();
    });

    it('should is not empty search dashboard home info notification', () => {
        service.setSearchDashboardRecords(FilterKmTimeEnum.TIME, true);
        expect(service.isEmptySearchDashboard(PageEnum.HOME)).toBeFalsy();
        service.setSearchDashboardRecords(FilterKmTimeEnum.KM, false);
        expect(service.isEmptySearchDashboard(PageEnum.HOME)).toBeFalsy();
    });

    it('should calculate initial km sum per year', () => {
        expect(service.calculateInitalkmSumPerYear(new Date(2021, 10, 12), new Date(2021, 11, 15), 17, 2021)).toEqual(561);
        expect(service.calculateInitalkmSumPerYear(new Date(2021, 10, 12), new Date(2022, 11, 15), 17, 2022)).toEqual(5916);
    });

    it('should calculate final km sum per year', () => {
        expect(service.calculateFinalkmSumPerYear(new Date(2021, 11, 15), 17, 2021)).toEqual(272);
        expect(service.calculateFinalkmSumPerYear(new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDay()), 17, new Date().getFullYear())).toBeGreaterThanOrEqual(17 * 2);
    });

    it('should calculate average km', () => {
        const data: IDashboardModel[] = [
            { id: 1, name: '2015', value: -1 },
            { id: 1, name: '2016', value: 200 },
            { id: 1, name: '2017', value: 400 },
            { id: 1, name: '2018', value: 600 },
            { id: 1, name: '2019', value: -1 },
            { id: 1, name: '2020', value: 800 },
            { id: 1, name: '2021', value: -1 },
        ];
        expect(service.calculateAveragekm([data[0]], -1, 5)).toEqual(0);
        expect(service.calculateAveragekm(data, -1, 5)).toEqual(400);
        expect(service.calculateAveragekm(data, 3, 50)).toEqual(700);
        expect(service.calculateAveragekm(data, -1, 50)).toEqual(500);
    });

    it('should calculate remain km', () => {
        const year: number = new Date().getFullYear();
        const data: IDashboardModel[] = [
            { id: 1, name: (year-6).toString(), value: 100 },
            { id: 1, name: (year-5).toString(), value: 200 },
            { id: 1, name: (year-4).toString(), value: 400 },
            { id: 1, name: (year-3).toString(), value: 600 },
            { id: 1, name: (year-2).toString(), value: 200 },
            { id: 1, name: (year-1).toString(), value: 800 },
            { id: 1, name: year.toString(), value: -1 },
        ];
        let result: IDashboardModel[] = service.calculateRemainKm(data, 6000);
        expect(result[0].value).toEqual(1100);
        expect(result[1].value).toEqual(1200);
        expect(result[2].value).toEqual(1400);
        expect(result[3].value).toEqual(1600);
        expect(result[4].value).toEqual(1200);
        expect(result[5].value).toEqual(1800);
        expect(result[6].value).toEqual(-1);
    });

    it('should calculate km per year without operation 1', () => {
        const today: Date = new Date();
        const year: number = today.getFullYear();
        const month: number = today.getMonth();
        const day: number = today.getDate();
        const data: IDashboardModel[] = [
            { id: 1, name: (year-6).toString(), value: -1 },
            { id: 2, name: (year-5).toString(), value: 200 },
            { id: 3, name: (year-4).toString(), value: 400 },
            { id: 4, name: (year-3).toString(), value: 600 },
            { id: 5, name: (year-2).toString(), value: -1 },
            { id: 6, name: (year-1).toString(), value: 800 },
            { id: 7, name: year.toString(), value: -1 },
        ];
        let vehicleMock: VehicleModel = new VehicleModel({ 
            km: 9500,
            kmsPerMonth: 300,
            dateKms: new Date(year, month - 3, day),
            datePurchase: new Date(year - 8, month - 3, day)
        });
        vehicleMock.kmEstimated = calendarService.calculateKmVehicleEstimated(vehicleMock);
        let result: IDashboardModel[] = service.calculateKmPerYearWithOutOperations(data, vehicleMock);
        expect(result[0].value).toBeLessThanOrEqual(2305);
        expect(result[1].value).toBeLessThanOrEqual(2105);
        expect(result[2].value).toBeLessThanOrEqual(2305);
        expect(result[3].value).toBeLessThanOrEqual(2505);
        expect(result[4].value).toBeLessThanOrEqual(2905);
        expect(result[5].value).toBeLessThanOrEqual(2705);
        expect(result[6].value).toBeLessThanOrEqual(4000);
        expect(result[0].value).toBeGreaterThanOrEqual(500);
        expect(result[1].value).toBeGreaterThanOrEqual(500);
        expect(result[2].value).toBeGreaterThanOrEqual(500);
        expect(result[3].value).toBeGreaterThanOrEqual(500);
        expect(result[4].value).toBeGreaterThanOrEqual(500);
        expect(result[5].value).toBeGreaterThanOrEqual(500);
        expect(result[6].value).toBeGreaterThanOrEqual(500);
    });

    it('should calculate km per year without operation 2', () => {
        const today: Date = new Date();
        const year: number = today.getFullYear();
        const month: number = today.getMonth();
        const day: number = today.getDate();
        const data: IDashboardModel[] = [
            { id: 1, name: (year-6).toString(), value: 9000 },
            { id: 1, name: (year-5).toString(), value: 600 },
            { id: 1, name: (year-4).toString(), value: -1 },
            { id: 1, name: (year-3).toString(), value: -1 },
            { id: 1, name: (year-2).toString(), value: -1 },
            { id: 1, name: (year-1).toString(), value: -1 },
            { id: 1, name: year.toString(), value: -1 },
        ];
        let vehicleMock: VehicleModel = new VehicleModel({ 
            km: 9500,
            kmsPerMonth: 300,
            dateKms: new Date(year, month - 3, day),
            datePurchase: new Date(year - 8, month - 3, day)
        });
        vehicleMock.kmEstimated = calendarService.calculateKmVehicleEstimated(vehicleMock);
        let result: IDashboardModel[] = service.calculateKmPerYearWithOutOperations(data, vehicleMock);
        expect(result[0].value).toBeLessThanOrEqual(9100);
        expect(result[1].value).toBeLessThanOrEqual(610);
        expect(result[2].value).toBeLessThanOrEqual(186);
        expect(result[3].value).toBeLessThanOrEqual(186);
        expect(result[4].value).toBeLessThanOrEqual(186);
        expect(result[5].value).toBeLessThanOrEqual(186);
        expect(result[6].value).toBeLessThanOrEqual(4000);
        expect(result[0].value).toBeGreaterThanOrEqual(8900);
        expect(result[1].value).toBeGreaterThanOrEqual(590);
        expect(result[2].value).toBeGreaterThanOrEqual(156);
        expect(result[3].value).toBeGreaterThanOrEqual(156);
        expect(result[4].value).toBeGreaterThanOrEqual(156);
        expect(result[5].value).toBeGreaterThanOrEqual(156);
        expect(result[6].value).toBeGreaterThanOrEqual(500);
    });

    it('should calculate km per year with operation', () => {
        const dataVehicle: VehicleModel = MockAppData.Vehicles[0];
        let result: IDashboardModel[] = service.calculateKmPerYearWithOperations(dataVehicle, MockAppData.Operations.filter(x => x.vehicle.id === dataVehicle.id));
        let year: number = new Date().getFullYear();
        expect(result.length).toEqual(year - new Date(dataVehicle.datePurchase).getFullYear() + 1);
        expect(result[0].name).toEqual((year - 17).toString());
        expect(result[0].value).toBeLessThanOrEqual(6920);
        expect(result[0].value).toBeGreaterThanOrEqual(-1);
    });

    it('should calculate km per day', () => {
        const dataVehicle: VehicleModel = MockAppData.Vehicles[0];
        let year: number = new Date().getFullYear();
        const dataOperation: OperationModel[] = MockAppData.Operations.filter(x => x.vehicle.id === dataVehicle.id);
        expect(service.calculateKmsPerDayPast(dataOperation, dataOperation.filter(x => !!x && new Date(x.date).getFullYear() === year - 17), year - 17, 25)).toEqual(25);
        expect(service.calculateKmsPerDayPast(dataOperation, dataOperation.filter(x => !!x && new Date(x.date).getFullYear() === year - 15), year - 15, 120)).toEqual(120);
        expect(service.calculateKmsPerDayPast(dataOperation, dataOperation.filter(x => !!x && new Date(x.date).getFullYear() === year - 6), year - 6, 34)).toEqual(73);
        expect(service.calculateKmsPerDayPast(dataOperation, dataOperation.filter(x => !!x && new Date(x.date).getFullYear() === year - 6), year - 6, 15)).toEqual(66);
        expect(service.calculateKmsPerDayPast(dataOperation, dataOperation.filter(x => !!x && new Date(x.date).getFullYear() === year - 5), year - 5, 12)).toEqual(79);
    });

    it('should calculate km per day using operations', () => {
        expect(service.calculateKmPerDayOperation(
            new OperationModel({date: new Date(2020, 1, 1), km: 500}),
            new OperationModel({date: new Date(2020, 2, 1), km: 2000}))).toEqual(51);
        expect(service.calculateKmPerDayOperation(
            new OperationModel({date: new Date(2020, 2, 1), km: 2000}),
            new OperationModel({date: new Date(2020, 1, 1), km: 500}))).toEqual(52);
    });

    it('should get dashboard information vehicle', () => {
        const dataVehicle: VehicleModel = MockAppData.Vehicles[0];
        let result: DashboardModel<IDashboardModel> = service.getDashboardInformationVehicle([1, 2], dataVehicle, MockAppData.Operations.filter(x => x.vehicle.id === dataVehicle.id));
        expect(result.data.length).toEqual(new Date().getFullYear() - new Date(dataVehicle.datePurchase).getFullYear() + 1);
        expect(result.view).toEqual([1, 2]);
    });

    it('should get dashboard configuration vehicle - windows', () => {
        const spyPlatform = spyOn(TestBed.inject(Platform), 'is').and.returnValue(true);
        const data: InfoVehicleConfigurationModel[] = serviceInfoVehicle.calculateInfoVehicleConfiguration(MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        let result: DashboardModel<IDashboardModel> = service.getDashboardConfigurationVehicle([1, 2], data[1]);
        expect(spyPlatform).toHaveBeenCalled();
        expect(result.view).toEqual([1, 2]);
        expect(result.data[0].name).toEqual(MockTranslate.ES.COMMON.SUCCESS);
        expect(result.data[0].value).toEqual(1);
        expect(result.colorScheme.domain[0]).toEqual('#387F57');
        expect(result.data[1].name).toEqual(MockTranslate.ES.COMMON.WARNING);
        expect(result.data[1].value).toEqual(2);
        expect(result.colorScheme.domain[1]).toEqual('#B69B57');
        expect(result.data[2].name).toEqual(MockTranslate.ES.COMMON.DANGER);
        expect(result.data[2].value).toEqual(1);
        expect(result.colorScheme.domain[2]).toEqual('#882B1C');
        expect(result.data[3].name).toEqual(MockTranslate.ES.COMMON.UNUSABLE);
        expect(result.data[3].value).toEqual(4);
        expect(result.colorScheme.domain[3]).toEqual('#7F4339');
    });

    it('should get dashboard configuration vehicle - android', () => {
        const spyPlatform = spyOn(TestBed.inject(Platform), 'is').and.returnValue(false);
        const data: InfoVehicleConfigurationModel[] = serviceInfoVehicle.calculateInfoVehicleConfiguration(MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        const result: DashboardModel<IDashboardModel> = service.getDashboardConfigurationVehicle([1, 2], data[1]);
        expect(spyPlatform).toHaveBeenCalled();
        expect(result.view).toEqual([1, 2]);
        expect(result.data[0].name).toEqual(MockTranslate.ES.COMMON.SUCCESS);
        expect(result.data[0].value).toEqual(1);
        expect(result.colorScheme.domain[0]).toEqual('rgba(var(--ion-color-progressbar-success-progress), 0.7)');
        expect(result.data[1].name).toEqual(MockTranslate.ES.COMMON.WARNING);
        expect(result.data[1].value).toEqual(2);
        expect(result.colorScheme.domain[1]).toEqual('rgba(var(--ion-color-progressbar-warning-progress), 0.7)');
        expect(result.data[2].name).toEqual(MockTranslate.ES.COMMON.DANGER);
        expect(result.data[2].value).toEqual(1);
        expect(result.colorScheme.domain[2]).toEqual('rgba(var(--ion-color-progressbar-danger-progress), 0.5)');
        expect(result.data[3].name).toEqual(MockTranslate.ES.COMMON.UNUSABLE);
        expect(result.data[3].value).toEqual(4);
        expect(result.colorScheme.domain[3]).toEqual('rgba(var(--ion-color-progressbar-danger-progress), 1)');
    });

    it('should get dashboard record maintenance - km', () => {
        const mockVehicle: VehicleModel[] = MockAppData.Vehicles;
        const mockOperation: OperationModel[] = MockAppData.Operations;
        const mockMaintenance: MaintenanceModel[] = MockAppData.Maintenances;
        const wear: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(mockOperation, mockVehicle, MockAppData.Configurations, mockMaintenance);
        const filter: SearchDashboardModel = new SearchDashboardModel();
        const measure: ISettingModel = settingService.getDistanceSelected(MockAppData.SystemConfigurations);
        const result: DashboardModel<IDashboardSerieModel> = service.getDashboardRecordMaintenances([1, 2], wear[0], filter, measure);
        expect(result.barPadding).toEqual(2);
        expect(result.colorScheme).toEqual({ domain: ['#D91CF6', '#1CEAF6','#5FF61C']});
        expect(result.gradient).toEqual(true);
        expect(result.isDoughnut).toEqual(false);
        expect(result.legendPosition).toEqual(LegendPosition.Right);
        expect(result.showDataLabel).toEqual(false);
        expect(result.showLabels).toEqual(true);
        expect(result.showLegend).toEqual(false);
        expect(result.showXAxis).toEqual(true);
        expect(result.showXAxisLabel).toEqual(false);
        expect(result.showYAxis).toEqual(true);
        expect(result.showYAxisLabel).toEqual(false);
        expect(result.xAxisLabel).toEqual(MockTranslate.ES.PAGE_CONFIGURATION.MAINTENANCES);
        expect(result.yAxisLabel).toEqual(measure.valueLarge);
        expect(result.legendTitle).toEqual(MockTranslate.ES.COMMON.OPERATIONS);
        expect(result.data.length).toEqual(2);
        expect(result.data[0].name).toEqual(MockTranslate.ES.COMMON.ESTIMATED);
        expect(result.data[1].name).toEqual(MockTranslate.ES.COMMON.REAL);
    });

    it('should get dashboard record maintenance - time', async () => {
        await firstValueFrom(translate.use('en'));
        const mockVehicle: VehicleModel[] = MockAppData.Vehicles;
        const mockOperation: OperationModel[] = MockAppData.Operations;
        const mockMaintenance: MaintenanceModel[] = MockAppData.Maintenances;
        const wear: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(mockOperation, mockVehicle, MockAppData.Configurations, mockMaintenance);
        const filter: SearchDashboardModel = new SearchDashboardModel({
            filterKmTime: FilterKmTimeEnum.TIME,
            doghnut: true,
            showLegend: true,
            showAxis: false
        });
        const measure: ISettingModel = settingService.getDistanceSelected(MockAppData.SystemConfigurations);
        const result: DashboardModel<IDashboardSerieModel> = service.getDashboardRecordMaintenances([1, 2], wear[0], filter, measure);
        expect(result.barPadding).toEqual(2);
        expect(result.colorScheme).toEqual({ domain: ['#D91CF6', '#1CEAF6','#5FF61C']});
        expect(result.gradient).toEqual(true);
        expect(result.isDoughnut).toEqual(true);
        expect(result.legendPosition).toEqual(LegendPosition.Right);
        expect(result.showDataLabel).toEqual(false);
        expect(result.showLabels).toEqual(true);
        expect(result.showLegend).toEqual(true);
        expect(result.showXAxis).toEqual(false);
        expect(result.showXAxisLabel).toEqual(false);
        expect(result.showYAxis).toEqual(false);
        expect(result.showYAxisLabel).toEqual(false);
        expect(result.xAxisLabel).toEqual(MockTranslate.EN.PAGE_CONFIGURATION.MAINTENANCES);
        expect(result.yAxisLabel).toEqual(MockTranslate.EN.COMMON.MONTHS);
        expect(result.legendTitle).toEqual(MockTranslate.EN.COMMON.OPERATIONS);
        expect(result.data.length).toEqual(2);
        expect(result.data[0].name).toEqual(MockTranslate.EN.COMMON.ESTIMATED);
        expect(result.data[1].name).toEqual(MockTranslate.EN.COMMON.REAL);
    });
});
