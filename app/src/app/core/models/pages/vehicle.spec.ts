import { ConfigurationModel, VehicleModel, VehicleTypeModel } from "@models/index";

describe('VehicleModels', () => {

    it('should initialize vehicle model', () => {
        const date = new Date();
        let base: VehicleModel = new VehicleModel();
        expect(base.id).toEqual(1);
        expect(base.model).toEqual(null);
        expect(base.brand).toEqual(null);
        expect(base.year).toEqual(null);
        expect(base.configuration.id).toEqual(1);
        expect(base.vehicleType.id).toEqual(-1);
        expect(base.km).toEqual(null);
        expect(base.dateKms.toDateString()).toEqual(date.toDateString());
        expect(base.datePurchase.toDateString()).toEqual(date.toDateString());
        expect(base.kmEstimated).toEqual(null);
        expect(base.kmsPerMonth).toEqual(null);
        expect(base.active).toEqual(true);
        expect(base.$getName).toBe(`${base.brand} ${base.model}`);
        const date1 = new Date(2022, 11, 10);
        const date2 = new Date(2022, 3, 2);
        base = new VehicleModel({
            model: 'model',
            brand: 'brand',
            year: 2005,
            km: 2000,
            kmEstimated: 2500,
            configuration: new ConfigurationModel({ name: 'name' }),
            vehicleType: new VehicleTypeModel('code'), 
            kmsPerMonth: 200,
            dateKms: date1,
            datePurchase: date2,
            active: false,
            id: 4
        });
        expect(base.id).toEqual(4);
        expect(base.model).toEqual('model');
        expect(base.brand).toEqual('brand');
        expect(base.year).toEqual(2005);
        expect(base.configuration.name).toEqual('name');
        expect(base.vehicleType.code).toEqual('code');
        expect(base.dateKms.toDateString()).toEqual(date1.toDateString());
        expect(base.datePurchase.toDateString()).toEqual(date2.toDateString());
        expect(base.km).toEqual(2000);
        expect(base.kmEstimated).toEqual(2500);
        expect(base.kmsPerMonth).toEqual(200);
        expect(base.active).toEqual(false);
        expect(base.$getName).toEqual(`${base.brand} ${base.model}`);
    });
});