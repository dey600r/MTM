import { BaseMaintenanceModel } from '../common/index';
import { MaintenanceElementModel } from './maintenance-element.model';
import { MaintenanceFreqModel } from './maintenance-freq.model';

export class MaintenanceModel extends BaseMaintenanceModel {
    listMaintenanceElement: MaintenanceElementModel[];
    maintenanceFreq: MaintenanceFreqModel;
    master: boolean;
    constructor(data: Partial<MaintenanceModel> = {}) {
        super({
            description: data.description,
            km: data.km,
            time: data.time,
            init: data.init,
            wear: data.wear,
            fromKm: data.fromKm,
            toKm: data.toKm,
            id: data.id
        });
        this.listMaintenanceElement = (data.listMaintenanceElement !== undefined ? data.listMaintenanceElement : []);
        this.maintenanceFreq = (data.maintenanceFreq !== undefined ? data.maintenanceFreq : new MaintenanceFreqModel());
        this.master = (data.master !== undefined ? data.master : false);
    }
}
