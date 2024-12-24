import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// MODELS
import { 
    ConfigurationModel,
    IConfigurationMaintenanceStorageModel,
    IMaintenanceElementRelStorageModel,
    IOperationMaintenanceElementStorageModel,MaintenanceElementModel, MaintenanceFreqModel, 
    MaintenanceModel, OperationModel, OperationTypeModel,
    SystemConfigurationModel, VehicleModel, VehicleTypeModel
} from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // MASTER DATA
  private readonly vehicleTypeObservable = new BehaviorSubject([]);
  private readonly operationTypeObservable = new BehaviorSubject([]);
  private readonly maintenanceFreqObservable = new BehaviorSubject([]);

  // RELATED DATA
  private operationMaintenanceElementList: IOperationMaintenanceElementStorageModel[] = [];
  private configurationMaintenanceList: IConfigurationMaintenanceStorageModel[] = [];
  private maintenanceElementRelList: IMaintenanceElementRelStorageModel[] = [];

  // APPLICATION DATA
  private readonly vehiclesObservable = new BehaviorSubject([]);
  private readonly configurationObservable = new BehaviorSubject([]);
  private readonly operationObservable = new BehaviorSubject([]);
  private readonly maintenanceObservable = new BehaviorSubject([]);
  private readonly maintenanceElementObservable = new BehaviorSubject([]);
  private readonly systemConfigurationObservable = new BehaviorSubject([]);

  constructor() {}
  
  // GETS

  getVehicles(): Observable<VehicleModel[]> {
    return this.vehiclesObservable.asObservable();
  }

  getVehicleType(): Observable<VehicleTypeModel[]> {
    return this.vehicleTypeObservable.asObservable();
  }

  getConfigurations(): Observable<ConfigurationModel[]> {
    return this.configurationObservable.asObservable();
  }

  getOperations(): Observable<OperationModel[]> {
    return this.operationObservable.asObservable();
  }

  getOperationType(): Observable<OperationTypeModel[]> {
    return this.operationTypeObservable.asObservable();
  }

  getMaintenance(): Observable<MaintenanceModel[]> {
    return this.maintenanceObservable.asObservable();
  }

  getMaintenanceElement(): Observable<MaintenanceElementModel[]> {
    return this.maintenanceElementObservable.asObservable();
  }

  getMaintenanceFreq(): Observable<MaintenanceFreqModel[]> {
    return this.maintenanceFreqObservable.asObservable();
  }

  getSystemConfiguration(): Observable<SystemConfigurationModel[]> {
    return this.systemConfigurationObservable.asObservable();
  }

  // SETS

  setOperationMaintenanceElementData(opMaintenanceElement: IOperationMaintenanceElementStorageModel[]) {
    this.operationMaintenanceElementList = opMaintenanceElement;
  }
  
  setConfigurationMaintenanceData(confMaintenance: IConfigurationMaintenanceStorageModel[]) {
    this.configurationMaintenanceList = confMaintenance;
  }

  setMaintenanceElementRelData(maintenanceElementRef: IMaintenanceElementRelStorageModel[]) {
    this.maintenanceElementRelList = maintenanceElementRef;
  }

  setVehicles(vehicles: VehicleModel[]): void {
    this.vehiclesObservable.next(vehicles);
  }

  setVehicleType(vehicleTypes: VehicleTypeModel[]): void {
    this.vehicleTypeObservable.next(vehicleTypes);
  }

  setConfigurations(configurations: ConfigurationModel[]): void {
    this.configurationObservable.next(configurations);
  }

  setOperations(operations: OperationModel[]): void {
    this.operationObservable.next(operations);
  }

  setOperationType(operationTypes: OperationTypeModel[]): void {
    this.operationTypeObservable.next(operationTypes);
  }

  setMaintenance(maintenances: MaintenanceModel[]): void {
    this.maintenanceObservable.next(maintenances);
  }

  setMaintenanceElement(maintenanceElements: MaintenanceElementModel[]): void {
    this.maintenanceElementObservable.next(maintenanceElements);
  }

  setMaintenanceFreq(maintenanceFreq: MaintenanceFreqModel[]): void {
    this.maintenanceFreqObservable.next(maintenanceFreq);
  }

  setSystemConfiguration(systemConfigurations: SystemConfigurationModel[]): void {
    this.systemConfigurationObservable.next(systemConfigurations);
  }

  // GETS DATA
  getOperationMaintenanceElementData(): IOperationMaintenanceElementStorageModel[] {
    return this.operationMaintenanceElementList;
  }
  
  getConfigurationMaintenanceData(): IConfigurationMaintenanceStorageModel[] {
    return this.configurationMaintenanceList;
  }

  getMaintenanceElementRelData(): IMaintenanceElementRelStorageModel[] {
    return this.maintenanceElementRelList;
  }

  getVehiclesData(): VehicleModel[] {
    return this.filterNull<VehicleModel>(this.vehiclesObservable);
  }

  getVehicleTypeData(): VehicleTypeModel[] {
    return this.filterNull<VehicleTypeModel>(this.vehicleTypeObservable);
  }

  getConfigurationsData(): ConfigurationModel[] {
    return this.filterNull<ConfigurationModel>(this.configurationObservable);
  }

  getOperationsData(): OperationModel[] {
    return this.filterNull<OperationModel>(this.operationObservable);
  }

  getOperationTypeData(): OperationTypeModel[] {
    return this.filterNull<OperationTypeModel>(this.operationTypeObservable);
  }

  getMaintenanceData(): MaintenanceModel[] {
    return this.filterNull<MaintenanceModel>(this.maintenanceObservable);
  }

  getMaintenanceElementData(): MaintenanceElementModel[] {
    return this.filterNull<MaintenanceElementModel>(this.maintenanceElementObservable);
  }

  getMaintenanceFreqData(): MaintenanceFreqModel[] {
    return this.filterNull<MaintenanceFreqModel>(this.maintenanceFreqObservable);
  }

  getSystemConfigurationData(): SystemConfigurationModel[] {
    return this.filterNull<SystemConfigurationModel>(this.systemConfigurationObservable);
  }

  private filterNull<T>(behaviour: BehaviorSubject<T[]>): T[] {
    return behaviour.value ? behaviour.value : [];
  }

}

  