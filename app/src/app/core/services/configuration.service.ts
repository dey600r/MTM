import { Injectable } from '@angular/core';

// UTILS
import { MaintenanceElementModel, ConfigurationModel, MotoModel, MaintenanceModel } from '@models/index';
import { ConstantsColumns, ActionDB, ConstantsTable } from '@utils/index';
import { CommonService } from './common.service';
import { DataBaseService } from './data-base.service';
import { SqlService } from './sql.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    constructor(private commonService: CommonService,
                private dbService: DataBaseService,
                private sqlService: SqlService) {
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
    saveConfiguration(configuration: ConfigurationModel, action: ActionDB, motos: MotoModel[] = []) {
        let sqlDB = '';
        let listLoadTable: string[] = [ConstantsTable.TABLE_MTM_CONFIGURATION];
        switch (action) {
            case ActionDB.create:
                sqlDB = this.sqlService.insertSqlConfiguration([configuration]);
                sqlDB += this.sqlService.insertSqlConfigurationMaintenance(configuration);
                break;
            case ActionDB.update:
                sqlDB = this.sqlService.updateSqlConfiguration([configuration]);
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIG_MAINT,
                    ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION, [configuration.id]);
                sqlDB += this.sqlService.insertSqlConfigurationMaintenance(configuration);
                break;
            case ActionDB.delete:
                sqlDB = this.getSqlDeleteConfiguration(configuration, motos);
                listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_MOTO];
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    getSqlDeleteConfiguration(configuration: ConfigurationModel, motos: MotoModel[]): string {
        let sqlDB = '';
        if (!!configuration.listMaintenance && configuration.listMaintenance.length > 0) {
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIG_MAINT,
                    ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_CONFIGURATION,
                    configuration.listMaintenance.map(x => x.id)); // DELETE CONFIGURATION_MAINTENANCE
        }
        if (!!motos && motos.length > 0) {
            sqlDB += this.sqlService.updateSqlMoto(motos); // UPDATE MOTO WITH OTHER CONFIGURATIONS
        }
        sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIGURATION,
            ConstantsColumns.COLUMN_MTM_ID, [configuration.id]); // DELETE CONFIGURATION
        return sqlDB;
    }

    /** MAINTENANCE */
    saveMaintenance(maintenance: MaintenanceModel, action: ActionDB) {
        let sqlDB = '';
        const listLoadTable: string[] = [ConstantsTable.TABLE_MTM_MAINTENANCE];
        switch (action) {
            case ActionDB.create:
                sqlDB = this.sqlService.insertSqlMaintenance([maintenance]);
                break;
            case ActionDB.update:
                // sqlDB = this.sqlService.updateSqlMaintenanceElement([replacement]);
                break;
            case ActionDB.delete:
                sqlDB = this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MAINTENANCE,
                    ConstantsColumns.COLUMN_MTM_ID, [maintenance.id]);
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    /** MAINTENANCE ELEMENT / REPLACEMENT */
    saveMaintenanceElement(replacement: MaintenanceElementModel, action: ActionDB) {
        let sqlDB = '';
        const listLoadTable: string[] = [ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT];
        switch (action) {
            case ActionDB.create:
                sqlDB = this.sqlService.insertSqlMaintenanceElement([replacement]);
                break;
            case ActionDB.update:
                sqlDB = this.sqlService.updateSqlMaintenanceElement([replacement]);
                break;
            case ActionDB.delete:
                sqlDB = this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
                    ConstantsColumns.COLUMN_MTM_ID, [replacement.id]);
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

}
