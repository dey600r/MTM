import { WarningWearEnum } from '@utils/index';

export class InfoCalendarVehicleViewModel {
    idVehicle = -1;
    nameVehicle = '';
    typeVehicle = '';
    iconVehicle = '';
    listInfoCalendarMaintenance: InfoCalendarMaintenanceViewModel[] = [];
}

export class InfoCalendarMaintenanceViewModel {
    idMaintenance = -1;
    descriptionMaintenance = '';
    codeMaintenanceFreq = '';
    iconMaintenance = '';
    fromKmMaintenance = 0;
    toKmMaintenance = 0;
    initMaintenance = false;
    wearMaintenance = false;
    listInfoCalendarReplacement: InfoCalendarReplacementViewModel[] = [];
}

export class InfoCalendarReplacementViewModel {
    idReplacement = -1;
    nameReplacement = '';
    iconReplacement = '';
    price = 0;
    km = 0;
    time = 0;
    warning = WarningWearEnum.SUCCESS;
    warningIconClass = '';
    date: Date = new Date();
    dateFormat = '';
}
