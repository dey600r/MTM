import { Injectable } from '@angular/core';

import { MotoModel, ConfigurationModel } from '@models/index';

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
        default:
            sql = `SELECT * FROM ${table}`;
      }
      return sql;
  }

  getSqlMoto(): string {
      return `SELECT * FROM ${ConstantsTable.TABLE_MTM_MOTO} ` +
      `JOIN ${ConstantsTable.TABLE_MTM_CONFIGURATION} ON ` +
      `${ConstantsTable.TABLE_MTM_CONFIGURATION}.id = ${ConstantsTable.TABLE_MTM_MOTO}.idConfiguration`;
  }

  /* MAPPERS */

  mapDataToObserver(table: string, data: any): any {
    let result: any;
    switch (table) {
      case ConstantsTable.TABLE_MTM_MOTO:
        let motosDB: MotoModel[] = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            motosDB = [...motosDB, {
              id: Number(data.rows.item(i).id),
              model: data.rows.item(i).model,
              brand: data.rows.item(i).brand,
              year: data.rows.item(i).year,
              km: Number(data.rows.item(i).km),
              configuration: new ConfigurationModel(data.rows.item(i).name)
            }];
          }
        }
        result = motosDB;
        break;
      case ConstantsTable.TABLE_MTM_CONFIGURATION:
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
        result = configurationDB;
        break;
    }
    return result;
  }

  /* INSERTS SQL */

  insertSqlMoto() {
    return `INSERT INTO ${ConstantsTable.TABLE_MTM_MOTO} ` +
    `(${ConstantsColumns.COLUMN_MTM_MOTO_MODEL}, ${ConstantsColumns.COLUMN_MTM_MOTO_BRAND}, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_YEAR}, ${ConstantsColumns.COLUMN_MTM_MOTO_KM}, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}) ` +
    `VALUES (?, ?, ?, ?, ?)`;
  }

  /* UPDATES SQL */

  updateSqlMoto(): string {
    // return `UPDATE ${ConstantsTable.TABLE_MTM_MOTO} SET ` +
    // `(${ConstantsColumns.COLUMN_MTM_MOTO_MODEL}, ${ConstantsColumns.COLUMN_MTM_MOTO_BRAND}, ` +
    // `${ConstantsColumns.COLUMN_MTM_MOTO_YEAR}, ${ConstantsColumns.COLUMN_MTM_MOTO_KM}, ` +
    // `${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}) = ('?', '?', '?', '?', ?) ` +
    // `WHERE ${ConstantsColumns.COLUMN_MTM_ID}='?'`;
    return `UPDATE ${ConstantsTable.TABLE_MTM_MOTO} ` +
    `SET ${ConstantsColumns.COLUMN_MTM_MOTO_MODEL}=?, ${ConstantsColumns.COLUMN_MTM_MOTO_BRAND}=?, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_YEAR}=?, ${ConstantsColumns.COLUMN_MTM_MOTO_KM}=?, ` +
    `${ConstantsColumns.COLUMN_MTM_MOTO_CONFIGURATION}=? ` +
    `WHERE ${ConstantsColumns.COLUMN_MTM_ID}=?;`;
  }
}
