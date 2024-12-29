import { CalendarInputModal, InfoCalendarMaintOpViewModel, InfoCalendarReplacementViewModel, InfoCalendarVehicleViewModel } from "@models/index";
import { WarningWearEnum } from "@utils/index";

describe('InfoCalendarModels', () => {

    it('should initialize infocalendarvehicle view', () => {
        const base: InfoCalendarVehicleViewModel = new InfoCalendarVehicleViewModel();
        expect(base.idVehicle).toEqual(-1);
        expect(base.nameVehicle).toEqual('');
        expect(base.iconVehicle).toEqual('');
        expect(base.typeVehicle).toEqual('');
        expect(base.listInfoCalendarMaintOp).toEqual([]);
    });

    it('should initialize infocalendarmaintenance view', () => {
        const base: InfoCalendarMaintOpViewModel = new InfoCalendarMaintOpViewModel();
        expect(base.id).toEqual(-1);
        expect(base.description).toEqual('');
        expect(base.detailOperation).toEqual('');
        expect(base.icon).toEqual('');
        expect(base.kmOperation).toEqual(0);
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
        expect(base.date.toDateString()).toEqual(new Date().toDateString());
        expect(base.dateFormat).toEqual('');
        expect(base.km).toEqual(0);
        expect(base.time).toEqual(0);
        expect(base.price).toEqual(0);
        expect(base.warning).toEqual(WarningWearEnum.SUCCESS);
        expect(base.warningIcon).toEqual('');
        expect(base.warningIconClass).toEqual('');
    });

    it('should initialize calendar input modal', () => {
        const input: CalendarInputModal = new CalendarInputModal();
        expect(input.operations.length).toEqual(0);
        expect(input.wear.length).toEqual(0);
        expect(input.vehicleSelected).toEqual(-1);
    });
});