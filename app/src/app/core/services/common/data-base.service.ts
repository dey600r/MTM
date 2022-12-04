import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// LIBRARIES IONIC
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

// UTILS
import { ConstantsTable, Constants } from '@utils/index';
import { environment } from '@environment/environment';

// MODELS
import {
  VehicleModel, ConfigurationModel, OperationModel, OperationTypeModel, MaintenanceElementModel,
  MaintenanceFreqModel, MaintenanceModel, VehicleTypeModel, SystemConfigurationModel
} from '@models/index';

// SERVICES
import { SqlService } from './sql.service';


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

  constructor(private plt: Platform,
              private sqlitePorter: SQLitePorter,
              private sqlite: SQLite,
              private http: HttpClient,
              private sqlService: SqlService) { }

  getDB(): SQLiteObject {
    return this.database;
  }

  setDB(db: SQLiteObject) {
    this.database = db;
  }

  initDB() {
    this.plt.ready().then(() => {
        // LOAD DATA BASE
        this.sqlite.create({
          name: 'mtm.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
            this.setDB(db);
            this.seedDatabase();
        }).catch(e => {
          console.log('ERROR ' + e);
        });
    });
  }

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
    return this.filterNull<VehicleModel>(this.vehicles);
  }

  getVehicleTypeData(): VehicleTypeModel[] {
    return this.filterNull<VehicleTypeModel>(this.vehicleType);
  }

  getConfigurationsData(): ConfigurationModel[] {
    return this.filterNull<ConfigurationModel>(this.configuration);
  }

  getOperationsData(): OperationModel[] {
    return this.filterNull<OperationModel>(this.operation);
  }

  getOperationTypeData(): OperationTypeModel[] {
    return this.filterNull<OperationTypeModel>(this.operationType);
  }

  getMaintenanceData(): MaintenanceModel[] {
    return this.filterNull<MaintenanceModel>(this.maintenance);
  }

  getMaintenanceElementData(): MaintenanceElementModel[] {
    return this.filterNull<MaintenanceElementModel>(this.maintenanceElement);
  }

  getMaintenanceFreqData(): MaintenanceFreqModel[] {
    return this.filterNull<MaintenanceFreqModel>(this.maintenanceFreq);
  }

  getSystemConfigurationData(): SystemConfigurationModel[] {
    return this.filterNull<SystemConfigurationModel>(this.systemConfiguration);
  }

  private filterNull<T>(behaviour: BehaviorSubject<T[]>): T[] {
    return behaviour.value ? behaviour.value : [];
  }

  loadAllTables() {
    this.loadListTables(this.getTablesLoadInit());
  }

  private getTablesMaster(): string[] {
    return [
      ConstantsTable.TABLE_MTM_VEHICLE_TYPE,
      ConstantsTable.TABLE_MTM_OPERATION_TYPE,
      ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ
    ];
  }

  private getTablesData(): string[] {
    return [
      ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION,
      ConstantsTable.TABLE_MTM_VEHICLE,
      ConstantsTable.TABLE_MTM_CONFIGURATION,
      ConstantsTable.TABLE_MTM_OPERATION,
      ConstantsTable.TABLE_MTM_MAINTENANCE,
      ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT
    ];
  }

  private getTablesRef(): string[] {
    return [
      ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
      ConstantsTable.TABLE_MTM_CONFIG_MAINT,
      ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL
    ];
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
