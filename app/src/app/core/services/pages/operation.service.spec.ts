import { TestBed } from '@angular/core/testing';

// SERVICES
import { OperationService } from './operation.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

// MODELS
import { MaintenanceElementModel, OperationModel } from '@models/index';

// UTILS
import { ActionDBEnum } from '@utils/index';

describe('OperationService', () => {
    let service: OperationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(OperationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call execute query with insert operation sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapOpMaintenanceRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getOperationsData: jasmine.createSpy().and.returnValue([])};
        const service2 = new OperationService(spyCRUDService, spyMapService, spyDataService);
        service2.saveOperation(new OperationModel({ description: 'test', listMaintenanceElement: [new MaintenanceElementModel()] }), ActionDBEnum.CREATE);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).toHaveBeenCalled();
        expect(spyMapService.saveMapOpMaintenanceRel).toHaveBeenCalled();
        expect(spyDataService.getOperationsData).toHaveBeenCalled();
    });

    it('should call execute query with update operation sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapOpMaintenanceRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getOperationsData: jasmine.createSpy().and.returnValue([])};
        const service2 = new OperationService(spyCRUDService, spyMapService, spyDataService);
        service2.saveOperation(new OperationModel({ description: 'test' }), ActionDBEnum.UPDATE);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).not.toHaveBeenCalled();
        expect(spyMapService.saveMapOpMaintenanceRel).toHaveBeenCalled();
        expect(spyDataService.getOperationsData).not.toHaveBeenCalled();
    });

    it('should call execute query with delete operation sql', () => {
        const spyCRUDService: any = { 
            saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])),
            getLastId: jasmine.createSpy().and.returnValue(1)
        };
        const spyMapService: any = { saveMapOpMaintenanceRel: jasmine.createSpy().and.returnValue([]) };
        const spyDataService: any = { getOperationsData: jasmine.createSpy().and.returnValue([])};
        const service2 = new OperationService(spyCRUDService, spyMapService, spyDataService);
        service2.saveOperation(new OperationModel({
                description: 'test',
                details: 'test',
                km: 100,
                price: 100, 
                listMaintenanceElement: [new MaintenanceElementModel()]
            }), ActionDBEnum.DELETE);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
        expect(spyCRUDService.getLastId).not.toHaveBeenCalled();
        expect(spyMapService.saveMapOpMaintenanceRel).not.toHaveBeenCalled();
        expect(spyDataService.getOperationsData).not.toHaveBeenCalled();
    });
});
