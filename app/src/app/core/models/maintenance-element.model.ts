import { BaseModel } from './common.model';

export class MaintenanceElementModel extends BaseModel {
    name: string;
    description: string;
    master: boolean;
    constructor(n: string = null, desc: string = null, m: boolean = true, id: number = 1) {
        super(id);
        this.name = n;
        this.description = desc;
        this.master = m;
    }
}
