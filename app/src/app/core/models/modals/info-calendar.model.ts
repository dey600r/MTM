import { CalendarTypeEnum } from '@utils/index';
import { BaseWarningIconModel } from '../common/index';
import { OperationModel } from '../pages/index';
import { WearVehicleProgressBarViewModel } from './wear-progress-bar.model';

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

export class CalendarInputModal {
    wear: WearVehicleProgressBarViewModel[] = [];
    operations: OperationModel[] = [];
    vehicleSelected: number = -1;
}