import { BaseNameDescriptionModel } from '../common/index';
import { MaintenanceModel } from './maintenance.model';

export class ConfigurationModel extends BaseNameDescriptionModel {
    master: boolean;
    listMaintenance: MaintenanceModel[];
    constructor(data: Partial<ConfigurationModel> = {}) {
        super(
            (data.name ? data.name : ''),
            (data.description ? data.description : ''), 
            data.id
        );
        this.master = (data.master !== undefined ? data.master : false);
        this.listMaintenance = (data.listMaintenance !== undefined ? data.listMaintenance : []);
    }
}
