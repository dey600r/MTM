import { BaseIconNameDescriptionModel } from '../common/index';

export class MaintenanceElementModel extends BaseIconNameDescriptionModel {
    master: boolean;
    price: number;
    constructor(data: Partial<MaintenanceElementModel> = {}) {
        super(data.name, data.description, data.id);
        this.master = (data.master !== undefined ? data.master : false);
        this.price = (data.price !== undefined ? data.price : 0);
    }
}
