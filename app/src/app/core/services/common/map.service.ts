import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES ANGULAR
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { 
    ConfigurationModel,
    IConfigurationMaintenanceStorageModel,
    IConfigurationStorageModel,
    IMaintenanceElementRelStorageModel,
    IMaintenanceElementStorageModel,
    IMaintenanceFreqStorageModel,
    IMaintenanceStorageModel,
    IMapperModel,
    IOperationMaintenanceElementStorageModel,
    IOperationStorageModel,
    IOperationTypeStorageModel,
    ISystemConfigurationStorageModel, IVehicleStorageModel, IVehicleTypeStorageModel, MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel, OperationModel, OperationTypeModel,
    SystemConfigurationModel, VehicleModel, VehicleTypeModel
} from '@models/index';

// SERVICES
import { IconService } from './icon.service';
import { CalendarService } from './calendar.service';

// UTILS
import { Constants, ConstantsColumns, ConstantsTable, TypeOfTableEnum } from '@utils/index';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // MASTER DATA
  private vehicleTypeObservable = new BehaviorSubject([]);
  private operationTypeObservable = new BehaviorSubject([]);
  private maintenanceFreqObservable = new BehaviorSubject([]);

  // RELATED DATA
  private operationMaintenanceElementList: IOperationMaintenanceElementStorageModel[] = [];
  private configurationMaintenanceList: IConfigurationMaintenanceStorageModel[] = [];
  private maintenanceElementRelList: IMaintenanceElementRelStorageModel[] = [];

  // APPLICATION DATA
  private vehiclesObservable = new BehaviorSubject([]);
  private configurationObservable = new BehaviorSubject([]);
  private operationObservable = new BehaviorSubject([]);
  private maintenanceObservable = new BehaviorSubject([]);
  private maintenanceElementObservable = new BehaviorSubject([]);
  private systemConfigurationObservable = new BehaviorSubject([]);

  // MAPPER 

  private readonly mapperDatabaseConfiguration: IMapperModel[] = [
    // MASTER DATA
    {
      table: ConstantsTable.TABLE_MTM_VEHICLE_TYPE,
      type: TypeOfTableEnum.MASTER,
      mapperFunction: (data: IVehicleTypeStorageModel) => this.getMapVehicleType(data),
      observerFunction: (data: VehicleTypeModel[]) => this.setVehicleType(data),
      relatedTable: [],
    },
    {
      table: ConstantsTable.TABLE_MTM_OPERATION_TYPE,
      type: TypeOfTableEnum.MASTER,
      mapperFunction: (data: IOperationTypeStorageModel) => this.getMapOperationType(data),
      observerFunction: (data: OperationTypeModel[]) => this.setOperationType(data),
      relatedTable: [],
    },
    {
      table: ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ,
      type: TypeOfTableEnum.MASTER,
      mapperFunction: (data: IMaintenanceFreqStorageModel) => this.getMapMaintenanceFreq(data),
      observerFunction: (data: MaintenanceFreqModel[]) => this.setMaintenanceFreq(data),
      relatedTable: [],
    },
    // RELATED DATA
    {
      table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
      type: TypeOfTableEnum.RELATION,
      mapperFunction: (data: IOperationMaintenanceElementStorageModel[]) => data,
      observerFunction: (data: IOperationMaintenanceElementStorageModel[]) => this.setOperationMaintenanceElementData(data),
      relatedTable: [],
    },
    {
      table: ConstantsTable.TABLE_MTM_CONFIG_MAINT,
      type: TypeOfTableEnum.RELATION,
      mapperFunction: (data: IConfigurationMaintenanceStorageModel[]) => data,
      observerFunction: (data: IConfigurationMaintenanceStorageModel[]) => this.setConfigurationMaintenanceData(data),
      relatedTable: [],
    },
    {
      table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL,
      type: TypeOfTableEnum.RELATION,
      mapperFunction: (data: IMaintenanceElementRelStorageModel[]) => data,
      observerFunction: (data: IMaintenanceElementRelStorageModel[]) => this.setMaintenanceElementRelData(data),
      relatedTable: [],
    },
    // APPLICATION DATA
    {
      table: ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION,
      type: TypeOfTableEnum.DATA,
      mapperFunction: (data: ISystemConfigurationStorageModel) => this.getMapSystemConfiguration(data),
      observerFunction: (data: SystemConfigurationModel[]) => this.setSystemConfiguration(data),
      relatedTable: [],
    },
    {
      table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
      type: TypeOfTableEnum.DATA,
      mapperFunction: (data: IMaintenanceElementStorageModel) => this.getMapMaintenanceElement(data),
      observerFunction: (data: MaintenanceElementModel[]) => this.setMaintenanceElement(data),
      relatedTable: [],
    },
    {
      table: ConstantsTable.TABLE_MTM_MAINTENANCE,
      type: TypeOfTableEnum.DATA,
      mapperFunction: (data: IMaintenanceStorageModel, listME: MaintenanceElementModel[], mf: MaintenanceFreqModel) => this.getMapMaintenance(data, listME, mf),
      observerFunction: (data: MaintenanceModel[]) => this.setMaintenance(data),
      relatedTable: [
        {
          foreignKey: ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE,
          foreignKeyRel: ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE_ELEMENT,
          getDataRelatedTableFunction: () => this.getMaintenanceElementData(),
          getDataRelatedTableRefFunction: () => this.getMaintenanceElementRelData(),
          customMapperBeforeStorage: (data: any[]) => data
        },
        {
          foreignKey: ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ,
          foreignKeyRel: '',
          getDataRelatedTableFunction: () => this.getMaintenanceFreqData(),
          getDataRelatedTableRefFunction: null,
          customMapperBeforeStorage: (data: any[]) => data
        }
      ],
    },
    {
      table: ConstantsTable.TABLE_MTM_CONFIGURATION,
      type: TypeOfTableEnum.DATA,
      mapperFunction: (data: IConfigurationStorageModel, listMaint: MaintenanceModel[]) => this.getMapConfiguration(data, listMaint),
      observerFunction: (data: ConfigurationModel[]) => this.setConfigurations(data),
      relatedTable: [
        {
          foreignKey: ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION,
          foreignKeyRel: ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE,
          getDataRelatedTableFunction: () => this.getMaintenanceData(),
          getDataRelatedTableRefFunction: () => this.getConfigurationMaintenanceData(),
          customMapperBeforeStorage: (data: any[]) => data
        }
      ],
    },
    {
      table: ConstantsTable.TABLE_MTM_VEHICLE,
      type: TypeOfTableEnum.DATA,
      mapperFunction: (data: IVehicleStorageModel, conf: ConfigurationModel, vType: VehicleTypeModel) => this.getMapVehicle(data, conf, vType),
      observerFunction: (data: VehicleModel[]) => this.setVehicles(data),
      relatedTable: [
        {
          foreignKey: ConstantsColumns.COLUMN_MTM_VEHICLE_CONFIGURATION,
          foreignKeyRel: '',
          getDataRelatedTableFunction: () => this.getConfigurationsData(),
          getDataRelatedTableRefFunction: null,
          customMapperBeforeStorage: (data: any[]) => data
        },
        {
          foreignKey: ConstantsColumns.COLUMN_MTM_VEHICLE_VEHICLE_TYPE,
          foreignKeyRel: '',
          getDataRelatedTableFunction: () => this.getVehicleTypeData(),
          getDataRelatedTableRefFunction: null,
          customMapperBeforeStorage: (data: any[]) => data
        }
      ],
    },
    {
      table: ConstantsTable.TABLE_MTM_OPERATION,
      type: TypeOfTableEnum.DATA,
      mapperFunction: (data: IOperationStorageModel, oType: OperationTypeModel, v: VehicleModel, listME) => this.getMapOperation(data, oType, v, listME),
      observerFunction: (data: OperationModel[]) => this.setOperations(data),
      relatedTable: [
        {
          foreignKey: ConstantsColumns.COLUMN_MTM_OPERATION_OPERATION_TYPE,
          foreignKeyRel: '',
          getDataRelatedTableFunction: () => this.getOperationTypeData(),
          getDataRelatedTableRefFunction: null,
          customMapperBeforeStorage: (data: any[]) => data
        },
        {
          foreignKey: ConstantsColumns.COLUMN_MTM_OPERATION_VEHICLE,
          foreignKeyRel: '',
          getDataRelatedTableFunction: () => this.getVehiclesData(),
          getDataRelatedTableRefFunction: null,
          customMapperBeforeStorage: (data: any[]) => data
        },
        {
          foreignKey: ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION,
          foreignKeyRel: ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_MAINTENANCE_ELEMENT,
          getDataRelatedTableFunction: () => this.getMaintenanceElementData(),
          getDataRelatedTableRefFunction: () => this.getOperationMaintenanceElementData(),
          customMapperBeforeStorage: (data: MaintenanceElementModel[], related: IOperationMaintenanceElementStorageModel[]) => {
            data.forEach(x => x.price = related.find(y => x.id == y.idMaintenanceElement).price)
            return data;
          }
        }
      ],
    },
  ];

  constructor(private translator: TranslateService,
              private iconService: IconService,
              private calendarService: CalendarService) {}
  
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
    return this.vehiclesObservable.next(vehicles);
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

  /* MAPPER CONFIGURATION */
  getMapperConfiguration(): IMapperModel[] {
    return this.mapperDatabaseConfiguration;
  }

  mapperDataStorage(data: any) {
    for(let conf of this.mapperDatabaseConfiguration) {
      let dataMapped: any[] = [];
      for(let element of data[conf.table]) {
        
        let parameters: any[] = [];
        conf.relatedTable.forEach(step => {
          const dataTable: any[] = JSON.parse(JSON.stringify(step.getDataRelatedTableFunction()));
          if(step.getDataRelatedTableRefFunction == null) {
            parameters = [...parameters, dataTable.find(row => row.id === element[step.foreignKey])];
          } else {
            const dataTableRelated: any[] = step.getDataRelatedTableRefFunction()
                                                .filter(row => row[step.foreignKey] === element.id);
            parameters = [...parameters, 
              step.customMapperBeforeStorage(dataTable.filter(row => dataTableRelated.some(rel => row.id === rel[step.foreignKeyRel])), dataTableRelated)];
          }
        });

        dataMapped = [...dataMapped, conf.mapperFunction(element, ...parameters)];
      }
      conf.observerFunction(dataMapped);
    }
  }

  /* MASTER DATA */

  getMapVehicleType(data: IVehicleTypeStorageModel): VehicleTypeModel {
      return {
          id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
          code: data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_CODE],
          description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_DESCRIPTION]}`),
          icon: this.iconService.getIconVehicle(data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_CODE])
      };
  }
  
  getMapOperationType(data: IOperationTypeStorageModel): OperationTypeModel {
      return {
          id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
          code: data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_CODE],
          description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION]}`),
          icon: this.iconService.getIconOperationType(data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_CODE])
      };
  }
  
  getMapMaintenanceFreq(data: IMaintenanceFreqStorageModel): MaintenanceFreqModel {
      return {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        code: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE],
        description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_DESCRIPTION]}`),
        icon: this.iconService.getIconMaintenance(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE])
      };
  }

  /* APPLICATION DATA */

  getMapSystemConfiguration(data: ISystemConfigurationStorageModel): SystemConfigurationModel {
    return {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        key: data[ConstantsColumns.COLUMN_MTM_SYSTEM_CONFIGURATION_KEY],
        value: data[ConstantsColumns.COLUMN_MTM_SYSTEM_CONFIGURATION_VALUE],
        updated: new Date(data[ConstantsColumns.COLUMN_MTM_SYSTEM_CONFIGURATION_UPDATED])
    };
  }

  getMapMaintenanceElement(data: IMaintenanceElementStorageModel): MaintenanceElementModel {
    return {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        name: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER] === Constants.DATABASE_YES ?
            this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME]}`) :
            data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME]),
        description: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER] === Constants.DATABASE_YES ?
            this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION]}`) :
            data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION]),
        master: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER] === Constants.DATABASE_YES),
        price: (data[ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE] ? 
                data[ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE] : 0),
        icon: this.iconService.getIconReplacement(data[ConstantsColumns.COLUMN_MTM_ID])
    };
}

  getMapMaintenance(data: IMaintenanceStorageModel, listMaintenanceElement: MaintenanceElementModel[], maintenaceFreq: MaintenanceFreqModel): MaintenanceModel {
    const master: boolean = data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER] === Constants.DATABASE_YES;
    return {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      description: (master ? this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION]}`)
        : data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION]),
      listMaintenanceElement: listMaintenanceElement,
      maintenanceFreq: maintenaceFreq,
      km: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM]),
      time: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME],
      init: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT] === Constants.DATABASE_YES,
      wear: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR] === Constants.DATABASE_YES,
      fromKm: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FROM],
      toKm: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TO],
      master: master
    };
  }
  
  getMapConfiguration(data: IConfigurationStorageModel, listMaintenance: MaintenanceModel[]): ConfigurationModel {
    const master: boolean = (data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER] === Constants.DATABASE_YES);
    return {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        name: (master ? this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME]}`) :
          data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME]),
        description: (master ? this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION]}`) :
          data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION]),
        master: master,
        listMaintenance: listMaintenance
      };
  }

  getMapVehicle(data: IVehicleStorageModel, configuration: ConfigurationModel, vehicleType: VehicleTypeModel): VehicleModel {
    let vehicleMapped: VehicleModel = {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      model: data[ConstantsColumns.COLUMN_MTM_VEHICLE_MODEL],
      brand: data[ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND],
      year: Number(data[ConstantsColumns.COLUMN_MTM_VEHICLE_YEAR]),
      km: Number(data[ConstantsColumns.COLUMN_MTM_VEHICLE_KM]),
      kmEstimated: 0,
      configuration: configuration,
      vehicleType: vehicleType,
      kmsPerMonth: data[ConstantsColumns.COLUMN_MTM_VEHICLE_KMS_PER_MONTH],
      dateKms: new Date(data[ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_KMS]),
      datePurchase: data[ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_PURCHASE],
      active: data[ConstantsColumns.COLUMN_MTM_VEHICLE_ACTIVE] === Constants.DATABASE_YES
    };
    vehicleMapped.kmEstimated = this.calendarService.calculateKmVehicleEstimated(vehicleMapped);
    return vehicleMapped;
  }

  getMapOperation(data: IOperationStorageModel, operationType: OperationTypeModel,
                  vehicle: VehicleModel, replacements: MaintenanceElementModel[]): OperationModel {
    return {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      description: data[ConstantsColumns.COLUMN_MTM_OPERATION_DESCRIPTION],
      details: data[ConstantsColumns.COLUMN_MTM_OPERATION_DETAILS],
      operationType: operationType,
      vehicle: vehicle,
      km: Number(data[ConstantsColumns.COLUMN_MTM_OPERATION_KM]),
      date: data[ConstantsColumns.COLUMN_MTM_OPERATION_DATE],
      location: data[ConstantsColumns.COLUMN_MTM_OPERATION_LOCATION],
      owner: data[ConstantsColumns.COLUMN_MTM_OPERATION_OWNER],
      price: Number(data[ConstantsColumns.COLUMN_MTM_OPERATION_PRICE]),
      document: data[ConstantsColumns.COLUMN_MTM_OPERATION_DOCUMENT],
      listMaintenanceElement: replacements
    };
  }
}

  