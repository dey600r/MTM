export class WearMotoProgressBarModel {
    idMoto = -1;
    nameMoto = '';
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
    kmMaintenance = 0;
    timeMaintenace = 0;
    calculateKms = 0;
    calculateMonths = 0;
    percentKms = 0;
    percentMonths = 0;
}
