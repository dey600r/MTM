export class Constants {
    // DELAYS
    public static readonly DELAY_TOAST = 1300;
    public static readonly DELAY_TOAST_IS_FREE = 2500;
    public static readonly DELAY_TOAST_NORMAL = 3500;
    public static readonly DELAY_TOAST_HIGH = 5000;
    public static readonly DELAY_TOAST_HIGHER = 7000;

    // WIDHTS
    public static readonly MAX_WIDTH_SEGMENT_SCROLABLE = 800;

    // SCROLL
    public static readonly MAX_ROWS_INFINITE_SCROLL = 18;

    // FORMAT
    public static readonly DATE_FORMAT_ES = 'DD/MM/YYYY';
    public static readonly DATE_FORMAT_EN = 'MM/DD/YYYY';
    public static readonly DATE_FORMAT_DB = 'YYYY-MM-DD';
    public static readonly DATE_TIME_FORMAT_DB = 'YYYY-MM-DD HH:mm:ss';

    public static readonly CLASS_ION_ICON_OPERATION_TYPE = 'icon-color-';

    public static readonly OPERATION_TYPE_MAINTENANCE_HOME = 'MH';
    public static readonly OPERATION_TYPE_MAINTENANCE_WORKSHOP = 'MW';
    public static readonly OPERATION_TYPE_FAILURE_HOME = 'FH';
    public static readonly OPERATION_TYPE_FAILURE_WORKSHOP = 'FW';
    public static readonly OPERATION_TYPE_TOOLS = 'T';
    public static readonly OPERATION_TYPE_OTHER = 'O';
    public static readonly OPERATION_TYPE_ACCESSORIES = 'A';
    public static readonly OPERATION_TYPE_CLOTHES = 'C';
    public static readonly OPERATION_TYPE_SPARE_PARTS = 'R';

    public static readonly MAINTENANCE_FREQ_ONCE_CODE = 'O';
    public static readonly MAINTENANCE_FREQ_CALENDAR_CODE = 'C';

    public static readonly OWNER_YO = 'yo';
    public static readonly OWNER_ME = 'me';
    public static readonly OWNER_OTHER = 'other';
    public static readonly OWNER_OTRO = 'otro';

    public static readonly STATE_INFO_OPERATION_EMPTY = 'operation_empty';
    public static readonly STATE_INFO_VEHICLE_EMPTY = 'vehicle_empty';
    public static readonly STATE_INFO_MAINTENANCE_EMPTY = 'maintenance_empty';
    public static readonly STATE_INFO_MAINTENANCE_ELEMENT_EMPTY = 'maintenance_element_empty';
    public static readonly STATE_INFO_NOTIFICATION_EMPTY = 'notification_empty';
    public static readonly STATE_INFO_NOTIFICATION_WITHOUT = 'notification_without';

    public static readonly DATABASE_YES = 'Y';
    public static readonly DATABASE_NO = 'N';

    public static readonly IONIC_APP = 'app';

    public static readonly KEY_CONFIG_THEME = 'configTheme';
    public static readonly KEY_CONFIG_DISTANCE = 'configDistance';
    public static readonly KEY_CONFIG_MONEY = 'configMoney';
    public static readonly KEY_LAST_UPDATE_DB = 'lastUpdate';
    public static readonly KEY_CONFIG_PRIVACY = 'configPrivacy';
    public static readonly KEY_CONFIG_SYNC_EMAIL = 'configSyncEmail';

    public static readonly VEHICLE_TYPE_CODE_MOTO = 'M';
    public static readonly VEHICLE_TYPE_CODE_CAR = 'C';

    public static readonly PATH_FILE_DB = 'assets/db/';
    public static readonly FILE_NAME_INIT_DB = 'initTableDB';
    public static readonly FILE_NAME_NEXT_DEPLOY_DB = 'nextDeployDB';
    public static readonly FILE_NAME_INIT_DB_STORAGE = 'initDBStorage.json';

    public static readonly TOAST_POSITION_TOP = 'top';
    public static readonly TOAST_POSITION_MIDDLE = 'middle';
    public static readonly TOAST_POSITION_BOTTOM = 'bottom';

    public static readonly SETTING_DISTANCE_KM = 'KM';
    public static readonly SETTING_DISTANCE_MILES = 'MILES';
    public static readonly SETTING_MONEY_EURO = 'EURO';
    public static readonly SETTING_MONEY_DOLLAR = 'DOLLAR';
    public static readonly SETTING_MONEY_POUND = 'POUND';
    public static readonly SETTING_THEME_DARK = 'D';
    public static readonly SETTING_THEME_DARK_DESC = 'DARK';
    public static readonly SETTING_THEME_SKY = 'S';
    public static readonly SETTING_THEME_SKY_DESC = 'SKY';
    public static readonly SETTING_THEME_LIGHT = 'L';
    public static readonly SETTING_THEME_LIGHT_DESC = 'LIGHT';

    // DB
    public static readonly NEXT_DEPLOY_TITLE_SEPARATOR = '**->';
    public static readonly NEXT_DEPLOY_SCRIPT_SEPARATOR = '**>';

    // EXPORTS AND IMPORTS
    public static readonly OUTPUT_DIR_NAME = 'OutputMtM';
    public static readonly EXPORT_DIR_NAME = 'exports';
    public static readonly IMPORT_DIR_NAME = 'imports';
    public static readonly FILE_EMPTY_NAME = 'db.txt';
    public static readonly FORMAT_FILE_DB = 'json';
    public static readonly FORMAT_FILE_LOG = 'txt';
    public static readonly EXPORT_FILE_NAME = 'mtmDB';
    public static readonly BACKUP_FILE_NAME = 'mtmBackup';
    public static readonly BACKUP_SYNC_FILE_NAME = 'mtmSyncBackup';
    public static readonly LOG_FILE_NAME = 'mtmLog';

    // URLS
    public static readonly MTM_URL_PRIVACY_POLICY = 'https://deyapps-a0de1.web.app/infomtm/privacypolicy';

    // SYNC
    public static readonly SYNC_PATH_USERS = 'users';
}
