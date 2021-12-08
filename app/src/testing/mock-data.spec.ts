import {
    ConfigurationModel, MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel, OperationModel,
    OperationTypeModel, SystemConfigurationModel, VehicleModel, VehicleTypeModel
} from '@models/index';

import { Constants } from '@utils/index';

export class MockData {
    static MaintenanceElements: MaintenanceElementModel[] = [
        new MaintenanceElementModel('FRONT_WHEEL', 'CHANGE_FRONT_WHEEL', true, 110, 1),
        new MaintenanceElementModel('BACK_WHEEL', 'CHANGE_BACK_WHEEL', true, 180, 2),
        new MaintenanceElementModel('ENGINE_OIL', 'CHANGE_ENGINE_OIL', true, 45, 3),
        new MaintenanceElementModel('AIR_FILTER', 'CHANGE_AIR_FILTER', true, 34, 4),
        new MaintenanceElementModel('OIL_FILTER', 'CHANGE_OIL_FILTER', true, 6, 5),
        new MaintenanceElementModel('SPARK_PLUG', 'CHANGE_SPARK_PLUG', false, 32, 6),
        new MaintenanceElementModel('SPARK_PLUG', 'CHANGE_SPARK_PLUG', false, 34, 7),
        new MaintenanceElementModel('ENGINE_OIL', 'CHANGE_ENGINE_OIL', false, 38, 8),
        new MaintenanceElementModel('FRONT_BRAKE_FLUID', 'CHANGE_FRONT_BRAKE_FLUID', false, 5, 9),
        new MaintenanceElementModel('BACK_BRAKE_FLUID', 'CHANGE_BACK_BRAKE_FLUID', false, 5, 10)
    ];
    static MaintenanceFreqs: MaintenanceFreqModel[] = [
        new MaintenanceFreqModel(Constants.MAINTENANCE_FREQ_ONCE_CODE, 'ONCE', 1),
        new MaintenanceFreqModel(Constants.MAINTENANCE_FREQ_CALENDAR_CODE, 'CALENDAR', 2)
    ];
    static Maintenances: MaintenanceModel[] = [
        new MaintenanceModel('FIRST_REVIEW', [MockData.MaintenanceElements[0], MockData.MaintenanceElements[2]],
            MockData.MaintenanceFreqs[0], 1000, 6, true, false, 0, null, true, 1),
        new MaintenanceModel('BASIC_REVIEW', [MockData.MaintenanceElements[1], MockData.MaintenanceElements[3],
            MockData.MaintenanceElements[7]],
            MockData.MaintenanceFreqs[1], 8000, 12, false, false, 0, null, true, 2),
        new MaintenanceModel('FIRST_REVIEW', [MockData.MaintenanceElements[4], MockData.MaintenanceElements[5]],
            MockData.MaintenanceFreqs[1], 16000, 24, false, false, 0, null, true, 3),
        new MaintenanceModel('REVIEW_SPARKS', [MockData.MaintenanceElements[2], MockData.MaintenanceElements[6]],
            MockData.MaintenanceFreqs[1], 20000, null, false, false, 0, null, true, 4),
        new MaintenanceModel('REVIEW_SPARKS', [MockData.MaintenanceElements[2], MockData.MaintenanceElements[4],
            MockData.MaintenanceElements[5]],
            MockData.MaintenanceFreqs[1], 26000, 0, false, false, 0, null, true, 5),
        new MaintenanceModel('CHANGE WHEELS', [MockData.MaintenanceElements[0], MockData.MaintenanceElements[1]],
            MockData.MaintenanceFreqs[1], 18000, 48, false, true, 0, null, false, 6),
        new MaintenanceModel('REVIES BRAKES', [MockData.MaintenanceElements[8], MockData.MaintenanceElements[8]],
            MockData.MaintenanceFreqs[1], 18000, 48, false, true, 0, null, false, 7)
    ];
    static SystemConfigurations: SystemConfigurationModel[] = [
        new SystemConfigurationModel(Constants.KEY_LAST_UPDATE_DB, 'v3.1.0', new Date(), 1),
        new SystemConfigurationModel(Constants.KEY_CONFIG_DISTANCE, Constants.SETTING_DISTANCE_KM, new Date(), 2),
        new SystemConfigurationModel(Constants.KEY_CONFIG_MONEY, Constants.SETTING_MONEY_EURO, new Date(), 3),
        new SystemConfigurationModel(Constants.KEY_CONFIG_THEME, Constants.SETTING_THEME_DARK, new Date(), 4)
    ];
    static Configurations: ConfigurationModel[] = [
        new ConfigurationModel('PRODUCTION', 'PRODUCTION SETUP', true, [MockData.Maintenances[0],
            MockData.Maintenances[1], MockData.Maintenances[4], MockData.Maintenances[5]], 1),
        new ConfigurationModel('HYOSUNG', 'PRODUCTION SETUP HYOSUNG', true, MockData.Maintenances, 2),
        new ConfigurationModel('KAWASAKI', 'PRODUCTION SETUP KAWASAKI', true, [MockData.Maintenances[1],
            MockData.Maintenances[3], MockData.Maintenances[6]], 3)
    ];
    static VehicleTypes: VehicleTypeModel[] = [
        new VehicleTypeModel(Constants.VEHICLE_TYPE_CODE_MOTO, 'MOTORBIKE', 1),
        new VehicleTypeModel(Constants.VEHICLE_TYPE_CODE_CAR, 'CAR', 2),
        new VehicleTypeModel('O', 'OTHER', 3),
    ];
    static Vehicles: VehicleModel[] = [
        new VehicleModel('R6', 'Yamaha', 2005, 100200, MockData.Configurations[0], MockData.VehicleTypes[0],
            600, new Date(2021, 6, 2), new Date(2006, 3, 27), true, 1),
        new VehicleModel('gt125r', 'Hyosung', 2006, 76750, MockData.Configurations[1], MockData.VehicleTypes[0],
            50, new Date(2021, 6, 2), new Date(2006, 9, 12), true, 2),
        new VehicleModel('Ninja 1000sx', 'Kawasaki', 2021, 12000, MockData.Configurations[2], MockData.VehicleTypes[0],
            600, new Date(2021, 6, 2), new Date(2021, 3, 5), true, 3),
    ];
    static OperationTypes: OperationTypeModel[] = [
        new OperationTypeModel(Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP, 'MAINTENANCE_WORKSHOP', 1),
        new OperationTypeModel(Constants.OPERATION_TYPE_FAILURE_WORKSHOP, 'FAILURE_WORKSHOP', 2),
        new OperationTypeModel(Constants.OPERATION_TYPE_CLOTHES, 'CLOTHES', 3),
        new OperationTypeModel(Constants.OPERATION_TYPE_TOOLS, 'TOOLS', 4),
        new OperationTypeModel(Constants.OPERATION_TYPE_ACCESSORIES, 'ACCESORIES', 5),
        new OperationTypeModel(Constants.OPERATION_TYPE_OTHER, 'OTHERS', 6),
        new OperationTypeModel(Constants.OPERATION_TYPE_MAINTENANCE_HOME, 'MAINTENANCE_HOME', 7),
        new OperationTypeModel(Constants.OPERATION_TYPE_FAILURE_HOME, 'FAILURE_HOME', 8),
        new OperationTypeModel(Constants.OPERATION_TYPE_SPARE_PARTS, 'SPARE_PARTS', 9)
    ];
    static Operations: OperationModel[] = [
        new OperationModel('Compra moto', 'Compra hyosung GT125r 2006', MockData.OperationTypes[5], MockData.Vehicles[1],
            0, new Date(2006, 9, 12), 'Motos real (Ciudad Real)', 'Yo', 3500, '', 1, []),
        new OperationModel('Revision', 'Aceite motor, filtro aceite, pastillas de freno', MockData.OperationTypes[0], MockData.Vehicles[1],
            4000, new Date(2006, 11, 15), 'Motos real (Ciudad Real)', 'Yo', 40, '', 2,
            [MockData.MaintenanceElements[0], MockData.MaintenanceElements[2], MockData.MaintenanceElements[3]]),
        new OperationModel('Comprar Moto', 'Yamaha R6 2005', MockData.OperationTypes[5], MockData.Vehicles[0],
            0, new Date(2006, 9, 19), 'Madrid (Motos Cortes)', 'Otro', 8155.35, '', 3, []),
        new OperationModel('Primera Revisión', 'Filtro aceite, aceite motor, residuos', MockData.OperationTypes[0], MockData.Vehicles[1],
            988, new Date(2006, 11, 21), 'Madrid (Motos Cortes)', 'Otro', 100, '', 4,
            [MockData.MaintenanceElements[1], MockData.MaintenanceElements[4], MockData.MaintenanceElements[5],
            MockData.MaintenanceElements[6]]),
        new OperationModel('Revisión', 'Filtro aceite, aceite motor, residuos', MockData.OperationTypes[0], MockData.Vehicles[1],
            68770, new Date(2021, 2, 11), 'Ciudad Real (Motos Real)', 'Yo', 300, '', 5,
            [MockData.MaintenanceElements[1], MockData.MaintenanceElements[7]]),
        new OperationModel('Revisión', 'Filtro aceite, aceite motor, residuos', MockData.OperationTypes[0], MockData.Vehicles[0],
            100000, new Date(2018, 2, 11), 'Madrid (Motos Cortes)', 'Yo', 300, '', 6,
            [MockData.MaintenanceElements[1], MockData.MaintenanceElements[4], MockData.MaintenanceElements[5],
            MockData.MaintenanceElements[6]]),
        new OperationModel('Revisión', 'Filtro aceite, aceite motor, residuos', MockData.OperationTypes[0], MockData.Vehicles[1],
            72000, new Date(2021, 5, 21), 'Ciudad Real (Motos Real)', 'Yo', 400, '', 7,
            [MockData.MaintenanceElements[4], MockData.MaintenanceElements[5], MockData.MaintenanceElements[6]])
    ];
}