import {
    IConfigurationMaintenanceStorageModel,
    IConfigurationStorageModel,
    IMaintenanceElementRelStorageModel,
    IMaintenanceElementStorageModel, IMaintenanceFreqStorageModel, IMaintenanceStorageModel, IOperationMaintenanceElementStorageModel, IOperationStorageModel, IOperationTypeStorageModel, ISystemConfigurationStorageModel, IVehicleStorageModel, IVehicleTypeStorageModel
} from '@models/index';
import { MockDBConfiguration, MockDBMaintenance, MockDBOperation, MockDBVehicle } from './data/db/index';

export class MockDBData {

    /* MAINTENANCE ELELEMTNS */
    public static readonly MaintenanceElements: IMaintenanceElementStorageModel[] = MockDBMaintenance.MaintenanceElements;

    /* MAINTENANCE FREQUENCIES */
    public static readonly MaintenanceFreqs: IMaintenanceFreqStorageModel[] = MockDBMaintenance.MaintenanceFreqs;

    /* MAINTENANCES */
    public static readonly Maintenances: IMaintenanceStorageModel[] = MockDBMaintenance.Maintenances;

    /* MAINTENANCES - MAINTENANCES ELEMENT */
    public static readonly MaintenancesElementRel: IMaintenanceElementRelStorageModel[] = MockDBMaintenance.MaintenanceElementRel;

    /* SYSTEM CONFIGURATION */
    public static readonly SystemConfigurations: ISystemConfigurationStorageModel[] = MockDBConfiguration.SystemConfigurations;

    /* CONFIGURATION */
    static readonly Configurations: IConfigurationStorageModel[] = MockDBConfiguration.Configurations;

    /* CONFIGURATION - MAINTENANCES */
    public static readonly ConfigurationMaintenance: IConfigurationMaintenanceStorageModel[] = MockDBConfiguration.ConfigurationMaintenances;

    /* VEHICLE TYPE */
    public static readonly VehicleTypes: IVehicleTypeStorageModel[] = MockDBVehicle.VehicleTypes;

    /* VEHICLES */
    public static readonly Vehicles: IVehicleStorageModel[] = MockDBVehicle.Vehicles;

    /* OPERATION TYPES */
    public static readonly OperationTypes: IOperationTypeStorageModel[] = MockDBOperation.OperationTypes;

    /* OPERATIONS */
    public static readonly Operations: IOperationStorageModel[] = MockDBOperation.Operations;

    /* OPERATIONS - MAINTENANCE MODEL */
    public static readonly OperationMaintenancesElement: IOperationMaintenanceElementStorageModel[] = MockDBOperation.OperationMaintenanceElement;
}