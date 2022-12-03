import { WarningWearEnum } from '@utils/index';

export class WearVehicleProgressBarViewModel {
    idVehicle = -1;
    nameVehicle = '';
    kmVehicle = 0;
    kmEstimatedVehicle = 0;
    datePurchaseVehicle: Date = new Date();
    kmsPerMonthVehicle = 0;
    dateKmsVehicle: Date = new Date();
    typeVehicle = '';
    iconVehicle = '';
    percent = 0;
    percentKm = 0;
    percentTime = 0;
    warning: WarningWearEnum = WarningWearEnum.SUCCESS;
    warningProgressBarIcon = '';
    idConfiguration = -1;
    nameConfiguration = '';
    listWearMaintenance: WearMaintenanceProgressBarViewModel[] = [];
    constructor(id: number = -1, name: string = '', km: number = 0, kme: number = 0, dateP: Date = new Date(),
                kmsM: number = 0, dateK: Date = new Date(), per: number = 0, perKm: number = 0, perTime: number = 0,
                war: WarningWearEnum = WarningWearEnum.SUCCESS,
                list: WearMaintenanceProgressBarViewModel[] = []) {
        this.idVehicle = id;
        this.nameVehicle = name;
        this.kmVehicle = km;
        this.kmEstimatedVehicle = kme;
        this.datePurchaseVehicle = dateP;
        this.kmsPerMonthVehicle = kmsM;
        this.dateKmsVehicle = dateK;
        this.percent = per;
        this.percentKm = perKm;
        this.percentTime = perTime;
        this.warning = war;
        this.listWearMaintenance = list;
    }
}

export class WearMaintenanceProgressBarViewModel {
    codeMaintenanceFreq = '';
    iconMaintenance = '';
    idMaintenance = -1;
    descriptionMaintenance = '';
    kmMaintenance = 0;
    timeMaintenance = 0;
    fromKmMaintenance = 0;
    toKmMaintenance = 0;
    initMaintenance = false;
    wearMaintenance = false;
    listWearNotificationReplacement: WearNotificationReplacementProgressBarViewModel[] = [];
    listWearReplacement: WearReplacementProgressBarViewModel[] = [];
    constructor(codeFreq: string = '', id: number = -1, desc: string = '', km: number = 0, time: number = 0,
                from: number = 0, to: number = 0, init: boolean = false, wear: boolean = false,
                listNotif: WearNotificationReplacementProgressBarViewModel[] = [],
                listRep: WearReplacementProgressBarViewModel[] = []) {
        this.codeMaintenanceFreq = codeFreq;
        this.idMaintenance = id;
        this.descriptionMaintenance = desc;
        this.kmMaintenance = km;
        this.timeMaintenance = time;
        this.fromKmMaintenance = from;
        this.toKmMaintenance = to;
        this.initMaintenance = init;
        this.wearMaintenance = wear;
        this.listWearNotificationReplacement = listNotif;
        this.listWearReplacement = listRep;
    }
}

export class WearReplacementProgressBarViewModel {
    idMaintenanceElement = -1;
    nameMaintenanceElement = '';
    iconMaintenanceElement = '';
    idOperation = -1;
    descriptionOperation = '';
    kmOperation = null;
    dateOperation: Date = null;
    priceOperation = 0;
    kmAcumulateMaintenance = 0;
    timeAcumulateMaintenance = 0;
    calculateKms = 0;
    calculateMonths = 0;
    percentKms = 0;
    warningIconClass = '';
    warningKms: WarningWearEnum = WarningWearEnum.SUCCESS;
    warningKmsProgressBarIcon = '';
    warningKmsIconClass = '';
    percentMonths = 0;
    warningMonths: WarningWearEnum = WarningWearEnum.SUCCESS;
    warningMonthsProgressBarIcon = '';
    warningMonthsIconClass = '';
}

export class WearNotificationReplacementProgressBarViewModel {
    warning: WarningWearEnum = WarningWearEnum.SUCCESS;
    warningIconClass = '';
    numWarning = 0;
    totalWarning = 0;
}


