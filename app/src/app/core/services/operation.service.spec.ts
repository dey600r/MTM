import { TestBed } from '@angular/core/testing';

// SERVICES
import { OperationService } from './operation.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

describe('OperationService', () => {
    let service: OperationService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(OperationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
