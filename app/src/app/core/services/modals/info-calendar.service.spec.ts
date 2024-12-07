import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { InfoCalendarService } from './info-calendar.service';
import { HomeService } from '../pages/index';

// CONFIGURATIONS
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';
import { Constants, WarningWearEnum } from '@utils/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { InfoCalendarReplacementViewModel, InfoCalendarVehicleViewModel, WearVehicleProgressBarViewModel } from '@models/index';

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
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        const result: InfoCalendarVehicleViewModel[] = service.getInfoCalendar(allWears, []);
        expect(result[0].nameVehicle).toEqual(`${MockAppData.Vehicles[1].brand} ${MockAppData.Vehicles[1].model}`);
        expect(result[0].listInfoCalendarMaintOp[0].codeMaintenanceFreq).toEqual(Constants.MAINTENANCE_FREQ_CALENDAR_CODE);
        expect(result[0].listInfoCalendarMaintOp[0].wearMaintenance).toEqual(false);
        expect(result[0].listInfoCalendarMaintOp[0].listInfoCalendarReplacement[0].km).toEqual(6000);
        expect(service.getInfoCalendar([], [])).toEqual([]);
    });

    it('should get empty list info calendar vehicle view filter with past date', () => {
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        const listInfoCalendar: InfoCalendarVehicleViewModel[] = service.getInfoCalendar(allWears, []);
        const result: InfoCalendarVehicleViewModel[] = service.getInfoCalendarReplacementDate(listInfoCalendar,
            [new Date(2007, 1, 1), new Date(2008, 11, 31)]);
        expect(result).toEqual([]);
    });

    it('should get empty list info calendar vehicle view filter with future date', () => {
        const listInfoCalendar: InfoCalendarVehicleViewModel[] = service.getInfoCalendar([], MockAppData.Operations);
        const today = new Date();
        const result: InfoCalendarVehicleViewModel[] = service.getInfoCalendarReplacementDate(listInfoCalendar,
            [today, new Date(today.getFullYear(), today.getMonth() + 10, today.getDate() + 15)]);
        expect(result).toEqual([]);
    });

    it('should get list info calendar vehicle maintenance view filter with date', () => {
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        const listInfoCalendar: InfoCalendarVehicleViewModel[] = service.getInfoCalendar(allWears, []);
        const result: InfoCalendarVehicleViewModel[] = service.getInfoCalendarReplacementDate(listInfoCalendar, [new Date()]);
        expect(result.some(x => x.nameVehicle == `${MockAppData.Vehicles[1].brand} ${MockAppData.Vehicles[1].model}`)).toBeTrue();
        expect(result[0].listInfoCalendarMaintOp[0].listInfoCalendarReplacement.length).toEqual(2);
        expect(result.some(x => x.nameVehicle == `${MockAppData.Vehicles[0].brand} ${MockAppData.Vehicles[0].model}`)).toBeTrue();
        expect(result[1].listInfoCalendarMaintOp[0].listInfoCalendarReplacement.length).toEqual(2);
        expect(service.getInfoCalendarReplacementDate([], [])).toEqual([]);
    });

    it('should get list info calendar vehicle operation view filter with date', () => {
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        const listInfoCalendar: InfoCalendarVehicleViewModel[] = service.getInfoCalendar(allWears, MockAppData.Operations);
        const result: InfoCalendarVehicleViewModel[] = service.getInfoCalendarReplacementDate(listInfoCalendar, 
            [new Date(2022, 1, 1), new Date(2023, 11, 31)]);
        expect(result.some(x => x.nameVehicle == `${MockAppData.Vehicles[1].brand} ${MockAppData.Vehicles[1].model}`)).toBeTrue();
        expect(result[0].listInfoCalendarMaintOp[0].listInfoCalendarReplacement.length).toEqual(2);
        const op = MockAppData.Operations.find(x => x.id === 6);
        expect(result[0].listInfoCalendarMaintOp[0].id).toEqual(op.id);
        expect(result[0].listInfoCalendarMaintOp[0].detailOperation).toEqual(op.details);
        expect(result[0].listInfoCalendarMaintOp[0].listInfoCalendarReplacement.length).toEqual(op.listMaintenanceElement.length);

    });

    it('should validate date between range dates', () => {
        const resultOK: boolean = service.isDateEquals(new Date(), [new Date(2020, 1, 1), new Date()]);
        expect(resultOK).toBeTruthy();
        const resultKO: boolean = service.isDateEquals(new Date(2019, 1, 2), [new Date(2020, 1, 1), new Date()]);
        expect(resultKO).toBeFalsy();
    });

    it('should calculate circle color advice', () => {
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        const listInfoCalendar: InfoCalendarVehicleViewModel[] = service.getInfoCalendar(allWears, []);
        let allColors: string[] = [];
        listInfoCalendar.forEach(v => {
            v.listInfoCalendarMaintOp.forEach(m => {
                m.listInfoCalendarReplacement.forEach(r => {
                    const color: string = service.getCircleColor(listInfoCalendar, r);
                    if (!allColors.some(x => x === color)) {
                        allColors = [...allColors, color];
                    }
                });
            });
        });

        expect(allColors.some(x => x === 'day-circle-config-success')).toBeTruthy();
        expect(allColors.some(x => x === 'day-circle-config-all')).toBeTruthy();
    });

    it('should create info calendar replacement', () => {
        let today: Date = new Date();
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        let result: InfoCalendarReplacementViewModel = service.createInfoCalendarReplacement(allWears[0], 
                                                                allWears[0].listWearMaintenance[3], 
                                                                allWears[0].listWearMaintenance[3].listWearReplacement[1], true);
        
        expect(result.idReplacement).toEqual(6);
        expect(result.nameReplacement).toEqual(MockAppData.MaintenanceElementsAux[5].name);
        expect(result.km).toEqual(88000);
        expect(result.price).toEqual(472);
        expect(result.time).toEqual(0);
        expect(result.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(result.date.getTime()).toBeLessThanOrEqual(new Date(today.getFullYear() + 14, today.getMonth() + 2, today.getDate() - 5).getTime());
        expect(result.date.getTime()).toBeGreaterThanOrEqual(new Date(today.getFullYear() + 14, today.getMonth(), today.getDate() - 5).getTime());

        allWears[1].listWearMaintenance[0].listWearReplacement[0].priceOperation = null;
        result = service.createInfoCalendarReplacement(allWears[1], 
                                                        allWears[1].listWearMaintenance[0], 
                                                        allWears[1].listWearMaintenance[0].listWearReplacement[0], true);

        expect(result.idReplacement).toEqual(4);
        expect(result.nameReplacement).toEqual(MockAppData.MaintenanceElementsAux[3].name);
        expect(result.km).toEqual(2000);
        expect(result.price).toEqual(0);
        expect(result.time).toEqual(0);
        expect(result.warning).toEqual(WarningWearEnum.SKULL);
        expect(result.date.getTime()).toBeLessThanOrEqual(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate() - 11).getTime());
        expect(result.date.getTime()).toBeGreaterThanOrEqual(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 11).getTime());
    });

    it('should get date from km', () => {
        let today: Date = new Date();
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        const date: Date = service.getDateCalculatingKm(allWears[0], 
                                                        allWears[0].listWearMaintenance[3], 
                                                        allWears[0].listWearMaintenance[3].listWearReplacement[1]);
        expect(date.getTime()).toBeLessThanOrEqual(new Date(today.getFullYear() + 14, today.getMonth() + 2, today.getDate() - 5).getTime());
        expect(date.getTime()).toBeGreaterThanOrEqual(new Date(today.getFullYear() + 14, today.getMonth(), today.getDate() - 5).getTime());
    });

    it('should get date from time', () => {
        let today: Date = new Date();
        const allWears: WearVehicleProgressBarViewModel[] = homeService.getWearReplacementToVehicle(
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        const date: Date = service.getDateCalculatingTime(allWears[0], 
                                                        allWears[0].listWearMaintenance[3], 
                                                        allWears[0].listWearMaintenance[3].listWearReplacement[1]);
        expect(date).toEqual(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate() + 6));
    });

    it('should calculate km info notification', () => {
        let today: Date = new Date();
        const result1 = service.calculateKmInfoNotification(MockAppData.Vehicles[0], 10, 1000);
        expect(result1.getTime()).toBeLessThanOrEqual(new Date(today.getFullYear() - 2, today.getMonth() -1, today.getDate() + 7).getTime());
        expect(result1.getTime()).toBeGreaterThanOrEqual(new Date(today.getFullYear() - 2, today.getMonth() -1, today.getDate() + 5).getTime());
        const result2 = service.calculateKmInfoNotification(MockAppData.Vehicles[1], 0, 2000);
        expect(result2.getTime()).toBeLessThanOrEqual(new Date(today.getFullYear() + 1, today.getMonth() + 1, today.getDate()).getTime());
        expect(result2.getTime()).toBeGreaterThanOrEqual(new Date(today.getFullYear() + 1, today.getMonth() + 1, today.getDate() - 2).getTime());
        const result3 = service.calculateKmInfoNotification(MockAppData.Vehicles[2], 1000, 6000);
        expect(result3.getTime()).toBeLessThanOrEqual(new Date(today.getFullYear() - 1, today.getMonth() - 6, today.getDate() - 7).getTime());
        expect(result3.getTime()).toBeGreaterThanOrEqual(new Date(today.getFullYear() - 1, today.getMonth() - 6, today.getDate() - 9).getTime());
    });
});
