import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

// SERVICES
import { InfoVehicleService } from './info-vehicle.service';
import { ControlService } from '../common/index';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// CONFIGURATIONS
import { MockAppData, SetupTest, SpyMockConfig } from '@testing/index';

// MODELS
import { InfoVehicleConfigurationModel, InfoVehicleHistoricModel, IDashboardModel, ISettingModel } from '@models/index';
import {  WarningWearEnum } from '@utils/index';

describe('InfoVehicleService', () => {
    let service: InfoVehicleService;
    let translate: TranslateService;
    let controlService: ControlService;

    let measure: ISettingModel = { code: 'km', value: 'km', valueLarge: 'kilometer' };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: SetupTest.config.imports,
            providers: SpyMockConfig.ProvidersServices
        }).compileComponents();
        service = TestBed.inject(InfoVehicleService);
        translate = TestBed.inject(TranslateService);
        controlService = TestBed.inject(ControlService);
        await firstValueFrom(translate.use('es'));
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
    
    it('should get label average km vehicle', () => {
        const year: number = new Date().getFullYear();
        const data: IDashboardModel[] = [
            { id: 1, name: (year-6).toString(), value: 100 },
            { id: 1, name: (year-5).toString(), value: 200 },
            { id: 1, name: (year-4).toString(), value: 400 },
            { id: 1, name: (year-3).toString(), value: 600 },
            { id: 1, name: (year-2).toString(), value: 200 },
            { id: 1, name: (year-1).toString(), value: 800 },
            { id: 1, name: year.toString(), value: 12 },
        ];
        const label: string = service.getLabelAverageKmVehicle(data, measure);
        expect(label).toContain('330');
        expect(label).toContain('12');
        expect(label).toContain('km');
    });

    it('should get percent km vehicle', () => {
        const data = service.calculateInfoVehicleConfiguration(MockAppData.Operations, [MockAppData.Vehicles[0]],
            MockAppData.Configurations, MockAppData.Maintenances);
        expect(service.getPercentKmVehicle(data[0])).toEqual(50);
    });

    it('should get label km vehicle', () => {
        expect(service.getLabelKmVehicle(1000, 1000, measure)).toContain('1000');
        expect(service.getLabelKmVehicle(1000, 1000, measure)).not.toContain('2000');
        expect(service.getLabelKmVehicle(1000, 2000, measure)).toContain('2000');
    });

    it('should show toast message', () => {
        const showToast = spyOn(controlService, 'showMsgToast').and.returnValue(Promise.resolve());
        service.showInfoVehicle(new Date(), measure);
        expect(showToast).toHaveBeenCalled();
    });

    const validateInfoVehicleConfiguration = (data: InfoVehicleConfigurationModel, index: number) => {
        data.listMaintenance.forEach(main => {
            const dataMain = MockAppData.Configurations[index].listMaintenance.find(x => x.id === main.id);
            expect(dataMain).not.toBeUndefined();
            expect(main.km).toEqual(dataMain.km);
            expect(main.time).toEqual(dataMain.time);
            expect(main.init).toEqual(dataMain.init);
            expect(main.wear).toEqual(dataMain.wear);
            expect(main.fromKm).toEqual(dataMain.fromKm);
            expect(main.toKm).toEqual(dataMain.toKm);
            expect(main.codeFrequency).toEqual(dataMain.maintenanceFreq.code);
            expect(main.description).toEqual(dataMain.description);
        });
    };

    it('should calculate info vehicle configuration', () => {
        const data: InfoVehicleConfigurationModel[] = service.calculateInfoVehicleConfiguration(
            MockAppData.Operations, MockAppData.Vehicles, MockAppData.Configurations, MockAppData.Maintenances);
        expect(data.length).toEqual(3);
        const confProd: InfoVehicleConfigurationModel = data.find(x => x.idConfiguration === MockAppData.Configurations[0].id);
        expect(confProd.idVehicle).toEqual(MockAppData.Vehicles[0].id);
        validateInfoVehicleConfiguration(confProd, 0);
        expect(confProd.listMaintenance[0].warning).toEqual(WarningWearEnum.SUCCESS);
        expect(confProd.listMaintenance[1].warning).toEqual(WarningWearEnum.SKULL);
        expect(confProd.listMaintenance[2].warning).toEqual(WarningWearEnum.SKULL);
        expect(confProd.listMaintenance[3].warning).toEqual(WarningWearEnum.WARNING);
        const confHyosung: InfoVehicleConfigurationModel = data.find(x => x.idConfiguration === MockAppData.Configurations[1].id);
        validateInfoVehicleConfiguration(confHyosung, 1);
        expect(confHyosung.listMaintenance[0].warning).toEqual(WarningWearEnum.SUCCESS);
        expect(confHyosung.listMaintenance[1].warning).toEqual(WarningWearEnum.SKULL);
        expect(confHyosung.listMaintenance[2].warning).toEqual(WarningWearEnum.DANGER);
        expect(confHyosung.listMaintenance[3].warning).toEqual(WarningWearEnum.SKULL);
        expect(confHyosung.listMaintenance[4].warning).toEqual(WarningWearEnum.SKULL);
        const confKawa: InfoVehicleConfigurationModel = data.find(x => x.idConfiguration === MockAppData.Configurations[2].id);
        validateInfoVehicleConfiguration(confKawa, 2);
        expect(confKawa.listMaintenance[0].warning).toEqual(WarningWearEnum.SKULL);
        expect(confKawa.listMaintenance[1].warning).toEqual(WarningWearEnum.SKULL);
        expect(confKawa.listMaintenance[2].warning).toEqual(WarningWearEnum.WARNING);
    });

    it('should calculate info replacement historic', () => {
        const data: InfoVehicleHistoricModel[] = service.calculateInfoReplacementHistoric(
            MockAppData.Vehicles, MockAppData.Maintenances, MockAppData.Operations, MockAppData.Configurations, MockAppData.MaintenanceElements);
        expect(data.length).toEqual(3);
        const vehicleHyosung: InfoVehicleHistoricModel = data.find(x => x.id === MockAppData.Vehicles[0].id);
        expect(vehicleHyosung.id).not.toBeUndefined();
        expect(vehicleHyosung.listHistoricReplacements[0].name).toEqual(MockAppData.MaintenanceElements[4].name);
        expect(vehicleHyosung.listHistoricReplacements[0].km).toBeGreaterThanOrEqual(3940);
        expect(vehicleHyosung.listHistoricReplacements[0].kmAverage).toEqual(23900);
        expect(vehicleHyosung.listHistoricReplacements[0].priceAverage).toEqual(6);
        expect(vehicleHyosung.listHistoricReplacements[0].time).toBeGreaterThanOrEqual(40);
        expect(vehicleHyosung.listHistoricReplacements[0].timeAverage).toEqual(34);
        expect(vehicleHyosung.listHistoricReplacements[0].listReplacements.length).toEqual(5);
        expect(vehicleHyosung.listHistoricReplacements[2].name).toEqual(MockAppData.MaintenanceElements[5].name);
        expect(vehicleHyosung.listHistoricReplacements[2].km).toBeGreaterThanOrEqual(7840);
        expect(vehicleHyosung.listHistoricReplacements[2].kmAverage).toEqual(29875);
        expect(vehicleHyosung.listHistoricReplacements[2].priceAverage).toEqual(34);
        expect(vehicleHyosung.listHistoricReplacements[2].time).toBeGreaterThanOrEqual(40);
        expect(vehicleHyosung.listHistoricReplacements[2].timeAverage).toEqual(42);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements.length).toEqual(4);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].km).toEqual(9200);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].price).toEqual(34);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].priceOp).toEqual(900);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].time).toBeGreaterThanOrEqual(17);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].opName).toEqual(MockAppData.Operations[11].description);
    });
});
