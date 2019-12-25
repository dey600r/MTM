import { Injectable } from '@angular/core';

import { MotoModel, ConfigurationModel } from '@models/index';

import { ConstantsTable } from '@utils/index';

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

  getSqlMoto() {
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
    }
    return result;
  }
}
