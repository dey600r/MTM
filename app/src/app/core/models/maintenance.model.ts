import { BaseModel } from './common.model';
import { MaintenanceElementModel } from './maintenance-element.model';
import { MaintenanceFreqModel } from './maintenance-freq.model';

export class MaintenanceModel extends BaseModel {
    description: string;
    listMaintenanceElement: MaintenanceElementModel[];
    maintenanceFreq: MaintenanceFreqModel;
    km: number;
    time: number;
    init: boolean;
    wear: boolean;
    fromKm: number;
    toKm: number;
    master: boolean;
    constructor(d: string = null, lme: MaintenanceElementModel[] = [],
                mf: MaintenanceFreqModel = new MaintenanceFreqModel(),
                k: number = null, t: number = null, i: boolean = false, w: boolean = false,
                fr: number = 0, to: number = null, m: boolean = false, id: number = 1) {
        super(id);
        this.description = d;
        this.listMaintenanceElement = lme;
        this.maintenanceFreq = mf;
        this.km = k;
        this.time = t;
        this.init = i;
        this.wear = w;
        this.fromKm = fr;
        this.toKm = to;
        this.master = m;
    }
}
