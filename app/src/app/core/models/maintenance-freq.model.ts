import { BaseModel } from './common.model';

export class MaintenanceFreqModel extends BaseModel {
    code: string;
    description: string;
    constructor(c: string = null, desc: string = null, id: number = 1) {
        super(id);
        this.code = c;
        this.description = desc;
    }
}
