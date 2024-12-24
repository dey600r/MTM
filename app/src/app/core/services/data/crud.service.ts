import { Injectable } from '@angular/core';

// SERVICES
import { StorageService } from './storage.service';
import { DataService } from './data.service';
import { MapService } from './map.service';
import { CalendarService } from '../common';

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

  // UTILS
import { ConstantsTable, TypeOfTableEnum, ConstantsColumns, ActionDBEnum } from '@utils/index';


@Injectable({
  providedIn: 'root'
})
export class CRUDService {

  // MAPPER BEHAVIOUR
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
          saveMapperFunction: (data: SystemConfigurationModel) => this.mapService.saveMapSystemConfiguration(data),
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
          saveMapperFunction: (data: ConfigurationModel) => this.mapService.saveMapConfiguration(data)
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
          saveMapperFunction: (data: VehicleModel) => this.mapService.saveMapVehicle(data)
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
          saveMapperFunction: (data: OperationModel) => this.mapService.saveMapOperation(data)
        }
      },
    ];

  constructor(private readonly storageService: StorageService,
              private readonly mapService: MapService,
              private readonly dataService: DataService,
              private readonly calendarService: CalendarService) {

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
            // const dataTable: any[] = JSON.parse(JSON.stringify(step.getDataRelatedTableFunction()));
            const dataTable: any[] = step.getDataRelatedTableFunction();
            if(step.getDataRelatedTableRefFunction == null) {
                let idRelated: number = Number(element[step.foreignKey]);
                parameters = [...parameters, dataTable.find(row => Number(row.id) === idRelated)];
              } else {
                let idRelated: number = Number(element.id);
                const dataTableRelated: any[] = step.getDataRelatedTableRefFunction()
                                                    .filter(row => Number(row[step.foreignKey]) === idRelated);
                parameters = [...parameters, step.customMapperBeforeStorage(
                  dataTable.filter(row => dataTableRelated.some(rel => Number(row.id) === Number(rel[step.foreignKeyRel]))), dataTableRelated)];
              }
          });
  
          dataMapped = [...dataMapped, conf.get.mapperFunction(element, ...parameters)];
          }
          conf.get.setFunction(dataMapped);
      }
    }
  }

  async loadAllTables() {
    await this.loadListKeysStorage(this.getAllTables());
  }

  async getAllDataFromStorage() {
    return await this.getDataFromStorage(this.getAllTables());
  }

  async getDataFromStorage(list: string[]) {
    let storage: any = {};
    for(const element of list) {
      storage[element] = await this.storageService.getData(element);
    }
    return storage;
  }

  async loadListKeysStorage(list: string[]) {
    if (!!list && list.length > 0) {
      let storage: any = await this.getDataFromStorage(list);

      this.mapperDataStorage(storage);
    }
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

  getAllTables(): string[] {
      return [...this.getTablesMaster(),...this.getTablesRef(), ...this.getTablesData()];
  }

  getSyncTables(): string[] {
      return [...this.getTablesRef(), ...this.getTablesData()];
  }

  /* SAVER CONFIGURATION */

  saveDataStorage(listBehaviour: ISaveBehaviourModel[]): Promise<boolean[]> {
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
          case ActionDBEnum.REFRESH:
          this.loadListKeysStorage([behaviour.table]);
          break;
      }
      });

      return Promise.all(listPromises);
  }

  launchActionDataStorage(saver: ISaveBehaviourModel, actionDataStorage: (saver: ISaveBehaviourModel, listDataStorage: any[]) => any[]): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
      const mapper: IMapperModel = this.databaseBehaviourConfiguration.find(x => x.table === saver.table);
      if(mapper !== null) {
          let listDataToSave: any[] = [];
          mapper.get.getDataFunction().forEach(x => listDataToSave.push(mapper.save.saveMapperFunction(x)));
          if (saver.action !== ActionDBEnum.DELETE) {
          let newData: any[] = [];
          saver.data.forEach(x => newData.push(mapper.save.saveMapperFunction(x)));
          saver.data = newData;
          }
          listDataToSave = actionDataStorage(saver, listDataToSave);
          this.mapperDataStorage({[saver.table]: listDataToSave});
          this.storageService.setData(saver.table, listDataToSave).then(saved => {
          resolve(saved);
          }).catch(e => reject(e));
      } else {
          reject('Behaviour not found');
      }
      });
  }

  getLastId(listData: any[]): number {
      return (listData.length === 0 ? 1 : listData[listData.length - 1].id + 1);
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
      let dataToUpdate: any[] = saver.data;
      let listData: any[] = listDataStorage;
      dataToUpdate.forEach(item => {
      let indexDataToUpdate = listData.findIndex(x => x.id === item.id);
      listData[indexDataToUpdate] = item;
      });
      return listData;
  }

  deleteItemToList(saver: ISaveBehaviourModel, listDataStorage: any[]): any[] {
      let idToDelete: any[] = saver.data;
      let listData: any[] = listDataStorage;
      let prop: string[] = (!!saver.prop && saver.prop.length > 0 ? saver.prop: [ConstantsColumns.COLUMN_MTM_ID]);
      let listDataToDelete: any[] = [];
      if (prop.length === 1) {
      listDataToDelete = listData.filter(x => idToDelete.some(y => y[ConstantsColumns.COLUMN_MTM_ID] === x[prop[0]]));
      } else {
      listDataToDelete = listData.filter(x => prop.every((y, index) => x[y] === idToDelete[index][ConstantsColumns.COLUMN_MTM_ID]));
      }
      listDataToDelete.forEach(item => {
      let index: number = listData.findIndex(x => x.id === item.id);
      listData.splice(index, 1);
      });
      return listData;
  }

  saveSystemConfiguration(key: string, value: string, id: number = -1, date: string = null): Promise<any> {
      if (!!value) {
          return this.saveDataStorage([{
              action: ActionDBEnum.UPDATE,
              table: ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION,
              data: [{
                  id: (id === -1 ? this.dataService.getSystemConfigurationData().find(x => x.key === key).id : id),
                  key: key,
                  value: value,
                  updated: (date ?? this.calendarService.getDateStringToDB(new Date()))
              }]
          }]);
      }
      return null;
  }

}