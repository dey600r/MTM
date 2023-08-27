import { Injectable } from '@angular/core';

// MODELS
import {
    MaintenanceElementModel, ConfigurationModel, VehicleModel, MaintenanceModel, OperationModel, ISaveBehaviourModel
} from '@models/index';

// UTILS
import { ConstantsColumns, ActionDBEnum, ConstantsTable } from '@utils/index';

// SERVICES
import { CommonService, DataBaseService, MapService, SqlService } from '../common/index';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    constructor(private commonService: CommonService,
                private dbService: DataBaseService,
                private sqlService: SqlService,
                private mapService: MapService) {
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
        let sqlDB = '';
        let listLoadTable: string[] = [ConstantsTable.TABLE_MTM_CONFIGURATION];
        switch (action) {
            case ActionDBEnum.CREATE:
                sqlDB = this.sqlService.insertSqlConfiguration([configuration]);
                sqlDB += this.sqlService.insertSqlConfigurationMaintenance(configuration);
                break;
            case ActionDBEnum.UPDATE:
                sqlDB = this.sqlService.updateSqlConfiguration([configuration]);
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIG_MAINT,
                    ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION, [configuration.id]);
                sqlDB += this.sqlService.insertSqlConfigurationMaintenance(configuration);
                break;
            case ActionDBEnum.DELETE:
                sqlDB = this.getSqlDeleteConfiguration(configuration, vehicles);
                listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_VEHICLE];
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    saveConfigurationMaintenance(maintenancesNew: ConfigurationModel[], maintenancesDelete: ConfigurationModel[]) {
        let sqlDB = '';
        const listLoadTable: string[] = [ConstantsTable.TABLE_MTM_CONFIGURATION];
        if (maintenancesNew && maintenancesNew.length > 0) {
            maintenancesNew.forEach(x => {
                sqlDB += this.sqlService.insertSqlConfigurationMaintenance(x);
            });
        }
        if (maintenancesDelete && maintenancesDelete.length > 0) {
            maintenancesDelete.forEach(x => {
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIG_MAINT,
                    ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE, x.listMaintenance.map(y => y.id),
                    ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION, [x.id]);
            });
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    deleteConfigManintenance(idConfiguration: number, idMaintenance: number) {
        const sqlDB: string = this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIG_MAINT,
            ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION, [idConfiguration],
            ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE, [idMaintenance]);
        return this.dbService.executeScriptDataBase(sqlDB, [ConstantsTable.TABLE_MTM_CONFIGURATION]);
    }

    getSqlDeleteConfiguration(configuration: ConfigurationModel, vehicles: VehicleModel[]): string {
        let sqlDB = '';
        if (!!configuration.listMaintenance && configuration.listMaintenance.length > 0) {
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIG_MAINT,
                    ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION,
                    [configuration.id]); // DELETE CONFIGURATION_MAINTENANCE
        }
        if (!!vehicles && vehicles.length > 0) {
            sqlDB += this.sqlService.updateSqlVehicle(vehicles); // UPDATE VEHICLE WITH OTHER CONFIGURATIONS
        }
        sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIGURATION,
            ConstantsColumns.COLUMN_MTM_ID, [configuration.id]); // DELETE CONFIGURATION
        return sqlDB;
    }

    /** MAINTENANCE */
    saveMaintenance(maintenance: MaintenanceModel, action: ActionDBEnum, configurations: ConfigurationModel[] = []) {
        let listActions: ISaveBehaviourModel[] = [];
        let listTablesToRefresh: string[] = [];
        switch(action) {
            case ActionDBEnum.CREATE:
                listActions = [
                    { action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE, data: [maintenance]},
                    { action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, data: this.mapService.saveMapMaintenanceElementRel(maintenance)}
                ];
                break;
            case ActionDBEnum.UPDATE:
                listActions = [
                    { action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE, data: [maintenance]},
                    { action: ActionDBEnum.DELETE, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, data: [maintenance.id], prop: ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE},
                    { action: ActionDBEnum.CREATE, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, data: this.mapService.saveMapMaintenanceElementRel(maintenance)}
                ];
                break;
            case ActionDBEnum.DELETE:
                listActions = [
                    { action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, data: [maintenance.id], prop: ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE},
                    { action: action, table: ConstantsTable.TABLE_MTM_CONFIG_MAINT, data: [maintenance.id], prop: ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE},
                    { action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE, data: [maintenance.id]}
                ];
                listTablesToRefresh = [ConstantsTable.TABLE_MTM_CONFIG_MAINT];
                break;
        }

        listTablesToRefresh.push(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL);
        listTablesToRefresh.push(ConstantsTable.TABLE_MTM_MAINTENANCE);
        
        
        return this.dbService.saveDataStorage(listActions, listTablesToRefresh);
        
        
        
        let sqlDB = '';
        let listLoadTable: string[] = [ConstantsTable.TABLE_MTM_MAINTENANCE];
        switch (action) {
            case ActionDBEnum.CREATE:
                sqlDB = this.sqlService.insertSqlMaintenance([maintenance]);
                sqlDB += this.sqlService.insertSqlMaintenanceElementRel(maintenance);
                break;
            case ActionDBEnum.UPDATE:
                sqlDB = this.sqlService.updateSqlMaintenance([maintenance]);
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL,
                    ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE, [maintenance.id]);
                sqlDB += this.sqlService.insertSqlMaintenanceElementRel(maintenance);
                break;
            case ActionDBEnum.DELETE:
                sqlDB = this.getSqlDeleteMaintenance(maintenance, configurations);
                listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_CONFIG_MAINT];
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    getSqlDeleteMaintenance(maintenance: MaintenanceModel, configurations: ConfigurationModel[]): string {
        let sqlDB = '';
        if (!!maintenance.listMaintenanceElement && maintenance.listMaintenanceElement.length > 0) {
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL, // DELETE MAINTENANCE_ELEMENT_REL
                    ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_REL_MAINTENANCE, [maintenance.id]);
        }
        if (!!configurations && configurations.length > 0) {
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIG_MAINT, // DELETE CONFIG MAINTENANCE
                ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE, [maintenance.id]);
        }
        sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MAINTENANCE,
            ConstantsColumns.COLUMN_MTM_ID, [maintenance.id]);
        return sqlDB;
    }

    /** MAINTENANCE ELEMENT / REPLACEMENT */
    saveMaintenanceElement(replacement: MaintenanceElementModel, action: ActionDBEnum, operations: OperationModel[] = []) {
        let listActions: ISaveBehaviourModel[] = [{ action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT, data: [replacement]}];
        let listTablesToRefresh: string[] = [];
        if(ActionDBEnum.DELETE === action) {
            listActions = [{ action: action, table: ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT, data: [replacement.id]}];
            if (!!operations && operations.length > 0) {
                listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT, data: [replacement.id], prop: ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_MAINTENANCE_ELEMENT});
                listTablesToRefresh = [ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT];
            }
        }

        listTablesToRefresh.push(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT);

        return this.dbService.saveDataStorage(listActions, listTablesToRefresh);
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
