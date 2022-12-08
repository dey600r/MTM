import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { DashboardService } from './dashboard.service';

// CONFIGURATIONS
import { MockData, MockTranslate, SetupTest, SpyMockConfig } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { DashboardModel, SearchDashboardModel } from '@models/index';
import { FilterMonthsEnum, Constants, PageEnum, FilterKmTimeEnum } from '@utils/index';

describe('DashboardService', () => {
    let service: DashboardService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(DashboardService);
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
        const dashboard: DashboardModel = service.getDashboardModelVehicleExpenses(windows, MockData.Operations, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toEqual(2);
        expect(dashboard.legendTitle).toEqual(MockTranslate.ES.COMMON.VEHICLES);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.ES.COMMON.VEHICLES);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.ES.COMMON.EXPENSE);
        const vehicle1: any = dashboard.data.find(x => x.id === MockData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(8155.35);
        expect(vehicle1.name).toEqual(`${MockData.Vehicles[0].brand}-${MockData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(352);
        expect(vehicle2.name).toEqual(`${MockData.Vehicles[1].brand}-${MockData.Vehicles[1].model}`);
    });

    it('should calculate other vehicle expenses dashboard - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: false,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel = service.getDashboardModelVehicleExpenses(windows, MockData.Operations, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toEqual(2);
        expect(dashboard.legendTitle).toEqual(MockTranslate.EN.COMMON.VEHICLES);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.EN.COMMON.VEHICLES);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.EN.COMMON.EXPENSE);
        const vehicle1: any = dashboard.data.find(x => x.id === MockData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(8155.35);
        expect(vehicle1.name).toEqual(`${MockData.Vehicles[0].brand}-${MockData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(352);
        expect(vehicle2.name).toEqual(`${MockData.Vehicles[1].brand}-${MockData.Vehicles[1].model}`);
    });

    it('should calculate my vehicle expenses dashboard', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: true,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel = service.getDashboardModelVehicleExpenses(windows, MockData.Operations, filter);
        expect(dashboard.data.length).toEqual(2);
        const vehicle1: any = dashboard.data.find(x => x.id === MockData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(1955);
        expect(vehicle1.name).toEqual(`${MockData.Vehicles[0].brand}-${MockData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(5007);
        expect(vehicle2.name).toEqual(`${MockData.Vehicles[1].brand}-${MockData.Vehicles[1].model}`);
    });

    it('should calculate vehicle expenses per km dashboard', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: false,
            expensePerKm: true,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel = service.getDashboardModelVehicleExpenses(windows, MockData.Operations, filter);
        expect(dashboard.data.length).toEqual(2);
        const vehicle1: any = dashboard.data.find(x => x.id === MockData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(0.08);
        expect(vehicle1.name).toEqual(`${MockData.Vehicles[0].brand}-${MockData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(0);
        expect(vehicle2.name).toEqual(`${MockData.Vehicles[1].brand}-${MockData.Vehicles[1].model}`);
    });

    it('should calculate vehicle other expenses dashboard with filter operations type maintenance home', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            searchOperationType: [MockData.OperationTypes[6]],
            showMyData: false,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel = service.getDashboardModelVehicleExpenses(windows, MockData.Operations, filter);
        expect(dashboard.data.length).toEqual(0);
    });

    it('should calculate vehicle my expenses dashboard with filter operations type maintenance home', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            searchOperationType: [MockData.OperationTypes[0]],
            showMyData: true,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel = service.getDashboardModelVehicleExpenses(windows, MockData.Operations, filter);
        expect(dashboard.data.length).toEqual(2);
        const vehicle1: any = dashboard.data.find(x => x.id === MockData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(417);
        expect(vehicle1.name).toEqual(`${MockData.Vehicles[0].brand}-${MockData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(1225);
        expect(vehicle2.name).toEqual(`${MockData.Vehicles[1].brand}-${MockData.Vehicles[1].model}`);
    });

    it('should calculate vehicle my expenses dashboard with filter replacement oil filter', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            searchMaintenanceElement: [MockData.MaintenanceElements[4]],
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel = service.getDashboardModelVehicleExpenses(windows, MockData.Operations, filter);
        expect(dashboard.data.length).toEqual(2);
        const vehicle1: any = dashboard.data.find(x => x.id === MockData.Vehicles[0].id);
        expect(vehicle1.value).toEqual(1301);
        expect(vehicle1.name).toEqual(`${MockData.Vehicles[0].brand}-${MockData.Vehicles[0].model}`);
        const vehicle2: any = dashboard.data.find(x => x.id === MockData.Vehicles[1].id);
        expect(vehicle2.value).toEqual(452);
        expect(vehicle2.name).toEqual(`${MockData.Vehicles[1].brand}-${MockData.Vehicles[1].model}`);
    });

    // VEHICLE PER MONTH EXPENSES

    it('should calculate other vehicle per month expenses dashboard - ES', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const operationVehicle = MockData.Operations.filter(x => x.vehicle.id === MockData.Vehicles[0].id);
        const dashboard: DashboardModel = service.getDashboardModelVehiclePerTime(windows, operationVehicle, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toBeGreaterThanOrEqual(3);
        expect(dashboard.legendTitle).toEqual(MockTranslate.ES.COMMON.DATE);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.ES.COMMON.DATE);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.ES.COMMON.EXPENSE);
        expect(dashboard.data[0].name).toEqual('02/2016');
        expect(dashboard.data[0].value).toEqual(1012);
        expect(dashboard.data[1].name).toEqual('08/2017');
        expect(dashboard.data[1].value).toEqual(526);
        expect(dashboard.data[2].name).toEqual('03/2018');
        expect(dashboard.data[2].value).toEqual(417);
    });

    it('should calculate other vehicle per month expenses dashboard - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const operationVehicle = MockData.Operations.filter(x => x.vehicle.id === MockData.Vehicles[0].id);
        const dashboard: DashboardModel = service.getDashboardModelVehiclePerTime(windows, operationVehicle, filter);
        expect(dashboard.data.length).toBeGreaterThanOrEqual(3);
        expect(dashboard.legendTitle).toEqual(MockTranslate.EN.COMMON.DATE);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.EN.COMMON.DATE);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.EN.COMMON.EXPENSE);
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
        const dashboard: DashboardModel = service.getDashboardModelOpTypeExpenses(windows, MockData.Operations, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toEqual(2);
        expect(dashboard.legendTitle).toEqual(MockTranslate.ES.COMMON.OPERATION_TYPE);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.ES.COMMON.OPERATION_TYPE);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.ES.COMMON.EXPENSE);
        const opt1: any = dashboard.data.find(x => x.id === MockData.OperationTypes[5].id);
        expect(opt1.value).toEqual(8155.35);
        expect(opt1.name).toEqual(MockData.OperationTypes[5].description);
        const vehicle2: any = dashboard.data.find(x => x.id === MockData.OperationTypes[0].id);
        expect(vehicle2.value).toEqual(352);
        expect(vehicle2.name).toEqual(MockData.OperationTypes[0].description);
    });

    it('should calculate operation type expenses dashboard - EN', async () => {
        await firstValueFrom(translate.use('en'));
        const filter: SearchDashboardModel = new SearchDashboardModel({
            showMyData: true,
            showStrict: false
        });
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel = service.getDashboardModelOpTypeExpenses(windows, MockData.Operations, filter);
        expect(dashboard.isDoughnut).toBeFalsy();
        expect(dashboard.showLegend).toBeFalsy();
        expect(dashboard.data.length).toEqual(3);
        expect(dashboard.legendTitle).toEqual(MockTranslate.EN.COMMON.OPERATION_TYPE);
        expect(dashboard.xAxisLabel).toEqual(MockTranslate.EN.COMMON.OPERATION_TYPE);
        expect(dashboard.yAxisLabel).toEqual(MockTranslate.EN.COMMON.EXPENSE);
        const opt1: any = dashboard.data.find(x => x.id === MockData.OperationTypes[5].id);
        expect(opt1.value).toEqual(3500);
        expect(opt1.name).toEqual(MockData.OperationTypes[5].description);
        const opt2: any = dashboard.data.find(x => x.id === MockData.OperationTypes[0].id);
        expect(opt2.value).toEqual(1642);
        expect(opt2.name).toEqual(MockData.OperationTypes[0].description);
        const opt3: any = dashboard.data.find(x => x.id === MockData.OperationTypes[6].id);
        expect(opt3.value).toEqual(1820);
        expect(opt3.name).toEqual(MockData.OperationTypes[6].description);
    });

    it('should prefilter operations', () => {
        const op1 = service.getPrefilterOperation(MockData.Operations, new SearchDashboardModel({
            searchOperationType: [MockData.OperationTypes[0]],
            showStrict: false
        }));
        expect(op1.some(x => x.operationType.id !== MockData.OperationTypes[0].id)).toBeFalsy();
        
        const op2 = service.getPrefilterOperation(MockData.Operations, new SearchDashboardModel({
            searchMaintenanceElement: [MockData.MaintenanceElements[0]],
            showStrict: false
        }));
        expect(op2.every(x => x.listMaintenanceElement.some(y => y.id === MockData.MaintenanceElements[0].id))).toBeTruthy();
        
        const op3 = service.getPrefilterOperation(MockData.Operations, new SearchDashboardModel());
        expect(op3.some(x => x.owner !== null && x.owner !== '' && x.owner.toLowerCase() !== Constants.OWNER_ME &&
            x.owner.toLowerCase() !== Constants.OWNER_YO)).toBeFalsy();
    });

    it('should refresh search dashboard operation', () => {
        service.setSearchOperation(MockData.OperationTypes, MockData.MaintenanceElements, 'hola');
        expect(service.behaviourSearchOperation.value.searchOperationType).toEqual(MockData.OperationTypes);
        expect(service.behaviourSearchOperation.value.searchMaintenanceElement).toEqual(MockData.MaintenanceElements);
        expect(service.behaviourSearchOperation.value.searchText).toEqual('hola');
    });

    it('should refresh search dashboard vehicles', () => {
        service.setSearchConfiguration(MockData.Vehicles);
        expect(service.behaviourSearchOperation.value.searchVehicle).toEqual(MockData.Vehicles);
    });

    it('should is empty search dashboard operation', () => {
        service.setSearchOperation();
        expect(service.isEmptySearchDashboard(PageEnum.OPERATION)).toBeTruthy();
    });
    
    it('should is not empty search dashboard operation', () => {
        service.setSearchOperation([], [], 'hola');
        expect(service.isEmptySearchDashboard(PageEnum.OPERATION)).toBeFalse();
        service.setSearchOperation([], [MockData.MaintenanceElements[0]]);
        expect(service.isEmptySearchDashboard(PageEnum.OPERATION)).toBeFalse();
        service.setSearchOperation([MockData.OperationTypes[0]]);
        expect(service.isEmptySearchDashboard(PageEnum.OPERATION)).toBeFalse();
    });
    
    it('should is empty search dashboard configuration', () => {
        service.setSearchConfiguration();
        expect(service.isEmptySearchDashboard(PageEnum.CONFIGURATION)).toBeTruthy();
    });
    
    it('should is not empty search dashboard configuration', () => {
        service.setSearchConfiguration([MockData.Vehicles[0]], 'hola');
        expect(service.isEmptySearchDashboard(PageEnum.CONFIGURATION)).toBeFalse();
        service.setSearchConfiguration([], 'hola');
        expect(service.isEmptySearchDashboard(PageEnum.CONFIGURATION)).toBeFalse();
        service.setSearchConfiguration([MockData.Vehicles[0]]);
        expect(service.isEmptySearchDashboard(PageEnum.CONFIGURATION)).toBeFalse();
    });

    it('should is empty search dashboard operation/vehicle dashboard', () => {
        service.setSearchDashboard(new SearchDashboardModel());
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeTruthy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeTruthy();
    });

    it('should is not empty search dashboard operation/vehicle dashboard', () => {
        service.setSearchDashboard(new SearchDashboardModel({ searchOperationType: [MockData.OperationTypes[0]] }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ searchMaintenanceElement: [MockData.MaintenanceElements[0]] }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_VEHICLE)).toBeFalsy();
        service.setSearchDashboard(new SearchDashboardModel({ showPerMont: FilterMonthsEnum.YEAR }));
        expect(service.isEmptySearchDashboard(PageEnum.MODAL_DASHBOARD_OPERATION)).toBeFalsy();
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
});