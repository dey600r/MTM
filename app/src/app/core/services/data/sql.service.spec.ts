import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { SqlService } from './sql.service';

// CONFIGURATIONS
import { SetupTest } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

describe('SqlService', () => {
    let service: SqlService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
        }).compileComponents();
        service = TestBed.inject(SqlService);
        translate = TestBed.inject(TranslateService);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
