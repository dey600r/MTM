import { TestBed } from '@angular/core/testing';

// SERVICES
import { ConfigurationService } from './configuration.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

describe('ConfigurationService', () => {
    let service: ConfigurationService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(ConfigurationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
