import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// UTILS
import { ConstantsTable, Constants, PageEnum, ToastTypeEnum } from '@utils/index';
import { environment } from '@environment/environment';

// MODELS
import {
  SystemConfigurationModel, ISystemConfigurationStorageModel,  
} from '@models/index';

// SERVICES
import { LogService } from '../common/log.service';
import { StorageService } from './storage.service';
import { MapService } from './map.service';
import { CRUDService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  constructor(private plt: Platform,
              private http: HttpClient,
              private storageService: StorageService,
              private mapService: MapService,
              private crudService: CRUDService,
              private logService: LogService) { }

  initDB() {
    this.plt.ready().then(() => {
      setTimeout(() => {
        this.seedDataStorage();
      }, 100);
    });
  }

  private seedDataStorage() {
    this.storageService.getData(ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION).then((data: ISystemConfigurationStorageModel[]) => { // OK -> EXISTS OR NOT SQLITE
      this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, 'Start DB Storage OK');
      this.validateVersionOfDB(this.mapService.getMapSystemConfiguration(data.find(x => x.key === Constants.KEY_LAST_UPDATE_DB)));
    }).catch(error => { // MIGRATE DB OR INIT STORAGE
      this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, 'Reviewing DB...', error);
      this.initStorageDataBaseWithMasterData();
    });
  }

  private async validateVersionOfDB(data: SystemConfigurationModel) {
    await this.crudService.loadAllTables();

    const dateLastUpdateApp: Date = new Date(environment.lastUpdate);
    this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, `Version App: ${environment.lastVersion} - ${environment.lastUpdate} / Version DB: ${data.value} - ${data.updated.toLocaleString()}`);
    if(dateLastUpdateApp > data.updated) { // NEW VERSION - DB VERSION SHORTER THAN APP VERSION
      this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, `Upgrading Database to ${environment.lastVersion}...`);
      this.crudService.saveSystemConfiguration(Constants.KEY_LAST_UPDATE_DB, environment.lastVersion, data.id, environment.lastUpdate);
    }
  }

  private initStorageDataBaseWithMasterData() {
    this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `Initializing Data Storage to ${environment.lastVersion}...`);
    this.http.get(`${Constants.PATH_FILE_DB}${Constants.FILE_NAME_INIT_DB_STORAGE}`, { responseType: 'text'}).subscribe(json => {
      this.saveAndGetDBStorage(JSON.parse(json).data);
    });
  }

  private async saveAndGetDBStorage(json: any) {
    await this.saveDataIntoStorage(json);
    await this.validateVersionOfDB(this.mapService.getMapSystemConfiguration(json[ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION].find(x => x.key === Constants.KEY_LAST_UPDATE_DB)));
  }
  
  public async saveDataIntoStorage(json: any) {
    const jsonStringly: string = this.formatBooleanJSON(JSON.stringify(json));
    const jsonFormated: any = JSON.parse(jsonStringly);
    this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, 'Json Formated: ' + jsonStringly);
    
    for(const table of this.crudService.getAllTables()) {
        await this.storageService.setData(table, jsonFormated[table]).then(x => console.log(`Storaged ${table}`));
    };

    this.logService.logInfo(ToastTypeEnum.INFO, PageEnum.HOME, 'Database Storage updated sucessfully');
  }

  formatBooleanJSON(json: string): string {
    return json.split(":\"Y\"").join(":true").split(":\"N\"").join(":false").replace("\"value\":false", "\"value\":\"N\"").replace("\"value\":true", "\"value\":\"Y\"");
  }
}
