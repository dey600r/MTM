import { MaintenanceFreqModel } from "@models/index";

describe('MaintenanceFreqModels', () => {

    it('should initialize maintenance frequency model', () => {
        let base: MaintenanceFreqModel = new MaintenanceFreqModel();
        expect(base.id).toEqual(1);
        expect(base.code).toEqual(null);
        expect(base.description).toEqual(null);
        expect(base.icon).toEqual(undefined);
        base = new MaintenanceFreqModel('david', 'description', 3);
        expect(base.id).toEqual(3);
        expect(base.code).toEqual('david');
        expect(base.description).toEqual('description');
        expect(base.icon).toEqual(undefined);
    });
});