import { BaseCodeDescriptionModel } from './common.model';

export class VehicleTypeModel extends BaseCodeDescriptionModel {
    constructor(c: string = '', d: string = '', id: number = -1) {
        super(c, d, id);
    }
}
