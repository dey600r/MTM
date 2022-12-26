import { WarningWearEnum } from '@utils/index';
import { BaseModel, BaseMaintenanceModel, BaseNameModel } from '../common/index';

export class InfoVehicleConfigurationModel {
    idVehicle: number;
    idConfiguration: number;
    nameConfiguration: string;
    warning: WarningWearEnum;
    kmEstimated: number;
    listMaintenance: InfoVehicleConfigurationMaintenanceModel[] = [];
    constructor(idV: number = -1, idC: number = -1, nc: string = null, w: WarningWearEnum = WarningWearEnum.SUCCESS,
                l: InfoVehicleConfigurationMaintenanceModel[] = [], kmEstimated: number = 0) {
        this.idVehicle = idV;
        this.idConfiguration = idC;
        this.nameConfiguration = nc;
        this.warning = w;
        this.listMaintenance = l;
        this.kmEstimated = kmEstimated;
    }
}

export class InfoVehicleConfigurationMaintenanceModel extends BaseMaintenanceModel {
    descFrequency: string;
    codeFrequency: string;
    iconMaintenance: string;
    warning: WarningWearEnum;
    warningIcon: string;
    warningIconClass: string;
    active: boolean;
    listReplacement: InfoVehicleConfigurationMaintenanceElementModel[] = [];
    constructor(d: string = null, lr: InfoVehicleConfigurationMaintenanceElementModel[] = [],
                cf: string = null, df: string = null, k: number = null, t: number = null, i: boolean = false,
                w: boolean = false, fr: number = 0, to: number = null, warn: WarningWearEnum = WarningWearEnum.SUCCESS,
                act: boolean = true, id: number = -1) {
        super({
            description: d,
            km: k,
            time: t,
            init: i,
            wear: w,
            fromKm: fr,
            toKm: to,
            id: id
        });
        this.codeFrequency = cf;
        this.descFrequency = df;
        this.listReplacement = lr;
        this.warning = warn;
        this.active = act;
    }
}

export class InfoVehicleConfigurationMaintenanceElementModel extends BaseNameModel {
    warning: WarningWearEnum;
    warningIcon: string;
    warningIconClass: string;
    iconReplacement: string;
    constructor(n: string = null, w: WarningWearEnum = WarningWearEnum.SUCCESS, id: number = -1) {
        super(n, id);
        this.warning = w;
    }
}

export class InfoVehicleHistoricModel extends BaseModel {
    listHistoricReplacements: InfoVehicleHistoricReplacementModel[];
    constructor(id: number = -1, list: InfoVehicleHistoricReplacementModel[] = []) {
        super(id);
        this.listHistoricReplacements = list;
    }
}

export class InfoVehicleHistoricReplacementModel extends BaseNameModel {
    km: number;
    time: number;
    kmAverage: number;
    timeAverage: number;
    priceAverage: number;
    planned: boolean;
    iconReplacement: string;
    listReplacements: InfoVehicleReplacementModel[];
    constructor(n: string = '', k: number = 0, t: number = 0,
                ka: number = 0, ta: number = 0, pa: number = 0, plan: boolean = false,
                list: InfoVehicleReplacementModel[] = [], id: number = -1) {
        super(n, id);
        this.km = k;
        this.time = t;
        this.kmAverage = ka;
        this.timeAverage = ta;
        this.priceAverage = pa;
        this.planned = plan;
        this.listReplacements = list;
    }
}

export class InfoVehicleReplacementModel extends BaseModel {
    opName: string;
    km: number;
    time: number;
    date: Date;
    price: number;
    priceOp: number;
    constructor(op: string = '', k: number = 0, t: number = 0, d: Date = new Date(), p: number = 0,
                pop: number = 0, id: number = -1) {
        super(id);
        this.opName = op;
        this.km = k;
        this.time = t;
        this.date = d;
        this.price = p;
        this.priceOp = pop;
    }
}
