import { TestBed } from '@angular/core/testing';

// SERVICES
import { DataBaseService } from './data-base.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

describe('DataBaseService', () => {
    let service: DataBaseService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(DataBaseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
