import { BaseCodeDescriptionModel } from './common.model';

export class MaintenanceFreqModel extends BaseCodeDescriptionModel {
    constructor(c: string = null, desc: string = null, id: number = 1) {
        super(c, desc, id);
    }
}
