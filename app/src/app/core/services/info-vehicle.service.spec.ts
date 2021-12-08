import { TestBed } from '@angular/core/testing';

// SERVICES
import { InfoVehicleService } from './info-vehicle.service';
import { ControlService } from './control.service';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// CONFIGURATIONS
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';

describe('InfoVehicleService', () => {
    let service: InfoVehicleService;
    let translate: TranslateService;
    let controlService: ControlService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(InfoVehicleService);
        translate = TestBed.inject(TranslateService);
        controlService = TestBed.inject(ControlService);
        await translate.use('es').toPromise();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get icon percent', () => {
        expect(service.getIconPercent(20, 'icon')).toEqual('skull');
        expect(service.getIconPercent(40, 'icon')).toEqual('nuclear');
        expect(service.getIconPercent(60, 'icon')).toEqual('warning');
        expect(service.getIconPercent(90, 'icon')).toEqual('checkmark-done-circle');
    });

    it('should get color icon percent', () => {
        expect(service.getIconPercent(20, 'color')).toEqual(' icon-color-skull');
        expect(service.getIconPercent(40, 'color')).toEqual(' icon-color-danger');
        expect(service.getIconPercent(60, 'color')).toEqual(' icon-color-warning');
        expect(service.getIconPercent(90, 'color')).toEqual(' icon-color-success');
    });

    it('should get percent km vehicle', () => {
        const data = service.calculateInfoVehicleConfiguration(MockData.Operations, MockData.Vehicles,
            MockData.Configurations, MockData.Maintenances);
        expect(service.getPercentKmVehicle(data[0])).toEqual(25);
    });

    it('should get label km vehicle', () => {
        expect(service.getLabelKmVehicle(1000, 1000, { value: 'km' })).toContain('1000');
        expect(service.getLabelKmVehicle(1000, 1000, { value: 'km' })).not.toContain('2000');
        expect(service.getLabelKmVehicle(1000, 2000, { value: 'km' })).toContain('2000');
    });

    it('should show toast message', () => {
        const showToast = spyOn(controlService, 'showMsgToast').and.returnValue(Promise.resolve());
        service.showInfoVehicle(new Date(), { valueLarge: 'km'});
        expect(showToast).toHaveBeenCalled();
    });
});
