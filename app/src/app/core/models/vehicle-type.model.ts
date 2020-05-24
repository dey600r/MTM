import { BaseModel } from './common.model';

export class VehicleTypeModel extends BaseModel {
    code: string;
    description: string;
    constructor(c: string = '', d: string = '', id: number = -1) {
        super(id);
        this.code = c;
        this.description = d;
    }
}
