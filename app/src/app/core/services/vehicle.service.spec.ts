import { TestBed } from '@angular/core/testing';

// SERVICES
import { VehicleService } from './vehicle.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

describe('VehicleService', () => {
    let service: VehicleService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(VehicleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
