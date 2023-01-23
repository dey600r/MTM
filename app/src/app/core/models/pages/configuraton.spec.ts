import { ConfigurationModel, MaintenanceModel } from "@models/index";

describe('ConfigurationModels', () => {

    it('should initialize configuration model', () => {
        let base: ConfigurationModel = new ConfigurationModel();
        expect(base.id).toEqual(1);
        expect(base.name).toEqual('');
        expect(base.description).toEqual('');
        expect(base.master).toEqual(false);
        expect(base.listMaintenance).toEqual([]);
        base = new ConfigurationModel({
            name: 'david', 
            description: 'description', 
            master: true, 
            listMaintenance: [ new MaintenanceModel({ description: 'maint' })]
        });
        expect(base.id).toEqual(1);
        expect(base.name).toEqual('david');
        expect(base.description).toEqual('description');
        expect(base.master).toEqual(true);
        expect(base.listMaintenance[0].description).toEqual('maint');
    });
});
