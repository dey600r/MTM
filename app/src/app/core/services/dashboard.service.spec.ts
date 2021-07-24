import { TestBed } from '@angular/core/testing';

// SERVICES
import { DashboardService } from './dashboard.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

describe('DashboardService', () => {
    let service: DashboardService;
    let translate: TranslateService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(DashboardService);
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
