import { TestBed } from '@angular/core/testing';

// SERVICES
import { MapService } from './map.service';

// MODELS
import { ConfigurationModel, IConfigurationMaintenanceStorageModel, IConfigurationStorageModel, IMaintenanceElementRelStorageModel, IMaintenanceElementStorageModel, IMaintenanceStorageModel, IOperationMaintenanceElementStorageModel, IOperationStorageModel, ISystemConfigurationStorageModel, IVehicleStorageModel, MaintenanceElementModel, MaintenanceModel, OperationModel, OperationTypeModel, SystemConfigurationModel, VehicleModel, VehicleTypeModel } from '@models/index';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig, MockDBData, MockAppData } from '@testing/index';

describe('MapService', () => {
    let service: MapService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(MapService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should map maintenance element model from storage into model', () => {
        let data: MaintenanceElementModel = MockAppData.MaintenanceElements[0];
        let result: MaintenanceElementModel = service.getMapMaintenanceElement(MockDBData.MaintenanceElements[0]);
        expect(result.id).toEqual(data.id);
        expect(result.name).toEqual(data.name);
        expect(result.nameKey).toEqual(data.name.split('.')[1]);
        expect(result.description).toEqual(data.description);
        expect(result.descriptionKey).toEqual(data.description.split('.')[1]);
        expect(result.master).toEqual(data.master);
        expect(result.icon).toEqual(data.icon);
        expect(result.price).toEqual(0);
    });

    it('should save maintenance element model from storage into model', () => {
        let data: IMaintenanceElementStorageModel = MockDBData.MaintenanceElements[0];
        let result: IMaintenanceElementStorageModel = service.saveMapMaintenanceElement(MockAppData.MaintenanceElements[0]);
        expect(result.id).toEqual(data.id);
        expect(result.name).toEqual(undefined);
        expect(result.description).toEqual(undefined);
        expect(result.master).toEqual(data.master);
    });

    it('should map maintenance model from storage into model', () => {
        let data: MaintenanceModel = MockAppData.Maintenances[0];
        let result: MaintenanceModel = service.getMapMaintenance(MockDBData.Maintenances[0], data.listMaintenanceElement, data.maintenanceFreq);
        expect(result.id).toEqual(data.id);
        expect(result.description).toEqual(data.description);
        expect(result.descriptionKey).toEqual(data.description.split('.')[1]);
        expect(result.master).toEqual(data.master);
        expect(result.fromKm).toEqual(data.fromKm);
        expect(result.toKm).toEqual(data.toKm);
        expect(result.init).toEqual(data.init);
        expect(result.wear).toEqual(data.wear);
        expect(result.time).toEqual(data.time);
        expect(result.km).toEqual(data.km);
        expect(result.maintenanceFreq.id).toEqual(data.maintenanceFreq.id);
        expect(result.listMaintenanceElement.length).toEqual(data.listMaintenanceElement.length);
    });

    it('should save maintenance model from storage into model', () => {
        let data: IMaintenanceStorageModel = MockDBData.Maintenances[0];
        let result: IMaintenanceStorageModel = service.saveMapMaintenance(MockAppData.Maintenances[0]);
        expect(result.id).toEqual(data.id);
        expect(result.description).toEqual(undefined);
        expect(result.master).toEqual(data.master);
        expect(result.fromKm).toEqual(data.fromKm);
        expect(result.toKm).toEqual(data.toKm);
        expect(result.init).toEqual(data.init);
        expect(result.wear).toEqual(data.wear);
        expect(result.time).toEqual(data.time);
        expect(result.km).toEqual(data.km);
        expect(result.idMaintenanceFrec).toEqual(data.idMaintenanceFrec);
    });

    it('should map operation model from storage into model', () => {
        let data: OperationModel = MockAppData.Operations[0];
        let result: OperationModel = service.getMapOperation(MockDBData.Operations[0], data.operationType, data.vehicle, data.listMaintenanceElement);
        expect(result.id).toEqual(data.id);
        expect(result.description).toEqual(data.description);
        expect(result.date).toEqual(data.date);
        expect(result.details).toEqual(data.details);
        expect(result.location).toEqual(data.location);
        expect(result.vehicle.id).toEqual(data.vehicle.id);
        expect(result.price).toEqual(data.price);
        expect(result.owner).toEqual(data.owner);
        expect(result.km).toEqual(data.km);
        expect(result.operationType.id).toEqual(data.operationType.id);
        expect(result.listMaintenanceElement.length).toEqual(data.listMaintenanceElement.length);
    });

    it('should save operation model from storage into model', () => {
        let data: IOperationStorageModel = MockDBData.Operations[0];
        let result: IOperationStorageModel = service.saveMapOperation(MockAppData.Operations[0]);
        expect(result.id).toEqual(data.id);
        expect(result.description).toEqual(data.description);
        expect(result.date).toEqual(data.date);
        expect(result.details).toEqual(data.details);
        expect(result.location).toEqual(data.location);
        expect(result.idVehicle).toEqual(data.idVehicle);
        expect(result.price).toEqual(data.price);
        expect(result.owner).toEqual(data.owner);
        expect(result.km).toEqual(data.km);
        expect(result.idOperationType).toEqual(data.idOperationType);
    });

    it('should map operation type model from storage into model', () => {
        let data: OperationTypeModel = MockAppData.OperationTypes[0];
        let result: OperationTypeModel = service.getMapOperationType(MockDBData.OperationTypes[0]);
        expect(result.id).toEqual(data.id);
        expect(result.descriptionKey).toEqual(data.description);
        expect(result.code).toEqual(data.code);
        expect(result.icon).toEqual(data.icon);
    });

    it('should map vehicle model from storage into model', () => {
        let data: VehicleModel = MockAppData.Vehicles[0];
        let result: VehicleModel = service.getMapVehicle(MockDBData.Vehicles[0], data.configuration, data.vehicleType);
        expect(result.id).toEqual(data.id);
        expect(result.brand).toEqual(data.brand);
        expect(result.model).toEqual(data.model);
        expect(result.datePurchase).toEqual(data.datePurchase);
        expect(result.km).toEqual(data.km);
        expect(result.vehicleType.id).toEqual(data.vehicleType.id);
        expect(result.kmsPerMonth).toEqual(data.kmsPerMonth);
        expect(result.km).toEqual(data.km);
        expect(result.configuration.id).toEqual(data.configuration.id);
    });

    it('should save vehicle model from storage into model', () => {
        let data: IVehicleStorageModel = MockDBData.Vehicles[0];
        let result: IVehicleStorageModel = service.saveMapVehicle(MockAppData.Vehicles[0]);
        expect(result.id).toEqual(data.id);
        expect(result.brand).toEqual(data.brand);
        expect(result.model).toEqual(data.model);
        expect(result.datePurchase).toEqual(data.datePurchase);
        expect(result.km).toEqual(data.km);
        expect(result.idVehicleType).toEqual(data.idVehicleType);
        expect(result.kmsPerMonth).toEqual(data.kmsPerMonth);
        expect(result.km).toEqual(data.km);
        expect(result.idConfiguration).toEqual(data.idConfiguration);
    });

    it('should map vehicle type model from storage into model', () => {
        let data: VehicleTypeModel = MockAppData.VehicleTypes[0];
        let result: VehicleTypeModel = service.getMapVehicleType(MockDBData.VehicleTypes[0]);
        expect(result.id).toEqual(data.id);
        expect(result.descriptionKey).toEqual(data.description);
        expect(result.code).toEqual(data.code);
        expect(result.icon).toEqual(data.icon);
    });

    it('should map configuration model from storage into model', () => {
        let data: ConfigurationModel = MockAppData.Configurations[0];
        let result: ConfigurationModel = service.getMapConfiguration(MockDBData.Configurations[0], data.listMaintenance);
        expect(result.id).toEqual(data.id);
        expect(result.name).toEqual(data.name);
        expect(result.description).toEqual(data.description);
        expect(result.master).toEqual(data.master);
        expect(result.listMaintenance.length).toEqual(data.listMaintenance.length);
    });

    it('should save configuration model from storage into model', () => {
        let data: IConfigurationStorageModel = MockDBData.Configurations[0];
        let result: IConfigurationStorageModel = service.saveMapConfiguration(MockAppData.Configurations[0]);
        expect(result.id).toEqual(data.id);
        expect(result.name).toEqual(undefined);
        expect(result.description).toEqual(undefined);
        expect(result.master).toEqual(data.master);
    });

    it('should map system configuration model from storage into model', () => {
        let data: SystemConfigurationModel = MockAppData.SystemConfigurations[0];
        let result: SystemConfigurationModel = service.getMapSystemConfiguration(MockDBData.SystemConfigurations[0]);
        expect(result.id).toEqual(data.id);
        expect(result.key).toEqual(data.key);
        expect(result.value).toEqual(data.value);
        expect(result.updated.toDateString()).toEqual(data.updated.toDateString());
    });

    it('should save system configuration model from storage into model', () => {
        let data: ISystemConfigurationStorageModel = MockDBData.SystemConfigurations[0];
        let result: ISystemConfigurationStorageModel = service.saveMapSystemConfiguration(MockAppData.SystemConfigurations[0]);
        expect(result.id).toEqual(data.id);
        expect(result.key).toEqual(data.key);
        expect(result.value).toEqual(data.value);
        expect(result.updated.toDateString()).toEqual(data.updated.toDateString());
    });

    it('should save configuration maintenances model from storage into model', () => {
        let result: IConfigurationMaintenanceStorageModel[] = service.saveMapConfigMaintenanceRel(MockAppData.Configurations[0]);
        result.forEach(x => {
            expect(x.idConfiguration).toEqual(MockAppData.Configurations[0].id);
            expect(MockAppData.Configurations[0].listMaintenance.some(y => y.id === x.idMaintenance)).toBeTruthy();
        });
    });

    it('should save maintenance element rel model from storage into model', () => {
        let result: IMaintenanceElementRelStorageModel[] = service.saveMapMaintenanceElementRel(MockAppData.Maintenances[0]);
        result.forEach(x => {
            expect(x.idMaintenance).toEqual(MockAppData.Maintenances[0].id);
            expect(MockAppData.Maintenances[0].listMaintenanceElement.some(y => y.id === x.idMaintenanceElement)).toBeTruthy();
        });
    });

    it('should save operation maintenance model from storage into model', () => {
        let result: IOperationMaintenanceElementStorageModel[] = service.saveMapOpMaintenanceRel(MockAppData.Operations[0]);
        result.forEach(x => {
            expect(x.idOperation).toEqual(MockAppData.Operations[0].id);
            expect(MockAppData.Operations[0].listMaintenanceElement.some(y => y.id === x.idMaintenanceElement)).toBeTruthy();
        });
    });
});
