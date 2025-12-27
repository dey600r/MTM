import { WarningWearEnum } from '@utils/index';
import { BaseWarningIconModel } from '../common/index';

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
    constructor(data: Partial<WearVehicleProgressBarViewModel> = {}) {
        this.idVehicle = (data.idVehicle !== undefined ? data.idVehicle : -1);
        this.nameVehicle = (data.nameVehicle !== undefined ? data.nameVehicle : '');
        this.kmVehicle = (data.kmVehicle !== undefined ? data.kmVehicle : 0);
        this.kmEstimatedVehicle = (data.kmEstimatedVehicle !== undefined ? data.kmEstimatedVehicle : 0);
        this.datePurchaseVehicle = (data.datePurchaseVehicle !== undefined ? data.datePurchaseVehicle : new Date());
        this.kmsPerMonthVehicle = (data.kmsPerMonthVehicle !== undefined ? data.kmsPerMonthVehicle : 0);
        this.dateKmsVehicle = (data.dateKmsVehicle !== undefined ? data.dateKmsVehicle : new Date());
        this.percent = (data.percent !== undefined ? data.percent : 0);
        this.percentKm = (data.percentKm !== undefined ? data.percentKm : 0);
        this.percentTime = (data.percentTime !== undefined ? data.percentTime : 0);
        this.warning = (data.warning !== undefined ? data.warning : WarningWearEnum.SUCCESS);
        this.listWearMaintenance = (data.listWearMaintenance ? data.listWearMaintenance : []);
        this.iconVehicle = (data.iconVehicle ? data.iconVehicle : '');
        this.warningProgressBarIcon = (data.warningProgressBarIcon ? data.warningProgressBarIcon : '');
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
    percent = 0;
    warning: WarningWearEnum = WarningWearEnum.SUCCESS;
    warningProgressBarIcon = '';
    listWearNotificationReplacement: WearNotificationReplacementProgressBarViewModel[] = [];
    listWearReplacement: WearReplacementProgressBarViewModel[] = [];
    constructor(data: Partial<WearMaintenanceProgressBarViewModel> = {}) {
        this.codeMaintenanceFreq = (data.codeMaintenanceFreq ? data.codeMaintenanceFreq : '');
        this.idMaintenance = (data.idMaintenance !== undefined ? data.idMaintenance : -1);
        this.descriptionMaintenance = (data.descriptionMaintenance ? data.descriptionMaintenance : '');
        this.kmMaintenance = (data.kmMaintenance !== undefined ? data.kmMaintenance : 0);
        this.timeMaintenance = (data.timeMaintenance !== undefined ? data.timeMaintenance : 0);
        this.fromKmMaintenance = (data.fromKmMaintenance !== undefined ? data.fromKmMaintenance : 0);
        this.toKmMaintenance = (data.toKmMaintenance !== undefined ? data.toKmMaintenance : 0);
        this.initMaintenance = (data.initMaintenance !== undefined ? data.initMaintenance : false);
        this.wearMaintenance = (data.wearMaintenance !== undefined ? data.wearMaintenance : false);
        this.listWearNotificationReplacement = (data.listWearNotificationReplacement ? data.listWearNotificationReplacement : []);
        this.listWearReplacement = (data.listWearReplacement ? data.listWearReplacement : []);
        this.iconMaintenance = (data.iconMaintenance ? data.iconMaintenance : '');
        this.percent = (data.percent !== undefined ? data.percent : 0);
        this.warning = (data.warning !== undefined ? data.warning : WarningWearEnum.SUCCESS);
        this.warningProgressBarIcon = (data.warningProgressBarIcon ? data.warningProgressBarIcon : '');
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
    warningKmsIcon = '';
    warningKmsIconClass = '';
    percentMonths = 0;
    warningMonths: WarningWearEnum = WarningWearEnum.SUCCESS;
    warningMonthsProgressBarIcon = '';
    warningMonthsIcon = '';
    warningMonthsIconClass = '';
}

export class WearNotificationReplacementProgressBarViewModel extends BaseWarningIconModel {
    numWarning = 0;
    totalWarning = 0;
}


