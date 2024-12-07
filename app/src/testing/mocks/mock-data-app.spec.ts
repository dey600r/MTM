import {
    ConfigurationModel, MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel, OperationModel,
    OperationTypeModel, SystemConfigurationModel, VehicleModel, VehicleTypeModel
} from '@models/index';
import { MockAppConfiguration, MockAppVehicle, MockAppMaintenance, MockAppOperation } from './data/app/index';

export class MockAppData {

    /* MAINTENANCE ELELEMTNS */
    static readonly MaintenanceElementsAux: MaintenanceElementModel[] = MockAppMaintenance.MaintenanceElementsAux;
    public static readonly MaintenanceElements: MaintenanceElementModel[] = MockAppMaintenance.MaintenanceElements;

    /* MAINTENANCE FREQUENCIES */
    public static readonly MaintenanceFreqsAux: MaintenanceFreqModel[] = MockAppMaintenance.MaintenanceFreqsAux;
    public static readonly MaintenanceFreqs: MaintenanceFreqModel[] = MockAppMaintenance.MaintenanceFreqs;

    /* MAINTENANCES */
    public static readonly Maintenances: MaintenanceModel[] = MockAppMaintenance.Maintenances;

    /* SYSTEM CONFIGURATION */
    public static readonly SystemConfigurations: SystemConfigurationModel[] = MockAppConfiguration.SystemConfigurations;

    /* CONFIGURATION */
    static readonly Configurations: ConfigurationModel[] = MockAppConfiguration.Configurations;

    /* VEHICLE TYPE */
    public static readonly VehicleTypesAux: VehicleTypeModel[] = MockAppVehicle.VehicleTypesAux;
    public static readonly VehicleTypes: VehicleTypeModel[] = MockAppVehicle.VehicleTypes;

    /* VEHICLES */
    public static readonly VehiclesAux: VehicleModel[] = MockAppVehicle.VehiclesAux;
    public static readonly Vehicles: VehicleModel[] = MockAppVehicle.Vehicles;

    /* OPERATION TYPES */
    public static readonly OperationTypesAux: OperationTypeModel[] = MockAppOperation.OperationTypesAux;
    public static readonly OperationTypes: OperationTypeModel[] = MockAppOperation.OperationTypes;

    /* OPERATIONS */
    static readonly Operations: OperationModel[] = MockAppOperation.Operations;
}