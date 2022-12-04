import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { InfoCalendarService } from './info-calendar.service';
import { HomeService } from '../pages/index';

// CONFIGURATIONS
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';
import { Constants } from '@utils/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { InfoCalendarVehicleViewModel, WearVehicleProgressBarViewModel } from '@models/index';

describe('InfoCalendarService', () => {
    let service: InfoCalendarService;
    let homeService: HomeService;
    let translate: TranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(InfoCalendarService);
        homeService = TestBed.inject(HomeService);
        translate = TestBed.inject(TranslateService);
        await firstValueFrom(translate.use('es'));
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
        let allColors: string[] = [];
        listInfoCalendar.forEach(v => {
            v.listInfoCalendarMaintenance.forEach(m => {
                m.listInfoCalendarReplacement.forEach(r => {
                    const color: string = service.getCircleColor(listInfoCalendar, r);
                    if (!allColors.some(x => x === color)) {
                        allColors = [...allColors, color];
                    }
                });
            });
        });

        expect(allColors.some(x => x === 'day-circle-config-skull')).toBeTruthy();
        expect(allColors.some(x => x === 'day-circle-config-danger')).toBeTruthy();
        expect(allColors.some(x => x === 'day-circle-config-warning')).toBeTruthy();
        expect(allColors.some(x => x === 'day-circle-config-success')).toBeTruthy();
        expect(allColors.some(x => x === 'day-circle-config-all')).toBeFalsy();
    });
});
