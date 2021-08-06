import { TestBed } from '@angular/core/testing';

// LIBRARIES
import * as Moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

// PIPE
import { DateFormatCalendarPipe } from './date-format-calendar.pipe';

// SERVICES
import { CalendarService } from '@src/app/core/services';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

describe('DateFormatCalendarPipe', () => {
    let pipe: DateFormatCalendarPipe;
    let translate: TranslateService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        pipe = new DateFormatCalendarPipe(TestBed.inject(CalendarService));
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(pipe).toBeTruthy();
    });

    it('should be transform date to format DD/MM/YYYY', () => {
        expect(pipe.transform()).toEqual(Moment(new Date()).format('DD/MM/YYYY'));
    });

    it('should be transform date to format DD/MM/YYYY', () => {
        expect(pipe.transform(new Date(2020, 2, 5, 1, 1, 1))).toEqual('05/03/2020');
    });

    it('should be transform date to format MM/DD/YYYY', async () => {
        await translate.use('en').toPromise();
        expect(pipe.transform(new Date(2020, 2, 5, 1, 1, 1))).toEqual('03/05/2020');
    });
});
