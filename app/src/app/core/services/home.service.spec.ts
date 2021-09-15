import { TestBed } from '@angular/core/testing';

// SERVICES
import { HomeService } from './home.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

describe('HomeService', () => {
    let service: HomeService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(HomeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});