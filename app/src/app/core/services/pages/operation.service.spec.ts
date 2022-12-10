import { TestBed } from '@angular/core/testing';

// SERVICES
import { OperationService } from './operation.service';

// CONFIGURATIONS
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';

// MODELS
import { MaintenanceElementModel, OperationModel, OperationTypeModel, VehicleModel } from '@models/index';

// UTILS
import { ActionDBEnum, ConstantsTable } from '@utils/index';

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
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { 
            insertSqlOperation: jasmine.createSpy().and.returnValues('query1;'),
            insertSqlOpMaintenanceElement: jasmine.createSpy().and.returnValues('query1;'),
        };
        const service2 = new OperationService(spyDataBase, spySqlService);
        service2.saveOperation(new OperationModel('test'), ActionDBEnum.CREATE);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.insertSqlOperation).toHaveBeenCalled();
        expect(spySqlService.insertSqlOpMaintenanceElement).toHaveBeenCalled();
    });

    it('should call execute query with update operation sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { 
            updateSqlOperation: jasmine.createSpy().and.returnValues('query1;'),
            deleteSql: jasmine.createSpy().and.returnValues('query1;'),
            insertSqlOpMaintenanceElement: jasmine.createSpy().and.returnValues('query1;'),
        };
        const service2 = new OperationService(spyDataBase, spySqlService);
        service2.saveOperation(new OperationModel('test'), ActionDBEnum.UPDATE);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.updateSqlOperation).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalled();
        expect(spySqlService.insertSqlOpMaintenanceElement).toHaveBeenCalled();
    });

    it('should call execute query with delete operation sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { deleteSql: jasmine.createSpy().and.returnValues('query1;', 'query2;') };
        const service2 = new OperationService(spyDataBase, spySqlService);
        service2.saveOperation(
            new OperationModel('test', 'test', new OperationTypeModel(), new VehicleModel(), 
                100, new Date(), '', '', 100, '', 1, [new MaintenanceElementModel()]),
            ActionDBEnum.DELETE);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalledTimes(2);
    });

    it('should call execute query with delete vehicle operation sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { deleteSql: jasmine.createSpy().and.returnValues('query1;', 'query2;') };
        const service2 = new OperationService(spyDataBase, spySqlService);
        const result: string = service2.getSqlDeleteVehicleOperation([new OperationModel()]);
        expect(result).toEqual('query1;query2;');
        expect(spyDataBase.executeScriptDataBase).not.toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalledTimes(2);
        expect(result).toEqual('query1;query2;');
        expect(service2.getSqlDeleteVehicleOperation()).toEqual('');
    });
});
