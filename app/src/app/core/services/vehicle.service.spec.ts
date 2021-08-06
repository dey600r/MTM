import { TestBed } from '@angular/core/testing';

// SERVICES
import { VehicleService } from './vehicle.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

describe('VehicleService', () => {
    let service: VehicleService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(VehicleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
