import { ConfigurationModel, VehicleModel, VehicleTypeModel } from "@models/index";

describe('VehicleModels', () => {

    it('should initialize vehicle model', () => {
        let base: VehicleModel = new VehicleModel();
        const date: Date = new Date();
        expect(base.id).toEqual(1);
        expect(base.dateKms).toEqual(date);
        expect(base.datePurchase).toEqual(date);
        expect(base.model).toEqual(null);
        expect(base.brand).toEqual(null);
        expect(base.year).toEqual(null);
        expect(base.configuration.id).toEqual(1);
        expect(base.vehicleType.id).toEqual(-1);
        expect(base.km).toEqual(null);
        expect(base.kmEstimated).toEqual(undefined);
        expect(base.kmsPerMonth).toEqual(null);
        expect(base.active).toEqual(true);
        base = new VehicleModel('model', 'brand', 2005, 2000, new ConfigurationModel('name'), new VehicleTypeModel('code'), 200,
            new Date(2022, 11, 10), new Date(2022, 3, 2), false, 4);
        expect(base.id).toEqual(4);
        expect(base.model).toEqual('model');
        expect(base.brand).toEqual('brand');
        expect(base.year).toEqual(2005);
        expect(base.configuration.name).toEqual('name');
        expect(base.vehicleType.code).toEqual('code');
        expect(base.dateKms).toEqual(new Date(2022, 11, 10));
        expect(base.datePurchase).toEqual(new Date(2022, 3, 2));
        expect(base.km).toEqual(2000);
        expect(base.kmEstimated).toEqual(undefined);
        expect(base.kmsPerMonth).toEqual(200);
        expect(base.active).toEqual(false);
    });
});