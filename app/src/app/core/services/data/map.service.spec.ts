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
            providers: SpyMockConfig.ProvidersServices

        }).compileComponents();
        service = TestBed.inject(StorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
