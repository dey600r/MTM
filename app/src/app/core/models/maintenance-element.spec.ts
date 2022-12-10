import { MaintenanceElementModel } from "@models/index";

describe('MaintenanceElementModels', () => {

    it('should initialize maintenance element model', () => {
        let base: MaintenanceElementModel = new MaintenanceElementModel();
        expect(base.id).toEqual(1);
        expect(base.name).toEqual(null);
        expect(base.description).toEqual(null);
        expect(base.icon).toEqual(undefined);
        expect(base.price).toEqual(0);
        expect(base.master).toEqual(false);
        base = new MaintenanceElementModel('david', 'description', true, 2, 3);
        expect(base.id).toEqual(3);
        expect(base.name).toEqual('david');
        expect(base.description).toEqual('description');
        expect(base.icon).toEqual(undefined);
        expect(base.price).toEqual(2);
        expect(base.master).toEqual(true);
    });
});