import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { CalendarService } from './calendar.service';

// CONFIGURATIONS
import { SetupTest, SpyMockConfig } from '@testing/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { VehicleModel } from '@models/index';

describe('CalendarService', () => {
    let service: CalendarService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(CalendarService);
        translate = TestBed.inject(TranslateService);
        await firstValueFrom(translate.use('es'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should transform date to format DD/MM/YYYY', () => {
        expect(service.getDateString(new Date(2020, 2, 5, 1, 1, 1))).toEqual('05/03/2020');
    });

    it('should transform date to format MM/DD/YYYY - EN', async () => {
        await firstValueFrom(translate.use('en'));
        expect(service.getDateString(new Date(2020, 2, 5, 1, 1, 1))).toEqual('03/05/2020');
    });

    it('should get format calendar week start - ES', () => {
        expect(service.getFormatCalendarWeekStart()).toEqual(1);
    });

    it('should get format calendar week start - EN', async () => {
        await firstValueFrom(translate.use('en'));
        expect(service.getFormatCalendarWeekStart()).toEqual(0);
    });

    it('should get format calendar week - ES', () => {
        expect(service.getFormatCalendarWeek()).toEqual(['D', 'L', 'M', 'X', 'J', 'V', 'S']);
    });

    it('should get format calendar week - EN', async () => {
        await firstValueFrom(translate.use('en'));
        expect(service.getFormatCalendarWeek()).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    });

    it('should get format calendar month - ES', () => {
        expect(service.getFormatCalendarMonth()).toEqual(['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DEC']);
    });

    it('should get format calendar month - EN', async () => {
        await firstValueFrom(translate.use('en'));
        expect(service.getFormatCalendarMonth()).toEqual(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']);
    });
    
    it('should transform date to format DB - YYYY-MM-DD', () => {
        expect(service.getDateStringToDB(new Date(2020, 2, 5, 1, 1, 1))).toEqual('2020-03-05');
    });

    it('should transform date to format DB - YYYY-MM-DD HH:mm:ss', () => {
        expect(service.getDateTimeStringToDB(new Date(2020, 2, 5, 10, 31, 11))).toEqual('2020-03-05 10:31:11');
    });

    it('should get diff months between dates', () => {
        expect(service.monthDiff(new Date(2020, 2, 5), new Date(2021, 3, 7))).toBe(13);
        expect(service.monthDiff(new Date(2021, 3, 7), new Date(2020, 2, 5))).toBe(0);
    });

    it('should get diff days between dates', () => {
        expect(service.dayDiff(new Date(2021, 2, 5), new Date(2021, 3, 7))).toBe(33);
        expect(service.dayDiff(new Date(2021, 2, 5), new Date(2021, 2, 5))).toBe(0);
    });

    it('should sum months to date', () => {
        expect(service.sumTimeToDate(new Date(2020, 2, 5), 12)).toEqual(new Date(2021, 2, 5));
    });

    it('should calculate kilometer vehicle estimated with km per month', () => {
        const today: Date = new Date();
        const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
        const vehice = new VehicleModel({
            km: 80000,
            kmsPerMonth: 700,
            dateKms: date,
            datePurchase: new Date(2015, 8, 1)
        });

        const result: number = service.calculateKmVehicleEstimated(vehice);
        expect(result).toBeGreaterThanOrEqual(vehice.km);
    });

    it('should calculate kilometer vehicle estimated without km per month', () => {
        const today: Date = new Date();
        const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
        const vehice = new VehicleModel({
            km: 80000,
            dateKms: date,
            datePurchase: new Date(2015, 8, 1)
        });

        const result: number = service.calculateKmVehicleEstimated(vehice);
        expect(result).toBeGreaterThanOrEqual(vehice.km);
    });

    it('should calculate kilometer vehicle estimated without km per month and new motorbike', () => {
        const today: Date = new Date();
        const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
        const datePurchase: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15);
        const vehice = new VehicleModel({
            km: 0,
            dateKms: date,
            datePurchase: datePurchase
        });

        const result: number = service.calculateKmVehicleEstimated(vehice);
        expect(result).toEqual(0);
    });

    it('should not calculate kilometer vehicle estimated', () => {
        const today: Date = new Date();
        const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
        const vehice = new VehicleModel({
            km: 80000,
            kmsPerMonth: 700,
            dateKms: date,
            datePurchase: new Date(2015, 8, 1),
            active: false
        });

        const result: number = service.calculateKmVehicleEstimated(vehice);
        expect(result).toEqual(vehice.km);
    });
});
