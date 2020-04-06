import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES IONIC
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

// UTILS
import {
  MotoModel, ConfigurationModel, OperationModel, OperationTypeModel, MaintenanceElementModel,
  MaintenanceFreqModel, MaintenanceModel
} from '@models/index';
import { ConstantsTable } from '@utils/index';
import { SqlService } from './sql.service';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  motos = new BehaviorSubject([]);
  configuration = new BehaviorSubject([]);
  operation = new BehaviorSubject([]);
  operationType = new BehaviorSubject([]);
  maintenance = new BehaviorSubject([]);
  maintenanceElement = new BehaviorSubject([]);
  maintenanceFreq = new BehaviorSubject([]);

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

  getOperationType(): Observable<OperationTypeModel[]> {
    return this.operationType.asObservable();
  }

  getMaintenance(): Observable<MaintenanceModel[]> {
    return this.maintenance.asObservable();
  }

  getMaintenanceElement(): Observable<MaintenanceElementModel[]> {
    return this.maintenanceElement.asObservable();
  }

  getMaintenanceFreq(): Observable<MaintenanceFreqModel[]> {
    return this.maintenanceFreq.asObservable();
  }

  loadAllTables() {
    this.loadListTables([
      ConstantsTable.TABLE_MTM_MOTO,
      ConstantsTable.TABLE_MTM_CONFIGURATION,
      ConstantsTable.TABLE_MTM_OPERATION,
      ConstantsTable.TABLE_MTM_OPERATION_TYPE,
      ConstantsTable.TABLE_MTM_MAINTENANCE,
      ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
      ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ
    ]);
  }

  loadListTables(list: string []) {
    if (!!list && list.length > 0) {
      list.forEach(x => {
        this.loadAllDataTable(x);
      });
    }
  }

  loadAllDataTable(table: string) {
    return this.executeSql(table).then(data => {
      this.loadDataOnObserver(table, data);
    });
  }

  executeSql(table: string): Promise<any> {
    return this.database.executeSql(this.sqlService.getSql(table), []);
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
      case ConstantsTable.TABLE_MTM_OPERATION_TYPE:
        this.operationType.next(this.sqlService.mapDataToObserver(table, data));
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE:
        this.maintenance.next(this.sqlService.mapDataToObserver(table, data));
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT:
        this.maintenanceElement.next(this.sqlService.mapDataToObserver(table, data));
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ:
        this.maintenanceFreq.next(this.sqlService.mapDataToObserver(table, data));
        break;
    }
  }

  executeSqlDataBase(sqlDB: string, dataDB: any[], list: string[] = []): Promise<any> {
    return this.database.executeSql(sqlDB, dataDB).then(data => {
      this.loadListTables(list);
    }).catch(e => {
      console.error(`Error executing sql on DB: ${e.message}`);
      throw new Error(`Error executing sql on DB: ${e.message}`);
    });
  }

  executeScriptDataBase(sqlDB: string, list: string[] = []): Promise<any> {
    return this.sqlitePorter.importSqlToDb(this.database, sqlDB).then(result => {
      this.loadListTables(list);
    })
    // tslint:disable-next-line: no-shadowed-variable
    .catch(e => {
      console.error(`Error executing script on DB: ${e.message}`);
      throw new Error(`Error executing script on DB: ${e.message}`);
    });
  }

}
