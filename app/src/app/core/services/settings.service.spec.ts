import { TestBed } from '@angular/core/testing';

// SERVICES
import { SettingsService } from './settings.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

describe('SettingsService', () => {
    let service: SettingsService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(SettingsService);
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
