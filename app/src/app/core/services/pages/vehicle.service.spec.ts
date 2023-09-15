import { TestBed } from '@angular/core/testing';

// SERVICES
import { VehicleService } from './vehicle.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

// MODELS
import { OperationModel, VehicleModel } from '@models/index';

// UTILS
import { ActionDBEnum } from '@utils/index';

describe('VehicleService', () => {
    let service: VehicleService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(VehicleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call execute query with insert vehicle sql', () => {
        const spyCRUDService: any = { saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])) };
        const service2 = new VehicleService(spyCRUDService);
        service2.saveVehicle([new VehicleModel({
            model: 'test',
            brand: 'test',
            year: 2005,
            km: 1000
        })], ActionDBEnum.CREATE);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
    });

    it('should call execute query with update vehicle sql', () => {
        const spyCRUDService: any = { saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])) };
        const service2 = new VehicleService(spyCRUDService);
        service2.saveVehicle([new VehicleModel({
            model: 'test',
            brand: 'test',
            year: 2005,
            km: 1000
        })], ActionDBEnum.UPDATE, []);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
    });

    it('should call execute query with delete vehicle sql', () => {
        const spyCRUDService: any = { saveDataStorage: jasmine.createSpy().and.returnValues(Promise.resolve([true])) };
        const service2 = new VehicleService(spyCRUDService);
        service2.saveVehicle([new VehicleModel({
            model: 'test',
            brand: 'test',
            year: 2005,
            km: 1000
        })], ActionDBEnum.DELETE, [new OperationModel()]);
        expect(spyCRUDService.saveDataStorage).toHaveBeenCalled();
    });
});
