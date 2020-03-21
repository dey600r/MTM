import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

import { MotoModel, ConfigurationModel, OperationModel } from '@models/index';

import { ConstantsTable } from '@utils/index';

import { SqlService } from './sql.service';
import { MotoService } from './moto.service';
import { OperationService } from './operation.service';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  motos = new BehaviorSubject([]);
  configuration = new BehaviorSubject([]);
  operation = new BehaviorSubject([]);
  constructor(private plt: Platform,
              private sqlitePorter: SQLitePorter,
              private sqlite: SQLite,
              private http: HttpClient,
              private sqlService: SqlService) { }

  initDB() {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'mtm.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }

  seedDatabase() {
    this.database.executeSql(`SELECT * FROM ${ConstantsTable.TABLE_MTM_MOTO}`, []).then(initDB => {
      console.log(`NEXT DEPLOY DB`); // INIT DB
      this.http.get('assets/db/nextDeployDB.sql', { responseType: 'text'}).subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql).then(result => {
          this.loadAllTables();
          this.dbReady.next(true);
        })
        // tslint:disable-next-line: no-shadowed-variable
        .catch(e => console.error(`Error launching next deploy data base: ${e}`));
      });
    }).catch(e => {
      console.log(`INIT DB`); // INIT DB
      this.http.get('assets/db/initTableDB.sql', { responseType: 'text'}).subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql).then(result => {
          this.loadAllTables();
          this.dbReady.next(true);
        })
        // tslint:disable-next-line: no-shadowed-variable
        .catch(e => console.error(`Error launching initialize data base: ${e}`));
      });
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getMotos(): Observable<MotoModel[]> {
    return this.motos.asObservable();
  }

  getConfigurations(): Observable<ConfigurationModel[]> {
    return this.configuration.asObservable();
  }

  getOperations(): Observable<OperationModel[]> {
    return this.operation.asObservable();
  }

  loadAllTables() {
    this.loadAllDataTable(ConstantsTable.TABLE_MTM_MOTO);
    this.loadAllDataTable(ConstantsTable.TABLE_MTM_CONFIGURATION);
    this.loadAllDataTable(ConstantsTable.TABLE_MTM_OPERATION);
  }

  loadAllDataTable(table: string) {
    return this.database.executeSql(this.sqlService.getSql(table), []).then(data => {
      this.loadDataOnObserver(table, data);
    });
  }

  loadDataOnObserver(table: string, data: any[]) {
    switch (table) {
      case ConstantsTable.TABLE_MTM_MOTO:
        this.motos.next(this.sqlService.mapDataToObserver(table, data));
        break;
      case ConstantsTable.TABLE_MTM_CONFIGURATION:
        this.configuration.next(this.sqlService.mapDataToObserver(table, data));
        break;
      case ConstantsTable.TABLE_MTM_OPERATION:
        this.operation.next(this.sqlService.mapDataToObserver(table, data));
        break;
    }
  }

  executeSqlDataBase(sqlDB: string, dataDB: any[]): Promise<any> {
    return this.database.executeSql(sqlDB, dataDB).then(data => {
      this.loadAllDataTable(ConstantsTable.TABLE_MTM_MOTO);
    }).catch(e => console.error(`Error saving moto: ${e.message}`));
  }

}
