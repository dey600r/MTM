import { WarningWearEnum } from '@utils/index';

export class WearMotoProgressBarModel {
    idMoto = -1;
    nameMoto = '';
    kmMoto = 0;
    datePurchaseMoto: Date = new Date();
    kmsPerMonthMoto = 0;
    dateKmsMoto: Date = new Date();
    percent = 0;
    percentKm = 0;
    percentTime = 0;
    warning: WarningWearEnum = WarningWearEnum.SUCCESS;
    listWearReplacement: WearReplacementProgressBarModel[] = [];
    constructor(id: number = -1, name: string = '', km: number = 0, dateP: Date = new Date(),
                kmsM: number = 0, dateK: Date = new Date(), per: number = 0, perKm: number = 0, perTime: number = 0,
                war: WarningWearEnum = WarningWearEnum.SUCCESS,
                list: WearReplacementProgressBarModel[] = []) {
        this.idMoto = id;
        this.nameMoto = name;
        this.kmMoto = km;
        this.datePurchaseMoto = dateP;
        this.kmsPerMonthMoto = kmsM;
        this.dateKmsMoto = dateK;
        this.percent = per;
        this.percentKm = perKm;
        this.percentTime = perTime;
        this.warning = war;
        this.listWearReplacement = list;
    }
}

export class WearReplacementProgressBarModel {
    idMaintenanceElement = -1;
    nameMaintenanceElement = '';
    codeMaintenanceFreq = '';
    idOperation = -1;
    descriptionOperation = '';
    kmOperation = 0;
    dateOperation: Date = null;
    idMaintenance = -1;
    descriptionMaintenance = '';
    kmMaintenance = 0;
    timeMaintenance = 0;
    initMaintenance = false;
    wearMaintenance = false;
    calculateKms = 0;
    calculateMonths = 0;
    percentKms = 0;
    warningKms: WarningWearEnum = WarningWearEnum.SUCCESS;
    percentMonths = 0;
    warningMonths: WarningWearEnum = WarningWearEnum.SUCCESS;
}
