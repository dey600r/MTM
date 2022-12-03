import { BaseIconCodeDescriptionModel } from './common.model';

export class MaintenanceFreqModel extends BaseIconCodeDescriptionModel {
    constructor(c: string = null, desc: string = null, id: number = 1) {
        super(c, desc, id);
    }
}
