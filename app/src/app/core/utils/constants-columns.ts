export class ConstantsColumns {
    static COLUMN_MTM_ID = 'id';

    // MOTO
    static COLUMN_MTM_MOTO_MODEL = 'model';
    static COLUMN_MTM_MOTO_BRAND = 'brand';
    static COLUMN_MTM_MOTO_YEAR = 'year';
    static COLUMN_MTM_MOTO_KM = 'km';
    static COLUMN_MTM_MOTO_CONFIGURATION = 'idConfiguration';
    static COLUMN_MTM_MOTO_KMS_PER_MONTH = 'kmsPerMonth';
    static COLUMN_MTM_MOTO_DATE_KMS = 'dateKms';

    // CONFIGURATION
    static COLUMN_MTM_CONFIGURATION_NAME = 'name';
    static COLUMN_MTM_CONFIGURATION_DESCRIPTION = 'description';

    // OPERATION TYPE
    static COLUMN_MTM_OPERATION_TYPE_CODE = 'code';
    static COLUMN_MTM_OPERATION_TYPE_DESCRIPTION = 'description';

    // OPERTATION
    static COLUMN_MTM_OPERATION_DESCRIPTION = 'description';
    static COLUMN_MTM_OPERATION_DETAILS = 'details';
    static COLUMN_MTM_OPERATION_OPERATION_TYPE = 'idOperationType';
    static COLUMN_MTM_OPERATION_MOTO = 'idMoto';
    static COLUMN_MTM_OPERATION_KM = 'km';
    static COLUMN_MTM_OPERATION_DATE = 'date';
    static COLUMN_MTM_OPERATION_LOCATION = 'location';
    static COLUMN_MTM_OPERATION_OWNER = 'owner';
    static COLUMN_MTM_OPERATION_PRICE = 'price';
    static COLUMN_MTM_OPERATION_DOCUMENT = 'document';

    // OPERATION MAINTENANCE ELEMENT
    static COLUMN_MTM_OP_MAINTENANCE_ELEMENT_ID_OPERATION = 'idOperation';
    static COLUMN_MTM_OP_MAINTENANCE_ELEMENT_ID_MAINTENANCE_ELEMENT = 'idMaintenanceElement';

    // MAINTENANCE ELEMENT
    static COLUMN_MTM_MAINTENANCE_ELEMENT_NAME = 'name';
    static COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION = 'description';

    // SEQUENCE
    static COLUMN_MTM_SEQUENCE_NAME = 'name';
    static COLUMN_MTM_SEQUENCE_SEQ = 'seq';
}
