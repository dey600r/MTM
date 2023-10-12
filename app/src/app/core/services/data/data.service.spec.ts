import { TestBed } from '@angular/core/testing';

// SERVICES
import { DataService } from './data.service';

// CONFIGURATIONS
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';


describe('DataService', () => {
    let service: DataService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(DataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should init operation maintenance element', () => {
        service.setOperationMaintenanceElementData([{idOperation: 1, idMaintenanceElement: 1, id: 1, price: 3}]);
        expect(service.getOperationMaintenanceElementData().length).toEqual(1);
        expect(service.getOperationMaintenanceElementData()[0].price).toEqual(3);
    });

    it('should init configuration maintenance', () => {
        service.setConfigurationMaintenanceData([{idConfiguration: 1, idMaintenance: 1, id: 1}]);
        expect(service.getConfigurationMaintenanceData().length).toEqual(1);
    });

    it('should init maintenance element rel', () => {
        service.setMaintenanceElementRelData([{idMaintenance: 1, idMaintenanceElement: 1, id: 1}]);
        expect(service.getMaintenanceElementRelData().length).toEqual(1);
    });

    it('should init vehicles', () => {
        service.setVehicles(MockAppData.Vehicles);
        expect(service.getVehiclesData().length).toEqual(MockAppData.Vehicles.length);
        service.getVehicles().subscribe(data => expect(data.length).toEqual(MockAppData.Vehicles.length));
    });

    it('should init vehicle type', () => {
        service.setVehicleType(MockAppData.VehicleTypes);
        expect(service.getVehicleTypeData().length).toEqual(MockAppData.VehicleTypes.length);
        service.getVehicleType().subscribe(data => expect(data.length).toEqual(MockAppData.VehicleTypes.length));
    });

    it('should init configurations', () => {
        service.setConfigurations(MockAppData.Configurations);
        expect(service.getConfigurationsData().length).toEqual(MockAppData.Configurations.length);
        service.getConfigurations().subscribe(data => expect(data.length).toEqual(MockAppData.Configurations.length));
    });

    it('should init operations', () => {
        service.setOperations(MockAppData.Operations);
        expect(service.getOperationsData().length).toEqual(MockAppData.Operations.length);
        service.getOperations().subscribe(data => expect(data.length).toEqual(MockAppData.Operations.length));
    });

    it('should init operation type', () => {
        service.setOperationType(MockAppData.OperationTypes);
        expect(service.getOperationTypeData().length).toEqual(MockAppData.OperationTypes.length);
        service.getOperationType().subscribe(data => expect(data.length).toEqual(MockAppData.OperationTypes.length));
    });

    it('should init maintenances', () => {
        service.setMaintenance(MockAppData.Maintenances);
        expect(service.getMaintenanceData().length).toEqual(MockAppData.Maintenances.length);
        service.getMaintenance().subscribe(data => expect(data.length).toEqual(MockAppData.Maintenances.length));
    });

    it('should init maintenances', () => {
        service.setMaintenance(MockAppData.Maintenances);
        expect(service.getMaintenanceData().length).toEqual(MockAppData.Maintenances.length);
        service.getMaintenance().subscribe(data => expect(data.length).toEqual(MockAppData.Maintenances.length));
    });
    
    it('should init maintenance elements', () => {
        service.setMaintenanceElement(MockAppData.MaintenanceElements);
        expect(service.getMaintenanceElementData().length).toEqual(MockAppData.MaintenanceElements.length);
        service.getMaintenanceElement().subscribe(data => expect(data.length).toEqual(MockAppData.MaintenanceElements.length));
    });

    it('should init maintenance frequency', () => {
        service.setMaintenanceFreq(MockAppData.MaintenanceFreqs);
        expect(service.getMaintenanceFreqData().length).toEqual(MockAppData.MaintenanceFreqs.length);
        service.getMaintenanceFreq().subscribe(data => expect(data.length).toEqual(MockAppData.MaintenanceFreqs.length));
    });

    it('should init system configuration', () => {
        service.setSystemConfiguration(MockAppData.SystemConfigurations);
        expect(service.getSystemConfigurationData().length).toEqual(MockAppData.SystemConfigurations.length);
        service.getSystemConfiguration().subscribe(data => expect(data.length).toEqual(MockAppData.SystemConfigurations.length));
    });
});
