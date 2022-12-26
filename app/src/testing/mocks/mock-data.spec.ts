import {
    ConfigurationModel, MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel, OperationModel,
    OperationTypeModel, SystemConfigurationModel, VehicleModel, VehicleTypeModel
} from '@models/index';
import { MockConfiguration, MockVehicle, MockMaintenance, MockOperation } from './data/index';

export class MockData {

    /* MAINTENANCE ELELEMTNS */
    static MaintenanceElementsAux: MaintenanceElementModel[] = MockMaintenance.MaintenanceElementsAux;
    public static MaintenanceElements: MaintenanceElementModel[] = MockMaintenance.MaintenanceElements;

    /* MAINTENANCE FREQUENCIES */
    public static MaintenanceFreqsAux: MaintenanceFreqModel[] = MockMaintenance.MaintenanceFreqsAux;
    public static MaintenanceFreqs: MaintenanceFreqModel[] = MockMaintenance.MaintenanceFreqs;

    /* MAINTENANCES */
    public static Maintenances: MaintenanceModel[] = MockMaintenance.Maintenances;

    /* SYSTEM CONFIGURATION */
    public static SystemConfigurations: SystemConfigurationModel[] = MockConfiguration.SystemConfigurations;

    /* CONFIGURATION */
    static Configurations: ConfigurationModel[] = MockConfiguration.Configurations;

    /* VEHICLE TYPE */
    public static VehicleTypesAux: VehicleTypeModel[] = MockVehicle.VehicleTypesAux;
    public static VehicleTypes: VehicleTypeModel[] = MockVehicle.VehicleTypes;

    /* VEHICLES */
    public static VehiclesAux: VehicleModel[] = MockVehicle.VehiclesAux;
    public static Vehicles: VehicleModel[] = MockVehicle.Vehicles;

    /* OPERATION TYPES */
    public static OperationTypesAux: OperationTypeModel[] = MockOperation.OperationTypesAux;
    public static OperationTypes: OperationTypeModel[] = MockOperation.OperationTypes;

    /* OPERATIONS */
    static Operations: OperationModel[] = MockOperation.Operations;
}