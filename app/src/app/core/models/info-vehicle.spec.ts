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
        base = new InfoVehicleConfigurationModel(2, 3, 'nameConfiguration', WarningWearEnum.DANGER,
            [new InfoVehicleConfigurationMaintenanceModel()], 100);
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
        expect(base.iconMaintenance).toEqual(undefined);
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningIcon).toEqual(undefined);
        expect(base.warningIconClass).toEqual(undefined);
        expect(base.active).toEqual(true);
        base = new InfoVehicleConfigurationMaintenanceModel('david', [ new InfoVehicleConfigurationMaintenanceElementModel()],
            'code', 'desc', 100, 12, true, true, 10, 200, WarningWearEnum.DANGER, false, 3);
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
        expect(base.iconMaintenance).toEqual(undefined);
        expect(base.warning).toEqual(WarningWearEnum.DANGER);
        expect(base.warningIcon).toEqual(undefined);
        expect(base.warningIconClass).toEqual(undefined);
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
        expect(base.iconReplacement).toEqual(undefined);
        expect(base.listReplacements).toEqual([]);
        base = new InfoVehicleHistoricReplacementModel('david', 100, 12, 50, 6, 2000, true,
            [new InfoVehicleReplacementModel()], 2);
        expect(base.id).toEqual(2);
        expect(base.name).toEqual('david');
        expect(base.km).toEqual(100);
        expect(base.time).toEqual(12);
        expect(base.kmAverage).toEqual(50);
        expect(base.timeAverage).toEqual(6);
        expect(base.priceAverage).toEqual(2000);
        expect(base.planned).toEqual(true);
        expect(base.iconReplacement).toEqual(undefined);
        expect(base.listReplacements[0].id).toEqual(-1);
    });

    it('should initialize InfoVehicleReplacement model', () => {
        let base: InfoVehicleReplacementModel = new InfoVehicleReplacementModel();
        expect(base.id).toEqual(-1);
        expect(base.opName).toEqual('');
        expect(base.km).toEqual(0);
        expect(base.time).toEqual(0);
        expect(base.date).toEqual(new Date());
        expect(base.price).toEqual(0);
        expect(base.priceOp).toEqual(0);
        base = new InfoVehicleReplacementModel('david', 100, 12, new Date(2022, 11, 12), 600, 2000, 2);
        expect(base.id).toEqual(2);
        expect(base.opName).toEqual('david');
        expect(base.km).toEqual(100);
        expect(base.time).toEqual(12);
        expect(base.date).toEqual(new Date(2022, 11, 12));
        expect(base.price).toEqual(600);
        expect(base.priceOp).toEqual(2000);
    });
});
