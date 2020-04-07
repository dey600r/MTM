import { Injectable } from '@angular/core';

// LIBRARIES ANGULAR
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
  MotoModel, ConfigurationModel, OperationModel, OperationTypeModel, MaintenanceElementModel,
  MaintenanceFreqModel, MaintenanceModel
} from '@models/index';
import { ConstantsTable, ConstantsColumns, Constants } from '@utils/index';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class SqlService {

  constructor(private commonService: CommonService,
              private translator: TranslateService) {
  }

  /* BUILDER SQL */

  getSql(table: string): string {
      let sql: string;
      switch (table) {
        case ConstantsTable.TABLE_MTM_MOTO:
          sql = this.getSqlMoto();
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

  getSqlMoto(): string {
      return `SELECT m.${ConstantsColumns.COLUMN_MTM_ID}, ` +
      `m.${ConstantsColumns.COLUMN_MTM_MOTO_MODEL}, m.${ConstantsColumns.COLUMN_MTM_MOTO_BRAND}, ` +
      `m.${ConstantsColumns.COLUMN_MTM_MOTO_YEAR}, m.${ConstantsColumns.COLUMN_MTM_MOTO_KM}, ` +
      `m.${ConstantsColumns.COLUMN_MTM_MOTO_KMS_PER_MONTH}, ` +
      `m.${ConstantsColumns.COLUMN_MTM_MOTO_DATE_KMS}, ` +
      `c.${ConstantsColumns.COLUMN_MTM_ID} as idConfiguration, ` +
      `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME} as nameConfiguration, ` +
      `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION} as descriptionConfiguration ` +
      `FROM ${ConstantsTable.TABLE_MTM_MOTO} AS m ` +
      `JOIN ${ConstantsTable.TABLE_MTM_CONFIGURATION} AS c ON ` +
      `c.${ConstantsColumns.COLUMN_MTM_ID} = m.${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}`;
  }

  getSqlConfiguration(): string {
    return `SELECT c.${ConstantsColumns.COLUMN_MTM_ID}, ` +
    `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME}, c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION}, ` +
    `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_ID} as idMaintenance, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION} as descriptionMaintenance, ` +
    `me.${ConstantsColumns.COLUMN_MTM_ID} as idMaintenanceElement, ` +
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME} as nameMaintenanceElement, ` +
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION} as descriptionMaintenanceElement, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_ID} as idMaintenanceFreq, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_CODE} as codeMaintenanceFreq, ` +
    `mf.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_FREQ_DESCRIPTION} as descriptionMaintenanceFreq, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME}, m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER} as masterMaintenance ` +
    `FROM ${ConstantsTable.TABLE_MTM_CONFIGURATION} AS c ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_CONFIG_MAINT} AS cm ON ` +
    `c.${ConstantsColumns.COLUMN_MTM_ID} = cm.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE} AS m ON ` +
    `m.${ConstantsColumns.COLUMN_MTM_ID} = cm.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT} AS me ON ` +
    `me.${ConstantsColumns.COLUMN_MTM_ID} = m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_ELEMENT} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ} AS mf ON ` +
    `mf.${ConstantsColumns.COLUMN_MTM_ID} = m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ}`;
  }

  getSqlOperation(): string {
    return `SELECT op.${ConstantsColumns.COLUMN_MTM_ID}, ` +
    `op.${ConstantsColumns.COLUMN_MTM_OPERATION_DESCRIPTION}, op.${ConstantsColumns.COLUMN_MTM_OPERATION_DETAILS}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_ID} as idMoto, m.${ConstantsColumns.COLUMN_MTM_MOTO_BRAND} as brandMoto, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MOTO_MODEL} as modelMoto, op.${ConstantsColumns.COLUMN_MTM_OPERATION_KM}, ` +
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
    `JOIN ${ConstantsTable.TABLE_MTM_MOTO} AS m ON ` +
    `m.${ConstantsColumns.COLUMN_MTM_ID} = op.${ConstantsColumns.COLUMN_MTM_OPERATION_MOTO} ` +
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
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR}, ` +
    `m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER} ` +
    `FROM ${ConstantsTable.TABLE_MTM_MAINTENANCE} AS m ` +
    `JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT} AS me ON ` +
    `me.${ConstantsColumns.COLUMN_MTM_ID} = m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_ELEMENT} ` +
    `JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ} AS mf ON ` +
    `mf.${ConstantsColumns.COLUMN_MTM_ID} = m.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ}`;
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
      case ConstantsTable.TABLE_MTM_MOTO:
        result = this.mapMoto(data);
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

  mapMoto(data: any): any {
    let motosDB: MotoModel[] = [];
    if (data.rows.length > 0) {
      let row: any = null;
      for (let i = 0; i < data.rows.length; i++) {
        row = data.rows.item(i);
        motosDB = [...motosDB, {
          id: Number(row[ConstantsColumns.COLUMN_MTM_ID]),
          model: row[ConstantsColumns.COLUMN_MTM_MOTO_MODEL],
          brand: row[ConstantsColumns.COLUMN_MTM_MOTO_BRAND],
          year: Number(row[ConstantsColumns.COLUMN_MTM_MOTO_YEAR]),
          km: Number(row[ConstantsColumns.COLUMN_MTM_MOTO_KM]),
          configuration: this.getMapConfiguration(row, true),
          kmsPerMonth: row[ConstantsColumns.COLUMN_MTM_MOTO_KMS_PER_MONTH],
          dateKms: new Date(row[ConstantsColumns.COLUMN_MTM_MOTO_DATE_KMS])
        }];
      }
    }
    return motosDB;
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

  getMapConfiguration(data: any, moto: boolean): ConfigurationModel {
    const maintenance: MaintenanceModel = this.getMapMaintenance(data, true);
    return (moto ? {
      id: Number(data.idConfiguration),
      name: data.nameConfiguration,
      description: data.descriptionConfiguration,
      master: (data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER] === Constants.DATABASE_YES),
      listMaintenance: []
    } : {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      name: data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME],
      description: data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION],
      master: (data[ConstantsColumns.COLUMN_MTM_CONFIGURATION_MASTER] === Constants.DATABASE_YES),
      listMaintenance: (!!maintenance && maintenance.description !== null ? [maintenance] : [])
    });
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
            moto: new MotoModel(
              row.modelMoto,
              row.brandMoto,
              null, null, null, null, null,
              row.idMoto),
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
      for (let i = 0; i < data.rows.length; i++) {
        maintenanceDB = [...maintenanceDB, this.getMapMaintenance(data.rows.item(i), false)];
      }
    }
    return maintenanceDB;
  }

  getMapMaintenance(data: any, conf: boolean): MaintenanceModel {
    return (conf ? {
      id: Number(data.idMaintenance),
      description: (data.masterMaintenance === Constants.DATABASE_YES ?
        this.translator.instant(`DB.${data.descriptionMaintenance}`)
        : data.descriptionMaintenance),
      maintenanceElement: this.getMapMaintenanceElement(data, true),
      maintenanceFreq: this.getMapMaintenanceFreq(data, true),
      km: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM]),
      time: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME]),
      init: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT] === Constants.DATABASE_YES,
      wear: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR] === Constants.DATABASE_YES,
      master: data.masterMaintenance === Constants.DATABASE_YES
    } : {
      id: Number(data[ConstantsColumns.COLUMN_MTM_ID]),
      description: (data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER] === Constants.DATABASE_YES ?
        this.translator.instant(`DB.${data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION]}`)
        : data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION]),
      maintenanceElement: this.getMapMaintenanceElement(data, true),
      maintenanceFreq: this.getMapMaintenanceFreq(data, true),
      km: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM]),
      time: Number(data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME]),
      init: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT] === Constants.DATABASE_YES,
      wear: data[ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR] === Constants.DATABASE_YES,
      master: data.master === Constants.DATABASE_YES
    });
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

  insertSqlMoto(motos: MotoModel[]): string {
    let sql = '';
    if (!!motos && motos.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_MOTO} ` +
        `(${ConstantsColumns.COLUMN_MTM_MOTO_MODEL}, ${ConstantsColumns.COLUMN_MTM_MOTO_BRAND}, ` +
        `${ConstantsColumns.COLUMN_MTM_MOTO_YEAR}, ${ConstantsColumns.COLUMN_MTM_MOTO_KM}, ` +
        `${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}, ${ConstantsColumns.COLUMN_MTM_MOTO_KMS_PER_MONTH}, ` +
        `${ConstantsColumns.COLUMN_MTM_MOTO_DATE_KMS}) `;
      motos.forEach((x, index) => {
        sql += `SELECT '${x.model}', '${x.brand}', ${x.year}, ${x.km}, ${x.configuration.id}, ` +
          `${x.kmsPerMonth}, '${this.commonService.getDateStringToDB(x.dateKms)}' `;
        if ((index + 1) < motos.length) {
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
      `${ConstantsColumns.COLUMN_MTM_OPERATION_OPERATION_TYPE}, ${ConstantsColumns.COLUMN_MTM_OPERATION_MOTO}, ` +
      `${ConstantsColumns.COLUMN_MTM_OPERATION_KM}, ${ConstantsColumns.COLUMN_MTM_OPERATION_PRICE}, ` +
      `${ConstantsColumns.COLUMN_MTM_OPERATION_DATE}, ${ConstantsColumns.COLUMN_MTM_OPERATION_LOCATION}, ` +
      `${ConstantsColumns.COLUMN_MTM_OPERATION_OWNER}, ${ConstantsColumns.COLUMN_MTM_OPERATION_DOCUMENT}) `;
      op.forEach((x, index) => {
        sql += `SELECT '${x.description}', '${x.details}', ${x.operationType.id}, ${x.moto.id}, ` +
        `${x.km}, ${x.price}, '${this.commonService.getDateStringToDB(x.date)}', ${this.getValueWithCom(x.location)}, ` +
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

  insertSqlMaintenance(maintenance: MaintenanceModel[]): string {
    let sql = '';
    if (!!maintenance && maintenance.length > 0) {
      sql = `INSERT INTO ${ConstantsTable.TABLE_MTM_MAINTENANCE} ` +
      `(${ConstantsColumns.COLUMN_MTM_MAINTENANCE_DESCRIPTION}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_ELEMENT}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT}, ` +
      `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR}, ${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MASTER}) `;
      maintenance.forEach((x, index) => {
        sql += `SELECT '${x.description}', ${x.maintenanceElement.id}, ${x.maintenanceFreq.id}, ` +
          `${x.km}, ${x.time}, '${(x.init ? Constants.DATABASE_YES : Constants.DATABASE_NO)}', ` +
          `'${(x.wear ? Constants.DATABASE_YES : Constants.DATABASE_NO)}', '${Constants.DATABASE_NO}'`;
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

  updateSqlMoto(motos: MotoModel[]): string {
    let sql = '';
    if (!!motos && motos.length > 0) {
      motos.forEach(x => {
        sql += `UPDATE ${ConstantsTable.TABLE_MTM_MOTO} ` +
        `SET ${ConstantsColumns.COLUMN_MTM_MOTO_MODEL}='${x.model}', ` +
        `${ConstantsColumns.COLUMN_MTM_MOTO_BRAND}='${x.brand}', ` +
        `${ConstantsColumns.COLUMN_MTM_MOTO_YEAR}=${x.year}, ${ConstantsColumns.COLUMN_MTM_MOTO_KM}=${x.km}, ` +
        `${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}=${x.configuration.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_MOTO_KMS_PER_MONTH}=${x.kmsPerMonth}, ` +
        `${ConstantsColumns.COLUMN_MTM_MOTO_DATE_KMS}=${this.commonService.getDateStringToDB(x.dateKms)} ` +
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
        `${ConstantsColumns.COLUMN_MTM_OPERATION_MOTO}=${x.moto.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_KM}=${x.km}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_PRICE}=${x.price}, ` +
        `${ConstantsColumns.COLUMN_MTM_OPERATION_DATE}='${this.commonService.getDateStringToDB(x.date)}', ` +
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
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_ELEMENT}=${x.maintenanceElement.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ}=${x.maintenanceFreq.id}, ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM}=${x.km}, ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_TIME}=${x.time}, ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_INIT}='${(x.init ? Constants.DATABASE_YES : Constants.DATABASE_NO)}', ` +
        `${ConstantsColumns.COLUMN_MTM_MAINTENANCE_WEAR}='${(x.wear ? Constants.DATABASE_YES : Constants.DATABASE_NO)}' ` +
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
