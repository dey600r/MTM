import { Injectable } from '@angular/core';

// MODELS
import {
    MaintenanceElementModel, ConfigurationModel, VehicleModel, MaintenanceModel, OperationModel, 
    ISaveBehaviourModel, IConfigurationMaintenanceStorageModel
} from '@models/index';

// UTILS
import { ConstantsColumns, ActionDBEnum, ConstantsTable } from '@utils/index';

// SERVICES
import { CommonService, DataBaseService, DataService, MapService } from '../common/index';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    constructor(private commonService: CommonService,
                private dbService: DataBaseService,
                private mapService: MapService,
                private dataService: DataService) {
    }

    // COMMON

    orderMaintenanceElement(replacement: MaintenanceElementModel[]): MaintenanceElementModel[] {
        let order: MaintenanceElementModel[] = [];

        if (!!replacement && replacement.length > 0) {
                order = this.commonService.orderBy(
                    replacement.filter(x => !x.master), ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME);
                const orderMaster: MaintenanceElementModel[] =
                    this.commonService.orderBy(replacement.filter(x => x.master), ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME);
                orderMaster.forEach(x => order = [...order, x]);
        }

        return order;
    }

    // SAVE

    /** CONFIGURATION */
    saveConfiguration(configuration: ConfigurationModel, action: ActionDBEnum, vehicles: VehicleModel[] = []) {
        let listActions: ISaveBehaviourModel[] = [];
        switch(action) {
            case ActionDBEnum.CREATE:
                if(!!configuration.listMaintenance && configuration.listMaintenance.length > 0) {
                    configuration.id = this.dbService.getLastId(this.dataService.getConfigurationsData());
                    listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_CONFIG_MAINT, data: this.mapService.saveMapConfigMaintenanceRel(configuration)});
                }
                break;
            case ActionDBEnum.UPDATE:
                listActions = [
                    { action: ActionDBEnum.DELETE, table: ConstantsTable.TABLE_MTM_CONFIG_MAINT, data: [configuration], prop: [ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION]},
                    { action: ActionDBEnum.CREATE, table: ConstantsTable.TABLE_MTM_CONFIG_MAINT, data: this.mapService.saveMapConfigMaintenanceRel(configuration)}
                ];
                break;
            case ActionDBEnum.DELETE:
                if (!!configuration.listMaintenance && configuration.listMaintenance.length > 0) {
                    listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_CONFIG_MAINT, data: [configuration], prop: [ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION]});
                }
                if (!!vehicles && vehicles.length > 0) {
                    listActions.push({ action: ActionDBEnum.UPDATE, table: ConstantsTable.TABLE_MTM_VEHICLE, data: vehicles});
                }
                break;
        }

        listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_CONFIGURATION, data: [configuration]});
            
        return this.dbService.saveDataStorage(listActions);
    }

    saveConfigurationMaintenance(maintenancesNew: ConfigurationModel[], maintenancesDelete: ConfigurationModel[]) {
        let listActions: ISaveBehaviourModel[] = [];

        if (maintenancesNew && maintenancesNew.length > 0) {
            let listData: IConfigurationMaintenanceStorageModel[] = [];
            maintenancesNew.forEach(x => this.mapService.saveMapConfigMaintenanceRel(x).forEach(y => listData.push(y)));
            listActions.push({ 
                action: ActionDBEnum.CREATE,
                table: ConstantsTable.TABLE_MTM_CONFIG_MAINT,
                data: listData
            });
        }
        if (maintenancesDelete && maintenancesDelete.length > 0) {
            maintenancesDelete.forEach(x => {
                listActions.push({ 
                    action: ActionDBEnum.DELETE, 
                    table: ConstantsTable.TABLE_MTM_CONFIG_MAINT, 
                    data: [x.listMaintenance[0], x], 
                    prop: [ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE, ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION]
                });
            });
        }

        listActions.push({ action: ActionDBEnum.REFRESH, table: ConstantsTable.TABLE_MTM_CONFIGURATION, data: [] });

        return this.dbService.saveDataStorage(listActions);
    }

    deleteConfigManintenance(idConfiguration: number, idMaintenance: number) {
        return this.dbService.saveDataStorage([{ 
                action: ActionDBEnum.DELETE,
                table: ConstantsTable.TABLE_MTM_CONFIG_MAINT, 
                data: [{ id: idConfiguration} , { id: idMaintenance }], 
                prop: [ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION, ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE]
            },
            {
                action: ActionDBEnum.REFRESH,
                table: ConstantsTable.TABLE_MTM_CONFIGURATION,
                data: []
            }
        ]);
    }

    /** MAINTENANCE */
    saveMaintenance(maintenance: MaintenanceModel, action: ActionDBEnum, configurations: ConfigurationModel[] = []) {
        let listActions: ISaveBehaviourModel[] = [];
        switch(action) {
            case ActionDBEnum.CREATE:
                if(!!maintenance.listMaintenanceElement && maintenance.listMaintenanceElement.length > 0) {
                    maintenance.id = this.dbService.getLastId(this.dataService.getMaintenanceData());
                    listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, data: this.mapService.saveMapMaintenanceElementRel(maintenance)});
                }
                break;
            case ActionDBEnum.UPDATE:
                listActions = [
                    { action: ActionDBEnum.DELETE, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, data: [maintenance], prop: [ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE]},
                    { action: ActionDBEnum.CREATE, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, data: this.mapService.saveMapMaintenanceElementRel(maintenance)}
                ];
                break;
            case ActionDBEnum.DELETE:
                if (!!maintenance.listMaintenanceElement && maintenance.listMaintenanceElement.length > 0) {
                    listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, data: [maintenance], prop: [ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE]});
                }
                if (!!configurations && configurations.length > 0) {
                    listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_CONFIG_MAINT, data: [maintenance], prop: [ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE]});
                }
                break;
            }
        
        listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE, data: [maintenance]});
            
        return this.dbService.saveDataStorage(listActions);
    }

    /** MAINTENANCE ELEMENT / REPLACEMENT */
    saveMaintenanceElement(replacement: MaintenanceElementModel, action: ActionDBEnum, operations: OperationModel[] = []) {
        let listActions: ISaveBehaviourModel[] = [];
        if(ActionDBEnum.DELETE === action && !!operations && operations.length > 0) {
            listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT, data: [replacement], prop: [ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_MAINTENANCE_ELEMENT]});
        }
        
        listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT, data: [replacement]});

        return this.dbService.saveDataStorage(listActions);
    }

    /** OTHERS */

    getReplacement(replacements: MaintenanceElementModel[]): string {
        let msg = '';
        replacements.forEach((x, index) => {
          msg += x.name;
          msg += index + 1 !== replacements.length ? ', ' : '';
        });
        return msg;
      }

}
