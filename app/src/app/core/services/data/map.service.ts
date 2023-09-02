import { Injectable } from '@angular/core';

// LIBRARIES ANGULAR
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { 
    ConfigurationModel, IConfigurationMaintenanceStorageModel, IConfigurationStorageModel, IMaintenanceElementRelStorageModel, IMaintenanceElementStorageModel, IMaintenanceFreqStorageModel,
    IMaintenanceStorageModel, IOperationMaintenanceElementStorageModel, IOperationStorageModel, IOperationTypeStorageModel,
    ISystemConfigurationStorageModel, IVehicleStorageModel, IVehicleTypeStorageModel, 
    MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel, OperationModel, OperationTypeModel,
    SystemConfigurationModel, VehicleModel, VehicleTypeModel
} from '@models/index';

// SERVICES
import { IconService } from '../common/icon.service';
import { CalendarService } from '../common/calendar.service';

// UTILS
import { ConstantsColumns } from '@utils/index';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private translator: TranslateService,
              private iconService: IconService,
              private calendarService: CalendarService) {}

  /* MASTER DATA */

  getMapVehicleType(data: IVehicleTypeStorageModel): VehicleTypeModel {
      return {
          id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
          code: data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_CODE],
          description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_DESCRIPTION]}`),
          descriptionKey: data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_DESCRIPTION],
          icon: this.iconService.getIconVehicle(data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_CODE])
      };
  }
  
  getMapOperationType(data: IOperationTypeStorageModel): OperationTypeModel {
      return {
          id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
          code: data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_CODE],
          description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION]}`),
          descriptionKey: data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION],
          icon: this.iconService.getIconOperationType(data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_CODE])
      };
  }
  
  getMapMaintenanceFreq(data: IMaintenanceFreqStorageModel): MaintenanceFreqModel {
      return {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        code: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE],
        description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_DESCRIPTION]}`),
        descriptionKey: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_DESCRIPTION],
        icon: this.iconService.getIconMaintenance(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE])
      };
  }

  /* RELATION DATA */

  saveMapMaintenanceElementRel(data: MaintenanceModel): IMaintenanceElementRelStorageModel[] {
    let result: IMaintenanceElementRelStorageModel[] = [];
    data.listMaintenanceElement.forEach(x => result.push({
      id: x.idMaintenanceRel,
      idMaintenance: data.id,
      idMaintenanceElement: x.id
    }));
    return result;
  }

  saveMapConfigMaintenanceRel(data: ConfigurationModel): IConfigurationMaintenanceStorageModel[] {
    let result: IConfigurationMaintenanceStorageModel[] = [];
    data.listMaintenance.forEach(x => result.push({
      id: x.idConfigurationRel,
      idConfiguration: data.id,
      idMaintenance: x.id
    }));
    return result;
  }

  saveMapOpMaintenanceRel(data: OperationModel): IOperationMaintenanceElementStorageModel[] {
    let result: IOperationMaintenanceElementStorageModel[] = [];
    data.listMaintenanceElement.forEach(x => result.push({
      id: x.idOperationRel,
      idOperation: data.id,
      idMaintenanceElement: x.id,
      price: x.price
    }));
    return result;
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

  saveMapSystemConfiguration(data: SystemConfigurationModel): ISystemConfigurationStorageModel {
    return {
      id: data.id,
      key: data.key,
      value: data.value,
      updated: data.updated
    };
  }

  getMapMaintenanceElement(data: IMaintenanceElementStorageModel): MaintenanceElementModel {
    return {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        name: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER] === true ?
          this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME]}`) :
          data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME]),
        nameKey: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME],
        description: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER] ?
          this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION]}`) :
          data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION]),
        descriptionKey: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION],
        master: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER]),
        price: (data[ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE] ? 
                data[ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_PRICE] : 0),
        icon: this.iconService.getIconReplacement(data[ConstantsColumns.COLUMN_MTM_ID]),
        idOperationRel: 0,
        idMaintenanceRel: 0
    };
  }

  saveMapMaintenanceElement(data: MaintenanceElementModel): IMaintenanceElementStorageModel {
    return {
      id: data.id,
      name: (data.master ? data.nameKey : data.name),
      description: (data.master ? data.descriptionKey : data.description),
      master: data.master
    };
  }

  getMapMaintenance(data: IMaintenanceStorageModel, listMaintenanceElement: MaintenanceElementModel[], maintenaceFreq: MaintenanceFreqModel): MaintenanceModel {
    return {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      description: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER] ?
        this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION]}`)
        : data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION]),
      descriptionKey: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION],
      listMaintenanceElement: listMaintenanceElement,
      maintenanceFreq: maintenaceFreq,
      km: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM]),
      time: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME],
      init: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT],
      wear: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR],
      fromKm: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FROM],
      toKm: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TO],
      master: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER],
      idConfigurationRel: 0
    };
  }

  saveMapMaintenance(data: MaintenanceModel): IMaintenanceStorageModel {
    return {
      id: data.id,
      description: (data.master ? data.descriptionKey : data.description),
      idMaintenanceFrec: data.maintenanceFreq.id,
      km: data.km,
      time: data.time,
      init: data.init,
      wear: data.wear,
      fromKm: data.fromKm,
      toKm: data.toKm,
      master: data.master
    };
  }
  
  getMapConfiguration(data: IConfigurationStorageModel, listMaintenance: MaintenanceModel[]): ConfigurationModel {
    return {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        name: (data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER] ?
          this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME]}`) :
          data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME]),
        nameKey: data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME],
        description: (data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER] ?
          this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION]}`) :
          data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION]),
        descriptionKey: data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION],
        master: data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER],
        listMaintenance: listMaintenance
      };
  }

  saveMapConfiguration(data: ConfigurationModel): IConfigurationStorageModel {
    return {
      id: data.id,
      name: (data.master ? data.nameKey : data.name),
      description: (data.master ? data.descriptionKey : data.description),
      master: data.master
    }
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
      active: data[ConstantsColumns.COLUMN_MTM_VEHICLE_ACTIVE]
    };
    vehicleMapped.kmEstimated = this.calendarService.calculateKmVehicleEstimated(vehicleMapped);
    return vehicleMapped;
  }

  saveMapVehicle(data: VehicleModel): IVehicleStorageModel {
    return {
      id: data.id,
      model: data.model,
      brand: data.brand,
      year: data.year,
      km: data.km,
      idConfiguration: data.configuration.id,
      idVehicleType: data.vehicleType.id,
      kmsPerMonth: data.kmsPerMonth,
      dateKms: data.dateKms,
      datePurchase: data.datePurchase,
      active: data.active
    };
  }

  getMapOperation(data: IOperationStorageModel, operationType: OperationTypeModel,
                  vehicle: VehicleModel, replacements: MaintenanceElementModel[]): OperationModel {
    return {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      description: data[ConstantsColumns.COLUMN_MTM_OPERATION_DESCRIPTION],
      descriptionKey: '',
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

  saveMapOperation(data: OperationModel): IOperationStorageModel {
    return {
      id: data.id,
      description: data.description,
      details: data.details,
      idOperationType: data.operationType.id,
      idVehicle: data.vehicle.id,
      km: data.km,
      date: data.date,
      location: data.location,
      owner: data.owner,
      price: data.price,
      document: data.document
    }
  }
}

  