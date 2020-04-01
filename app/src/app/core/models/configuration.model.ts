import { BaseModel } from './common.model';
import { MaintenanceModel } from './maintenance.model';

export class ConfigurationModel extends BaseModel {
    name: string;
    description: string;
    master: boolean;
    listMaintenance: MaintenanceModel[];
    constructor(n: string = '', d: string = '', m: boolean = false, l: MaintenanceModel[] = [], id: number = 1) {
        super(id);
        this.name = n;
        this.description = d;
        this.master = m;
        this.listMaintenance = l;
    }
}
