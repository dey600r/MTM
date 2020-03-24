import { BaseModel } from './common.model';

export class MaintenanceElementModel extends BaseModel {
    name: string;
    description: string;
    constructor(n: string = null, desc: string = null, id: number = 1) {
        super(id);
        this.name = n;
        this.description = desc;
    }
}
