import { Injectable } from '@angular/core';

import { MotoModel, ConfigurationModel, OperationModel, OperationTypeModel, MaintenanceElementModel } from '@models/index';

import { ConstantsTable, ConstantsColumns } from '@utils/index';

@Injectable({
  providedIn: 'root'
})
export class SqlService {

  constructor() {
  }

  /* BUILDER SQL */

  getSql(table: string): string {
      let sql: string;
      switch (table) {
        case ConstantsTable.TABLE_MTM_MOTO:
            sql = this.getSqlMoto();
            break;
        case ConstantsTable.TABLE_MTM_OPERATION:
            sql = this.getSqlOperation();
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
      `m.${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}, m.${ConstantsColumns.COLUMN_MTM_MOTO_KMS_PER_MONTH}, ` +
      `m.${ConstantsColumns.COLUMN_MTM_MOTO_DATE_KMS}, ` +
      `c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_NAME}, c.${ConstantsColumns.COLUMN_MTM_CONFIGURATION_DESCRIPTION} ` +
      `FROM ${ConstantsTable.TABLE_MTM_MOTO} AS m ` +
      `JOIN ${ConstantsTable.TABLE_MTM_CONFIGURATION} AS c ON ` +
      `c.${ConstantsColumns.COLUMN_MTM_ID} = m.${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}`;
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
    `me.${ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_DESCRIPTION} as descriptionMaintenanceElement ` +
    `FROM ${ConstantsTable.TABLE_MTM_OPERATION} AS op ` +
    `JOIN ${ConstantsTable.TABLE_MTM_OPERATION_TYPE} AS opt ON ` +
    `opt.${ConstantsColumns.COLUMN_MTM_ID} = op.${ConstantsColumns.COLUMN_MTM_OPERATION_OPERATION_TYPE} ` +
    `JOIN ${ConstantsTable.TABLE_MTM_MOTO} AS m ON ` +
    `m.${ConstantsColumns.COLUMN_MTM_ID} = op.${ConstantsColumns.COLUMN_MTM_OPERATION_MOTO} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT} AS ome ON ` +
    `ome.${ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_ID_OPERATION} = op.${ConstantsColumns.COLUMN_MTM_ID} ` +
    `LEFT JOIN ${ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT} AS me ON ` +
    `me.${ConstantsColumns.COLUMN_MTM_ID} = ome.${ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_ID_MAINTENANCE_ELEMENT}`;
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
      case ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT:
        result = this.mapMaintenanceElement(data);
        break;
    }
    return result;
  }

  mapMoto(data: any): any {
    let motosDB: MotoModel[] = [];
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        motosDB = [...motosDB, {
          id: Number(data.rows.item(i).id),
          model: data.rows.item(i).model,
          brand: data.rows.item(i).brand,
          year: data.rows.item(i).year,
          km: Number(data.rows.item(i).km),
          configuration: new ConfigurationModel(
                      data.rows.item(i).name,
                      data.rows.item(i).description,
                      data.rows.item(i).idConfiguration
          ),
          kmsPerMonth: data.rows.item(i).kmsPerMonth,
          dateKms: data.rows.item(i).dateKms
        }];
      }
    }
    return motosDB;
  }

  mapConfiguration(data: any): any {
    let configurationDB: ConfigurationModel[] = [];
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
          configurationDB = [...configurationDB, {
            id: Number(data.rows.item(i).id),
            name: data.rows.item(i).name,
            description: data.rows.item(i).description
          }];
        }
    }
    return configurationDB;
  }

  mapOperation(data: any): any {
    let operationsDB: OperationModel[] = [];
    let operation: OperationModel = new OperationModel();
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        operation = operationsDB.find(x => x.id === data.rows.item(i).id);
        if (!!operation) { // if data exists it just save maintenance element
          operation.listMaintenanceElement = [...operation.listMaintenanceElement,
            new MaintenanceElementModel(
              data.rows.item(i).name,
              data.rows.item(i).description,
              data.rows.item(i).idMaintenanceElement
            )];
        } else { // new data
          operationsDB = [...operationsDB, {
            id: Number(data.rows.item(i).id),
            description: data.rows.item(i).description,
            details: data.rows.item(i).details,
            operationType: new OperationTypeModel(
                        data.rows.item(i).codeOperationType,
                        data.rows.item(i).descriptionOperationType,
                        data.rows.item(i).idOperationType
            ),
            moto: new MotoModel(
              data.rows.item(i).modelMoto,
              data.rows.item(i).brandMoto,
              null, null, null, null, null,
              data.rows.item(i).idMoto),
            km: data.rows.item(i).km,
            date: data.rows.item(i).date,
            location: data.rows.item(i).location,
            owner: data.rows.item(i).owner,
            price: data.rows.item(i).price,
            document: data.rows.item(i).document,
            listMaintenanceElement: [new MaintenanceElementModel(
              data.rows.item(i).nameMaintenanceElement,
              data.rows.item(i).descriptionMaintenanceElement,
              data.rows.item(i).idMaintenanceElement
            )]
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
        operationTypeDB = [...operationTypeDB, {
          id: Number(data.rows.item(i).id),
          code: data.rows.item(i).code,
          description: data.rows.item(i).description
        }];
      }
    }
    return operationTypeDB;
  }

  mapMaintenanceElement(data: any): any {
    let maintenanceElementDB: MaintenanceElementModel[] = [];
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        maintenanceElementDB = [...maintenanceElementDB, {
          id: Number(data.rows.item(i).id),
          name: data.rows.item(i).name,
          description: data.rows.item(i).description
        }];
      }
    }
    return maintenanceElementDB;
  }

  /* INSERTS SQL */

  insertSqlMoto() {
    return `INSERT INTO ${ConstantsTable.TABLE_MTM_MOTO} ` +
    `(${ConstantsColumns.COLUMN_MTM_MOTO_MODEL}, ${ConstantsColumns.COLUMN_MTM_MOTO_BRAND}, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_YEAR}, ${ConstantsColumns.COLUMN_MTM_MOTO_KM}, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}, ${ConstantsColumns.COLUMN_MTM_MOTO_KMS_PER_MONTH}, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_DATE_KMS}) ` +
    `VALUES (?, ?, ?, ?, ?, ?, ?)`;
  }

  /* UPDATES SQL */

  updateSqlMoto(): string {
    return `UPDATE ${ConstantsTable.TABLE_MTM_MOTO} ` +
    `SET ${ConstantsColumns.COLUMN_MTM_MOTO_MODEL}=?, ${ConstantsColumns.COLUMN_MTM_MOTO_BRAND}=?, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_YEAR}=?, ${ConstantsColumns.COLUMN_MTM_MOTO_KM}=?, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}=?, ${ConstantsColumns.COLUMN_MTM_MOTO_KMS_PER_MONTH}=?, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_DATE_KMS}=? ` +
    `WHERE ${ConstantsColumns.COLUMN_MTM_ID}=?`;
  }

  /* DELETES SQL */

  deleteSql(table: string, column: string, numData: number = 1, data: number[] = []): string {
    let sql = `DELETE FROM ${table} WHERE ${column} in (`;
    for (let i = 0; i < numData; i++) {
      sql += (data.length === numData ? data[0] : '?');
      if ((i + 1) < numData) {
        sql += ',';
      }
    }
    return `${sql.trim()}); `;
  }
}
