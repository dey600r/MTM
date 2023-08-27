import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES IONIC
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

// UTILS
import { ConstantsTable, Constants, TypeOfTableEnum, ConstantsColumns, ActionDBEnum } from '@utils/index';
import { environment } from '@environment/environment';

// MODELS
import {
  VehicleModel, ConfigurationModel, OperationModel, OperationTypeModel, MaintenanceElementModel,
  MaintenanceFreqModel, MaintenanceModel, VehicleTypeModel, SystemConfigurationModel, IConfigurationStorageModel, 
  IMaintenanceStorageModel, ISystemConfigurationStorageModel, IMaintenanceElementStorageModel, IMapperModel, 
  IVehicleTypeStorageModel,
  IOperationTypeStorageModel,
  IMaintenanceFreqStorageModel,
  IOperationMaintenanceElementStorageModel,
  IConfigurationMaintenanceStorageModel,
  IMaintenanceElementRelStorageModel,
  IOperationStorageModel,
  IVehicleStorageModel,
  ISaveBehaviourModel
} from '@models/index';

// SERVICES
import { SqlService } from './sql.service';
import { StorageService } from './storage.service';
import { DataService } from './data.service';
import { MapService } from './map.service';


@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private vehicles = new BehaviorSubject([]);
  private vehicleType = new BehaviorSubject([]);
  private configuration = new BehaviorSubject([]);
  private operation = new BehaviorSubject([]);
  private operationType = new BehaviorSubject([]);
  private maintenance = new BehaviorSubject([]);
  private maintenanceElement = new BehaviorSubject([]);
  private maintenanceFreq = new BehaviorSubject([]);
  private systemConfiguration = new BehaviorSubject([]);

  private databaseSqliteConfig = { name: 'mtm.db', location: 'default' };

  // MAPPER 

  private readonly databaseBehaviourConfiguration: IMapperModel[] = [
    // MASTER DATA
    {
      table: ConstantsTable.TABLE_MTM_VEHICLE_TYPE,
      type: TypeOfTableEnum.MASTER,
      get: {
        getDataFunction: () => this.dataService.getVehicleTypeData(),
        mapperFunction: (data: IVehicleTypeStorageModel) => this.mapService.getMapVehicleType(data),
        setFunction: (data: VehicleTypeModel[]) => this.dataService.setVehicleType(data),
        relatedTable: [],
      },
      save: {
        saveMapperFunction: (data: any) => data
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_OPERATION_TYPE,
      type: TypeOfTableEnum.MASTER,
      get: {
        getDataFunction: () => this.dataService.getOperationTypeData(),
        mapperFunction: (data: IOperationTypeStorageModel) => this.mapService.getMapOperationType(data),
        setFunction: (data: OperationTypeModel[]) => this.dataService.setOperationType(data),
        relatedTable: [],
      },
      save: {
        saveMapperFunction: (data: any) => data,
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ,
      type: TypeOfTableEnum.MASTER,
      get: {
        getDataFunction: () => this.dataService.getMaintenanceFreqData(),
        mapperFunction: (data: IMaintenanceFreqStorageModel) => this.mapService.getMapMaintenanceFreq(data),
        setFunction: (data: MaintenanceFreqModel[]) => this.dataService.setMaintenanceFreq(data),
        relatedTable: [],
      },
      save: {
        saveMapperFunction: (data: any) => data
      }
    },
    // RELATED DATA
    {
      table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
      type: TypeOfTableEnum.RELATION,
      get: {
        getDataFunction: () => this.dataService.getOperationMaintenanceElementData(),
        mapperFunction: (data: IOperationMaintenanceElementStorageModel[]) => data,
        setFunction: (data: IOperationMaintenanceElementStorageModel[]) => this.dataService.setOperationMaintenanceElementData(data),
        relatedTable: []
      },
      save: {
        saveMapperFunction: (data: any) => data
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_CONFIG_MAINT,
      type: TypeOfTableEnum.RELATION,
      get: {
        getDataFunction: () => this.dataService.getConfigurationMaintenanceData(),
        mapperFunction: (data: IConfigurationMaintenanceStorageModel[]) => data,
        setFunction: (data: IConfigurationMaintenanceStorageModel[]) => this.dataService.setConfigurationMaintenanceData(data),
        relatedTable: []
      },
      save: {
        saveMapperFunction: (data: any) => data
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL,
      type: TypeOfTableEnum.RELATION,
      get: {
        getDataFunction: () => this.dataService.getMaintenanceElementRelData(),
        mapperFunction: (data: IMaintenanceElementRelStorageModel[]) => data,
        setFunction: (data: IMaintenanceElementRelStorageModel[]) => this.dataService.setMaintenanceElementRelData(data),
        relatedTable: [],
      },
      save: {
        saveMapperFunction: (data: any) => data
      }
    },
    // APPLICATION DATA
    {
      table: ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION,
      type: TypeOfTableEnum.DATA,
      get: {
        getDataFunction: () => this.dataService.getSystemConfigurationData(),
        mapperFunction: (data: ISystemConfigurationStorageModel) => this.mapService.getMapSystemConfiguration(data),
        setFunction: (data: SystemConfigurationModel[]) => this.dataService.setSystemConfiguration(data),
        relatedTable: [],
      },
      save: {
        saveMapperFunction: (data: any) => data,
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
      type: TypeOfTableEnum.DATA,
      get: {
        getDataFunction: () => this.dataService.getMaintenanceElementData(),
        mapperFunction: (data: IMaintenanceElementStorageModel) => this.mapService.getMapMaintenanceElement(data),
        setFunction: (data: MaintenanceElementModel[]) => this.dataService.setMaintenanceElement(data),
        relatedTable: [],
      },
      save: {
        saveMapperFunction: (data: MaintenanceElementModel) => this.mapService.saveMapMaintenanceElement(data)
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_MAINTENANCE,
      type: TypeOfTableEnum.DATA,
      get: {
        getDataFunction: () => this.dataService.getMaintenanceData(),
        mapperFunction: (data: IMaintenanceStorageModel, listME: MaintenanceElementModel[], mf: MaintenanceFreqModel) => this.mapService.getMapMaintenance(data, listME, mf),
        setFunction: (data: MaintenanceModel[]) => this.dataService.setMaintenance(data),
        relatedTable: [
          {
            foreignKey: ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE,
            foreignKeyRel: ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE_ELEMENT,
            getDataRelatedTableFunction: () => this.dataService.getMaintenanceElementData(),
            getDataRelatedTableRefFunction: () => this.dataService.getMaintenanceElementRelData(),
            customMapperBeforeStorage: (data: MaintenanceElementModel[], related: IMaintenanceElementRelStorageModel[]) => {
              data.forEach(x => {
                let item = related.find(y => x.id == y.idMaintenanceElement);
                x.idMaintenanceRel = item.id;
              });
              return data;
            }
          },
          {
            foreignKey: ConstantsColumns.COLUMN_MTM_MAINTENANCE_MAINTENANCE_FREQ,
            foreignKeyRel: '',
            getDataRelatedTableFunction: () => this.dataService.getMaintenanceFreqData(),
            getDataRelatedTableRefFunction: null,
            customMapperBeforeStorage: (data: any[]) => data
          }
        ]
      },
      save: {
        saveMapperFunction: (data: MaintenanceModel) => this.mapService.saveMapMaintenance(data)
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_CONFIGURATION,
      type: TypeOfTableEnum.DATA,
      get: {
        getDataFunction: () => this.dataService.getConfigurationsData(),
        mapperFunction: (data: IConfigurationStorageModel, listMaint: MaintenanceModel[]) => this.mapService.getMapConfiguration(data, listMaint),
        setFunction: (data: ConfigurationModel[]) => this.dataService.setConfigurations(data),
        relatedTable: [
          {
            foreignKey: ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION,
            foreignKeyRel: ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE,
            getDataRelatedTableFunction: () => this.dataService.getMaintenanceData(),
            getDataRelatedTableRefFunction: () => this.dataService.getConfigurationMaintenanceData(),
            customMapperBeforeStorage: (data: MaintenanceModel[], related: IConfigurationMaintenanceStorageModel[]) => {
              data.forEach(x => {
                let item = related.find(y => x.id == y.idMaintenance);
                x.idConfigurationRel = item.id;
              });
              return data;
            }
          }
        ]
      },
      save: {
        saveMapperFunction: () => []
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_VEHICLE,
      type: TypeOfTableEnum.DATA,
      get: {
        getDataFunction: () => this.dataService.getVehiclesData(),
        mapperFunction: (data: IVehicleStorageModel, conf: ConfigurationModel, vType: VehicleTypeModel) => this.mapService.getMapVehicle(data, conf, vType),
        setFunction: (data: VehicleModel[]) => this.dataService.setVehicles(data),
        relatedTable: [
          {
            foreignKey: ConstantsColumns.COLUMN_MTM_VEHICLE_CONFIGURATION,
            foreignKeyRel: '',
            getDataRelatedTableFunction: () => this.dataService.getConfigurationsData(),
            getDataRelatedTableRefFunction: null,
            customMapperBeforeStorage: (data: any[]) => data
          },
          {
            foreignKey: ConstantsColumns.COLUMN_MTM_VEHICLE_VEHICLE_TYPE,
            foreignKeyRel: '',
            getDataRelatedTableFunction: () => this.dataService.getVehicleTypeData(),
            getDataRelatedTableRefFunction: null,
            customMapperBeforeStorage: (data: any[]) => data
          }
        ],
      },
      save: {
        saveMapperFunction: () => []
      }
    },
    {
      table: ConstantsTable.TABLE_MTM_OPERATION,
      type: TypeOfTableEnum.DATA,
      get: {
        getDataFunction: () => this.dataService.getOperationsData(),
        mapperFunction: (data: IOperationStorageModel, oType: OperationTypeModel, v: VehicleModel, listME) => this.mapService.getMapOperation(data, oType, v, listME),
        setFunction: (data: OperationModel[]) => this.dataService.setOperations(data),
        relatedTable: [
          {
            foreignKey: ConstantsColumns.COLUMN_MTM_OPERATION_OPERATION_TYPE,
            foreignKeyRel: '',
            getDataRelatedTableFunction: () => this.dataService.getOperationTypeData(),
            getDataRelatedTableRefFunction: null,
            customMapperBeforeStorage: (data: any[]) => data
          },
          {
            foreignKey: ConstantsColumns.COLUMN_MTM_OPERATION_VEHICLE,
            foreignKeyRel: '',
            getDataRelatedTableFunction: () => this.dataService.getVehiclesData(),
            getDataRelatedTableRefFunction: null,
            customMapperBeforeStorage: (data: any[]) => data
          },
          {
            foreignKey: ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION,
            foreignKeyRel: ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_MAINTENANCE_ELEMENT,
            getDataRelatedTableFunction: () => this.dataService.getMaintenanceElementData(),
            getDataRelatedTableRefFunction: () => this.dataService.getOperationMaintenanceElementData(),
            customMapperBeforeStorage: (data: MaintenanceElementModel[], related: IOperationMaintenanceElementStorageModel[]) => {
              data.forEach(x => {
                let item = related.find(y => x.id == y.idMaintenanceElement);
                x.price = item.price;
                x.idOperationRel = item.id;
              });
              return data;
            }
          }
        ]
      },
      save: {
        saveMapperFunction: () => []
      }
    },
  ];

  constructor(private plt: Platform,
              private sqlitePorter: SQLitePorter,
              private sqlite: SQLite,
              private http: HttpClient,
              private sqlService: SqlService,
              private storageService: StorageService,
              private dataService: DataService,
              private mapService: MapService) { }

  getDB(): SQLiteObject {
    return this.database;
  }

  setDB(db: SQLiteObject) {
    this.database = db;
  }

  initDB() {
    this.plt.ready().then(() => {
      // LOAD DATA BASE
      // this.sqlite.create({
      //   name: 'mtm.db',
      //   location: 'default'
      // })
      // .then((db: SQLiteObject) => {
      //     this.setDB(db);
      //     this.seedDatabase();
      // }).catch(e => {
      //   console.log('ERROR ' + e);
      // });
      this.seedDataStorage();
    });
  }

  saveDataIntoStorage(json: any) {
    const jsonFormated: any = JSON.parse(JSON.stringify(json).replaceAll(":\"Y\"", ":true").replaceAll(":\"N\"", ":false").replace("\"value\":false", "\"value\":\"N\""));
    this.getAllTables().forEach(x => {
        this.storageService.setData(x, jsonFormated[x]);
    });
    console.log('Database Storage updated sucessfully');
  }

  saveAndGetDBStorage(json: any) {
    this.saveDataIntoStorage(json);
    this.loadListKeysStorage(this.getAllTables());
  }

  migrateToSqlLite() {
    this.sqlitePorter.exportDbToJson(this.getDB()).then(async (json: any) => {
      this.saveAndGetDBStorage(json.data.inserts);

      this.sqlite.deleteDatabase(this.databaseSqliteConfig)
        .then(data => console.log('Database deleted ', data))
        .catch(error => console.error('Database error deleting', error));
    });
  }

  reviewDBToMigrateOrInit() {
    this.sqlite.create(this.databaseSqliteConfig).then((db: SQLiteObject) => { // LOAD DATABASE SQLITE
        this.setDB(db);
        //this.seedDatabase();
        this.database.executeSql(this.sqlService.getSqlSystemConfiguration(Constants.KEY_LAST_UPDATE_DB), []).then(data => {
          console.log('Migrating Database...');
          this.migrateToSqlLite();
        }).catch(e => {
          console.log(`Initializing Data Storage to ${environment.lastVersion}...`);
          this.http.get(`${Constants.PATH_FILE_DB}${Constants.FILE_NAME_INIT_DB_STORAGE}`, { responseType: 'text'}).subscribe(json => {
            this.saveAndGetDBStorage(JSON.parse(json).data);
          });
        });
    }).catch(e => {
      console.log('ERROR ' + e);
    });
  }

  seedDataStorage() {
    this.storageService.getData(ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION).then(data => { // OK -> EXISTS OR NOT SQLITE
      console.log('Start DB Storage OK', data);
      this.loadListKeysStorage(this.getAllTables());
    }).catch(error => { // MIGRATE DB OR INIT STORAGE
      console.log('Reviewing DB...');
      this.reviewDBToMigrateOrInit();
    });
  }

  /* MAPPER CONFIGURATION */
  getMapperConfiguration(): IMapperModel[] {
    return this.databaseBehaviourConfiguration;
  }

  mapperDataStorage(data: any) {
    for(let conf of this.databaseBehaviourConfiguration) {
      let dataMapped: any[] = [];
      if(data[conf.table]) {
        for(let element of data[conf.table]) {  
          let parameters: any[] = [];
          conf.get.relatedTable.forEach(step => {
            const dataTable: any[] = JSON.parse(JSON.stringify(step.getDataRelatedTableFunction()));
            if(step.getDataRelatedTableRefFunction == null) {
              parameters = [...parameters, dataTable.find(row => row.id === element[step.foreignKey])];
            } else {
              const dataTableRelated: any[] = step.getDataRelatedTableRefFunction()
                                                  .filter(row => row[step.foreignKey] === element.id);
              parameters = [...parameters, 
                step.customMapperBeforeStorage(dataTable.filter(row => dataTableRelated.some(rel => row.id === rel[step.foreignKeyRel])), dataTableRelated)];
            }
          });
  
          dataMapped = [...dataMapped, conf.get.mapperFunction(element, ...parameters)];
        }
        conf.get.setFunction(dataMapped);
      }
    }
  }

  saveDataStorage(listBehaviour: ISaveBehaviourModel[], listOfDataToRefresh: string[]): Promise<boolean[]> {
    let listPromises: any[] = [];
    listBehaviour.forEach(behaviour => {
      switch(behaviour.action) {
        case ActionDBEnum.CREATE:
          listPromises.push(this.launchActionDataStorage(behaviour, this.addItemToList));
          break;
        case ActionDBEnum.UPDATE:
          listPromises.push(this.launchActionDataStorage(behaviour, this.updateItemToList));
          break;
        case ActionDBEnum.DELETE:
          listPromises.push(this.launchActionDataStorage(behaviour, this.deleteItemToList));
          break;
      }

    });

    this.loadListKeysStorage(listOfDataToRefresh);

    return Promise.all(listPromises);
  }

  launchActionDataStorage(saver: ISaveBehaviourModel, actionDataStorage: (saver: ISaveBehaviourModel, listDataStorage: any[]) => any[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const mapper: IMapperModel = this.databaseBehaviourConfiguration.find(x => x.table === saver.table);
      if(mapper !== null) {
        let listData: any[] = actionDataStorage(saver, mapper.get.getDataFunction());
        let listDataToSave: any[] = [];
        listData.forEach(x => listDataToSave.push(mapper.save.saveMapperFunction(x)));
        this.storageService.setData(saver.table, listDataToSave).then(value => {
          resolve(value);
        }).catch(e => reject(e));
      } else {
        reject('Behaviour not found');
      }
    });
  }


  addItemToList(saver: ISaveBehaviourModel, listDataStorage: any[]): any[] {
    let dataToSave: any[] = saver.data;
    let listData: any[] = listDataStorage;
    dataToSave.forEach((x, index) => {
      x.id = (listData.length === 0 ? 1 : listData[listData.length - 1].id + 1) + index;
      listData.push(x);
    });
    return listData;
  }

  updateItemToList(saver: ISaveBehaviourModel, listDataStorage: any[]): any[] {
    let dataToUpdate: any = saver.data[0];
    let listData: any[] = listDataStorage;
    let indexDataToUpdate = listData.findIndex(x => x.id === dataToUpdate.id);
    listData[indexDataToUpdate] = dataToUpdate;
    return listData;
  }

  deleteItemToList(saver: ISaveBehaviourModel, listDataStorage: any[]): any[] {
    let idToDelete: any = saver.data[0];
    let listData: any[] = listDataStorage;
    let prop: string = (saver.prop ? saver.prop: ConstantsColumns.COLUMN_MTM_ID);
    let listDataToDelete: any[] = listData.filter(x => x[prop] === idToDelete);
    listDataToDelete.forEach(item => {
      let index: number = listData.findIndex(x => x.id === item.id);
      listData.splice(index, 1);
    });
    return listData;
  }






  // OLD-------------------------------------------------------------------------------

  seedDatabase() {
    this.database.executeSql(this.sqlService.getSqlSystemConfiguration(Constants.KEY_LAST_UPDATE_DB), []).then(data => {
      console.log('Checking Database...');
      this.getNextDeployDB(this.sqlService.mapSystemConfiguration(data)[0]);
    }).catch(e => {
      this.http.get(`${Constants.PATH_FILE_DB}${Constants.FILE_NAME_INIT_DB}.sql`, { responseType: 'text'}).subscribe(sql => {
        console.log(`Initializing Database to ${environment.lastVersion}...`);
        this.importSqlToDB(sql);
      });
    });
  }

  getNextDeployDB(data: SystemConfigurationModel) {
    const dateLastUpdateApp: Date = new Date(environment.lastUpdate);
    console.log(`Version App: ${environment.lastVersion} - ${environment.lastUpdate}`);
    console.log(`Version DB: ${data.value} - ${data.updated.toLocaleString()}`);
    if (dateLastUpdateApp > data.updated) { // NEW VERSION - DB VERSION SHORTER THAN APP VERSION
      this.http.get(`${Constants.PATH_FILE_DB}${Constants.FILE_NAME_NEXT_DEPLOY_DB}.sql`, { responseType: 'text'}).subscribe(sql => {
        const sqlNextDeploy = this.getSqlNextVersion(sql, data);
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

  getSqlNextVersion(sql: string, data: SystemConfigurationModel): string {
    let sqlNextDeploy = '';
    const sqlVersions: string[] = sql.split(Constants.NEXT_DEPLOY_TITLE_SEPARATOR);
    const numericVersionApp: number = this.getVersion(environment.lastVersion);
    const numericVersionDB: number = this.getVersion(data.value);
    sqlVersions.forEach(x => {
      if (!!x) {
        const subSqlNextDeploy: string[] = x.split(Constants.NEXT_DEPLOY_SCRIPT_SEPARATOR);
        if (!!subSqlNextDeploy && subSqlNextDeploy.length > 1 && !!subSqlNextDeploy[1]) {
          const numVesion: number = this.getVersion(subSqlNextDeploy[0].substring(13));
          if (numericVersionDB < numVesion && numericVersionApp >= numVesion) {
            sqlNextDeploy += subSqlNextDeploy[1].replace('\n', '');
          }
        }
      }
    });
    return sqlNextDeploy;
  }

  getVersion(version: string): number {
    const nums: string[] = version.split('.');
    const v1: number = (Number)(nums[0].substring(1)) * 1000;
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
      console.log(`Upgrading Database to ${environment.lastVersion}...`);
      this.executeScriptDataBase(this.sqlService.updateSqlSystemConfiguration(Constants.KEY_LAST_UPDATE_DB,
        environment.lastVersion, environment.lastUpdate), []);
    }
  }

  // GETS

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getVehicles(): Observable<VehicleModel[]> {
    return this.dataService.getVehicles();
  }

  getVehicleType(): Observable<VehicleTypeModel[]> {
    return this.dataService.getVehicleType();
  }

  getConfigurations(): Observable<ConfigurationModel[]> {
    return this.dataService.getConfigurations();
  }

  getOperations(): Observable<OperationModel[]> {
    return this.dataService.getOperations();
  }

  getOperationType(): Observable<OperationTypeModel[]> {
    return this.dataService.getOperationType();
  }

  getMaintenance(): Observable<MaintenanceModel[]> {
    return this.dataService.getMaintenance();
  }

  getMaintenanceElement(): Observable<MaintenanceElementModel[]> {
    return this.dataService.getMaintenanceElement();
  }

  getMaintenanceFreq(): Observable<MaintenanceFreqModel[]> {
    return this.dataService.getMaintenanceFreq();
  }

  getSystemConfiguration(): Observable<SystemConfigurationModel[]> {
    return this.dataService.getSystemConfiguration();
  }

  // SETS

  setVehicles(vehicles: VehicleModel[]): void {
    return this.vehicles.next(vehicles);
  }

  setVehicleType(vehicleTypes: VehicleTypeModel[]): void {
    this.vehicles.next(vehicleTypes);
  }

  setConfigurations(configurations: ConfigurationModel[]): void {
    this.configuration.next(configurations);
  }

  setOperations(operations: OperationModel[]): void {
    this.operation.next(operations);
  }

  setOperationType(operationTypes: OperationTypeModel[]): void {
    this.operationType.next(operationTypes);
  }

  setMaintenance(maintenances: MaintenanceModel[]): void {
    this.maintenance.next(maintenances);
  }

  setMaintenanceElement(maintenanceElements: MaintenanceElementModel[]): void {
    this.maintenanceElement.next(maintenanceElements);
  }

  setMaintenanceFreq(maintenanceFreq: MaintenanceFreqModel[]): void {
    this.maintenanceFreq.next(maintenanceFreq);
  }

  setSystemConfiguration(systemConfigurations: SystemConfigurationModel[]): void {
    this.systemConfiguration.next(systemConfigurations);
  }

  // GETS DATA
  getVehiclesData(): VehicleModel[] {
    return this.dataService.getVehiclesData();
  }

  getVehicleTypeData(): VehicleTypeModel[] {
    return this.dataService.getVehicleTypeData()
  }

  getConfigurationsData(): ConfigurationModel[] {
    return this.dataService.getConfigurationsData();
  }

  getOperationsData(): OperationModel[] {
    return this.dataService.getOperationsData();
  }

  getOperationTypeData(): OperationTypeModel[] {
    return this.dataService.getOperationTypeData();
  }

  getMaintenanceData(): MaintenanceModel[] {
    return this.dataService.getMaintenanceData();
  }

  getMaintenanceElementData(): MaintenanceElementModel[] {
    return this.dataService.getMaintenanceElementData();
  }

  getMaintenanceFreqData(): MaintenanceFreqModel[] {
    return this.dataService.getMaintenanceFreqData();
  }

  getSystemConfigurationData(): SystemConfigurationModel[] {
    return this.dataService.getSystemConfigurationData();
  }

  loadAllTables() {
    this.loadListTables(this.getTablesLoadInit());
  }

  private getTables(type: TypeOfTableEnum): string[] {
    return this.getMapperConfiguration().filter(x => x.type === type).map(x => x.table);
  }

  private getTablesMaster(): string[] {
    return this.getTables(TypeOfTableEnum.MASTER);
  }

  private getTablesData(): string[] {
    return this.getTables(TypeOfTableEnum.DATA);
  }

  private getTablesRef(): string[] {
    return this.getTables(TypeOfTableEnum.RELATION);
  }

  getTablesLoadInit(): string[] {
    return [...this.getTablesMaster(), ...this.getTablesData()];
  }

  getAllTables(): string[] {
    return [...this.getTablesLoadInit(), ...this.getTablesRef()];
  }

  getSyncTables(): string[] {
    return [...this.getTablesData(), ...this.getTablesRef()];
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

  async loadListKeysStorage(list: string[]) {
    if (!!list && list.length > 0) {
      let storage: any = {};
      for(const element of list) {
        storage[element] = await this.storageService.getData(element);
      }

      this.mapperDataStorage(storage);
    }
  }

  executeSql(table: string): Promise<any> {
    return this.database.executeSql(this.sqlService.getSql(table), []);
  }

  loadDataOnObserver(table: string, data: any[]) {
    switch (table) {
      case ConstantsTable.TABLE_MTM_VEHICLE:
        this.vehicles.next(this.sqlService.mapVehicle(data));
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
