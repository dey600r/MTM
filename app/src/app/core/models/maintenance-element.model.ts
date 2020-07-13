import { BaseModel } from './common.model';

export class MaintenanceElementModel extends BaseModel {
    name: string;
    description: string;
    master: boolean;
    price: number;
    constructor(n: string = null, desc: string = null, m: boolean = false, price: number = 0,  id: number = 1) {
        super(id);
        this.name = n;
        this.description = desc;
        this.master = m;
        this.price = price;
    }
}
