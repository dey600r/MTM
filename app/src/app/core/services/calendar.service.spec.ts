import { TestBed } from '@angular/core/testing';

// SERVICES
import { CalendarService } from './calendar.service';

// CONFIGURATIONS
import { SetupTest } from '@src/testing';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { WearVehicleProgressBarViewModel } from '@models/index';

describe('CalendarService', () => {
    let service: CalendarService;
    let translate: TranslateService;

    beforeEach(async () => {
        TestBed.configureTestingModule(SetupTest.config);
        service = TestBed.inject(CalendarService);
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should transform date to format DD/MM/YYYY', () => {
        expect(service.getDateString(new Date(2020, 2, 5, 1, 1, 1))).toEqual('05/03/2020');
    });

    it('should transform date to format MM/DD/YYYY', async () => {
        await translate.use('en').toPromise();
        expect(service.getDateString(new Date(2020, 2, 5, 1, 1, 1))).toEqual('03/05/2020');
    });

    it('should transform date to format DB - YYYY-MM-DD', () => {
        expect(service.getDateStringToDB(new Date(2020, 2, 5, 1, 1, 1))).toEqual('2020-03-05');
    });

    it('should transform date to format DB - YYYY-MM-DD HH:mm:ss', () => {
        expect(service.getDateTimeStringToDB(new Date(2020, 2, 5, 10, 31, 11))).toEqual('2020-03-05 10:31:11');
    });

    it('should get diff months between dates', () => {
        expect(service.monthDiff(new Date(2020, 2, 5), new Date(2021, 3, 7))).toBe(13);
    });

    it('should get diff days between dates', () => {
        expect(service.dayDiff(new Date(2021, 2, 5), new Date(2021, 3, 7))).toBe(33);
    });

    it('should sum months to date', () => {
        expect(service.sumTimeToDate(new Date(2020, 2, 5), 12)).toEqual(new Date(2021, 2, 5));
    });

    it('should calculate kilometer vehicle estimated with km per month', () => {
        const today: Date = new Date();
        const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
        const data: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel(1, '', 80000,
            new Date(2015, 8, 1), 700, date);

        expect(service.calculateWearKmVehicleEstimated(data)).toEqual(80257);
    });

    it('should calculate kilometer vehicle estimated without km per month', () => {
        const today: Date = new Date();
        const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
        const data: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel(1, '', 80000,
            new Date(2015, 8, 1), null, date);

        expect(service.calculateWearKmVehicleEstimated(data)).toEqual(80419);
    });
});