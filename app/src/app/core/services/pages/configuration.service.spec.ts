import { TestBed } from '@angular/core/testing';

// SERVICES
import { ConfigurationService } from './configuration.service';

// CONFIGURATIONS
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';

// MODELS
import { ConfigurationModel, MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel, OperationModel, VehicleModel } from '@models/index';

// UTILS
import { ActionDBEnum } from '@utils/index';

describe('ConfigurationService', () => {
    let service: ConfigurationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(ConfigurationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /* CONFIGURATIONS */

    it('should order all replacement', () => {
        const result: MaintenanceElementModel[] = service.orderMaintenanceElement(MockAppData.MaintenanceElements);
        expect(result[0].id).toEqual(10);
        expect(result[1].id).toEqual(8);
        expect(result[2].id).toEqual(9);
        expect(result[3].id).toEqual(6);
        expect(result[4].id).toEqual(7);
        expect(result[5].id).toEqual(4);
        expect(result[6].id).toEqual(2);
        expect(result[7].id).toEqual(3);
        expect(result[8].id).toEqual(1);
    });

    it('should call execute query with insert configuration sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapConfigMaintenanceRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getConfigurationsData: jasmine.createSpy().and.returnValue([])};
        const service2 = new ConfigurationService(null, spyCRUDService, spyMapService, spyDataService);
        service2.saveConfiguration(new ConfigurationModel({
            name: 'test',
            description: 'test',
            master: true,
            listMaintenance: [new MaintenanceModel()],
            id: 10
        }), ActionDBEnum.CREATE);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).toHaveBeenCalled();
        expect(spyMapService.saveMapConfigMaintenanceRel).toHaveBeenCalled();
        expect(spyDataService.getConfigurationsData).toHaveBeenCalled();
    });

    it('should call execute query with update configuration sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapConfigMaintenanceRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getConfigurationsData: jasmine.createSpy().and.returnValue([])};
        const service2 = new ConfigurationService(null, spyCRUDService, spyMapService, spyDataService);
        service2.saveConfiguration(new ConfigurationModel({
            name: 'test', 
            description: 'test',
            master: true,
            listMaintenance: [],
            id: 10
        }), ActionDBEnum.UPDATE, []);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).not.toHaveBeenCalled();
        expect(spyMapService.saveMapConfigMaintenanceRel).toHaveBeenCalled();
        expect(spyDataService.getConfigurationsData).not.toHaveBeenCalled();
    });

    it('should call execute query with delete configuration sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapConfigMaintenanceRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getConfigurationsData: jasmine.createSpy().and.returnValue([])};
        const service2 = new ConfigurationService(null, spyCRUDService, spyMapService, spyDataService);
        service2.saveConfiguration(new ConfigurationModel({
            name: 'test',
            description: 'test',
            master: true,
            listMaintenance: [ new MaintenanceModel({
                    description: 'test',
                    listMaintenanceElement: [],
                    maintenanceFreq: new MaintenanceFreqModel(),
                    km: 10
                })],
            id: 10
        }), ActionDBEnum.DELETE, [new VehicleModel()]);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).not.toHaveBeenCalled();
        expect(spyMapService.saveMapConfigMaintenanceRel).not.toHaveBeenCalled();
        expect(spyDataService.getConfigurationsData).not.toHaveBeenCalled();
    });

    it('should call execute query with insert configuration maintenance sql', () => {
        const spyCRUDService: any = { saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])) };
        const spyMapService: any = { saveMapConfigMaintenanceRel: jasmine.createSpy().and.returnValue([]) };
        const service2 = new ConfigurationService(null, spyCRUDService, spyMapService, null);
        service2.saveConfigurationMaintenance([ new ConfigurationModel(), new ConfigurationModel()], 
            [ new ConfigurationModel(), new ConfigurationModel({ id : 2, listMaintenance: [ new MaintenanceModel({ id: 3 }) ]}) ]);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyMapService.saveMapConfigMaintenanceRel).toHaveBeenCalled();
    });

    it('should call execute query with delete configuration maintenance sql', () => {
        const spyCRUDService: any = { saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])) };
        const service2 = new ConfigurationService(null, spyCRUDService, null, null);
        service2.deleteConfigManintenance(1, 1);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
    });

    /* MAINTENANCES */

    it('should call execute query with insert maintenance sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapMaintenanceElementRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getMaintenanceData: jasmine.createSpy().and.returnValue([])};
        const service2 = new ConfigurationService(null, spyCRUDService, spyMapService, spyDataService);
        service2.saveMaintenance(new MaintenanceModel({ description: 'test', listMaintenanceElement: [ new MaintenanceElementModel()] }), ActionDBEnum.CREATE);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).toHaveBeenCalled();
        expect(spyMapService.saveMapMaintenanceElementRel).toHaveBeenCalled();
        expect(spyDataService.getMaintenanceData).toHaveBeenCalled();
    });

    it('should call execute query with update maintenance sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapMaintenanceElementRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getMaintenanceData: jasmine.createSpy().and.returnValue([])};
        const service2 = new ConfigurationService(null, spyCRUDService, spyMapService, spyDataService);
        service2.saveMaintenance(new MaintenanceModel({ description: 'test' }), ActionDBEnum.UPDATE, []);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).not.toHaveBeenCalled();
        expect(spyMapService.saveMapMaintenanceElementRel).toHaveBeenCalled();
        expect(spyDataService.getMaintenanceData).not.toHaveBeenCalled();
    });

    it('should call execute query with delete maintenance sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapMaintenanceElementRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getMaintenanceData: jasmine.createSpy().and.returnValue([])};
        const service2 = new ConfigurationService(null, spyCRUDService, spyMapService, spyDataService);
        service2.saveMaintenance(new MaintenanceModel({ 
                description: 'test',
                listMaintenanceElement: [ new MaintenanceElementModel() ]
            }), ActionDBEnum.DELETE, [ new ConfigurationModel()]);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).not.toHaveBeenCalled();
        expect(spyMapService.saveMapMaintenanceElementRel).not.toHaveBeenCalled();
        expect(spyDataService.getMaintenanceData).not.toHaveBeenCalled();
    });

    /* MAINTENANCE ELEMENTS */

    it('should call execute query with insert maintenance element sql', () => {
        const spyCRUDService: any = { saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])) };
        const service2 = new ConfigurationService(null, spyCRUDService, null, null);
        service2.saveMaintenanceElement(new MaintenanceElementModel({ name: 'test' }), ActionDBEnum.CREATE);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
    });

    it('should call execute query with update maintenance element sql', () => {
        const spyCRUDService: any = { saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])) };
        const service2 = new ConfigurationService(null, spyCRUDService, null, null);
        service2.saveMaintenanceElement(new MaintenanceElementModel({ name: 'test' }), ActionDBEnum.UPDATE, []);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
    });

    it('should call execute query with delete maintenance element sql', () => {
        const spyCRUDService: any = { saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])) };
        const service2 = new ConfigurationService(null, spyCRUDService, null, null);
        service2.saveMaintenanceElement(new MaintenanceElementModel({ name: 'test' }), ActionDBEnum.DELETE, [ new OperationModel() ]);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
    });

    it('should get replacement separated by commas', () => {
        const result: string = service.getReplacement([MockAppData.MaintenanceElementsAux[0], MockAppData.MaintenanceElementsAux[2]]);
        expect(result).toEqual(`${MockAppData.MaintenanceElementsAux[0].name}, ${MockAppData.MaintenanceElementsAux[2].name}`);
    });
});
