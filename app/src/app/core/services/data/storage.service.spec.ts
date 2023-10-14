import { TestBed } from '@angular/core/testing';

// SERVICES
import { StorageService } from './storage.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';


describe('StorageService', () => {
    let service: StorageService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: [...SpyMockConfig.ProvidersServices, SpyMockConfig.ProviderLogService]
        }).compileComponents();
        service = TestBed.inject(StorageService);
    });
    
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get function return an error when the key doesnt exists', async () => {
        SpyMockConfig.SpyConfig.logService.logInfo = jasmine.createSpy().and.returnValue('');
        window.localStorage.clear();
        await service.getData('key').catch(error => expect(error).toEqual('Error getting item key'));
        expect(SpyMockConfig.SpyConfig.logService.logInfo).toHaveBeenCalled();
    });

    it('should get data from local storage', async () => {
        SpyMockConfig.SpyConfig.logService.logInfo = jasmine.createSpy().and.returnValue('');
        window.localStorage.setItem('key', "{\"data\":\"david\"}");
        let result: any = await service.getData('key');
        expect(result.data).toEqual('david');
        expect(SpyMockConfig.SpyConfig.logService.logInfo).not.toHaveBeenCalled();
    });

    it('should set data into local storage', async () => {
        SpyMockConfig.SpyConfig.logService.logInfo = jasmine.createSpy().and.returnValue('');
        window.localStorage.setItem('key', "{\"data\":\"david\"}");
        await service.setData('key', [ { data: "david"} ]);
        let result: any[] = await service.getData('key');
        expect(result[0].data).toEqual('david');
        expect(SpyMockConfig.SpyConfig.logService.logInfo).not.toHaveBeenCalled();
    });
});
