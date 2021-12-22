import { TestBed } from '@angular/core/testing';

// SERVICES
import { CalendarService } from './calendar.service';
import { HomeService } from './home.service';

// CONFIGURATIONS
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { Constants } from '@utils/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { InfoCalendarVehicleViewModel, WearVehicleProgressBarViewModel } from '@models/index';

describe('CalendarService', () => {
    let service: CalendarService;
    let homeService: HomeService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(CalendarService);
        homeService = TestBed.inject(HomeService);
        translate = TestBed.inject(TranslateService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should transform date to format DD/MM/YYYY', () => {
        expect(service.getDateString(new Date(2020, 2, 5, 1, 1, 1))).toEqual('05/03/2020');
    });

    it('should transform date to format MM/DD/YYYY - EN', async () => {
        await translate.use('en').toPromise();
        expect(service.getDateString(new Date(2020, 2, 5, 1, 1, 1))).toEqual('03/05/2020');
    });

    it('should get format calendar week start - EN', async () => {
        await translate.use('en').toPromise();
        expect(service.getFormatCalendarWeekStart()).toEqual(0);
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
        const data: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel(1, '', 80000,
            new Date(2015, 8, 1), 700, date);

        const result: number = service.calculateWearKmVehicleEstimated(data);
        expect(result).toBeLessThanOrEqual(80419);
        expect(result).toBeGreaterThanOrEqual(80233);
    });

    it('should calculate kilometer vehicle estimated without km per month', () => {
        const today: Date = new Date();
        const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
        const data: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel(1, '', 80000,
            new Date(2015, 8, 1), null, date);

        const result: number = service.calculateWearKmVehicleEstimated(data);
        expect(result).toBeLessThanOrEqual(80419);
        expect(result).toBeGreaterThanOrEqual(80356);
    });

    it('should calculate kilometer vehicle estimated without km per month and new motorbike', () => {
        const today: Date = new Date();
        const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10);
        const datePurchase: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15);
        const data: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel(1, '', 0,
            datePurchase, null, date);

        expect(service.calculateWearKmVehicleEstimated(data)).toEqual(0);
    });

    it('should map list wear notification to list info calendar vehicle view', () => {
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockData.Operations, MockData.Vehicles, MockData.Configurations, MockData.Maintenances);
        const result: InfoCalendarVehicleViewModel[] = service.getInfoCalendar(allWears);
        expect(result[0].nameVehicle).toEqual(`${MockData.Vehicles[1].brand} ${MockData.Vehicles[1].model}`);
        expect(result[0].listInfoCalendarMaintenance[0].codeMaintenanceFreq).toEqual(Constants.MAINTENANCE_FREQ_CALENDAR_CODE);
        expect(result[0].listInfoCalendarMaintenance[0].wearMaintenance).toEqual(false);
        expect(result[0].listInfoCalendarMaintenance[0].listInfoCalendarReplacement[0].km).toEqual(76770);
        expect(service.getInfoCalendar([])).toEqual([]);
    });

    it('should get list info calendar vehicle view filter with date', () => {
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockData.Operations, MockData.Vehicles, MockData.Configurations, MockData.Maintenances);
        const listInfoCalendar: InfoCalendarVehicleViewModel[] = service.getInfoCalendar(allWears);
        const result: InfoCalendarVehicleViewModel[] = service.getInfoCalendarReplacementDate(listInfoCalendar,
            [new Date(2007, 1, 1), new Date(2008, 11, 31)]);
        expect(result[0].nameVehicle).toEqual(`${MockData.Vehicles[1].brand} ${MockData.Vehicles[1].model}`);
        expect(result[0].listInfoCalendarMaintenance[0].listInfoCalendarReplacement.length).toEqual(2);
        expect(result[1].nameVehicle).toEqual(`${MockData.Vehicles[0].brand} ${MockData.Vehicles[0].model}`);
        expect(result[1].listInfoCalendarMaintenance[0].listInfoCalendarReplacement.length).toEqual(2);
        expect(service.getInfoCalendarReplacementDate([], [])).toEqual([]);
    });

    it('should validate date between range dates', () => {
        const resultOK: boolean = service.isDateEquals(new Date(), [new Date(2020, 1, 1), new Date()]);
        expect(resultOK).toBeTruthy();
        const resultKO: boolean = service.isDateEquals(new Date(2019, 1, 2), [new Date(2020, 1, 1), new Date()]);
        expect(resultKO).toBeFalsy();
    });

    it('should calculate circle color advice', () => {
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockData.Operations, MockData.Vehicles, MockData.Configurations, MockData.Maintenances);
        const listInfoCalendar: InfoCalendarVehicleViewModel[] = service.getInfoCalendar(allWears);
        listInfoCalendar.forEach(v => {
            v.listInfoCalendarMaintenance.forEach(m => {
                m.listInfoCalendarReplacement.forEach(r => {
                    console.log(service.getCircleColor(listInfoCalendar, r));
                });
            });
        });

        const resultSkull: string = service.getCircleColor(listInfoCalendar,
            listInfoCalendar[0].listInfoCalendarMaintenance[2].listInfoCalendarReplacement[2]);
        expect(resultSkull).toEqual('day-circle-config-skull');
        const resultDanger: string = service.getCircleColor(listInfoCalendar,
            listInfoCalendar[0].listInfoCalendarMaintenance[0].listInfoCalendarReplacement[2]);
        expect(resultDanger).toEqual('day-circle-config-danger');
        const resultWarning: string = service.getCircleColor(listInfoCalendar,
            listInfoCalendar[0].listInfoCalendarMaintenance[3].listInfoCalendarReplacement[2]);
        expect(resultWarning).toEqual('day-circle-config-warning');
        const resultSuccess: string = service.getCircleColor(listInfoCalendar,
            listInfoCalendar[0].listInfoCalendarMaintenance[0].listInfoCalendarReplacement[3]);
        expect(resultSuccess).toEqual('day-circle-config-success');
        // const resultAll: string = service.getCircleColor(listInfoCalendar,
        //     listInfoCalendar[0].listInfoCalendarMaintenance[1].listInfoCalendarReplacement[1]);
        // expect(resultAll).toEqual('day-circle-config-all');
    });
});
