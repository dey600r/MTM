import { TestBed } from '@angular/core/testing';

// SERVICES
import { InfoVehicleService } from './info-vehicle.service';
import { ControlService } from './control.service';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// CONFIGURATIONS
import { MockData, SetupTest, SpyMockConfig } from '@testing/index';

// MODELS
import { InfoVehicleConfigurationModel, InfoVehicleHistoricModel } from '@models/index';
import { WarningWearEnum } from '@utils/index';

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
        expect(service.getPercentKmVehicle(data[0])).toEqual(50);
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

    const validateInfoVehicleConfiguration = (data: InfoVehicleConfigurationModel, index: number) => {
        data.listMaintenance.forEach(main => {
            const dataMain = MockData.Configurations[index].listMaintenance.find(x => x.id === main.id);
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
            MockData.Operations, MockData.Vehicles, MockData.Configurations, MockData.Maintenances);
        expect(data.length).toEqual(3);
        const confProd: InfoVehicleConfigurationModel = data.find(x => x.idConfiguration === MockData.Configurations[0].id);
        expect(confProd.idVehicle).toEqual(MockData.Vehicles[0].id);
        validateInfoVehicleConfiguration(confProd, 0);
        expect(confProd.listMaintenance[0].warning).toEqual(WarningWearEnum.SUCCESS);
        expect(confProd.listMaintenance[1].warning).toEqual(WarningWearEnum.SKULL);
        expect(confProd.listMaintenance[2].warning).toEqual(WarningWearEnum.SKULL);
        expect(confProd.listMaintenance[3].warning).toEqual(WarningWearEnum.WARNING);
        const confHyosung: InfoVehicleConfigurationModel = data.find(x => x.idConfiguration === MockData.Configurations[1].id);
        validateInfoVehicleConfiguration(confHyosung, 1);
        expect(confHyosung.listMaintenance[0].warning).toEqual(WarningWearEnum.SUCCESS);
        expect(confHyosung.listMaintenance[1].warning).toEqual(WarningWearEnum.SKULL);
        expect(confHyosung.listMaintenance[2].warning).toEqual(WarningWearEnum.SUCCESS);
        expect(confHyosung.listMaintenance[3].warning).toEqual(WarningWearEnum.SKULL);
        expect(confHyosung.listMaintenance[4].warning).toEqual(WarningWearEnum.SKULL);
        const confKawa: InfoVehicleConfigurationModel = data.find(x => x.idConfiguration === MockData.Configurations[2].id);
        validateInfoVehicleConfiguration(confKawa, 2);
        expect(confKawa.listMaintenance[0].warning).toEqual(WarningWearEnum.SKULL);
        expect(confKawa.listMaintenance[1].warning).toEqual(WarningWearEnum.SUCCESS);
        expect(confKawa.listMaintenance[2].warning).toEqual(WarningWearEnum.SUCCESS);
    });

    it('should calculate info replacement historic', () => {
        const data: InfoVehicleHistoricModel[] = service.calculateInfoReplacementHistoric(
            MockData.Vehicles, MockData.Maintenances, MockData.Operations, MockData.Configurations, MockData.MaintenanceElements);
        expect(data.length).toEqual(3);
        const vehicleHyosung: InfoVehicleHistoricModel = data.find(x => x.id === MockData.Vehicles[0].id);
        expect(vehicleHyosung.id).not.toBeUndefined();
        expect(vehicleHyosung.listHistoricReplacements[0].name).toEqual(MockData.MaintenanceElements[4].name);
        expect(vehicleHyosung.listHistoricReplacements[0].km).toEqual(3660);
        expect(vehicleHyosung.listHistoricReplacements[0].kmAverage).toEqual(33333);
        expect(vehicleHyosung.listHistoricReplacements[0].priceAverage).toEqual(6);
        expect(vehicleHyosung.listHistoricReplacements[0].time).toEqual(45);
        expect(vehicleHyosung.listHistoricReplacements[0].timeAverage).toEqual(48);
        expect(vehicleHyosung.listHistoricReplacements[0].listReplacements.length).toEqual(3);
        expect(vehicleHyosung.listHistoricReplacements[2].name).toEqual(MockData.MaintenanceElements[0].name);
        expect(vehicleHyosung.listHistoricReplacements[2].km).toEqual(36660);
        expect(vehicleHyosung.listHistoricReplacements[2].kmAverage).toEqual(33500);
        expect(vehicleHyosung.listHistoricReplacements[2].priceAverage).toEqual(110);
        expect(vehicleHyosung.listHistoricReplacements[2].time).toEqual(52);
        expect(vehicleHyosung.listHistoricReplacements[2].timeAverage).toEqual(68);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements.length).toEqual(2);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].km).toEqual(12000);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].price).toEqual(110);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].priceOp).toEqual(333);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].time).toEqual(18);
        expect(vehicleHyosung.listHistoricReplacements[2].listReplacements[0].opName).toEqual(MockData.Operations[7].description);
    });
});
