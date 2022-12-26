import { MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel } from "@models/index";

describe('MaintenanceModels', () => {

    it('should initialize maintenance model', () => {
        let base: MaintenanceModel = new MaintenanceModel();
        expect(base.id).toEqual(1);
        expect(base.description).toEqual(null);
        expect(base.fromKm).toEqual(0);
        expect(base.toKm).toEqual(null);
        expect(base.km).toEqual(null);
        expect(base.time).toEqual(null);
        expect(base.init).toEqual(false);
        expect(base.wear).toEqual(false);
        expect(base.master).toEqual(false);
        expect(base.maintenanceFreq.id).toEqual(1);
        expect(base.listMaintenanceElement).toEqual([]);
        base = new MaintenanceModel({
            description: 'david', 
            listMaintenanceElement: [new MaintenanceElementModel({ name: 'name' })],
            maintenanceFreq: new MaintenanceFreqModel('code'),
            km: 100,
            time: 12,
            init: true,
            wear: true,
            fromKm: 10,
            toKm: 200,
            master: true,
            id: 3
        });
        expect(base.id).toEqual(3);
        expect(base.description).toEqual('david');
        expect(base.fromKm).toEqual(10);
        expect(base.toKm).toEqual(200);
        expect(base.km).toEqual(100);
        expect(base.time).toEqual(12);
        expect(base.init).toEqual(true);
        expect(base.wear).toEqual(true);
        expect(base.master).toEqual(true);
        expect(base.maintenanceFreq.code).toEqual('code');
        expect(base.listMaintenanceElement[0].name).toEqual('name');
    });
});