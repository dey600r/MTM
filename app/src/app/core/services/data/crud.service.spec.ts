import { TestBed } from '@angular/core/testing';

// SERVICES
import { CRUDService } from './crud.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';


describe('CRUDService', () => {
    let service: CRUDService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(CRUDService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
