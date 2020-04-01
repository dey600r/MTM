import { BaseModel } from './common.model';
import { MaintenanceElementModel } from './maintenance-element.model';
import { MaintenanceFreqModel } from './maintenance-freq.model';

export class MaintenanceModel extends BaseModel {
    description: string;
    maintenanceElement: MaintenanceElementModel;
    maintenanceFreq: MaintenanceFreqModel;
    km: number;
    time: number;
    init: boolean;
    wear: boolean;
    master: boolean;
    constructor(d: string = null, me: MaintenanceElementModel = new MaintenanceElementModel(),
                mf: MaintenanceFreqModel = new MaintenanceFreqModel(),
                k: number = null, t: number = null, i: boolean = false, w: boolean = false,
                m: boolean = false, id: number = 1) {
        super(id);
        this.description = d;
        this.maintenanceElement = me;
        this.maintenanceFreq = mf;
        this.km = k;
        this.time = t;
        this.init = i;
        this.wear = w;
        this.master = m;
    }
}
