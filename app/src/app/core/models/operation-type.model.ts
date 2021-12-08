import { BaseCodeDescriptionModel } from './common.model';

export class OperationTypeModel extends BaseCodeDescriptionModel {
    constructor(c: string = null, d: string = null, id: number = 1) {
        super(c, d, id);
    }
}
