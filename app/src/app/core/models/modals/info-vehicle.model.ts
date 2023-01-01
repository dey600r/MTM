import { WarningWearEnum } from '@utils/index';
import { BaseModel, BaseMaintenanceModel, BaseNameModel } from '../common/index';

export class InfoVehicleConfigurationModel {
    idVehicle: number;
    idConfiguration: number;
    nameConfiguration: string;
    warning: WarningWearEnum;
    kmEstimated: number;
    listMaintenance: InfoVehicleConfigurationMaintenanceModel[] = [];
    constructor(data: Partial<InfoVehicleConfigurationModel> = {}) {
        this.idVehicle = (data.idVehicle !== undefined ? data.idVehicle : -1);
        this.idConfiguration = (data.idConfiguration !== undefined ? data.idConfiguration : -1);
        this.nameConfiguration = (data.nameConfiguration ? data.nameConfiguration : null);
        this.warning = (data.warning ? data.warning : WarningWearEnum.SUCCESS);
        this.listMaintenance = (data.listMaintenance ? data.listMaintenance : []);
        this.kmEstimated = (data.kmEstimated !== undefined ? data.kmEstimated : 0);
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
    constructor(data: Partial<InfoVehicleConfigurationMaintenanceModel> = {}) {
        super({
            description: data.description,
            km: data.km,
            time: data.time,
            init: data.init,
            wear: data.wear,
            fromKm: data.fromKm,
            toKm: data.toKm,
            id: (data.id !== undefined ? data.id : -1)
        });
        this.codeFrequency = (data.codeFrequency ? data.codeFrequency : null);
        this.descFrequency = (data.descFrequency ? data.descFrequency : null)
        this.listReplacement = (data.listReplacement ? data.listReplacement : []);
        this.warning = (data.warning ? data.warning : WarningWearEnum.SUCCESS);
        this.active = (data.active !== undefined ? data.active : true);
        this.iconMaintenance = (data.iconMaintenance ? data.iconMaintenance : '');
        this.warningIcon = (data.warningIcon ? data.warningIcon : '');
        this.warningIconClass = (data.warningIconClass ? data.warningIconClass : '');
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
    constructor(data: Partial<InfoVehicleHistoricReplacementModel> = {} ) {
        super(
            (data.name ? data.name : ''),
            (data.id !== undefined ? data.id : -1)
        );
        this.km = (data.km !== undefined ? data.km : 0);
        this.time = (data.time !== undefined ? data.time : 0);
        this.kmAverage = (data.kmAverage !== undefined ? data.kmAverage : 0);
        this.timeAverage = (data.timeAverage !== undefined ? data.timeAverage : 0);
        this.priceAverage = (data.priceAverage !== undefined ? data.priceAverage : 0);
        this.planned = (data.planned !== undefined ? data.planned : false);
        this.listReplacements = (data.listReplacements ? data.listReplacements : []);
        this.iconReplacement = (data.iconReplacement ? data.iconReplacement : '');
    }
}

export class InfoVehicleReplacementModel extends BaseModel {
    opName: string;
    km: number;
    time: number;
    date: Date;
    price: number;
    priceOp: number;
    constructor(data: Partial<InfoVehicleReplacementModel> = {}) {
        super(data.id !== undefined ? data.id: -1);
        this.opName = (data.opName ? data.opName : '');
        this.km = (data.km !== undefined ? data.km : 0);
        this.time = (data.time !== undefined ? data.time : 0);
        this.date = (data.date ? data.date : new Date());
        this.price = (data.price !== undefined ? data.price : 0);
        this.priceOp = (data.priceOp !== undefined ? data.priceOp : 0);
    }
}
