import { BaseNameDescriptionModel } from './common.model';
import { MaintenanceModel } from './maintenance.model';

export class ConfigurationModel extends BaseNameDescriptionModel {
    master: boolean;
    listMaintenance: MaintenanceModel[];
    constructor(n: string = '', d: string = '', m: boolean = false, l: MaintenanceModel[] = [], id: number = 1) {
        super(n, d, id);
        this.master = m;
        this.listMaintenance = l;
    }
}
