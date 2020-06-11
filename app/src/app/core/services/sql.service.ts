import { Injectable } from '@angular/core';

// LIBRARIES ANGULAR
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
  VehicleModel, ConfigurationModel, OperationModel, OperationTypeModel, MaintenanceElementModel,
  MaintenanceFreqModel, MaintenanceModel, VehicleTypeModel
} from '@models/index';
import { ConstantsTable, ConstantsColumns, Constants } from '@utils/index';
import { CalendarService } from './calendar.service';

@Injectable({
  providedIn: 'root'
})
export class SqlService {

  constructor(private calendarService: CalendarService,
              private translator: TranslateService) {
  }

  /* BUILDER SQL */

  getSql(table: string): string {
      let sql: string;
      switch (table) {
        case ConstantsTable.TABLE_MTM_VEHICLE:
          sql = this.getSqlVehicle();
          break;
        case ConstantsTable.TABLE_MTM_CONFIGURATION:
          sql = this.getSqlConfiguration();
          break;
        case ConstantsTable.TABLE_MTM_OPERATION:
          sql = this.getSqlOperation();
          break;
        case ConstantsTable.TABLE_MTM_MAINTENANCE:
          sql = this.getSqlMaintenance();
          break;
        default:
          sql = `SELECT * FROM ${table}`;
      }
      return sql;
  }

  getSqlVehicle(): string {
      return `SELECT v.${ConstantsColumns.COLUMN_MTM_ID}, ` +
      `v.${ConstantsColumns.COLUMN_MTM_VEHICLE_MODEL}, v.${ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND}, ` +
      `v.${ConstantsColumns.COLUMN_MTM_VEHICLE_YEAR}, v.${ConstantsColumns.COLUMN_MTM_VEHICLE_KM}, ` +
      `v.${ConstantsColumns.COLUMN_MTM_VEHICLE_KMS_PER_MONTH}, ` +
      `v.${ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_KMS}, ` +
      `v.${ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_PURCHASE}, ` +
      `c.${ConstantsColumns.COLUMN_MTM_ID} as idConfiguration, ` +
      `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME} as nameConfiguration, ` +
      `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION} as descriptionConfiguration, ` +
      `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER} as masterConfiguration, ` +
      `vt.${ConstantsColumns.COLUMN_MTM_ID} as idVehicleType, ` +
      `vt.${ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_CODE} as codeVehicleType, ` +
      `vt.${ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_DESCRIPTION} as descriptionVehicleType ` +
      `FROM ${ConstantsTable.TABLE_MTM_VEHICLE} AS v ` +
      `JOIN ${ConstantsTable.TABLE_MTM_CONFIGURATION} AS c ON ` +
      `c.${ConstantsColumns.COLUMN_MTM_ID} = v.${ConstantsColumns.COLUMN_MTM_VEHICLE_CONFIGURATION} ` +
      `JOIN ${ConstantsTable.TABLE_MTM_VEHICLE_TYPE} AS vt ON ` +
      `vt.${ConstantsColumns.COLUMN_MTM_ID} = v.${ConstantsColumns.COLUMN_MTM_VEHICLE_VEHICLE_TYPE}`;
  }

  getSqlConfiguration(): string {
    return `SELECT c.${ConstantsColumns.COLUMN_MTM_ID}, ` +
    `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME}, c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION}, ` +
    `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_ID} as idMaintenance, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION} as descriptionMaintenance, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_ID} as idMaintenanceFreq, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE} as codeMaintenanceFreq, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_DESCRIPTION} as descriptionMaintenanceFreq, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME}, m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR}, m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FROM},` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TO}, m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER} as masterMaintenance ` +
    `FROM ${ConstantsTable.TABLE_MTM_CONFIGURATION} AS c ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_CONFIG_MAINT} AS cm ON ` +
    `c.${ConstantsColumns.COLUMN_MTM_ID} = cm.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE} AS m ON ` +
    `m.${ConstantsColumns.COLUMN_MTM_ID} = cm.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ} AS mf ON ` +
    `mf.${ConstantsColumns.COLUMN_MTM_ID} = m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ}`;
  }

  getSqlOperation(): string {
    return `SELECT op.${ConstantsColumns.COLUMN_MTM_ID}, ` +
    `op.${ConstantsColumns.COLUMN_MTM_OPERATION_DESCRIPTION}, op.${ConstantsColumns.COLUMN_MTM_OPERATION_DETAILS}, ` +
    `v.${ConstantsColumns.COLUMN_MTM_ID} as idVehicle, v.${ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND} as brandVehicle, ` +
    `v.${ConstantsColumns.COLUMN_MTM_VEHICLE_MODEL} as modelVehicle, op.${ConstantsColumns.COLUMN_MTM_OPERATION_KM}, ` +
    `vt.${ConstantsColumns.COLUMN_MTM_ID} as idVehicleType, vt.${ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_CODE} as codeVehicleType, ` +
    `op.${ConstantsColumns.COLUMN_MTM_OPERATION_DATE}, op.${ConstantsColumns.COLUMN_MTM_OPERATION_LOCATION}, ` +
    `op.${ConstantsColumns.COLUMN_MTM_OPERATION_OWNER}, op.${ConstantsColumns.COLUMN_MTM_OPERATION_PRICE}, ` +
    `op.${ConstantsColumns.COLUMN_MTM_OPERATION_DOCUMENT}, opt.${ConstantsColumns.COLUMN_MTM_ID} as idOperationType, ` +
    `opt.${ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_CODE} as codeOperationType, ` +
    `opt.${ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION} as descriptionOperationType, ` +
    `me.${ConstantsColumns.COLUMN_MTM_ID} as idMaintenanceElement, ` +
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME} as nameMaintenanceElement, ` +
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION} as descriptionMaintenanceElement, ` +
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER} as masterMaintenanceElement ` +
    `FROM ${ConstantsTable.TABLE_MTM_OPERATION} AS op ` +
    `JOIN ${ConstantsTable.TABLE_MTM_OPERATION_TYPE} AS opt ON ` +
    `opt.${ConstantsColumns.COLUMN_MTM_ID} = op.${ConstantsColumns.COLUMN_MTM_OPERATION_OPERATION_TYPE} ` +
    `JOIN ${ConstantsTable.TABLE_MTM_VEHICLE} AS v ON ` +
    `v.${ConstantsColumns.COLUMN_MTM_ID} = op.${ConstantsColumns.COLUMN_MTM_OPERATION_VEHICLE} ` +
    `JOIN ${ConstantsTable.TABLE_MTM_VEHICLE_TYPE} AS vt ON ` +
    `vt.${ConstantsColumns.COLUMN_MTM_ID} = v.${ConstantsColumns.COLUMN_MTM_VEHICLE_VEHICLE_TYPE} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT} AS ome ON ` +
    `ome.${ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION} = op.${ConstantsColumns.COLUMN_MTM_ID} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT} AS me ON ` +
    `me.${ConstantsColumns.COLUMN_MTM_ID} = ome.${ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_MAINTENANCE_ELEMENT}`;
  }

  getSqlMaintenance(): string {
    return `SELECT m.${ConstantsColumns.COLUMN_MTM_ID}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION}, ` +
    `me.${ConstantsColumns.COLUMN_MTM_ID} as idMaintenanceElement, ` +
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME} as nameMaintenanceElement, ` +
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION} as descriptionMaintenanceElement, ` +
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER} as masterMaintenanceElement, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_ID} as idMaintenanceFreq, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE} as codeMaintenanceFreq, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_DESCRIPTION} as descriptionMaintenanceFreq, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME}, m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR}, m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FROM},` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TO}, m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER} ` +
    `FROM ${ConstantsTable.TABLE_MTM_MAINTENANCE} AS m ` +
    `JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL} AS mer ON ` +
    `m.${ConstantsColumns.COLUMN_MTM_ID} = mer.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE} ` +
    `JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT} AS me ON ` +
    `me.${ConstantsColumns.COLUMN_MTM_ID} = mer.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE_ELEMENT} ` +
    `JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ} AS mf ON ` +
    `mf.${ConstantsColumns.COLUMN_MTM_ID} = m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ}`;
  }

  getSqlSystemConfiguration(value: string): string {
    return `SELECT * FROM ${ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION} WHERE ` +
        `${ConstantsColumns.COLUMN_MTM_SYSTEM_CONFIGURATION_KEY} = '${value}'`;
  }

  getSqlSequence(table: string, iteration: number): string {
    return `SELECT ${ConstantsColumns.COLUMN_MTM_SEQUENCE_SEQ} + ${iteration} FROM ` +
        `${ConstantsTable.SEQUENCES_MTM} WHERE ` +
        `${ConstantsColumns.COLUMN_MTM_SEQUENCE_NAME} = '${table}'`;
  }

  /* MAPPERS */

  mapDataToObserver(table: string, data: any): any {
    let result: any;
    switch (table) {
      case ConstantsTable.TABLE_MTM_VEHICLE:
        result = this.mapVehicle(data);
        break;
      case ConstantsTable.TABLE_MTM_VEHICLE_TYPE:
        result = this.mapVehicleType(data);
        break;
      case ConstantsTable.TABLE_MTM_CONFIGURATION:
        result = this.mapConfiguration(data);
        break;
      case ConstantsTable.TABLE_MTM_OPERATION:
        result = this.mapOperation(data);
        break;
      case ConstantsTable.TABLE_MTM_OPERATION_TYPE:
        result = this.mapOperationType(data);
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE:
        result = this.mapMaintenance(data);
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT:
        result = this.mapMaintenanceElement(data);
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ:
        result = this.mapMaintenanceFreq(data);
        break;
    }
    return result;
  }

  mapVehicle(data: any): any {
    let vehiclesDB: VehicleModel[] = [];
    if (data.rows.length > 0) {
      let row: any = null;
      for (let i = 0; i < data.rows.length; i++) {
        row = data.rows.item(i);
        vehiclesDB = [...vehiclesDB, {
          id: Number(row[ConstantsColumns.COLUMN_MTM_ID]),
          model: row[ConstantsColumns.COLUMN_MTM_VEHICLE_MODEL],
          brand: row[ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND],
          year: Number(row[ConstantsColumns.COLUMN_MTM_VEHICLE_YEAR]),
          km: Number(row[ConstantsColumns.COLUMN_MTM_VEHICLE_KM]),
          configuration: this.getMapConfiguration(row, true),
          vehicleType: this.getMapVehicleType(row, true),
          kmsPerMonth: row[ConstantsColumns.COLUMN_MTM_VEHICLE_KMS_PER_MONTH],
          dateKms: new Date(row[ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_KMS]),
          datePurchase: row[ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_PURCHASE]
        }];
      }
    }
    return vehiclesDB;
  }

  mapVehicleType(data: any): any {
    let vehicleTypeDB: VehicleTypeModel[] = [];
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        vehicleTypeDB = [...vehicleTypeDB, this.getMapVehicleType(data.rows.item(i), false)];
      }
    }
    return vehicleTypeDB;
  }

  getMapVehicleType(data: any, vehicle: boolean): VehicleTypeModel {
    return (vehicle ? {
      id: Number(data.idVehicleType),
      code: data.codeVehicleType,
      description: (!!data.descriptionVehicleType ? this.translator.instant(`DB.${data.descriptionVehicleType}`) : '')
    } : {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      code: data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_CODE],
      description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_VEHICLE_TYPE_DESCRIPTION]}`)
    });
  }

  mapConfiguration(data: any): any {
    let configurationDB: ConfigurationModel[] = [];
    if (data.rows.length > 0) {
      let configuration: ConfigurationModel = new ConfigurationModel();
      let row: any = null;
      for (let i = 0; i < data.rows.length; i++) {
        row = data.rows.item(i);
        configuration = configurationDB.find(x => x.id === row.id);
        if (!!configuration) {
          configuration.listMaintenance = [...configuration.listMaintenance, this.getMapMaintenance(row, true)];
        } else {
          configurationDB = [...configurationDB, this.getMapConfiguration(row, false)];
        }
      }
    }
    return configurationDB;
  }

  getMapConfiguration(data: any, vehicle: boolean): ConfigurationModel {
    let result: ConfigurationModel = new ConfigurationModel();
    if (vehicle) {
      const masterConf: boolean = (data.masterConfiguration === Constants.DATABASE_YES);
      result = {
        id: Number(data.idConfiguration),
        name: (masterConf ? this.translator.instant(`DB.${data.nameConfiguration}`) : data.nameConfiguration),
        description: (masterConf ? this.translator.instant(`DB.${data.descriptionConfiguration}`) : data.descriptionConfiguration),
        master: masterConf,
        listMaintenance: []
      };
    } else {
      const maintenance: MaintenanceModel = this.getMapMaintenance(data, true);
      const masterConf: boolean = (data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER] === Constants.DATABASE_YES);
      result = {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        name: (masterConf ? this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME]}`) :
          data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME]),
        description: (masterConf ? this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION]}`) :
          data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION]),
        master: (data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER] === Constants.DATABASE_YES),
        listMaintenance: (!!maintenance && maintenance.description !== null ? [maintenance] : [])
      };
    }
    return result;
  }

  mapOperation(data: any): any {
    let operationsDB: OperationModel[] = [];
    if (data.rows.length > 0) {
      let operation: OperationModel = new OperationModel();
      let row: any = null;
      for (let i = 0; i < data.rows.length; i++) {
        row = data.rows.item(i);
        operation = operationsDB.find(x => x.id === row.id);
        if (!!operation) { // if data exists it just save maintenance element
          operation.listMaintenanceElement = [...operation.listMaintenanceElement, this.getMapMaintenanceElement(row, true)];
        } else { // new data
          const replacement: MaintenanceElementModel = this.getMapMaintenanceElement(row, true);
          operationsDB = [...operationsDB, {
            id: Number(row[ConstantsColumns.COLUMN_MTM_ID]),
            description: row[ConstantsColumns.COLUMN_MTM_OPERATION_DESCRIPTION],
            details: row[ConstantsColumns.COLUMN_MTM_OPERATION_DETAILS],
            operationType: this.getMapOperationType(row, true),
            vehicle: new VehicleModel(row.modelVehicle, row.brandVehicle, null, null, null,
              this.getMapVehicleType(row, true), null, null, null, row[ConstantsColumns.COLUMN_MTM_OPERATION_VEHICLE]),
            km: Number(row[ConstantsColumns.COLUMN_MTM_OPERATION_KM]),
            date: row[ConstantsColumns.COLUMN_MTM_OPERATION_DATE],
            location: row[ConstantsColumns.COLUMN_MTM_OPERATION_LOCATION],
            owner: row[ConstantsColumns.COLUMN_MTM_OPERATION_OWNER],
            price: Number(row[ConstantsColumns.COLUMN_MTM_OPERATION_PRICE]),
            document: row[ConstantsColumns.COLUMN_MTM_OPERATION_DOCUMENT],
            listMaintenanceElement: (!!replacement && replacement.name !== null ? [replacement] : [])
          }];
        }
      }
    }
    return operationsDB;
  }

  mapOperationType(data: any): any {
    let operationTypeDB: OperationTypeModel[] = [];
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        operationTypeDB = [...operationTypeDB, this.getMapOperationType(data.rows.item(i), false)];
      }
    }
    return operationTypeDB;
  }

  getMapOperationType(data: any, op: boolean): OperationTypeModel {
    return (op ? {
      id: Number(data.idOperationType),
      code: data.codeOperationType,
      description: this.translator.instant(`DB.${data.descriptionOperationType}`)
    } : {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      code: data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_CODE],
      description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION]}`)
    });
  }

  mapMaintenance(data: any): any {
    let maintenanceDB: MaintenanceModel[] = [];
    if (data.rows.length > 0) {
      let maintenance: MaintenanceModel = new MaintenanceModel();
      let row: any = null;
      for (let i = 0; i < data.rows.length; i++) {
        row = data.rows.item(i);
        maintenance = maintenanceDB.find(x => x.id === row.id);
        if (!!maintenance) {
          maintenance.listMaintenanceElement = [...maintenance.listMaintenanceElement, this.getMapMaintenanceElement(row, true)];
        } else {
          maintenanceDB = [...maintenanceDB, this.getMapMaintenance(data.rows.item(i), false)];
        }
      }
    }
    return maintenanceDB;
  }

  getMapMaintenance(data: any, conf: boolean): MaintenanceModel {
    let result: MaintenanceModel = new MaintenanceModel();
    if (conf) {
      result = {
        id: Number(data.idMaintenance),
        description: (data.masterMaintenance === Constants.DATABASE_YES ?
          this.translator.instant(`DB.${data.descriptionMaintenance}`)
          : data.descriptionMaintenance),
        listMaintenanceElement: [],
        maintenanceFreq: this.getMapMaintenanceFreq(data, true),
        km: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM]),
        time: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME]),
        init: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT] === Constants.DATABASE_YES,
        wear: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR] === Constants.DATABASE_YES,
        fromKm: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FROM],
        toKm: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TO],
        master: data.masterMaintenance === Constants.DATABASE_YES
      };
    } else {
      const maintElement: MaintenanceElementModel = this.getMapMaintenanceElement(data, true);
      result = {
        id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
        description: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER] === Constants.DATABASE_YES ?
          this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION]}`)
          : data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION]),
        listMaintenanceElement: (!!maintElement && maintElement.description !== null ? [maintElement] : []),
        maintenanceFreq: this.getMapMaintenanceFreq(data, true),
        km: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM]),
        time: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME]),
        init: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT] === Constants.DATABASE_YES,
        wear: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR] === Constants.DATABASE_YES,
        fromKm: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FROM],
        toKm: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TO],
        master: data.master === Constants.DATABASE_YES
      };
    }
    return result;
  }

  mapMaintenanceElement(data: any): any {
    let maintenanceElementDB: MaintenanceElementModel[] = [];
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        maintenanceElementDB = [...maintenanceElementDB, this.getMapMaintenanceElement(data.rows.item(i), false)];
      }
    }
    return maintenanceElementDB;
  }

  getMapMaintenanceElement(data: any, op: boolean): MaintenanceElementModel {
    return (op ? {
      id: Number(data.idMaintenanceElement),
      name: (data.masterMaintenanceElement === Constants.DATABASE_YES ?
        this.translator.instant(`DB.${data.nameMaintenanceElement}`) :
        data.nameMaintenanceElement),
      description: (data.masterMaintenanceElement === Constants.DATABASE_YES ?
        this.translator.instant(`DB.${data.descriptionMaintenanceElement}`) :
        data.descriptionMaintenanceElement),
      master: (data.masterMaintenanceElement === Constants.DATABASE_YES)
    } : {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      name: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER] === Constants.DATABASE_YES ?
        this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME]}`) :
        data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME]),
      description: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER] === Constants.DATABASE_YES ?
        this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION]}`) :
        data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION]),
      master: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER] === Constants.DATABASE_YES)
    });
  }

  mapMaintenanceFreq(data: any): any {
    let maintenanceFreqDB: MaintenanceFreqModel[] = [];
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        maintenanceFreqDB = [...maintenanceFreqDB, this.getMapMaintenanceFreq(data.rows.item(i), false)];
      }
    }
    return maintenanceFreqDB;
  }

  getMapMaintenanceFreq(data: any, man: boolean): MaintenanceFreqModel {
    return (man ? {
      id: Number(data.idMaintenanceFreq),
      code: data.codeMaintenanceFreq,
      description: this.translator.instant(`DB.${data.descriptionMaintenanceFreq}`)
    } : {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      code: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE],
      description: this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_DESCRIPTION]}`)
    });
  }

  /* INSERTS SQL */

  insertSqlVehicle(vehicles: VehicleModel[]): string {
    let sql = '';
    if (!!vehicles && vehicles.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_VEHICLE} ` +
        `(${ConstantsColumns.COLUMN_MTM_VEHICLE_MODEL}, ${ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND}, ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_YEAR}, ${ConstantsColumns.COLUMN_MTM_VEHICLE_KM}, ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_CONFIGURATION}, ${ConstantsColumns.COLUMN_MTM_VEHICLE_KMS_PER_MONTH}, ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_KMS}, ${ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_PURCHASE}, ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_VEHICLE_TYPE}) `;
      vehicles.forEach((x, index) => {
        sql += `SELECT '${x.model}', '${x.brand}', ${x.year}, ${x.km}, ${x.configuration.id}, ` +
          `${(!x.kmsPerMonth ? null : x.kmsPerMonth)}, '${this.calendarService.getDateStringToDB(x.dateKms)}', ` +
          `'${this.calendarService.getDateStringToDB(x.datePurchase)}', ${x.vehicleType.id} `;
        if ((index + 1) < vehicles.length) {
          sql += ' UNION ';
        }
      });
    }
    return `${sql}; `;
  }

  insertSqlOperation(op: OperationModel[]): string {
    let sql = '';
    if (!!op && op.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_OPERATION} ` +
      `(${ConstantsColumns.COLUMN_MTM_OPERATION_DESCRIPTION}, ${ConstantsColumns.COLUMN_MTM_OPERATION_DETAILS}, ` +
      `${ConstantsColumns.COLUMN_MTM_OPERATION_OPERATION_TYPE}, ${ConstantsColumns.COLUMN_MTM_OPERATION_VEHICLE}, ` +
      `${ConstantsColumns.COLUMN_MTM_OPERATION_KM}, ${ConstantsColumns.COLUMN_MTM_OPERATION_PRICE}, ` +
      `${ConstantsColumns.COLUMN_MTM_OPERATION_DATE}, ${ConstantsColumns.COLUMN_MTM_OPERATION_LOCATION}, ` +
      `${ConstantsColumns.COLUMN_MTM_OPERATION_OWNER}, ${ConstantsColumns.COLUMN_MTM_OPERATION_DOCUMENT}) `;
      op.forEach((x, index) => {
        sql += `SELECT '${x.description}', '${x.details}', ${x.operationType.id}, ${x.vehicle.id}, ` +
        `${x.km}, ${x.price}, '${this.calendarService.getDateStringToDB(x.date)}', ${this.getValueWithCom(x.location)}, ` +
        `${this.getValueWithCom(x.owner)}, ${x.document}`;
        if ((index + 1) < op.length) {
          sql += ' UNION ';
        }
      });
    }
    return `${sql}; `;
  }

  insertSqlOpMaintenanceElement(op: OperationModel): string {
    let sql = '';
    if (op !== null  && !!op.listMaintenanceElement && op.listMaintenanceElement.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT} ` +
      `(${ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION}, ` +
      `${ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_MAINTENANCE_ELEMENT}) `;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < op.listMaintenanceElement.length; i++) {
        sql += `SELECT (${(op.id > 0 ? op.id : this.getSqlSequence(ConstantsTable.TABLE_MTM_OPERATION, 0))}), ` +
        `${op.listMaintenanceElement[i].id}`;
        if ((i + 1) < op.listMaintenanceElement.length) {
          sql += ' UNION ';
        }
      }
    }
    return `${sql}; `;
  }

  insertSqlConfiguration(conf: ConfigurationModel[]): string {
    let sql = '';
    if (!!conf && conf.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_CONFIGURATION} ` +
      `(${ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME}, ${ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION}, ` +
      `${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER}) `;
      conf.forEach((x, index) => {
        sql += `SELECT '${x.name}', '${x.description}', '${Constants.DATABASE_NO}'`;
        if ((index + 1) < conf.length) {
          sql += ' UNION ';
        }
      });
    }
    return `${sql}; `;
  }

  insertSqlConfigurationMaintenance(conf: ConfigurationModel): string {
    let sql = '';
    if (conf !== null  && !!conf.listMaintenance && conf.listMaintenance.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_CONFIG_MAINT} ` +
      `(${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION}, ` +
      `${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE}) `;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < conf.listMaintenance.length; i++) {
        sql += `SELECT (${(conf.id > 0 ? conf.id : this.getSqlSequence(ConstantsTable.TABLE_MTM_CONFIGURATION, 0))}), ` +
        `${conf.listMaintenance[i].id}`;
        if ((i + 1) < conf.listMaintenance.length) {
          sql += ' UNION ';
        }
      }
    }
    return `${sql}; `;
  }

  insertSqlMaintenanceElementRel(maint: MaintenanceModel): string {
    let sql = '';
    if (maint !== null  && !!maint.listMaintenanceElement && maint.listMaintenanceElement.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL} ` +
      `(${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE_ELEMENT}) `;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < maint.listMaintenanceElement.length; i++) {
        sql += `SELECT (${(maint.id > 0 ? maint.id : this.getSqlSequence(ConstantsTable.TABLE_MTM_MAINTENANCE, 0))}), ` +
        `${maint.listMaintenanceElement[i].id}`;
        if ((i + 1) < maint.listMaintenanceElement.length) {
          sql += ' UNION ';
        }
      }
    }
    return `${sql}; `;
  }

  insertSqlMaintenance(maintenance: MaintenanceModel[]): string {
    let sql = '';
    if (!!maintenance && maintenance.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_MAINTENANCE} ` +
      `(${ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FROM}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TO}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER}) `;
      maintenance.forEach((x, index) => {
        sql += `SELECT '${x.description}', ${x.maintenanceFreq.id}, ` +
          `${x.km}, ${x.time}, '${(x.init ? Constants.DATABASE_YES : Constants.DATABASE_NO)}', ` +
          `'${(x.wear ? Constants.DATABASE_YES : Constants.DATABASE_NO)}', ${x.fromKm},` +
          `${x.toKm}, '${Constants.DATABASE_NO}'`;
        if ((index + 1) < maintenance.length) {
          sql += ' UNION ';
        }
      });
    }
    return `${sql}; `;
  }

  insertSqlMaintenanceElement(replacement: MaintenanceElementModel[]): string {
    let sql = '';
    if (!!replacement && replacement.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT} ` +
      `(${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_MASTER}) `;
      replacement.forEach((x, index) => {
        sql += `SELECT '${x.name}', '${x.description}', '${Constants.DATABASE_NO}'`;
        if ((index + 1) < replacement.length) {
          sql += ' UNION ';
        }
      });
    }
    return `${sql}; `;
  }

  /* UPDATES SQL */

  updateSqlVehicle(vehicles: VehicleModel[]): string {
    let sql = '';
    if (!!vehicles && vehicles.length > 0) {
      vehicles.forEach(x => {
        sql += `UPDATE ${ConstantsTable.TABLE_MTM_VEHICLE} ` +
        `SET ${ConstantsColumns.COLUMN_MTM_VEHICLE_MODEL}='${x.model}', ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND}='${x.brand}', ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_YEAR}=${x.year}, ${ConstantsColumns.COLUMN_MTM_VEHICLE_KM}=${x.km}, ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_CONFIGURATION}=${x.configuration.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_VEHICLE_TYPE}=${x.vehicleType.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_KMS_PER_MONTH}=${(!x.kmsPerMonth ? null : x.kmsPerMonth)}, ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_KMS}='${this.calendarService.getDateStringToDB(x.dateKms)}', ` +
        `${ConstantsColumns.COLUMN_MTM_VEHICLE_DATE_PURCHASE}='${this.calendarService.getDateStringToDB(x.datePurchase)}' ` +
        `WHERE ${ConstantsColumns.COLUMN_MTM_ID}=${x.id}; `;
      });
    }
    return sql;
  }

  updateSqlOperation(op: OperationModel[]): string {
    let sql = '';
    if (!!op && op.length > 0) {
      op.forEach(x => {
        sql += `UPDATE ${ConstantsTable.TABLE_MTM_OPERATION} ` +
        `SET ${ConstantsColumns.COLUMN_MTM_OPERATION_DESCRIPTION}='${x.description}', ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_DETAILS}='${x.details}', ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_OPERATION_TYPE}=${x.operationType.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_VEHICLE}=${x.vehicle.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_KM}=${x.km}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_PRICE}=${x.price}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_DATE}='${this.calendarService.getDateStringToDB(x.date)}', ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_LOCATION}=${this.getValueWithCom(x.location)}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_OWNER}=${this.getValueWithCom(x.owner)}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_DOCUMENT}=${x.document} ` +
        `WHERE ${ConstantsColumns.COLUMN_MTM_ID}=${x.id}; `;
      });
    }
    return sql;
  }

  updateSqlMaintenance(maintenance: MaintenanceModel[]): string {
    let sql = '';
    if (!!maintenance && maintenance.length > 0) {
      maintenance.forEach(x => {
        sql += `UPDATE ${ConstantsTable.TABLE_MTM_MAINTENANCE} ` +
        `SET ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION}='${x.description}', ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ}=${x.maintenanceFreq.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM}=${x.km}, ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME}=${x.time}, ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT}='${(x.init ? Constants.DATABASE_YES : Constants.DATABASE_NO)}', ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR}='${(x.wear ? Constants.DATABASE_YES : Constants.DATABASE_NO)}', ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FROM}=${x.fromKm}, ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TO}=${x.toKm} ` +
        `WHERE ${ConstantsColumns.COLUMN_MTM_ID}=${x.id}; `;
      });
    }
    return sql;
  }

  updateSqlMaintenanceElement(replacement: MaintenanceElementModel[]): string {
    let sql = '';
    if (!!replacement && replacement.length > 0) {
      replacement.forEach(x => {
        sql += `UPDATE ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT} ` +
        `SET ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME}='${x.name}', ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION}='${x.description}' ` +
        `WHERE ${ConstantsColumns.COLUMN_MTM_ID}=${x.id}; `;
      });
    }
    return sql;
  }

  updateSqlConfiguration(configuration: ConfigurationModel[]): string {
    let sql = '';
    if (!!configuration && configuration.length > 0) {
      configuration.forEach(x => {
        sql += `UPDATE ${ConstantsTable.TABLE_MTM_CONFIGURATION} ` +
        `SET ${ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME}='${x.name}', ` +
        `${ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION}='${x.description}' ` +
        `WHERE ${ConstantsColumns.COLUMN_MTM_ID}=${x.id}; `;
      });
    }
    return sql;
  }

  updateSqlSystemConfiguration(key: string, value: string, update: string): string {
    return `UPDATE ${ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION} ` +
    `SET ${ConstantsColumns.COLUMN_MTM_SYSTEM_CONFIGURATION_VALUE} = '${value}', ` +
    `${ConstantsColumns.COLUMN_MTM_SYSTEM_CONFIGURATION_UPDATED} = '${update}' ` +
    `WHERE ${ConstantsColumns.COLUMN_MTM_SYSTEM_CONFIGURATION_KEY} = '${key}'; `;
  }

  /* DELETES SQL */

  deleteSql(table: string, column: string, data: number[] = []): string {
    let sql = `DELETE FROM ${table} WHERE ${column} in (`;
    for (let i = 0; i < data.length; i++) {
      sql += data[i];
      if ((i + 1) < data.length) {
        sql += ',';
      }
    }
    return `${sql}); `;
  }

  /* SQL UTLS */
  getValueWithCom(data: any): string {
    return (data !== null ? `'${data}'` : data);
  }
}
