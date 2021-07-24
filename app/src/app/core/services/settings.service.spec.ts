import { TestBed } from '@angular/core/testing';

// SERVICES
import { SettingsService } from './settings.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

describe('SettingsService', () => {
    let service: SettingsService;
    let translate: TranslateService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(SettingsService);
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
