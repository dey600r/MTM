import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// LIBRARIES IONIC
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

// UTILS
import { ConstantsTable, Constants, PageEnum, ToastTypeEnum } from '@utils/index';
import { environment } from '@environment/environment';

// MODELS
import {
  SystemConfigurationModel, ISystemConfigurationStorageModel,  
} from '@models/index';

// SERVICES
import { LogService } from '../common/log.service';
import { SqlService } from './sql.service';
import { StorageService } from './storage.service';
import { MapService } from './map.service';
import { CRUDService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private database: SQLiteObject;
  private databaseSqliteConfig = { name: 'mtm.db', location: 'default' };

  constructor(private plt: Platform,
              private sqlitePorter: SQLitePorter,
              private sqlite: SQLite,
              private http: HttpClient,
              private sqlService: SqlService,
              private storageService: StorageService,
              private mapService: MapService,
              private crudService: CRUDService,
              private logService: LogService) { }

  getDB(): SQLiteObject {
    return this.database;
  }

  setDB(db: SQLiteObject) {
    this.database = db;
  }

  initDB() {
    this.plt.ready().then(() => {
      setTimeout(() => {
        this.seedDataStorage();
      }, 100);
    });
  }

  formatBooleanJSON(json: string): string {
    return json.split(":\"Y\"").join(":true").split(":\"N\"").join(":false").replace("\"value\":false", "\"value\":\"N\"").replace("\"value\":true", "\"value\":\"Y\"");
  }

  async saveDataIntoStorage(json: any) {
    const jsonStringly: string = this.formatBooleanJSON(JSON.stringify(json));
    const jsonFormated: any = JSON.parse(jsonStringly);
    this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, 'Json Formated: ' + jsonStringly);
    
    for(const table of this.crudService.getAllTables()) {
        await this.storageService.setData(table, jsonFormated[table]).then(x => console.log(`Storaged ${table}`));
    };

    this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, 'Database Storage updated sucessfully');
  }

  async saveAndGetDBStorage(json: any) {
    await this.saveDataIntoStorage(json);
    await this.validateVersionOfDB(this.mapService.getMapSystemConfiguration(json[ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION].find(x => x.key === Constants.KEY_LAST_UPDATE_DB)));
  }

  migrateToSqlLite() {
    this.sqlitePorter.exportDbToJson(this.getDB()).then(async (json: any) => {
      await this.saveAndGetDBStorage(json.data.inserts);

      this.sqlite.deleteDatabase(this.databaseSqliteConfig)
        .then(data => this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, 'Database deleted'))
        .catch(error => this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, 'Database error deleting', error));
    });
  }

  reviewDBToMigrateOrInit() {
    this.sqlite.create(this.databaseSqliteConfig).then((db: SQLiteObject) => { // LOAD DATABASE SQLITE
        this.setDB(db);
        this.database.executeSql(this.sqlService.getSqlSystemConfiguration(Constants.KEY_LAST_UPDATE_DB), []).then(data => {
          this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, 'Migrating database ...');
          this.migrateToSqlLite();
        }).catch(e => {
          this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `Initializing Data Storage to ${environment.lastVersion}...`);
          this.http.get(`${Constants.PATH_FILE_DB}${Constants.FILE_NAME_INIT_DB_STORAGE}`, { responseType: 'text'}).subscribe(json => {
            this.saveAndGetDBStorage(JSON.parse(json).data);
          });
        });
    }).catch(e => {
      this.logService.logInfo(ToastTypeEnum.DANGER, PageEnum.HOME, 'Reviewing DB...', e);
    });
  }

  seedDataStorage() {
    this.storageService.getData(ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION).then((data: ISystemConfigurationStorageModel[]) => { // OK -> EXISTS OR NOT SQLITE
      this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, 'Start DB Storage OK');
      this.validateVersionOfDB(this.mapService.getMapSystemConfiguration(data.find(x => x.key === Constants.KEY_LAST_UPDATE_DB)));
    }).catch(error => { // MIGRATE DB OR INIT STORAGE
      this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, 'Reviewing DB...', error);
      this.reviewDBToMigrateOrInit();
    });
  }

  async validateVersionOfDB(data: SystemConfigurationModel) {
    await this.crudService.loadAllTables();

    const dateLastUpdateApp: Date = new Date(environment.lastUpdate);
    this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `Version App: ${environment.lastVersion} - ${environment.lastUpdate} / Version DB: ${data.value} - ${data.updated.toLocaleString()}`);
    if(dateLastUpdateApp > data.updated) { // NEW VERSION - DB VERSION SHORTER THAN APP VERSION
      this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `Upgrading Database to ${environment.lastVersion}...`);
      this.crudService.saveSystemConfiguration(Constants.KEY_LAST_UPDATE_DB, environment.lastVersion, data.id, environment.lastUpdate);
    }
  }

  getVersion(version: string): number {
    const nums: string[] = version.split('.');
    const v1: number = (Number)(nums[0].substring(1)) * 1000;
    const v2: number = (Number)(nums[1]) * 10;
    const v3: number = (Number)(nums[2]);
    return v1 + v2 + v3;
  }


  

}