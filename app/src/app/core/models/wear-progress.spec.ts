import { WearMaintenanceProgressBarViewModel, WearNotificationReplacementProgressBarViewModel, WearReplacementProgressBarViewModel, WearVehicleProgressBarViewModel } from "@models/index";
import { WarningWearEnum } from "@utils/index";

describe('WearProgressModels', () => {

    it('should initialize wearvehicleprogressbar model', () => {
        let base: WearVehicleProgressBarViewModel = new WearVehicleProgressBarViewModel();
        let date: Date = new Date();
        expect(base.idVehicle).toEqual(-1);
        expect(base.nameVehicle).toEqual('');
        expect(base.kmVehicle).toEqual(0);
        expect(base.kmEstimatedVehicle).toEqual(0);
        expect(base.datePurchaseVehicle).toEqual(date);
        expect(base.kmsPerMonthVehicle).toEqual(0);
        expect(base.dateKmsVehicle).toEqual(date);
        expect(base.typeVehicle).toEqual('');
        expect(base.iconVehicle).toEqual('');
        expect(base.percent).toEqual(0);
        expect(base.percentKm).toEqual(0);
        expect(base.percentTime).toEqual(0);
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningProgressBarIcon).toEqual('');
        expect(base.idConfiguration).toEqual(-1);
        expect(base.nameConfiguration).toEqual('');
        expect(base.listWearMaintenance).toEqual([]);
        base = new WearVehicleProgressBarViewModel(2, 'nameV', 100, 120, new Date(2021, 11, 1), 40, new Date(2022, 3, 3),
            0.5, 0.6, 0.7, WarningWearEnum.DANGER, [new WearMaintenanceProgressBarViewModel()]);
        expect(base.idVehicle).toEqual(2);
        expect(base.nameVehicle).toEqual('nameV');
        expect(base.kmVehicle).toEqual(100);
        expect(base.kmEstimatedVehicle).toEqual(120);
        expect(base.datePurchaseVehicle).toEqual(new Date(2021, 11, 1));
        expect(base.kmsPerMonthVehicle).toEqual(40);
        expect(base.dateKmsVehicle).toEqual(new Date(2022, 3, 3));
        expect(base.typeVehicle).toEqual('');
        expect(base.iconVehicle).toEqual('');
        expect(base.percent).toEqual(0.5);
        expect(base.percentKm).toEqual(0.6);
        expect(base.percentTime).toEqual(0.7);
        expect(base.warning).toEqual(WarningWearEnum.DANGER);
        expect(base.warningProgressBarIcon).toEqual('');
        expect(base.idConfiguration).toEqual(-1);
        expect(base.nameConfiguration).toEqual('');
        expect(base.listWearMaintenance[0].idMaintenance).toEqual(-1);
    });

    it('should initialize WearMaintenanceProgressBarView model', () => {
        let base: WearMaintenanceProgressBarViewModel = new WearMaintenanceProgressBarViewModel();
        expect(base.codeMaintenanceFreq).toEqual('');
        expect(base.iconMaintenance).toEqual('');
        expect(base.idMaintenance).toEqual(-1);
        expect(base.descriptionMaintenance).toEqual('');
        expect(base.kmMaintenance).toEqual(0);
        expect(base.timeMaintenance).toEqual(0);
        expect(base.fromKmMaintenance).toEqual(0);
        expect(base.toKmMaintenance).toEqual(0);
        expect(base.initMaintenance).toEqual(false);
        expect(base.wearMaintenance).toEqual(false);
        expect(base.listWearNotificationReplacement).toEqual([]);
        expect(base.listWearReplacement).toEqual([]);
        base = new WearMaintenanceProgressBarViewModel('code', 2, 'desc', 100, 12, 50, 500, true, true,
            [new WearNotificationReplacementProgressBarViewModel()], [new WearReplacementProgressBarViewModel()]);
        expect(base.codeMaintenanceFreq).toEqual('code');
        expect(base.iconMaintenance).toEqual('');
        expect(base.idMaintenance).toEqual(2);
        expect(base.descriptionMaintenance).toEqual('desc');
        expect(base.kmMaintenance).toEqual(100);
        expect(base.timeMaintenance).toEqual(12);
        expect(base.fromKmMaintenance).toEqual(50);
        expect(base.toKmMaintenance).toEqual(500);
        expect(base.initMaintenance).toEqual(true);
        expect(base.wearMaintenance).toEqual(true);
        expect(base.listWearNotificationReplacement[0].numWarning).toEqual(0);
        expect(base.listWearReplacement[0].idOperation).toEqual(-1);
    });

    it('should initialize WearReplacementProgressBarView model', () => {
        let base: WearReplacementProgressBarViewModel = new WearReplacementProgressBarViewModel();
        expect(base.idMaintenanceElement).toEqual(-1);
        expect(base.nameMaintenanceElement).toEqual('');
        expect(base.iconMaintenanceElement).toEqual('');
        expect(base.idOperation).toEqual(-1);
        expect(base.descriptionOperation).toEqual('');
        expect(base.kmOperation).toEqual(null);
        expect(base.dateOperation).toEqual(null);
        expect(base.priceOperation).toEqual(0);
        expect(base.kmAcumulateMaintenance).toEqual(0);
        expect(base.timeAcumulateMaintenance).toEqual(0);
        expect(base.calculateKms).toEqual(0);
        expect(base.calculateMonths).toEqual(0);
        expect(base.percentKms).toEqual(0);
        expect(base.warningIconClass).toEqual('');
        expect(base.warningKms).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningKmsProgressBarIcon).toEqual('');
        expect(base.warningKmsIcon).toEqual('');
        expect(base.warningKmsIconClass).toEqual('');
        expect(base.percentMonths).toEqual(0);
        expect(base.warningMonths).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningMonthsProgressBarIcon).toEqual('');
        expect(base.warningMonthsIcon).toEqual('');
        expect(base.warningMonthsIconClass).toEqual('');
    });

    it('should initialize WearNotificationReplacementProgressBarView model', () => {
        let base: WearNotificationReplacementProgressBarViewModel = new WearNotificationReplacementProgressBarViewModel();
        expect(base.numWarning).toEqual(0);
        expect(base.totalWarning).toEqual(0);
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningIcon).toEqual('');
        expect(base.warningIconClass).toEqual('');
    });
});
