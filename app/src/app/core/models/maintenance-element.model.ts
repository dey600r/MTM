import { BaseNameDescriptionModel } from './common.model';

export class MaintenanceElementModel extends BaseNameDescriptionModel {
    master: boolean;
    price: number;
    constructor(n: string = null, desc: string = null, m: boolean = false, price: number = 0,  id: number = 1) {
        super(n, desc, id);
        this.master = m;
        this.price = price;
    }
}
