import {
    ConfigurationModel, MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel, OperationModel,
    OperationTypeModel, SystemConfigurationModel, VehicleModel, VehicleTypeModel
} from '@models/index';
import { MockAppConfiguration, MockAppVehicle, MockAppMaintenance, MockAppOperation } from './data/app/index';

export class MockAppData {

    /* MAINTENANCE ELELEMTNS */
    static MaintenanceElementsAux: MaintenanceElementModel[] = MockAppMaintenance.MaintenanceElementsAux;
    public static MaintenanceElements: MaintenanceElementModel[] = MockAppMaintenance.MaintenanceElements;

    /* MAINTENANCE FREQUENCIES */
    public static MaintenanceFreqsAux: MaintenanceFreqModel[] = MockAppMaintenance.MaintenanceFreqsAux;
    public static MaintenanceFreqs: MaintenanceFreqModel[] = MockAppMaintenance.MaintenanceFreqs;

    /* MAINTENANCES */
    public static Maintenances: MaintenanceModel[] = MockAppMaintenance.Maintenances;

    /* SYSTEM CONFIGURATION */
    public static SystemConfigurations: SystemConfigurationModel[] = MockAppConfiguration.SystemConfigurations;

    /* CONFIGURATION */
    static Configurations: ConfigurationModel[] = MockAppConfiguration.Configurations;

    /* VEHICLE TYPE */
    public static VehicleTypesAux: VehicleTypeModel[] = MockAppVehicle.VehicleTypesAux;
    public static VehicleTypes: VehicleTypeModel[] = MockAppVehicle.VehicleTypes;

    /* VEHICLES */
    public static VehiclesAux: VehicleModel[] = MockAppVehicle.VehiclesAux;
    public static Vehicles: VehicleModel[] = MockAppVehicle.Vehicles;

    /* OPERATION TYPES */
    public static OperationTypesAux: OperationTypeModel[] = MockAppOperation.OperationTypesAux;
    public static OperationTypes: OperationTypeModel[] = MockAppOperation.OperationTypes;

    /* OPERATIONS */
    static Operations: OperationModel[] = MockAppOperation.Operations;
}