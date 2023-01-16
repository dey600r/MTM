import { VehicleTypeModel } from "@models/index";

describe('VehicleTypeModels', () => {

    it('should initialize vehicle type model', () => {
        let base: VehicleTypeModel = new VehicleTypeModel();
        expect(base.id).toEqual(-1);
        expect(base.code).toEqual('');
        expect(base.description).toEqual('');
        expect(base.icon).toEqual(undefined);
        base = new VehicleTypeModel('code', 'description', 4);
        expect(base.id).toEqual(4);
        expect(base.code).toEqual('code');
        expect(base.description).toEqual('description');
        expect(base.icon).toEqual(undefined);
    });
});