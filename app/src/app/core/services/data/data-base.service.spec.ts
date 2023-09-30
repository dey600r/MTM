import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';

// PLUGINS
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

// SERVICES
import { DataBaseService } from './data-base.service';
import { SqlService } from './sql.service';
import { StorageService } from './storage.service';
import { MapService } from './map.service';

// CONFIGURATIONS
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';

// UTILS
import { Constants, ConstantsTable } from '@utils/index';
import { SystemConfigurationModel } from '@models/index';

describe('DataBaseService', () => {
    let service: DataBaseService;
    let serviceStorage: StorageService;
    let mapService: MapService;
    let sqlLite: SQLite;
    let httpClient: HttpClient;
    let platform: Platform;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
    });

    beforeEach(() => {
        service = TestBed.inject(DataBaseService);
        serviceStorage = TestBed.inject(StorageService);
        mapService = TestBed.inject(MapService);
        sqlLite = TestBed.inject(SQLite);
        httpClient = TestBed.inject(HttpClient);
        platform = TestBed.inject(Platform);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be int DB', fakeAsync(() => {
      const spyStorageService = spyOn(serviceStorage, 'getData').and.returnValue(Promise.resolve(MockData.SystemConfigurations));
        service.initDB();
        tick(200);
        expect(spyStorageService).toHaveBeenCalled();
    }));

    // it('should be next delopy DB', fakeAsync(() => {
    //     const sqlPorter = new SQLitePorter();
    //     const service2 = new DataBaseService(platform, sqlPorter, sqlLite, httpClient, TestBed.inject(SqlService), serviceStorage, mapService);
    //     const spySqlite = spyOn(sqlLite, 'create').and.returnValue(Promise.resolve(SpyMockConfig.SpyConfig.sqliteObject));
    //     const spyHttp = spyOn(httpClient, 'get').and.returnValue(of(''));
    //     const spyDataBase = SpyMockConfig.SpyConfig.sqliteObject.executeSql.and.returnValue(Promise.resolve());
    //     const spySqlitePorter = spyOn(sqlPorter, 'importSqlToDb').and.returnValue(Promise.resolve({ data : { rows: []}}));
    //     service2.initDB();
    //     tick();
    //     expect(spySqlite).toHaveBeenCalled();
    //     expect(spyDataBase).toHaveBeenCalled();
    //     expect(spySqlitePorter).not.toHaveBeenCalled();
    //     expect(spyHttp).not.toHaveBeenCalled();
    // }));

    // it('should initialize all tables', fakeAsync(() => {
    //     spyOn(sqlLite, 'create').and.returnValue(Promise.resolve(SpyMockConfig.SpyConfig.sqliteObject));
    //     SpyMockConfig.SpyConfig.sqliteObject.executeSql.and.returnValue(Promise.resolve());
    //     service.getDatabaseState().subscribe(data => {
    //         if (data) {
    //             expect(data).toBeTruthy();
    //         }
    //     });
    //     service.getSystemConfiguration().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.SystemConfigurations);
    //         }
    //     });
    //     service.getVehicles().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.Vehicles);
    //             data.forEach(x => expect(x.kmEstimated).toBeGreaterThan(x.km));
    //         }
    //     });
    //     service.getVehicleType().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.VehicleTypes);
    //         }
    //     });
    //     service.getConfigurations().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.Configurations);
    //         }
    //     });
    //     service.getOperations().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.Operations);
    //         }
    //     });
    //     service.getOperationType().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.OperationTypes);
    //         }
    //     });
    //     service.getMaintenance().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.Maintenances);
    //         }
    //     });
    //     service.getMaintenanceElement().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.MaintenanceElements);
    //         }
    //     });
    //     service.getMaintenanceFreq().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.MaintenanceFreqs);
    //         }
    //     });
    //     service.initDB();
    //     tick();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapSystemConfiguration).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapVehicle).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapVehicleType).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapConfiguration).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapOperation).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapOperationType).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapMaintenance).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapMaintenanceElement).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapMaintenanceFreq).toHaveBeenCalled();
    // }));

    // it('should execute sql data base', fakeAsync(() => {
    //     const spyDataBase: any =  { executeSql: jasmine.createSpy().and.returnValues(Promise.resolve({}), Promise.resolve({})) };
    //     service.setDB(spyDataBase);
    //     service.executeSqlDataBase('', [], [ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION]);
    //     service.getSystemConfiguration().subscribe(data => {
    //         if (data !== undefined && data !== null && data.length > 0) {
    //             expect(data).toEqual(MockData.SystemConfigurations);
    //         }
    //     });
    //     tick();
    //     expect(spyDataBase.executeSql).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapSystemConfiguration).toHaveBeenCalled();
    // }));

    // it('should check next deploy empty and init DB', fakeAsync(() => {
    //     const sqlPorter = new SQLitePorter();
    //     const service2 = new DataBaseService(platform, sqlPorter, sqlLite, httpClient, TestBed.inject(SqlService), serviceStorage, mapService);
    //     const spyDataBase: any =  { executeSql: jasmine.createSpy().and.returnValue(Promise.resolve({})) };
    //     const spyHttp = spyOn(httpClient, 'get').and.returnValue(of(''));
    //     const spySqlitePorter = spyOn(sqlPorter, 'importSqlToDb').and.returnValue(Promise.resolve({ data : { rows: []}}));
    //     const config: SystemConfigurationModel = new SystemConfigurationModel(
    //         Constants.KEY_LAST_UPDATE_DB, 'v3.0.0', new Date(2020, 1, 2), 1);
    //     service2.setDB(spyDataBase);
    //     service2.getNextDeployDB(config);
    //     tick();
    //     expect(spyHttp).toHaveBeenCalled();
    //     expect(spyDataBase.executeSql).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapSystemConfiguration).toHaveBeenCalled();
    //     expect(spySqlitePorter).toHaveBeenCalledTimes(1);
    // }));

    // it('should check next deploy with SQL and init DB', fakeAsync(() => {
    //     const sqlPorter = new SQLitePorter();
    //     const service2 = new DataBaseService(platform, sqlPorter, sqlLite, httpClient, TestBed.inject(SqlService), serviceStorage, mapService);
    //     const sqlNextDeploy = '**->nextDeployDB_v3.0.1**>alter table "mtmVehicle" add "active" TEXT not null default `Y`;**->nextDeployDB_v3.1.0**>';
    //     const spyDataBase: any =  { executeSql: jasmine.createSpy().and.returnValue(Promise.resolve({})) };
    //     const spyHttp = spyOn(httpClient, 'get').and.returnValue(of(sqlNextDeploy));
    //     const spySqlitePorter = spyOn(sqlPorter, 'importSqlToDb').and.returnValue(Promise.resolve({ data : { rows: []}}));
    //     const config: SystemConfigurationModel = new SystemConfigurationModel(
    //         Constants.KEY_LAST_UPDATE_DB, 'v3.0.0', new Date(2020, 1, 2), 1);
    //     service2.setDB(spyDataBase);
    //     service2.getNextDeployDB(config);
    //     tick();
    //     expect(spyHttp).toHaveBeenCalled();
    //     expect(spyDataBase.executeSql).toHaveBeenCalled();
    //     expect(SpyMockConfig.SpyConfig.sqlService.mapSystemConfiguration).toHaveBeenCalled();
    //     expect(spySqlitePorter).toHaveBeenCalledTimes(2);
    // }));

    // /* TESTING ERRORS */

    // it('should get error int DB', fakeAsync(() => {
    //     const spySqlite = spyOn(sqlLite, 'create').and.returnValue(Promise.reject('TESTING ERROR'));
    //     console.log = jasmine.createSpy('log');
    //     service.initDB();
    //     tick();
    //     expect(spySqlite).toHaveBeenCalled();
    //     expect(console.log).toHaveBeenCalledWith('ERROR TESTING ERROR');
    // }));

    // it('should get error import SQL to DB', fakeAsync(() => {
    //     const spySqlitePorter = SpyMockConfig.SpyConfig.sqlitePorter.importSqlToDb.and.returnValue(Promise.reject('TESTING ERROR'));
    //     console.error = jasmine.createSpy('error');
    //     service.importSqlToDB('');
    //     tick();
    //     expect(spySqlitePorter).toHaveBeenCalled();
    //     expect(console.error).toHaveBeenCalledWith('Error launching initialize data base: TESTING ERROR');
    // }));

    // it('should get error execute script data base', fakeAsync(() => {
    //     const spySqlitePorter = SpyMockConfig.SpyConfig.sqlitePorter.importSqlToDb.and.returnValue(
    //         Promise.reject({ message: 'TESTING ERROR'}));
    //     console.error = jasmine.createSpy('error');
    //     try {
    //         service.executeScriptDataBase('');
    //         tick();
    //         flush();
    //     }
    //     catch (e) {
    //         const messageError = 'Error executing script on DB: TESTING ERROR';
    //         expect(spySqlitePorter).toHaveBeenCalled();
    //         expect(console.error).toHaveBeenCalledWith(messageError);
    //         expect(e.message).toContain(messageError);
    //         flush();
    //     }
    // }));

    // it('should get error execute sql data base', fakeAsync(() => {
    //     const spyDataBase: any =  { executeSql: jasmine.createSpy().and.returnValue(Promise.reject({ message: 'TESTING ERROR'})) };
    //     console.error = jasmine.createSpy('error');
    //     try {
    //         service.setDB(spyDataBase);
    //         service.executeSqlDataBase('', []);
    //         tick();
    //     }
    //     catch (e) {
    //         const messageError = 'Error executing sql on DB: TESTING ERROR';
    //         expect(spyDataBase.executeSql).toHaveBeenCalled();
    //         expect(console.error).toHaveBeenCalledWith(messageError);
    //         expect(e.message).toContain(messageError);
    //     }
    //     flush();
    // }));

});
