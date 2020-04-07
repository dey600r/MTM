import { WarningWearEnum } from '@utils/index';

export class WearMotoProgressBarModel {
    idMoto = -1;
    nameMoto = '';
    percent = 0;
    warning: WarningWearEnum = WarningWearEnum.SUCCESS;
    listWearReplacement: WearReplacementProgressBarModel[] = [];
}

export class WearReplacementProgressBarModel {
    idMaintenanceElement = -1;
    nameMaintenanceElement = '';
    codeMaintenanceFreq = '';
    idOperation = -1;
    kmOperation = 0;
    dateOperation: Date = null;
    idMaintenance = -1;
    descriptionMaintenance = '';
    kmMaintenance = 0;
    timeMaintenace = 0;
    calculateKms = 0;
    calculateMonths = 0;
    percentKms = 0;
    warningKms: WarningWearEnum = WarningWearEnum.SUCCESS;
    percentMonths = 0;
    warningMonths: WarningWearEnum = WarningWearEnum.SUCCESS;
}
