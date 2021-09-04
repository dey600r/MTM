import { WarningWearEnum } from '@utils/index';

export class WearVehicleProgressBarViewModel {
    idVehicle = -1;
    nameVehicle = '';
    kmVehicle = 0;
    datePurchaseVehicle: Date = new Date();
    kmsPerMonthVehicle = 0;
    dateKmsVehicle: Date = new Date();
    typeVehicle = '';
    percent = 0;
    percentKm = 0;
    percentTime = 0;
    warning: WarningWearEnum = WarningWearEnum.SUCCESS;
    idConfiguration = -1;
    nameConfiguration = '';
    listWearMaintenance: WearMaintenanceProgressBarViewModel[] = [];
    constructor(id: number = -1, name: string = '', km: number = 0, dateP: Date = new Date(),
                kmsM: number = 0, dateK: Date = new Date(), per: number = 0, perKm: number = 0, perTime: number = 0,
                war: WarningWearEnum = WarningWearEnum.SUCCESS,
                list: WearMaintenanceProgressBarViewModel[] = []) {
        this.idVehicle = id;
        this.nameVehicle = name;
        this.kmVehicle = km;
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
    idMaintenance = -1;
    descriptionMaintenance = '';
    kmMaintenance = 0; //
    timeMaintenance = 0;
    fromKmMaintenance = 0;
    toKmMaintenance = 0;
    initMaintenance = false;
    wearMaintenance = false;
    listWearNotificationReplacement: WearNotificationReplacementProgressBarViewModel[] = [];
    listWearReplacement: WearReplacementProgressBarViewModel[] = [];
}

export class WearReplacementProgressBarViewModel {
    idMaintenanceElement = -1;
    nameMaintenanceElement = '';
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
    warningKms: WarningWearEnum = WarningWearEnum.SUCCESS;
    percentMonths = 0;
    warningMonths: WarningWearEnum = WarningWearEnum.SUCCESS;
}

export class WearNotificationReplacementProgressBarViewModel {
    warning: WarningWearEnum = WarningWearEnum.SUCCESS;
    numWarning = 0;
    totalWarning = 0;
}


