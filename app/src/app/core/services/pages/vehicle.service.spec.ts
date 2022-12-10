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
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { insertSqlVehicle: jasmine.createSpy().and.returnValues('query1;') };
        const service2 = new VehicleService(spyDataBase, spySqlService, null);
        service2.saveVehicle([new VehicleModel('test', 'test', 2005, 1000)], ActionDBEnum.CREATE, []);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.insertSqlVehicle).toHaveBeenCalled();
    });

    it('should call execute query with update vehicle sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { updateSqlVehicle: jasmine.createSpy().and.returnValues('query1;') };
        const service2 = new VehicleService(spyDataBase, spySqlService, null);
        service2.saveVehicle([new VehicleModel('test', 'test', 2005, 1000)], ActionDBEnum.UPDATE, []);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.updateSqlVehicle).toHaveBeenCalled();
    });

    it('should call execute query with delete vehicle sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { deleteSql: jasmine.createSpy().and.returnValues('query1;') };
        const spyOperationService: any = { getSqlDeleteVehicleOperation: jasmine.createSpy().and.returnValues('query1;') };
        const service2 = new VehicleService(spyDataBase, spySqlService, spyOperationService);
        service2.saveVehicle([new VehicleModel('test', 'test', 2005, 1000)], ActionDBEnum.DELETE, [new OperationModel()]);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spyOperationService.getSqlDeleteVehicleOperation).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalled();
    });
});
