import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// SERVICES
import { HomeService } from './home.service';
import { CalendarService, UtilsService } from '../common';

// CONFIGURATIONS
import { MockAppData, MockTranslate, SetupTest, SpyMockConfig } from '@testing/index';

// MODELS
import { WearVehicleProgressBarViewModel, WearMaintenanceProgressBarViewModel, VehicleModel, OperationModel, MaintenanceModel, MaintenanceElementModel, ConfigurationModel, WearNotificationReplacementProgressBarViewModel, WearReplacementProgressBarViewModel } from '@models/index';

// UTILS
import { ConstantsColumns, FailurePredictionTypeEnum, WarningWearEnum } from '@utils/index';

describe('HomeService', () => {
    let service: HomeService;
    let calendarService: CalendarService;
    let utilsService: UtilsService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(HomeService);
        calendarService = TestBed.inject(CalendarService);
        utilsService = TestBed.inject(UtilsService);
        translate = TestBed.inject(TranslateService);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /** HOME NOTIFICATIONS */

    it('should calculate wear notification replacement to vehicle', () => {
        const mockVehicle: VehicleModel[] = MockAppData.Vehicles;
        const mockOperation: OperationModel[] = MockAppData.Operations;
        const mockMaintenance: MaintenanceModel[] = MockAppData.Maintenances;
        const mockMaintenanceElement: MaintenanceElementModel[] = MockAppData.MaintenanceElements;
        const result: WearVehicleProgressBarViewModel[] = service.getWearReplacementToVehicle(mockOperation, mockVehicle, MockAppData.Configurations, mockMaintenance);
        expect(result.length).toEqual(mockVehicle.filter(x => x.active).length);
        result.forEach(v => {
            const vehicle: VehicleModel = mockVehicle.find(y => y.id === v.idVehicle);
            const diffV = calendarService.monthDiff(new Date(vehicle.datePurchase), new Date());

            // VALIDATE VEHICLE
            validateWearVehicle(v, vehicle);
            v.listWearMaintenance.forEach(m => {
                // VALIDATE MAINTENANCE
                const maintenance: MaintenanceModel = mockMaintenance.find(x => x.id === m.idMaintenance);
                validateWearMaintenance(m, maintenance);
                m.listWearReplacement.forEach(r => {
                    // VALIDATE REPLACEMENT
                    const maintenanceElement: MaintenanceElementModel = mockMaintenanceElement.find(x => x.id === r.idMaintenanceElement);
                    validateWearMaintenanceElement(r, maintenanceElement);
                    expect(r.kmAcumulateMaintenance).toEqual(0);
                    expect(r.timeAcumulateMaintenance).toEqual(0);
                    expect(r.calculateKms).toEqual(r.kmOperation - vehicle.kmEstimated + m.kmMaintenance);
                    expect(r.percentKms).toEqual((r.calculateKms >= 0 ? (m.kmMaintenance - r.calculateKms) / m.kmMaintenance : 1));
                    if (m.timeMaintenance === null || m.timeMaintenance === 0) {
                        expect(r.percentMonths).toEqual(0);
                    } else {
                        expect(r.percentMonths).toEqual((r.calculateMonths >= 0 ? (m.timeMaintenance - r.calculateMonths) / m.timeMaintenance : 1));
                    }
                    
                    if (m.timeMaintenance === null) {
                        expect(r.calculateMonths).toEqual(0);
                    } else if(r.kmOperation === null) {
                        expect(r.calculateMonths).toEqual(m.timeMaintenance - diffV);
                    } else {
                        const op: OperationModel = mockOperation.find(o => o.id === r.idOperation);
                        expect(r.descriptionOperation).toEqual(op.description);
                        const diffOp = calendarService.monthDiff(new Date(vehicle.datePurchase), new Date(r.dateOperation));
                        expect(r.calculateMonths).toEqual(diffOp - diffV + m.timeMaintenance);
                        const sum: number = utilsService.sum(op.listMaintenanceElement, ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE);
                        expect(r.priceOperation).toEqual(sum + op.price);
                        expect(r.kmOperation).toEqual(op.km);
                    }
                });
            });
        });
    });

    it('should calculate wear notification priority', () => {
        let result: WarningWearEnum = service.calculateWearNotificationPriority(WarningWearEnum.SUCCESS, WarningWearEnum.SUCCESS);
        expect(result).toEqual(WarningWearEnum.SUCCESS);
        result = service.calculateWearNotificationPriority(WarningWearEnum.SUCCESS, WarningWearEnum.WARNING);
        expect(result).toEqual(WarningWearEnum.WARNING);
        result = service.calculateWearNotificationPriority(WarningWearEnum.SUCCESS, WarningWearEnum.DANGER);
        expect(result).toEqual(WarningWearEnum.DANGER);
        result = service.calculateWearNotificationPriority(WarningWearEnum.SUCCESS, WarningWearEnum.SKULL);
        expect(result).toEqual(WarningWearEnum.SKULL);
        result = service.calculateWearNotificationPriority(WarningWearEnum.WARNING, WarningWearEnum.WARNING);
        expect(result).toEqual(WarningWearEnum.WARNING);
        result = service.calculateWearNotificationPriority(WarningWearEnum.WARNING, WarningWearEnum.DANGER);
        expect(result).toEqual(WarningWearEnum.DANGER);
        result = service.calculateWearNotificationPriority(WarningWearEnum.WARNING, WarningWearEnum.SKULL);
        expect(result).toEqual(WarningWearEnum.SKULL);
        result = service.calculateWearNotificationPriority(WarningWearEnum.DANGER, WarningWearEnum.DANGER);
        expect(result).toEqual(WarningWearEnum.DANGER);
        result = service.calculateWearNotificationPriority(WarningWearEnum.DANGER, WarningWearEnum.SKULL);
        expect(result).toEqual(WarningWearEnum.SKULL);
        result = service.calculateWearNotificationPriority(WarningWearEnum.SKULL, WarningWearEnum.SKULL);
        expect(result).toEqual(WarningWearEnum.SKULL);
    });

    it('should order maintenance wear', () => {
        const mockVehicle: VehicleModel = MockAppData.Vehicles[0];
        const mockOperation: OperationModel[] = MockAppData.Operations.filter(x => x.vehicle.id === mockVehicle.id);
        const mockConfiguration: ConfigurationModel = MockAppData.Configurations.find(x => x.id === mockVehicle.configuration.id);
        const mockMaintenance: MaintenanceModel[] = mockConfiguration.listMaintenance.filter(x => MockAppData.Maintenances.some(y => y.id === x.id));
        const result: WearVehicleProgressBarViewModel[] = service.getWearReplacementToVehicle(mockOperation, [mockVehicle], [mockConfiguration], mockMaintenance);
        expect(result.length).toEqual(1);
        let listOrder: WearMaintenanceProgressBarViewModel[] = service.orderMaintenanceWear(result[0].listWearMaintenance);
        expect(listOrder[0].idMaintenance).toEqual(2);
        expect(listOrder[1].idMaintenance).toEqual(5);
        expect(listOrder[2].idMaintenance).toEqual(6);
    });

    it('should calculate percent vehicle', () => {
        const mockVehicle: VehicleModel = MockAppData.Vehicles[0];
        const mockOperation: OperationModel[] = MockAppData.Operations.filter(x => x.vehicle.id === mockVehicle.id);
        const mockConfiguration: ConfigurationModel = MockAppData.Configurations.find(x => x.id === mockVehicle.configuration.id);
        const mockMaintenance: MaintenanceModel[] = mockConfiguration.listMaintenance.filter(x => MockAppData.Maintenances.some(y => y.id === x.id));
        const result: WearVehicleProgressBarViewModel[] = service.getWearReplacementToVehicle(mockOperation, [mockVehicle], [mockConfiguration], mockMaintenance);
        expect(result.length).toEqual(1);
        let warning: WarningWearEnum = service.getPercentVehicle(result[0].listWearMaintenance, mockVehicle.km);
        expect(warning).toEqual(WarningWearEnum.DANGER);
    });

    it('should validate km into maintenance', () => {
        expect(service.validateKmIntoMaintenance(15, 10, 20)).toBeTruthy();
        expect(service.validateKmIntoMaintenance(9, 10, 20)).toBeFalsy();
        expect(service.validateKmIntoMaintenance(9, 10, null)).toBeFalsy();
        expect(service.validateKmIntoMaintenance(15, 10, null)).toBeTruthy();
    });

    it('should get warning wear', () => {
        expect(service.getWarningWear(1)).toEqual(WarningWearEnum.WARNING);
        expect(service.getWarningWear(0.5)).toEqual(WarningWearEnum.SUCCESS);
    });

    it('should get warning wear normal', () => {
        // WEAR
        expect(service.getWarningWearNormal(true, 1, 1000, 900, 100)).toEqual(WarningWearEnum.WARNING);
        expect(service.getWarningWearNormal(true, 0.5, 1000, 900, 100)).toEqual(WarningWearEnum.SUCCESS);
        // NOT WEAR
        expect(service.getWarningWearNormal(false, 0.8, 1000, 900, 100)).toEqual(WarningWearEnum.WARNING);
        expect(service.getWarningWearNormal(false, 1, 1000, 900, 100)).toEqual(WarningWearEnum.DANGER);
        expect(service.getWarningWearNormal(false, 0.5, 1000, 900, 100)).toEqual(WarningWearEnum.SUCCESS);
        // NOT WEAR - NOT OPERATION
        expect(service.getWarningWearNormal(false, 0.5, -1, null, 100)).toEqual(WarningWearEnum.SKULL);
        expect(service.getWarningWearNormal(false, 0.5, -1000, 900, 100)).toEqual(WarningWearEnum.SKULL);
    });

    it('should calculate km vehicle replacement', () => {
        expect(service.calculateKmVehicleReplacement(100, 90, 10)).toEqual(0);
        expect(service.calculateKmVehicleReplacement(100, 75, 5)).toEqual(-20);
        expect(service.calculateKmVehicleReplacement(60, 75, 5)).toEqual(20);
    });

    it('should calculate month vehicle replacement', () => {
        const date: Date = new Date(2022, 10, 1);
        const diff: number = calendarService.monthDiff(new Date(date), new Date());
        expect(service.calculateMontVehicleReplacement(100, date)).toEqual(100 - diff);
        expect(service.calculateMontVehicleReplacement(null, date)).toEqual(0);
    });

    it('should calculate percent', () => {
        expect(service.calculatePercent(100, 60)).toEqual(0.4);
        expect(service.calculatePercent(0, 50)).toEqual(0);
        expect(service.calculatePercent(null, 50)).toEqual(0);
        expect(service.calculatePercent(100, -50)).toEqual(1);
    });

    it('should calculate percent negative', () => {
        expect(service.calculatePercentNegative(100, 60)).toEqual(0.6);
        expect(service.calculatePercentNegative(0, 50)).toEqual(0);
        expect(service.calculatePercentNegative(null, 50)).toEqual(0);
        expect(service.calculatePercentNegative(100, -50)).toEqual(1);
    });

    it('should calculate months', () => {
        expect(service.getDateCalculateMonths(11)).toEqual(`11 ${MockTranslate.ES.COMMON.MONTHS}`);
        expect(service.getDateCalculateMonths(-11)).toEqual(`11 ${MockTranslate.ES.COMMON.MONTHS}`);
        expect(service.getDateCalculateMonths(1)).toEqual(`1 ${MockTranslate.ES.COMMON.MONTH}`);
        expect(service.getDateCalculateMonths(-1)).toEqual(`1 ${MockTranslate.ES.COMMON.MONTH}`);
        expect(service.getDateCalculateMonths(36)).toEqual(`3 ${MockTranslate.ES.COMMON.YEARS}`);
        expect(service.getDateCalculateMonths(-36)).toEqual(`3 ${MockTranslate.ES.COMMON.YEARS}`);
        expect(service.getDateCalculateMonths(12)).toEqual(`1 ${MockTranslate.ES.COMMON.YEAR}`);
        expect(service.getDateCalculateMonths(-12)).toEqual(`1 ${MockTranslate.ES.COMMON.YEAR}`);
    });

    /** INFO NOTIFICATIONS */

    it('should calculate wear replacement to info notifications', () => {
        const mockVehicle: VehicleModel = MockAppData.Vehicles[0];
        const mockOperation: OperationModel[] = MockAppData.Operations.filter(x => x.vehicle.id === mockVehicle.id);
        const mockConfiguration: ConfigurationModel = MockAppData.Configurations.find(x => x.id === mockVehicle.configuration.id);
        const mockMaintenance: MaintenanceModel[] = mockConfiguration.listMaintenance.filter(x => MockAppData.Maintenances.some(y => y.id === x.id));
        const result: WearVehicleProgressBarViewModel[] = service.getWearReplacementToVehicle(mockOperation, [mockVehicle], [mockConfiguration], mockMaintenance);
        expect(result.length).toEqual(1);
        
        let info: WearVehicleProgressBarViewModel = service.getWearReplacement(true, result[0], mockOperation);
        const diffDateToday: number = calendarService.monthDiff(info.datePurchaseVehicle, new Date());
        validateWearVehicle(info, mockVehicle);
        let timeAccumulate: number = 0;
        info.listWearMaintenance.forEach(m => {
            const maintenance: MaintenanceModel = mockMaintenance.find(x => x.id === m.idMaintenance);
            validateWearMaintenance(m, maintenance);
            validateWearMaintenanceElement(m.listWearReplacement[0], MockAppData.MaintenanceElements.find(x => x.id === m.listWearReplacement[0].idMaintenanceElement));
            expect(m.listWearReplacement.length).toEqual(1);
            if (m.listWearReplacement[0].idOperation === null) {
                expect(m.listWearReplacement[0].calculateKms).toEqual((m.kmMaintenance / 2) * -1);
                expect(m.listWearReplacement[0].calculateMonths).toEqual((timeAccumulate + m.timeMaintenance) - diffDateToday);
                expect(m.listWearReplacement[0].timeAcumulateMaintenance).toEqual((timeAccumulate + m.timeMaintenance));
            } else {
                expect(m.listWearReplacement[0].calculateKms).toEqual(m.listWearReplacement[0].kmAcumulateMaintenance - m.listWearReplacement[0].kmOperation);
                const diff: number =calendarService.monthDiff(info.datePurchaseVehicle, new Date(m.listWearReplacement[0].dateOperation));
                expect(m.listWearReplacement[0].calculateMonths).toEqual((timeAccumulate + m.timeMaintenance) - diff);
                expect(m.listWearReplacement[0].timeAcumulateMaintenance).toEqual((timeAccumulate + m.timeMaintenance));
            }
            timeAccumulate += (m.timeMaintenance === null ? 0 : m.timeMaintenance);
        });
    });

    it('should calculate init KM', () => {
        expect(service.getInitKm(new WearMaintenanceProgressBarViewModel({ kmMaintenance: 10 }))).toEqual(0);
        expect(service.getInitKm(new WearMaintenanceProgressBarViewModel({ kmMaintenance: 10, fromKmMaintenance: 1 }))).toEqual(-9);
    });

    it('should calculate init KM', () => {
        expect(service.getInitTime(new WearMaintenanceProgressBarViewModel({ kmMaintenance: 10 }), [], null, 10)).toEqual(10);
        expect(service.getInitTime(new WearMaintenanceProgressBarViewModel({ kmMaintenance: 10, fromKmMaintenance: 1 }), [], new Date(), 0)).toEqual(0);
    });

    it('should calculate init KM', () => {
        const mockVehicle: VehicleModel = MockAppData.Vehicles[0];
        const mockOperation: OperationModel[] = MockAppData.Operations.filter(x => x.vehicle.id === mockVehicle.id);
        const mockConfiguration: ConfigurationModel = MockAppData.Configurations.find(x => x.id === mockVehicle.configuration.id);
        const mockMaintenance: MaintenanceModel[] = mockConfiguration.listMaintenance.filter(x => MockAppData.Maintenances.some(y => y.id === x.id));
        const result: WearVehicleProgressBarViewModel[] = service.getWearReplacementToVehicle(mockOperation, [mockVehicle], [mockConfiguration], mockMaintenance);
        expect(result.length).toEqual(1);
        const operations: OperationModel[] = service.getOperationsFilteredKmTime(mockOperation, result[0].listWearMaintenance, 1000, 20000, 2000, null, mockVehicle.datePurchase);
        expect(operations.length).toEqual(1);
        expect(operations[0].id).toEqual(3);
    });

    it('should get operation near km time', () => {
        let result: OperationModel = service.getOperationsNearKmTime(MockAppData.Operations, new Date(), 50000, 156);
        expect(result.id).toEqual(7);
        result = service.getOperationsNearKmTime(MockAppData.Operations, MockAppData.VehiclesAux[0].datePurchase, 70000, 120);
        expect(result.id).toEqual(6);
        result = service.getOperationsNearKmTime(MockAppData.Operations, MockAppData.VehiclesAux[2].datePurchase, 20000, 0);
        expect(result.id).toEqual(5);
    });

    it('should get warning record', () => {
        expect(service.getWarningRecord(true, 1, 0, 100)).toEqual(WarningWearEnum.SUCCESS);
        expect(service.getWarningRecord(true, 1, -0.5, 100)).toEqual(WarningWearEnum.WARNING);
        expect(service.getWarningRecord(true, 0, 1, 100)).toEqual(WarningWearEnum.WARNING);
        expect(service.getWarningRecord(true, -1, 1, 100)).toEqual(WarningWearEnum.DANGER);
        expect(service.getWarningRecord(true, -1, 1, null)).toEqual(WarningWearEnum.SKULL);
        expect(service.getWarningRecord(false, 1, 0.5, 100)).toEqual(WarningWearEnum.SUCCESS);
        expect(service.getWarningRecord(false, 1, 0.8, 100)).toEqual(WarningWearEnum.WARNING);
        expect(service.getWarningRecord(false, 0, 1, 100)).toEqual(WarningWearEnum.WARNING);
        expect(service.getWarningRecord(false, -1, 1, 100)).toEqual(WarningWearEnum.DANGER);
        expect(service.getWarningRecord(false, -1, 0, 100)).toEqual(WarningWearEnum.DANGER);
        expect(service.getWarningRecord(false, -1, 1, null)).toEqual(WarningWearEnum.SKULL);
    });

    /** VALIDATIONS WEAR */

    function validateWearVehicle(data: WearVehicleProgressBarViewModel, vehicle: VehicleModel) {
        expect(data.nameVehicle).toEqual(`${vehicle.brand} ${vehicle.model}`);
        expect(data.kmVehicle).toEqual(vehicle.km);
        expect(data.kmEstimatedVehicle).toEqual(vehicle.kmEstimated);
        expect(data.kmsPerMonthVehicle).toEqual(vehicle.kmsPerMonth);
        expect(data.nameConfiguration).toEqual(vehicle.configuration.name);
        expect(data.dateKmsVehicle).toEqual(vehicle.dateKms);
        expect(data.datePurchaseVehicle).toEqual(vehicle.datePurchase);
        expect(data.typeVehicle).toEqual(vehicle.vehicleType.code);
        expect(data.iconVehicle).toEqual(vehicle.vehicleType.icon);
    }

    function validateWearMaintenance(data: WearMaintenanceProgressBarViewModel, maintenance: MaintenanceModel) {
        expect(data.descriptionMaintenance).toEqual(maintenance.description);
        expect(data.kmMaintenance).toEqual(maintenance.km);
        expect(data.timeMaintenance).toEqual(maintenance.time);
        expect(data.iconMaintenance).toEqual(maintenance.maintenanceFreq.icon);
        expect(data.wearMaintenance).toEqual(maintenance.wear);
        expect(data.fromKmMaintenance).toEqual(maintenance.fromKm);
        expect(data.toKmMaintenance).toEqual(maintenance.toKm);
    }

    function validateWearMaintenanceElement(data: WearReplacementProgressBarViewModel, maintenanceElement: MaintenanceElementModel) {
        expect(data.idMaintenanceElement).toEqual(maintenanceElement.id);
        expect(data.nameMaintenanceElement).toEqual(maintenanceElement.name);
        expect(data.iconMaintenanceElement).toEqual(maintenanceElement.icon);
    }

    /** HELP EVENT FAILURES */

    it('should calculate event failure from operations', () => {
        const vehicle = MockAppData.Vehicles[0];
        const operations = MockAppData.Operations.filter(x => x.vehicle.id === vehicle.id);
        const events = service.calculateEventFailurePrediction(operations);
        expect(events.map(x => x.events.length).reduce((x, n) => x + n, 0)).toEqual(operations.map(x => x.listMaintenanceElement.length).reduce((x, n) => x + n, 0));
        expect(events[0].idVehicle).toEqual(vehicle.id);
        expect(events[0].brandVehicle).toEqual(vehicle.brand);
        expect(events[0].modelVehicle).toEqual(vehicle.model);
        expect(events[0].events[0].tkm).toEqual(55000);
        expect(events[0].events[0].ttime).toEqual(117);
        expect(events[0].events[0].cost).toEqual(760);
        expect(events[0].events[0].type).toEqual(FailurePredictionTypeEnum.MAINT);
        expect(events[0].events[1].tkm).toEqual(12000);
        expect(events[0].events[1].ttime).toEqual(19);
        expect(events[0].events[1].cost).toEqual(443);
        expect(events[0].events[1].type).toEqual(FailurePredictionTypeEnum.MAINT);
        expect(events.find(x => x.idReplacement === MockAppData.MaintenanceElements[4].id).events.some(x => x.type === FailurePredictionTypeEnum.FAIL)). toBeTruthy();    });
});