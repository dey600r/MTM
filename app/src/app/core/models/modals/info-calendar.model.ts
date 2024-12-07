import { CalendarTypeEnum } from '@utils/index';
import { BaseWarningIconModel } from '../common/index';

export class InfoCalendarVehicleViewModel {
    idVehicle = -1;
    nameVehicle = '';
    typeVehicle = '';
    iconVehicle = '';
    listInfoCalendarMaintOp: InfoCalendarMaintOpViewModel[] = [];
}

export class InfoCalendarMaintOpViewModel {
    id = -1;
    type: CalendarTypeEnum = CalendarTypeEnum.MAINTENANCE;
    description = '';
    detailOperation = '';
    codeMaintenanceFreq = '';
    codeOperationType = '';
    icon = '';
    priceOperation = 0;
    kmOperation = 0;
    dateOperation = null;
    dateFormatOperation = '';
    fromKmMaintenance = 0;
    toKmMaintenance = 0;
    initMaintenance = false;
    wearMaintenance = false;
    listInfoCalendarReplacement: InfoCalendarReplacementViewModel[] = [];
}

export class InfoCalendarReplacementViewModel extends BaseWarningIconModel {
    idReplacement = -1;
    nameReplacement = '';
    iconReplacement = '';
    price = 0;
    km = 0;
    time = 0;
    date: Date = new Date();
    dateFormat = '';
}
