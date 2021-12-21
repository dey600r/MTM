export class Constants {
    // DELAYS
    static DELAY_TOAST = 1300;
    static DELAY_TOAST_IS_FREE = 2500;
    static DELAY_TOAST_NORMAL = 3500;
    static DELAY_TOAST_HIGH = 5000;
    static DELAY_TOAST_HIGHER = 7000;

    // WIDHTS
    static MAX_WIDTH_SEGMENT_SCROLABLE = 800;

    // FORMAT
    static DATE_FORMAT_ES = 'DD/MM/YYYY';
    static DATE_FORMAT_EN = 'MM/DD/YYYY';
    static DATE_FORMAT_DB = 'YYYY-MM-DD';
    static DATE_TIME_FORMAT_DB = 'YYYY-MM-DD HH:mm:ss';

    static CLASS_ION_ICON_OPERATION_TYPE = 'icon-color-';

    static OPERATION_TYPE_MAINTENANCE_HOME = 'MH';
    static OPERATION_TYPE_MAINTENANCE_WORKSHOP = 'MW';
    static OPERATION_TYPE_FAILURE_HOME = 'FH';
    static OPERATION_TYPE_FAILURE_WORKSHOP = 'FW';
    static OPERATION_TYPE_TOOLS = 'T';
    static OPERATION_TYPE_OTHER = 'O';
    static OPERATION_TYPE_ACCESSORIES = 'A';
    static OPERATION_TYPE_CLOTHES = 'C';
    static OPERATION_TYPE_SPARE_PARTS = 'R';

    static MAINTENANCE_FREQ_ONCE_CODE = 'O';
    static MAINTENANCE_FREQ_CALENDAR_CODE = 'C';

    static OWNER_YO = 'yo';
    static OWNER_ME = 'me';

    static STATE_INFO_OPERATION_EMPTY = 'operation_empty';
    static STATE_INFO_VEHICLE_EMPTY = 'vehicle_empty';
    static STATE_INFO_NOTIFICATION_EMPTY = 'notification_empty';
    static STATE_INFO_NOTIFICATION_WITHOUT = 'notification_without';

    static DATABASE_YES = 'Y';
    static DATABASE_NO = 'N';

    static IONIC_APP = 'app';

    static KEY_CONFIG_THEME = 'configTheme';
    static KEY_CONFIG_DISTANCE = 'configDistance';
    static KEY_CONFIG_MONEY = 'configMoney';
    static KEY_LAST_UPDATE_DB = 'lastUpdate';
    static KEY_CONFIG_PRIVACY = 'configPrivacy';

    static VEHICLE_TYPE_CODE_MOTO = 'M';
    static VEHICLE_TYPE_CODE_CAR = 'C';

    static PATH_FILE_DB = 'assets/db/';
    static FILE_NAME_INIT_DB = 'initTableDB';
    static FILE_NAME_NEXT_DEPLOY_DB = 'nextDeployDB';

    static TOAST_POSITION_TOP = 'top';
    static TOAST_POSITION_MIDDLE = 'middle';
    static TOAST_POSITION_BOTTOM = 'bottom';

    static SETTING_DISTANCE_KM = 'KM';
    static SETTING_DISTANCE_MILES = 'MILES';
    static SETTING_MONEY_EURO = 'EURO';
    static SETTING_MONEY_DOLLAR = 'DOLLAR';
    static SETTING_MONEY_POUND = 'POUND';
    static SETTING_THEME_DARK = 'D';
    static SETTING_THEME_DARK_DESC = 'DARK';
    static SETTING_THEME_SKY = 'S';
    static SETTING_THEME_SKY_DESC = 'SKY';
    static SETTING_THEME_LIGHT = 'L';
    static SETTING_THEME_LIGHT_DESC = 'LIGHT';

    // DB
    static NEXT_DEPLOY_TITLE_SEPARATOR = '**->';
    static NEXT_DEPLOY_SCRIPT_SEPARATOR = '**>';

    // EXPORTS AND IMPORTS
    static OUTPUT_DIR_NAME = 'OutputMtM';
    static EXPORT_DIR_NAME = 'exports';
    static IMPORT_DIR_NAME = 'imports';
    static FILE_EMPTY_NAME = 'db.txt';
    static FORMAT_FILE_DB = 'json';
    static EXPORT_FILE_NAME = 'mtmDB';
    static BACKUP_FILE_NAME = 'mtmBackup';

    // URLS
    static MTM_URL_PRIVACY_POLICY = 'https://deyapps-a0de1.web.app/infomtm/privacypolicy';
}
