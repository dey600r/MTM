import { TestBed } from '@angular/core/testing';

// SERVICES
import { ThemeService } from './theme.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(ThemeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
