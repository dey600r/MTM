import { TestBed } from '@angular/core/testing';

// SERVICES
import { DashboardService } from './dashboard.service';

// CONFIGURATIONS
import { MockData, MockTranslate, SetupTest, SpyMockConfig } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { DashboardModel, SearchDashboardModel } from '@models/index';
import { FilterMonthsEnum, FilterKmTimeEnum } from '@utils/index';

fdescribe('DashboardService', () => {
    let service: DashboardService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(DashboardService);
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // VEHICLE EXPENSES

    it('should calculate other vehicle expenses dashboard - ES', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [], [],
            false, false, false, false, false, false, FilterKmTimeEnum.KM, false, false);
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
        await translate.use('en').toPromise();
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [], [],
            false, false, false, false, false, false, FilterKmTimeEnum.KM, false, false);
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
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [], [],
            false, false, false, false, false, true, FilterKmTimeEnum.KM, false, false);
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
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [], [],
            false, false, false, false, false, false, FilterKmTimeEnum.KM, true, false);
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
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [MockData.OperationTypes[6]], [],
            false, false, false, false, false, false, FilterKmTimeEnum.KM, false, false);
        const windows: any = service.getSizeWidthHeight(500, 900);
        const dashboard: DashboardModel = service.getDashboardModelVehicleExpenses(windows, MockData.Operations, filter);
        expect(dashboard.data.length).toEqual(0);
    });

    it('should calculate vehicle my expenses dashboard with filter operations type maintenance home', () => {
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [MockData.OperationTypes[0]], [],
            false, false, false, false, false, true, FilterKmTimeEnum.KM, false, false);
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
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [], [MockData.MaintenanceElements[4]],
            false, false, false, false, false, true, FilterKmTimeEnum.KM, false, false);
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
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [], [],
            false, false, false, false, false, true, FilterKmTimeEnum.KM, false, false);
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
        await translate.use('en').toPromise();
        const filter: SearchDashboardModel = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', [], [],
            false, false, false, false, false, true, FilterKmTimeEnum.KM, false, false);
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
});
