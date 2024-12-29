import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';

// SERVICES
import { LogService } from '../common/log.service';
import { DataBaseService } from './data-base.service';
import { StorageService } from './storage.service';
import { CRUDService } from './crud.service';

// CONFIGURATIONS
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';

// UTILS
import { ConstantsTable } from '@utils/index';

describe('DataBaseService', () => {
    let service: DataBaseService;
    let serviceStorage: StorageService;
    let serviceLog: LogService;
    let crudService: CRUDService;
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
        serviceLog = TestBed.inject(LogService);
        crudService = TestBed.inject(CRUDService)
        httpClient = TestBed.inject(HttpClient);
        platform = TestBed.inject(Platform);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be start DB', fakeAsync(() => {
        const spyPlatform = spyOn(platform, 'ready').and.resolveTo();
        const spyStorageService = spyOn(serviceStorage, 'getData').and.returnValue(Promise.resolve(MockAppData.SystemConfigurations));
        const spySetStorageService = spyOn(serviceStorage, 'setData').and.resolveTo(true);
        const spyCRUDService = spyOn(crudService, 'loadAllTables').and.resolveTo();
        const spyLogService = spyOn(serviceLog, 'logInfo').and.returnValue(Promise.resolve());
        const spyHttp = spyOn(httpClient, 'get').and.returnValue(of(''));
        service.initDB();
        tick(200);
        expect(spyPlatform).toHaveBeenCalled();
        expect(spyStorageService).toHaveBeenCalled();
        expect(spySetStorageService).not.toHaveBeenCalled();
        expect(spyCRUDService).toHaveBeenCalled();
        expect(spyLogService).toHaveBeenCalled();
        expect(spyHttp).not.toHaveBeenCalled();
    }));

    it('should be int DB', fakeAsync(() => {
        const spyPlatform = spyOn(platform, 'ready').and.resolveTo();
        const spyGetStorageService = spyOn(serviceStorage, 'getData').and.rejectWith();
        const spySetStorageService = spyOn(serviceStorage, 'setData').and.resolveTo(true);
        const spyCRUDService = spyOn(crudService, 'loadAllTables').and.resolveTo();
        const spyLogService = spyOn(serviceLog, 'logInfo').and.returnValue(Promise.resolve());
        const spyHttp = spyOn(httpClient, 'get').and.returnValue(of(JSON.stringify({
            data: {
                [ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION]: MockAppData.SystemConfigurations
            }
        })));
        service.initDB();
        tick(200);
        expect(spyPlatform).toHaveBeenCalled();
        expect(spyGetStorageService).toHaveBeenCalled();
        expect(spySetStorageService).toHaveBeenCalledTimes(crudService.getAllTables().length);
        expect(spyCRUDService).toHaveBeenCalled();
        expect(spyLogService).toHaveBeenCalled();
        expect(spyHttp).toHaveBeenCalled();
    }));

    it('should be format json', () => {
        expect(service.formatBooleanJSON('{"data":"Y"}, {"data":"N"}')).toEqual('{"data":true}, {"data":false}');
    });

});
