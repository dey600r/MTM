import { MaintenanceElementModel, OperationModel, OperationTypeModel, VehicleModel } from "@models/index";

describe('OperationModel', () => {

    it('should initialize operation model', () => {
        let base: OperationModel = new OperationModel();
        expect(base.id).toEqual(1);
        expect(base.description).toEqual(null);
        expect(base.details).toEqual(null);
        expect(base.km).toEqual(null);
        expect(base.price).toEqual(null);
        expect(base.location).toEqual(null);
        expect(base.document).toEqual(null);
        expect(base.operationType.id).toEqual(1);
        expect(base.owner).toEqual(null);
        expect(base.vehicle.id).toEqual(1);
        expect(base.listMaintenanceElement).toEqual([]);
        base = new OperationModel('david', 'detail', new OperationTypeModel('code'), new VehicleModel('model'), 10,
            new Date(2020, 2, 1), 'taller', 'yo', 100, 'doc', 3, [new MaintenanceElementModel('name')]);
        expect(base.id).toEqual(3);
        expect(base.description).toEqual('david');
        expect(base.details).toEqual('detail');
        expect(base.date).toEqual(new Date(2020, 2, 1));
        expect(base.km).toEqual(10);
        expect(base.price).toEqual(100);
        expect(base.location).toEqual('taller');
        expect(base.document).toEqual('doc');
        expect(base.operationType.code).toEqual('code');
        expect(base.owner).toEqual('yo');
        expect(base.vehicle.model).toEqual('model');
        expect(base.listMaintenanceElement[0].name).toEqual('name');
    });

});