import { BaseMaintenanceModel } from './common.model';
import { MaintenanceElementModel } from './maintenance-element.model';
import { MaintenanceFreqModel } from './maintenance-freq.model';

export class MaintenanceModel extends BaseMaintenanceModel {
    listMaintenanceElement: MaintenanceElementModel[];
    maintenanceFreq: MaintenanceFreqModel;
    master: boolean;
    constructor(d: string = null, lme: MaintenanceElementModel[] = [],
                mf: MaintenanceFreqModel = new MaintenanceFreqModel(),
                k: number = null, t: number = null, i: boolean = false, w: boolean = false,
                fr: number = 0, to: number = null, m: boolean = false, id: number = 1) {
        super(d, k, t, i, w, fr, to, id);
        this.listMaintenanceElement = lme;
        this.maintenanceFreq = mf;
        this.master = m;
    }
}
