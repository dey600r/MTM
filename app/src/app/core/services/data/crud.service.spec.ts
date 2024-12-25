import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { CRUDService } from './crud.service';
import { DataService } from './data.service';
import { IconService } from '../common/index';

// CONFIGURATIONS
import { TranslateService } from '@ngx-translate/core';
import { MockDBData, SetupTest, SpyMockConfig } from '@testing/index';

// UTILS
import { ActionDBEnum, ConstantsTable } from '@utils/index';

describe('CRUDService', () => {
    let service: CRUDService;
    let dataService: DataService;
    let iconService: IconService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: [...SpyMockConfig.ProvidersServices, SpyMockConfig.ProviderStorageService, DataService, IconService]
        }).compileComponents();
        service = TestBed.inject(CRUDService);
        dataService = TestBed.inject(DataService);
        iconService = TestBed.inject(IconService);

        translate = TestBed.inject(TranslateService);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all tables', () => {
        const allTables = service.getAllTables();
        expect(allTables.length).toEqual(12);
        // MASTER
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_VEHICLE_TYPE));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_OPERATION_TYPE));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ));
        // DATA
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_VEHICLE));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_CONFIGURATION));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_OPERATION));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_MAINTENANCE));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT));
        // RELATION
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_CONFIG_MAINT));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT));
    });

    it('should get sync tables', () => {
        const allTables = service.getSyncTables();
        expect(allTables.length).toEqual(9);
        // DATA
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_VEHICLE));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_CONFIGURATION));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_OPERATION));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_MAINTENANCE));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT));
        // RELATION
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_CONFIG_MAINT));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL));
        expect(allTables.some(x => x === ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT));
    });

    it('should get data from storage', async () => {
        SpyMockConfig.SpyConfig.storageService.getData = jasmine.createSpy()
            .and.returnValues(MockDBData.VehicleTypes, MockDBData.OperationTypes);
        const data = await service.getDataFromStorage([
            ConstantsTable.TABLE_MTM_VEHICLE_TYPE,
            ConstantsTable.TABLE_MTM_OPERATION_TYPE
        ]);
        expect(data[ConstantsTable.TABLE_MTM_VEHICLE_TYPE]).not.toBeUndefined();
        expect(data[ConstantsTable.TABLE_MTM_VEHICLE_TYPE].length).toEqual(MockDBData.VehicleTypes.length);
        expect(data[ConstantsTable.TABLE_MTM_OPERATION_TYPE]).not.toBeUndefined();
        expect(data[ConstantsTable.TABLE_MTM_OPERATION_TYPE].length).toEqual(MockDBData.OperationTypes.length);
    });

    it('should get all data from storage', async () => {
        SpyMockConfig.SpyConfig.storageService.getData = jasmine.createSpy()
            .and.returnValues(MockDBData.VehicleTypes, MockDBData.OperationTypes);
        const data = await service.getAllDataFromStorage();
        expect(data[ConstantsTable.TABLE_MTM_VEHICLE_TYPE]).not.toBeUndefined();
        expect(data[ConstantsTable.TABLE_MTM_VEHICLE_TYPE].length).toEqual(MockDBData.VehicleTypes.length);
        expect(data[ConstantsTable.TABLE_MTM_OPERATION_TYPE]).not.toBeUndefined();
        expect(data[ConstantsTable.TABLE_MTM_OPERATION_TYPE].length).toEqual(MockDBData.OperationTypes.length);
    });

    it('should get data from storage and map on observable', async () => {
        SpyMockConfig.SpyConfig.storageService.getData = jasmine.createSpy()
            .and.returnValues(
                MockDBData.VehicleTypes, MockDBData.OperationTypes, MockDBData.MaintenanceFreqs,
                MockDBData.OperationMaintenancesElement, MockDBData.ConfigurationMaintenance,
                MockDBData.MaintenancesElementRel, MockDBData.SystemConfigurations,
                MockDBData.MaintenanceElements, MockDBData.Maintenances,
                MockDBData.Configurations, MockDBData.Vehicles, MockDBData.Operations
            );
        await service.loadAllTables();

        // MASTER
        const vehicleType = dataService.getVehicleTypeData();
        expect(vehicleType.length).toEqual(MockDBData.VehicleTypes.length);
        vehicleType.forEach((x, index) => {
            expect(x.code).toEqual(MockDBData.VehicleTypes[index].code);
            expect(x.description).toEqual(translate.instant(`DB.${MockDBData.VehicleTypes[index].description}`));
            expect(x.descriptionKey).toEqual(MockDBData.VehicleTypes[index].description);
            expect(x.icon).toEqual(iconService.getIconVehicle(MockDBData.VehicleTypes[index].code));
        });
        const operationType = dataService.getOperationTypeData();
        expect(operationType.length).toEqual(MockDBData.OperationTypes.length);
        operationType.forEach((x, index) => {
            expect(x.code).toEqual(MockDBData.OperationTypes[index].code);
            expect(x.description).toEqual(translate.instant(`DB.${MockDBData.OperationTypes[index].description}`));
            expect(x.descriptionKey).toEqual(MockDBData.OperationTypes[index].description);
            expect(x.icon).toEqual(iconService.getIconOperationType(MockDBData.OperationTypes[index].code));
        });
        const maintenanceFreq = dataService.getMaintenanceFreqData();
        expect(maintenanceFreq.length).toEqual(MockDBData.MaintenanceFreqs.length);
        maintenanceFreq.forEach((x, index) => {
            expect(x.code).toEqual(MockDBData.MaintenanceFreqs[index].code);
            expect(x.description).toEqual(translate.instant(`DB.${MockDBData.MaintenanceFreqs[index].description}`));
            expect(x.descriptionKey).toEqual(MockDBData.MaintenanceFreqs[index].description);
            expect(x.icon).toEqual(iconService.getIconMaintenance(MockDBData.MaintenanceFreqs[index].code));
        });

        // RELATION
        const opMaintElem = dataService.getOperationMaintenanceElementData();
        expect(opMaintElem.length).toEqual(MockDBData.OperationMaintenancesElement.length);
        opMaintElem.forEach((x, index) => {
            expect(x.idMaintenanceElement).toEqual(MockDBData.OperationMaintenancesElement[index].idMaintenanceElement);
            expect(x.idOperation).toEqual(MockDBData.OperationMaintenancesElement[index].idOperation);
            expect(x.price).toEqual(MockDBData.OperationMaintenancesElement[index].price);
        });
        const confMaint = dataService.getConfigurationMaintenanceData();
        expect(confMaint.length).toEqual(MockDBData.ConfigurationMaintenance.length);
        confMaint.forEach((x, index) => {
            expect(x.idConfiguration).toEqual(MockDBData.ConfigurationMaintenance[index].idConfiguration);
            expect(x.idMaintenance).toEqual(MockDBData.ConfigurationMaintenance[index].idMaintenance);
        });
        const maintElemRel = dataService.getMaintenanceElementRelData();
        expect(maintElemRel.length).toEqual(MockDBData.MaintenancesElementRel.length);
        maintElemRel.forEach((x, index) => {
            expect(x.idMaintenance).toEqual(MockDBData.MaintenancesElementRel[index].idMaintenance);
            expect(x.idMaintenanceElement).toEqual(MockDBData.MaintenancesElementRel[index].idMaintenanceElement);
        });

        // DATA
        const sysConf = dataService.getSystemConfigurationData();
        expect(sysConf.length).toEqual(MockDBData.SystemConfigurations.length);
        sysConf.forEach((x, index) => {
            expect(x.key).toEqual(MockDBData.SystemConfigurations[index].key);
            expect(x.value).toEqual(MockDBData.SystemConfigurations[index].value);
            expect(x.updated).toEqual(MockDBData.SystemConfigurations[index].updated);
        });
        const maintenanceElement = dataService.getMaintenanceElementData();
        expect(maintenanceElement.length).toEqual(MockDBData.MaintenanceElements.length);
        maintenanceElement.forEach((x, index) => {
            expect(x.name).toEqual((x.master ? translate.instant(`DB.${MockDBData.MaintenanceElements[index].name}`) : MockDBData.MaintenanceElements[index].name));
            expect(x.nameKey).toEqual(MockDBData.MaintenanceElements[index].name);
            expect(x.description).toEqual((x.master ? translate.instant(`DB.${MockDBData.MaintenanceElements[index].description}`) : MockDBData.MaintenanceElements[index].description));
            expect(x.descriptionKey).toEqual(MockDBData.MaintenanceElements[index].description);
            expect(x.icon).toEqual(iconService.getIconReplacement(MockDBData.MaintenanceElements[index].id));
            expect(x.master).toEqual(MockDBData.MaintenanceElements[index].master);
            let rel = MockDBData.OperationMaintenancesElement.find(y => y.id == x.idOperationRel);
            expect(x.price).toEqual((rel ? rel.price : 0));
        });
        const maintenance = dataService.getMaintenanceData();
        expect(maintenance.length).toEqual(MockDBData.Maintenances.length);
        maintenance.forEach((x, index) => {
            expect(x.description).toEqual((x.master ? translate.instant(`DB.${MockDBData.Maintenances[index].description}`) : MockDBData.Maintenances[index].description));
            expect(x.descriptionKey).toEqual(MockDBData.Maintenances[index].description);
            expect(x.fromKm).toEqual(MockDBData.Maintenances[index].fromKm);
            expect(x.toKm).toEqual(MockDBData.Maintenances[index].toKm);
            expect(x.init).toEqual(MockDBData.Maintenances[index].init);
            expect(x.wear).toEqual(MockDBData.Maintenances[index].wear);
            expect(x.km).toEqual(MockDBData.Maintenances[index].km);
            expect(x.time).toEqual(MockDBData.Maintenances[index].time);
            expect(x.master).toEqual(MockDBData.Maintenances[index].master);
            expect(x.maintenanceFreq.id).toEqual(MockDBData.Maintenances[index].idMaintenanceFrec);
            expect(x.listMaintenanceElement.length).toEqual(MockDBData.MaintenancesElementRel.filter(y => y.idMaintenance == x.id).length);
        });
        const configurations = dataService.getConfigurationsData();
        expect(configurations.length).toEqual(MockDBData.Configurations.length);
        configurations.forEach((x, index) => {
            expect(x.name).toEqual((x.master ? translate.instant(`DB.${MockDBData.Configurations[index].name}`) : MockDBData.Maintenances[index].description));
            expect(x.nameKey).toEqual(MockDBData.Configurations[index].name);
            expect(x.description).toEqual((x.master ? translate.instant(`DB.${MockDBData.Configurations[index].description}`) : MockDBData.Maintenances[index].description));
            expect(x.descriptionKey).toEqual(MockDBData.Configurations[index].description);
            expect(x.master).toEqual(MockDBData.Configurations[index].master);
            expect(x.listMaintenance.length).toEqual(MockDBData.ConfigurationMaintenance.filter(y => y.idConfiguration == x.id).length);
        });
        const vehicles = dataService.getVehiclesData();
        expect(vehicles.length).toEqual(MockDBData.Vehicles.length);
        vehicles.forEach((x, index) => {
            expect(x.brand).toEqual(MockDBData.Vehicles[index].brand);
            expect(x.model).toEqual(MockDBData.Vehicles[index].model);
            expect(x.dateKms).toEqual(MockDBData.Vehicles[index].dateKms);
            expect(x.datePurchase).toEqual(MockDBData.Vehicles[index].datePurchase);
            expect(x.km).toEqual(MockDBData.Vehicles[index].km);
            expect(x.kmsPerMonth).toEqual(MockDBData.Vehicles[index].kmsPerMonth);
            expect(x.vehicleType.id).toEqual(MockDBData.Vehicles[index].idVehicleType);
            expect(x.configuration.id).toEqual(MockDBData.Vehicles[index].idConfiguration);
            expect(x.$getName).toEqual(`${MockDBData.Vehicles[index].brand} ${MockDBData.Vehicles[index].model}`);
        });
        const operations = dataService.getOperationsData();
        expect(operations.length).toEqual(MockDBData.Operations.length);
        operations.forEach((x, index) => {
            expect(x.description).toEqual(MockDBData.Operations[index].description);
            expect(x.descriptionKey).toEqual('');
            expect(x.details).toEqual(MockDBData.Operations[index].details);
            expect(x.km).toEqual(MockDBData.Operations[index].km);
            expect(x.price).toEqual(MockDBData.Operations[index].price);
            expect(x.location).toEqual(MockDBData.Operations[index].location);
            expect(x.date).toEqual(MockDBData.Operations[index].date);
            expect(x.operationType.id).toEqual(MockDBData.Operations[index].idOperationType);
            expect(x.vehicle.id).toEqual(MockDBData.Operations[index].idVehicle);
            expect(x.owner).toEqual(MockDBData.Operations[index].owner);
            expect(x.listMaintenanceElement.length).toEqual(MockDBData.OperationMaintenancesElement.filter(y => y.idOperation == x.id).length);
        });
    });

    it('should update system configuration data on storage', async () => {
        SpyMockConfig.SpyConfig.storageService.getData = jasmine.createSpy().and.returnValue(MockDBData.SystemConfigurations);
        SpyMockConfig.SpyConfig.storageService.setData = jasmine.createSpy().and.returnValues(Promise.resolve(true));
        await service.loadAllTables();
        const data = await service.saveSystemConfiguration('test', 'testing', 15, '2024-12-04 10:00:00');
        expect(data.length).toEqual(1);
        expect(data[0]).toBeTruthy();
        expect(SpyMockConfig.SpyConfig.storageService.setData).toHaveBeenCalled();
    });

    it('should create data on storage', async () => {
        SpyMockConfig.SpyConfig.storageService.getData = jasmine.createSpy()
            .and.returnValues(
                MockDBData.VehicleTypes, MockDBData.OperationTypes, MockDBData.MaintenanceFreqs,
                MockDBData.OperationMaintenancesElement, MockDBData.ConfigurationMaintenance,
                MockDBData.MaintenancesElementRel, MockDBData.SystemConfigurations,
                MockDBData.MaintenanceElements, MockDBData.Maintenances,
                MockDBData.Configurations, MockDBData.Vehicles, MockDBData.Operations
            );
        SpyMockConfig.SpyConfig.storageService.setData = jasmine.createSpy().and.returnValues(Promise.resolve(true));
        await service.loadAllTables();
        const data = await service.saveDataStorage([{
            action: ActionDBEnum.CREATE,
            table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
            data: [{
                name: 'FRONT_WHEEL2',
                description: 'CHANGE_FRONT_WHEEL2',
                master: false
            }]
        }]);

        expect(data.length).toEqual(1);
        expect(data[0]).toBeTruthy();
        expect(SpyMockConfig.SpyConfig.storageService.setData).toHaveBeenCalled();
        const maintElem = dataService.getMaintenanceElementData();
        expect(maintElem.length).toEqual(MockDBData.MaintenanceElements.length + 1);
        expect(maintElem.some(x => x.name === 'FRONT_WHEEL2')).toBeTruthy();
        expect(maintElem.some(x => x.nameKey === 'FRONT_WHEEL2')).toBeTruthy();
        expect(maintElem.some(x => x.description === 'CHANGE_FRONT_WHEEL2')).toBeTruthy();
        expect(maintElem.some(x => x.descriptionKey === 'CHANGE_FRONT_WHEEL2')).toBeTruthy();
        expect(maintElem.some(x => x.id === maintElem.length && !x.master)).toBeTruthy();
    });

    it('should update data on storage', async () => {
        SpyMockConfig.SpyConfig.storageService.getData = jasmine.createSpy()
            .and.returnValues(
                MockDBData.VehicleTypes, MockDBData.OperationTypes, MockDBData.MaintenanceFreqs,
                MockDBData.OperationMaintenancesElement, MockDBData.ConfigurationMaintenance,
                MockDBData.MaintenancesElementRel, MockDBData.SystemConfigurations,
                MockDBData.MaintenanceElements, MockDBData.Maintenances,
                MockDBData.Configurations, MockDBData.Vehicles, MockDBData.Operations
            );
        SpyMockConfig.SpyConfig.storageService.setData = jasmine.createSpy().and.returnValues(Promise.resolve(true));
        await service.loadAllTables();
        let update = MockDBData.MaintenanceElements[9];
        update.name = 'BACK_BRAKE_FLUID2';
        const data = await service.saveDataStorage([{
            action: ActionDBEnum.UPDATE,
            table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
            data: [update]
        }]);

        expect(data.length).toEqual(1);
        expect(data[0]).toBeTruthy();
        expect(SpyMockConfig.SpyConfig.storageService.setData).toHaveBeenCalled();
        const maintElem = dataService.getMaintenanceElementData();
        expect(maintElem.length).toEqual(MockDBData.MaintenanceElements.length);
        expect(maintElem.some(x => x.name === 'BACK_BRAKE_FLUID2')).toBeTruthy();
        expect(maintElem.some(x => x.nameKey === 'BACK_BRAKE_FLUID2')).toBeTruthy();
    });

    it('should delete data on storage', async () => {
        SpyMockConfig.SpyConfig.storageService.getData = jasmine.createSpy()
            .and.returnValues(
                MockDBData.VehicleTypes, MockDBData.OperationTypes, MockDBData.MaintenanceFreqs,
                MockDBData.OperationMaintenancesElement, MockDBData.ConfigurationMaintenance,
                MockDBData.MaintenancesElementRel, MockDBData.SystemConfigurations,
                MockDBData.MaintenanceElements, MockDBData.Maintenances,
                MockDBData.Configurations, MockDBData.Vehicles, MockDBData.Operations
            );
        SpyMockConfig.SpyConfig.storageService.setData = jasmine.createSpy().and.returnValues(Promise.resolve(true));
        await service.loadAllTables();
        const data = await service.saveDataStorage([{
            action: ActionDBEnum.DELETE,
            table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
            data: [MockDBData.MaintenanceElements[9]]
        }]);

        expect(data.length).toEqual(1);
        expect(data[0]).toBeTruthy();
        expect(SpyMockConfig.SpyConfig.storageService.setData).toHaveBeenCalled();
        const maintElem = dataService.getMaintenanceElementData();
        expect(maintElem.length).toEqual(MockDBData.MaintenanceElements.length - 1);
    });
});
