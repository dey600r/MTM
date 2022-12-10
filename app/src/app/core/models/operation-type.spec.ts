import { OperationTypeModel } from "@models/index";

describe('OperationModels', () => {

    it('should initialize operation type model', () => {
        let base: OperationTypeModel = new OperationTypeModel();
        expect(base.id).toEqual(1);
        expect(base.code).toEqual(null);
        expect(base.description).toEqual(null);
        expect(base.icon).toEqual(undefined);
        base = new OperationTypeModel('david', 'description', 2);
        expect(base.id).toEqual(2);
        expect(base.code).toEqual('david');
        expect(base.description).toEqual('description');
        expect(base.icon).toEqual(undefined);
    });

});