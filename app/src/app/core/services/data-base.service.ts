import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES IONIC
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

// UTILS
import {
  VehicleModel, ConfigurationModel, OperationModel, OperationTypeModel, MaintenanceElementModel,
  MaintenanceFreqModel, MaintenanceModel, VehicleTypeModel, SystemConfigurationModel
} from '@models/index';
import { ConstantsTable, Constants } from '@utils/index';
import { SqlService } from './sql.service';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  vehicles = new BehaviorSubject([]);
  vehiclesData: VehicleModel[] = [];
  vehicleType = new BehaviorSubject([]);
  configuration = new BehaviorSubject([]);
  operation = new BehaviorSubject([]);
  operationType = new BehaviorSubject([]);
  maintenance = new BehaviorSubject([]);
  maintenanceElement = new BehaviorSubject([]);
  maintenanceFreq = new BehaviorSubject([]);
  systemConfiguration = new BehaviorSubject([]);

  constructor(private plt: Platform,
              private sqlitePorter: SQLitePorter,
              private sqlite: SQLite,
              private http: HttpClient,
              private sqlService: SqlService) { }

  getDB(): SQLiteObject {
    return this.database;
  }

  initDB() {
    this.plt.ready().then(() => {
        // LOAD DATA BASE
        this.sqlite.create({
          name: 'mtm.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
            this.database = db;
            this.seedDatabase();
        }).catch(e => {
          console.log('ERROR ' + e);
        });
    });
  }

  seedDatabase() {
    this.database.executeSql(this.sqlService.getSqlSystemConfiguration(Constants.KEY_LAST_UPDATE_DB), []).then(data => {
      this.getNextDeployDB(this.sqlService.mapSystemConfiguration(data)[0]);
    }).catch(e => {
      this.http.get(`${Constants.PATH_FILE_DB}${Constants.FILE_NAME_INIT_DB}.sql`, { responseType: 'text'}).subscribe(sql => {
        this.importSqlToDB(sql);
      });
    });
  }

  getNextDeployDB(data: SystemConfigurationModel) {
    const dateLastUpdateApp: Date = new Date(environment.lastUpdate);
    if (dateLastUpdateApp > data.updated) { // NEW VERSION - DB VERSION SHORTER THAN APP VERSION
      this.http.get(`${Constants.PATH_FILE_DB}${Constants.FILE_NAME_NEXT_DEPLOY_DB}.sql`, { responseType: 'text'}).subscribe(sql => {
        const sqlVersions: string[] = sql.split(Constants.NEXT_DEPLOY_TITLE_SEPARATOR);
        const numericVersionApp: number = this.getVersion(environment.lastVersion);
        const numericVersionDB: number = this.getVersion(data.value);
        let sqlNextDeploy = '';
        sqlVersions.forEach(x => {
          if (!!x) {
            const subSqlNextDeploy: string[] = x.split(Constants.NEXT_DEPLOY_SCRIPT_SEPARATOR);
            if (!!subSqlNextDeploy && subSqlNextDeploy.length > 1 && !!subSqlNextDeploy[1]) {
              const numVesion: number = this.getVersion(subSqlNextDeploy[0].substr(13));
              if (numericVersionDB < numVesion && numericVersionApp >= numVesion) {
                sqlNextDeploy += subSqlNextDeploy[1].replace('\n', '');
              }
            }
          }
        });
        if (sqlNextDeploy !== '') {
          this.importSqlToDB(sqlNextDeploy);
        } else {
          this.inidLoadData(true);
        }
      });
    } else {
      this.inidLoadData(false);
    }
  }

  getVersion(version: string): number {
    const nums: string[] = version.split('.');
    const v1: number = (Number)(nums[0].substr(1, 1)) * 1000;
    const v2: number = (Number)(nums[1]) * 10;
    const v3: number = (Number)(nums[2]);
    return v1 + v2 + v3;
  }

  importSqlToDB(sql: string) {
    this.sqlitePorter.importSqlToDb(this.database, sql).then(result => {
      this.inidLoadData(true);
    })
    // tslint:disable-next-line: no-shadowed-variable
    .catch(e => console.error(`Error launching initialize data base: ${e}`));
  }

  inidLoadData(updateVersion: boolean) {
    this.loadAllTables();
    this.dbReady.next(true);
    if (updateVersion) {
      this.executeScriptDataBase(this.sqlService.updateSqlSystemConfiguration(Constants.KEY_LAST_UPDATE_DB,
        environment.lastVersion, environment.lastUpdate), []);
    }
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getVehicles(): Observable<VehicleModel[]> {
    return this.vehicles.asObservable();
  }

  getVehicleType(): Observable<VehicleTypeModel[]> {
    return this.vehicleType.asObservable();
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

  getSystemConfiguration(): Observable<SystemConfigurationModel[]> {
    return this.systemConfiguration.asObservable();
  }

  loadAllTables() {
    this.loadListTables([
      ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION,
      ConstantsTable.TABLE_MTM_VEHICLE,
      ConstantsTable.TABLE_MTM_VEHICLE_TYPE,
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
      case ConstantsTable.TABLE_MTM_VEHICLE:
        this.vehiclesData = this.sqlService.mapVehicle(data);
        this.vehicles.next(this.vehiclesData);
        break;
      case ConstantsTable.TABLE_MTM_VEHICLE_TYPE:
        this.vehicleType.next(this.sqlService.mapVehicleType(data));
        break;
      case ConstantsTable.TABLE_MTM_CONFIGURATION:
        this.configuration.next(this.sqlService.mapConfiguration(data));
        break;
      case ConstantsTable.TABLE_MTM_OPERATION:
        this.operation.next(this.sqlService.mapOperation(data));
        break;
      case ConstantsTable.TABLE_MTM_OPERATION_TYPE:
        this.operationType.next(this.sqlService.mapOperationType(data));
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE:
        this.maintenance.next(this.sqlService.mapMaintenance(data));
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT:
        this.maintenanceElement.next(this.sqlService.mapMaintenanceElement(data));
        break;
      case ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ:
        this.maintenanceFreq.next(this.sqlService.mapMaintenanceFreq(data));
        break;
      case ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION:
        this.systemConfiguration.next(this.sqlService.mapSystemConfiguration(data));
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
