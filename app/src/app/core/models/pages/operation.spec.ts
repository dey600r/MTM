import { MaintenanceElementModel, OperationModel, OperationTypeModel, VehicleModel } from "@models/index";

describe('OperationModel', () => {

    it('should initialize operation model', () => {
        let base: OperationModel = new OperationModel();
        expect(base.id).toEqual(1);
        expect(base.description).toEqual(null);
        expect(base.details).toEqual(null);
        expect(base.km).toEqual(null);
        expect(base.price).toEqual(null);
        expect(base.date.toDateString()).toEqual(new Date().toDateString())
        expect(base.location).toEqual(null);
        expect(base.document).toEqual(null);
        expect(base.operationType.id).toEqual(1);
        expect(base.owner).toEqual(null);
        expect(base.vehicle.id).toEqual(1);
        expect(base.listMaintenanceElement).toEqual([]);
        const date = new Date(2020, 2, 1);
        base = new OperationModel({
            description: 'david',
            details: 'detail',
            operationType: new OperationTypeModel('code'),
            vehicle: new VehicleModel({ model: 'model' }),
            km: 10,
            date: date,
            location: 'taller',
            owner: 'yo',
            price: 100,
            document: 'doc',
            id: 3,
            listMaintenanceElement: [new MaintenanceElementModel({ name: 'name' })]
        });
        expect(base.id).toEqual(3);
        expect(base.description).toEqual('david');
        expect(base.details).toEqual('detail');
        expect(base.date.toDateString()).toEqual(date.toDateString());
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