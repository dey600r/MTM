import { TestBed } from '@angular/core/testing';

// SERVICES
import { ConfigurationService } from './configuration.service';

// CONFIGURATIONS
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';

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
        const result: MaintenanceElementModel[] = service.orderMaintenanceElement(MockData.MaintenanceElements);
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
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { 
            insertSqlConfiguration: jasmine.createSpy().and.returnValues('query1;'),
            insertSqlConfigurationMaintenance: jasmine.createSpy().and.returnValues('query1;')
        };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveConfiguration(new ConfigurationModel({
            name: 'test',
            description: 'test',
            master: true,
            listMaintenance: [],
            id: 10
        }), ActionDBEnum.CREATE);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.insertSqlConfiguration).toHaveBeenCalled();
        expect(spySqlService.insertSqlConfigurationMaintenance).toHaveBeenCalled();
    });

    it('should call execute query with update configuration sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { 
            updateSqlConfiguration: jasmine.createSpy().and.returnValues('query1;'),
            deleteSql: jasmine.createSpy().and.returnValues('query1;'),
            insertSqlConfigurationMaintenance: jasmine.createSpy().and.returnValues('query1;')
        };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveConfiguration(new ConfigurationModel({
            name: 'test', 
            description: 'test',
            master: true,
            listMaintenance: [],
            id: 10
        }), ActionDBEnum.UPDATE, []);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.updateSqlConfiguration).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalled();
        expect(spySqlService.insertSqlConfigurationMaintenance).toHaveBeenCalled();
    });

    it('should call execute query with delete configuration sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { 
            deleteSql: jasmine.createSpy().and.returnValues('query1;', 'query2;'),
            updateSqlVehicle: jasmine.createSpy().and.returnValues('query1;')
        };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
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
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalledTimes(2);
        expect(spySqlService.updateSqlVehicle).toHaveBeenCalled();
    });

    it('should call execute query with insert configuration maintenance sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { 
            insertSqlConfigurationMaintenance: jasmine.createSpy().and.returnValues('query1;'),
            deleteSql: jasmine.createSpy().and.returnValues('query1;','query2;')
        };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveConfigurationMaintenance([ new ConfigurationModel(), new ConfigurationModel()], 
            [ new ConfigurationModel(), new ConfigurationModel({ id : 2, listMaintenance: [ new MaintenanceModel({ id: 3 }) ]}) ]);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.insertSqlConfigurationMaintenance).toHaveBeenCalledTimes(2);
        expect(spySqlService.deleteSql).toHaveBeenCalled();
    });

    it('should call execute query with delete configuration maintenance sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { deleteSql: jasmine.createSpy().and.returnValues('query1;') };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.deleteConfigManintenance(1, 1);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalled();
    });

    /* MAINTENANCES */

    it('should call execute query with insert maintenance sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { 
            insertSqlMaintenance: jasmine.createSpy().and.returnValues('query1;'),
            insertSqlMaintenanceElementRel: jasmine.createSpy().and.returnValues('query1;')
        };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveMaintenance(new MaintenanceModel({ description: 'test' }), ActionDBEnum.CREATE);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.insertSqlMaintenance).toHaveBeenCalled();
        expect(spySqlService.insertSqlMaintenanceElementRel).toHaveBeenCalled();
    });

    it('should call execute query with update maintenance sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { 
            updateSqlMaintenance: jasmine.createSpy().and.returnValues('query1;'),
            deleteSql: jasmine.createSpy().and.returnValues('query1;'),
            insertSqlMaintenanceElementRel: jasmine.createSpy().and.returnValues('query1;')
        };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveMaintenance(new MaintenanceModel({ description: 'test' }), ActionDBEnum.UPDATE, []);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.updateSqlMaintenance).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalled();
        expect(spySqlService.insertSqlMaintenanceElementRel).toHaveBeenCalled();
    });

    it('should call execute query with delete maintenance sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { deleteSql: jasmine.createSpy().and.returnValues('query1;', 'query2;', 'query3;') };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveMaintenance(new MaintenanceModel({ 
                description: 'test',
                listMaintenanceElement: [ new MaintenanceElementModel() ]
            }), ActionDBEnum.DELETE, [ new ConfigurationModel()]);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalledTimes(3);
    });

    /* MAINTENANCE ELEMENTS */

    it('should call execute query with insert maintenance element sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { insertSqlMaintenanceElement: jasmine.createSpy().and.returnValues('query1;') };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveMaintenanceElement(new MaintenanceElementModel({ name: 'test' }), ActionDBEnum.CREATE);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.insertSqlMaintenanceElement).toHaveBeenCalled();
    });

    it('should call execute query with update maintenance element sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { updateSqlMaintenanceElement: jasmine.createSpy().and.returnValues('query1;') };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveMaintenanceElement(new MaintenanceElementModel({ name: 'test' }), ActionDBEnum.UPDATE, []);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.updateSqlMaintenanceElement).toHaveBeenCalled();
    });

    it('should call execute query with delete maintenance element sql', () => {
        const spyDataBase: any =  { executeScriptDataBase: jasmine.createSpy().and.returnValues(Promise.resolve({})) };
        const spySqlService: any = { deleteSql: jasmine.createSpy().and.returnValues('query1;', 'query2;') };
        const service2 = new ConfigurationService(null, spyDataBase, spySqlService);
        service2.saveMaintenanceElement(new MaintenanceElementModel({ name: 'test' }), ActionDBEnum.DELETE, [ new OperationModel() ]);
        expect(spyDataBase.executeScriptDataBase).toHaveBeenCalled();
        expect(spySqlService.deleteSql).toHaveBeenCalledTimes(2);
    });

    it('should get replacement separated by commas', () => {
        const result: string = service.getReplacement([MockData.MaintenanceElementsAux[0], MockData.MaintenanceElementsAux[2]]);
        expect(result).toEqual(`${MockData.MaintenanceElementsAux[0].name}, ${MockData.MaintenanceElementsAux[2].name}`);
    });
});
