import { TestBed } from '@angular/core/testing';

// SERVICES
import { OperationService } from './operation.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

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
});
