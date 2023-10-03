import {
    IConfigurationMaintenanceStorageModel,
    IConfigurationStorageModel,
    IMaintenanceElementRelStorageModel,
    IMaintenanceElementStorageModel, IMaintenanceFreqStorageModel, IMaintenanceStorageModel, IOperationMaintenanceElementStorageModel, IOperationStorageModel, IOperationTypeStorageModel, ISystemConfigurationStorageModel, IVehicleStorageModel, IVehicleTypeStorageModel
} from '@models/index';
import { MockDBConfiguration, MockDBMaintenance, MockDBOperation, MockDBVehicle } from './data/db/index';

export class MockDBData {

    /* MAINTENANCE ELELEMTNS */
    public static MaintenanceElements: IMaintenanceElementStorageModel[] = MockDBMaintenance.MaintenanceElements;

    /* MAINTENANCE FREQUENCIES */
    public static MaintenanceFreqs: IMaintenanceFreqStorageModel[] = MockDBMaintenance.MaintenanceFreqs;

    /* MAINTENANCES */
    public static Maintenances: IMaintenanceStorageModel[] = MockDBMaintenance.Maintenances;

    /* MAINTENANCES - MAINTENANCES ELEMENT */
    public static MaintenancesElementRel: IMaintenanceElementRelStorageModel[] = MockDBMaintenance.MaintenanceElementRel;

    /* SYSTEM CONFIGURATION */
    public static SystemConfigurations: ISystemConfigurationStorageModel[] = MockDBConfiguration.SystemConfigurations;

    /* CONFIGURATION */
    static Configurations: IConfigurationStorageModel[] = MockDBConfiguration.Configurations;

    /* CONFIGURATION - MAINTENANCES */
    public static ConfigurationMaintenance: IConfigurationMaintenanceStorageModel[] = MockDBConfiguration.ConfigurationMaintenances;

    /* VEHICLE TYPE */
    public static VehicleTypes: IVehicleTypeStorageModel[] = MockDBVehicle.VehicleTypes;

    /* VEHICLES */
    public static Vehicles: IVehicleStorageModel[] = MockDBVehicle.Vehicles;

    /* OPERATION TYPES */
    public static OperationTypes: IOperationTypeStorageModel[] = MockDBOperation.OperationTypes;

    /* OPERATIONS */
    public static Operations: IOperationStorageModel[] = MockDBOperation.Operations;

    /* OPERATIONS - MAINTENANCE MODEL */
    public static OperationMaintenancesElement: IOperationMaintenanceElementStorageModel[] = MockDBOperation.OperationMaintenanceElement;
}