import { TestBed } from '@angular/core/testing';

// SERVICES
import { SqlService } from './sql.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

describe('SqlService', () => {
    let service: SqlService;
    let translate: TranslateService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(SqlService);
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
