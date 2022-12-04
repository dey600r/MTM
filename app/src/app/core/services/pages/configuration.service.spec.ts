import { TestBed } from '@angular/core/testing';

// SERVICES
import { ConfigurationService } from './configuration.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

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
});
