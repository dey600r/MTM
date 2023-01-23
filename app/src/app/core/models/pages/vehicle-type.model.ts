import { BaseIconCodeDescriptionModel } from '../common/index';

export class VehicleTypeModel extends BaseIconCodeDescriptionModel {
    constructor(c: string = '', d: string = '', id: number = -1) {
        super(c, d, id);
    }
}
