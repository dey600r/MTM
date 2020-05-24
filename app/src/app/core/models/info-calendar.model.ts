import { WarningWearEnum } from '@utils/index';

export class InfoCalendarVehicleViewModel {
    idVehicle = -1;
    nameVehicle = '';
    listInfoCalendarMaintenance: InfoCalendarMaintenanceViewModel[] = [];
}

export class InfoCalendarMaintenanceViewModel {
    idMaintenance = -1;
    descriptionMaintenance = '';
    codeMaintenanceFreq = '';
    fromKmMaintenance = 0;
    toKmMaintenance = 0;
    initMaintenance = false;
    wearMaintenance = false;
    listInfoCalendarReplacement: InfoCalendarReplacementViewModel[] = [];
}

export class InfoCalendarReplacementViewModel {
    idReplacement = -1;
    nameReplacement = '';
    price = 0;
    km = 0;
    time = 0;
    warning = WarningWearEnum.SUCCESS;
    date: Date = new Date();
    dateFormat = '';
}
