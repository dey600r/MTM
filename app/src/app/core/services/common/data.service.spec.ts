import { TestBed } from '@angular/core/testing';

// SERVICES
import { DataService } from './data.service';

// CONFIGURATIONS
import { SetupTest } from '@testing/index';


describe('DataService', () => {
    let service: DataService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
        }).compileComponents();
        service = TestBed.inject(DataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
