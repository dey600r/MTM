import { TestBed } from '@angular/core/testing';

// SERVICES
import { ControlService } from './control.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

describe('ControlService', () => {
    let service: ControlService;
    let translate: TranslateService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(ControlService);
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
