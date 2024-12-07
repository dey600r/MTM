export enum ActionDBEnum {
    CREATE= 1,
    UPDATE = 2,
    DELETE = 3,
    REFRESH = 4
}

export enum FilterMonthsEnum {
    MONTH = 1,
    QUARTER = 4,
    YEAR = 12
}

export enum WarningWearEnum {
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger',
    SKULL = 'skull'
}

export enum PageEnum {
    HOME = 1,
    VEHICLE = 2,
    OPERATION = 3,
    CONFIGURATION = 4,
    MODAL_VEHICLE = 5,
    MODAL_OPERATION = 6,
    MODAL_CONFIGURATION = 7,
    MODAL_MAINTENANCE = 8,
    MODAL_MAINTENANCE_ELEMENT = 9,
    MODAL_DASHBOARD_VEHICLE = 10,
    MODAL_DASHBOARD_OPERATION = 11,
    MODAL_INFO = 12,
    MODAL_CALENDAR = 13,
    MODAL_SETTINGS = 14
}

export enum FilterKmTimeEnum {
    KM = 'KM',
    TIME = 'TIME'
}

export enum ToastTypeEnum {
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger',
    INFO = 'primary'
}

export enum ModalOutputEnum {
    SAVE = 1,
    CANCEL = 2
}

export enum InfoButtonEnum {
    NONE = 0,
    HOME = 1,
    VEHICLES = 2,
    OPERATIONS = 3,
    CONFIGURATIONS = 4
}

export enum TypeOfTableEnum {
    MASTER = 0,
    DATA = 1,
    RELATION = 2
}

export enum CalendarModeEnum {
    MONTH = 0,
    YEAR = 1,
    YEARS = 2
}

export enum ModalTypeEnum {
    CREATE = 0,
    UPDATE = 1,
    DUPLICATE = 2
}

export enum CalendarTypeEnum {
    OPERATION = 0,
    MAINTENANCE = 1
}