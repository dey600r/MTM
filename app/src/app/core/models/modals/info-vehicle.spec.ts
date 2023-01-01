import {
    InfoVehicleConfigurationMaintenanceElementModel, InfoVehicleConfigurationMaintenanceModel, InfoVehicleConfigurationModel,
    InfoVehicleHistoricModel, InfoVehicleHistoricReplacementModel, InfoVehicleReplacementModel
} from "@models/index";
import { WarningWearEnum } from "@utils/index";

describe('InfoVehicleModels', () => {

    it('should initialize infovehicleconfiguration model', () => {
        let base: InfoVehicleConfigurationModel = new InfoVehicleConfigurationModel();
        expect(base.idVehicle).toEqual(-1);
        expect(base.idConfiguration).toEqual(-1);
        expect(base.nameConfiguration).toEqual(null);
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.listMaintenance).toEqual([]);
        expect(base.kmEstimated).toEqual(0);
        base = new InfoVehicleConfigurationModel({
            idVehicle: 2,
            idConfiguration: 3,
            nameConfiguration: 'nameConfiguration',
            warning: WarningWearEnum.DANGER,
            listMaintenance: [new InfoVehicleConfigurationMaintenanceModel()],
            kmEstimated: 100
        });
        expect(base.idVehicle).toEqual(2);
        expect(base.idConfiguration).toEqual(3);
        expect(base.nameConfiguration).toEqual('nameConfiguration');
        expect(base.warning).toEqual(WarningWearEnum.DANGER);
        expect(base.listMaintenance[0].id).toEqual(-1);
        expect(base.kmEstimated).toEqual(100);
    });

    it('should initialize InfoVehicleConfigurationMaintenance model', () => {
        let base: InfoVehicleConfigurationMaintenanceModel = new InfoVehicleConfigurationMaintenanceModel();
        expect(base.id).toEqual(-1);
        expect(base.description).toEqual(null);
        expect(base.fromKm).toEqual(0);
        expect(base.toKm).toEqual(null);
        expect(base.km).toEqual(null);
        expect(base.time).toEqual(null);
        expect(base.init).toEqual(false);
        expect(base.wear).toEqual(false);
        expect(base.codeFrequency).toEqual(null);
        expect(base.descFrequency).toEqual(null);
        expect(base.listReplacement).toEqual([]);
        expect(base.iconMaintenance).toEqual('');
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningIcon).toEqual('');
        expect(base.warningIconClass).toEqual('');
        expect(base.active).toEqual(true);
        base = new InfoVehicleConfigurationMaintenanceModel({
            description: 'david',
            codeFrequency: 'code',
            descFrequency: 'desc',
            km: 100,
            time: 12,
            init: true,
            wear: true,
            fromKm: 10,
            toKm: 200,
            warning: WarningWearEnum.DANGER,
            active: false,
            id: 3,
            listReplacement: [ new InfoVehicleConfigurationMaintenanceElementModel()],
            iconMaintenance: 'icon',
            warningIcon: 'warning-icon',
            warningIconClass: 'warning-icon-class'
        });
        expect(base.id).toEqual(3);
        expect(base.description).toEqual('david');
        expect(base.fromKm).toEqual(10);
        expect(base.toKm).toEqual(200);
        expect(base.km).toEqual(100);
        expect(base.time).toEqual(12);
        expect(base.init).toEqual(true);
        expect(base.wear).toEqual(true);
        expect(base.codeFrequency).toEqual('code');
        expect(base.descFrequency).toEqual('desc');
        expect(base.listReplacement[0].id).toEqual(-1);
        expect(base.iconMaintenance).toEqual('icon');
        expect(base.warning).toEqual(WarningWearEnum.DANGER);
        expect(base.warningIcon).toEqual('warning-icon');
        expect(base.warningIconClass).toEqual('warning-icon-class');
        expect(base.active).toEqual(false);
    });

    it('should initialize InfoVehicleConfigurationMaintenanceElement model', () => {
        let base: InfoVehicleConfigurationMaintenanceElementModel = new InfoVehicleConfigurationMaintenanceElementModel();
        expect(base.id).toEqual(-1);
        expect(base.name).toEqual(null);
        expect(base.iconReplacement).toEqual(undefined);
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningIcon).toEqual(undefined);
        expect(base.warningIconClass).toEqual(undefined);
        base = new InfoVehicleConfigurationMaintenanceElementModel('david', WarningWearEnum.DANGER, 2);
        expect(base.id).toEqual(2);
        expect(base.name).toEqual('david');
        expect(base.iconReplacement).toEqual(undefined);
        expect(base.warning).toEqual(WarningWearEnum.DANGER);
        expect(base.warningIcon).toEqual(undefined);
        expect(base.warningIconClass).toEqual(undefined);
    });

    it('should initialize InfoVehicleHistoric model', () => {
        let base: InfoVehicleHistoricModel = new InfoVehicleHistoricModel();
        expect(base.id).toEqual(-1);
        expect(base.listHistoricReplacements).toEqual([]);
        base = new InfoVehicleHistoricModel(2, [new InfoVehicleHistoricReplacementModel()]);
        expect(base.id).toEqual(2);
        expect(base.listHistoricReplacements[0].id).toEqual(-1);
    });

    it('should initialize InfoVehicleHistoricReplacement model', () => {
        let base: InfoVehicleHistoricReplacementModel = new InfoVehicleHistoricReplacementModel();
        expect(base.id).toEqual(-1);
        expect(base.name).toEqual('');
        expect(base.km).toEqual(0);
        expect(base.time).toEqual(0);
        expect(base.kmAverage).toEqual(0);
        expect(base.timeAverage).toEqual(0);
        expect(base.priceAverage).toEqual(0);
        expect(base.planned).toEqual(false);
        expect(base.iconReplacement).toEqual('');
        expect(base.listReplacements).toEqual([]);
        base = new InfoVehicleHistoricReplacementModel({
            name: 'david',
            km: 100,
            time: 12,
            kmAverage: 50,
            timeAverage: 6,
            priceAverage: 2000,
            planned: true,
            listReplacements: [new InfoVehicleReplacementModel()],
            id: 2,
            iconReplacement: 'icon'
        });
        expect(base.id).toEqual(2);
        expect(base.name).toEqual('david');
        expect(base.km).toEqual(100);
        expect(base.time).toEqual(12);
        expect(base.kmAverage).toEqual(50);
        expect(base.timeAverage).toEqual(6);
        expect(base.priceAverage).toEqual(2000);
        expect(base.planned).toEqual(true);
        expect(base.iconReplacement).toEqual('icon');
        expect(base.listReplacements[0].id).toEqual(-1);
    });

    it('should initialize InfoVehicleReplacement model', () => {
        let base: InfoVehicleReplacementModel = new InfoVehicleReplacementModel();
        expect(base.id).toEqual(-1);
        expect(base.opName).toEqual('');
        expect(base.km).toEqual(0);
        expect(base.time).toEqual(0);
        expect(base.date.toDateString()).toEqual(new Date().toDateString());
        expect(base.price).toEqual(0);
        expect(base.priceOp).toEqual(0);
        const date = new Date(2022, 11, 12);
        base = new InfoVehicleReplacementModel({
            opName: 'david',
            km: 100,
            time: 12,
            date: date,
            price: 600,
            priceOp: 2000,
            id: 2
        });
        expect(base.id).toEqual(2);
        expect(base.opName).toEqual('david');
        expect(base.km).toEqual(100);
        expect(base.time).toEqual(12);
        expect(base.date.toDateString()).toEqual(date.toDateString());
        expect(base.price).toEqual(600);
        expect(base.priceOp).toEqual(2000);
    });
});
