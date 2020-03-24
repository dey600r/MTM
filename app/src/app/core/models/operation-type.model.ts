import { BaseModel } from './common.model';

export class OperationTypeModel extends BaseModel {
    code: string;
    description: string;
    constructor(c: string = null, d: string = null, id: number = 1) {
        super(id);
        this.code = c;
        this.description = d;
    }
}
