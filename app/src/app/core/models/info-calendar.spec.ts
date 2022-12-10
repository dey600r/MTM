import { InfoCalendarMaintenanceViewModel, InfoCalendarReplacementViewModel, InfoCalendarVehicleViewModel } from "@models/index";
import { WarningWearEnum } from "@utils/index";

describe('InfoCalendarModels', () => {

    it('should initialize infocalendarvehicle view', () => {
        const base: InfoCalendarVehicleViewModel = new InfoCalendarVehicleViewModel();
        expect(base.idVehicle).toEqual(-1);
        expect(base.nameVehicle).toEqual('');
        expect(base.iconVehicle).toEqual('');
        expect(base.typeVehicle).toEqual('');
        expect(base.listInfoCalendarMaintenance).toEqual([]);
    });

    it('should initialize infocalendarmaintenance view', () => {
        const base: InfoCalendarMaintenanceViewModel = new InfoCalendarMaintenanceViewModel();
        expect(base.idMaintenance).toEqual(-1);
        expect(base.descriptionMaintenance).toEqual('');
        expect(base.iconMaintenance).toEqual('');
        expect(base.initMaintenance).toEqual(false);
        expect(base.wearMaintenance).toEqual(false);
        expect(base.codeMaintenanceFreq).toEqual('');
        expect(base.fromKmMaintenance).toEqual(0);
        expect(base.toKmMaintenance).toEqual(0);
        expect(base.listInfoCalendarReplacement).toEqual([]);
    });

    it('should initialize infocalendarreplacement view', () => {
        const base: InfoCalendarReplacementViewModel = new InfoCalendarReplacementViewModel();
        expect(base.idReplacement).toEqual(-1);
        expect(base.nameReplacement).toEqual('');
        expect(base.iconReplacement).toEqual('');
        expect(base.date).toEqual(new Date());
        expect(base.dateFormat).toEqual('');
        expect(base.km).toEqual(0);
        expect(base.time).toEqual(0);
        expect(base.price).toEqual(0);
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningIcon).toEqual('');
        expect(base.warningIconClass).toEqual('');
    });
});