import { BaseIconCodeDescriptionModel } from './common.model';

export class OperationTypeModel extends BaseIconCodeDescriptionModel {
    constructor(c: string = null, d: string = null, id: number = 1) {
        super(c, d, id);
    }
}
