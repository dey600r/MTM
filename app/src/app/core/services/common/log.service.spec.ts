import { TestBed } from '@angular/core/testing';

// SERVICES
import { LogService } from './log.service';

describe('LogService', () => {
    let service: LogService;

    beforeEach(() => {
        service = TestBed.inject(LogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    
});
