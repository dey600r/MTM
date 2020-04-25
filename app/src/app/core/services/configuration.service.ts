import { Injectable } from '@angular/core';

// UTILS
import {
    MaintenanceElementModel, ConfigurationModel, MotoModel, MaintenanceModel, OperationModel
} from '@models/index';
import { ConstantsColumns, ActionDBEnum, ConstantsTable, Constants, PageEnum } from '@utils/index';
import { CommonService } from './common.service';
import { DataBaseService } from './data-base.service';
import { SqlService } from './sql.service';
import { ControlService } from './control.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    private loaded = false;

    constructor(private commonService: CommonService,
                private dbService: DataBaseService,
                private sqlService: SqlService,
                private controlService: ControlService) {
    }

    showLoader() {
        if (!this.loaded) {
            this.controlService.showLoader(PageEnum.CONFIGURATION);
        }
    }

    closeLoader(): boolean {
        if (!this.loaded) {
            this.controlService.closeLoader();
            this.loaded = true;
        }
        return this.loaded;
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
    saveConfiguration(configuration: ConfigurationModel, action: ActionDBEnum, motos: MotoModel[] = []) {
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
                    [configuration.id]); // DELETE CONFIGURATION_MAINTENANCE
        }
        if (!!motos && motos.length > 0) {
            sqlDB += this.sqlService.updateSqlMoto(motos); // UPDATE MOTO WITH OTHER CONFIGURATIONS
        }
        sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIGURATION,
            ConstantsColumns.COLUMN_MTM_ID, [configuration.id]); // DELETE CONFIGURATION
        return sqlDB;
    }

    /** MAINTENANCE */
    saveMaintenance(maintenance: MaintenanceModel, action: ActionDBEnum, configurations: ConfigurationModel[] = []) {
        let sqlDB = '';
        let listLoadTable: string[] = [ConstantsTable.TABLE_MTM_MAINTENANCE];
        switch (action) {
            case ActionDBEnum.CREATE:
                sqlDB = this.sqlService.insertSqlMaintenance([maintenance]);
                break;
            case ActionDBEnum.UPDATE:
                sqlDB = this.sqlService.updateSqlMaintenance([maintenance]);
                break;
            case ActionDBEnum.DELETE:
                if (!!configurations && configurations.length > 0) {
                    sqlDB = this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_CONFIG_MAINT, // DELETE CONFIG MAINTENANCE
                        ConstantsColumns.COLUMN_MTM_CONFIGURATION_MAINTENANCE_MAINTENANCE, [maintenance.id]);
                    listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_CONFIG_MAINT];
                }
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MAINTENANCE,
                    ConstantsColumns.COLUMN_MTM_ID, [maintenance.id]);
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    getIconMaintenance(maintenance: MaintenanceModel): string {
        switch (maintenance.maintenanceFreq.code) {
          case Constants.MAINTENANCE_FREQ_ONCE_CODE:
            return 'alarm';
          case Constants.MAINTENANCE_FREQ_CALENDAR_CODE:
            return 'calendar';
        }
    }

    /** MAINTENANCE ELEMENT / REPLACEMENT */
    saveMaintenanceElement(replacement: MaintenanceElementModel, action: ActionDBEnum, operations: OperationModel[] = []) {
        let sqlDB = '';
        let listLoadTable: string[] = [ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT];
        switch (action) {
            case ActionDBEnum.CREATE:
                sqlDB = this.sqlService.insertSqlMaintenanceElement([replacement]);
                break;
            case ActionDBEnum.UPDATE:
                sqlDB = this.sqlService.updateSqlMaintenanceElement([replacement]);
                break;
            case ActionDBEnum.DELETE:
                if (!!operations && operations.length > 0) {
                    sqlDB = this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
                        ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_MAINTENANCE_ELEMENT, [replacement.id]);
                    listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT];
                }
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
                    ConstantsColumns.COLUMN_MTM_ID, [replacement.id]);
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    getIconReplacement(maintenanceElement: MaintenanceElementModel): string {
        switch (maintenanceElement.id) {
          case 1: case 2: case 22: case 23: case 25: case 28: case 29:
            return 'disc';
          case 4: case 5: case 27:
            return 'basket';
          case 6:
            return 'flash';
          case 9: case 14: case 15:
            return 'thermometer';
          case 3: case 7: case 8: case 12: case 32:
            return 'color-fill';
          case 11: case 13: case 16:
            return 'layers';
          case 18: case 19:
            return 'eyedrop';
          case 10: case 17: case 20: case 21: case 26:
            return 'settings';
          case 24:
            return 'battery-charging';
          case 30: case 31:
            return 'barcode';
          default:
            return this.getRandomIcon(maintenanceElement.id);
        }
    }

    getRandomIcon(rand: number): string {
        const min = 40;
        if (rand <= min) {
            return 'cube';
        } else if (rand > min && rand <= (min + 15)) {
            return 'bulb';
        } else if (rand > (min + 15) && rand <= (min + 25)) {
            return 'bandage';
        } else {
            return 'briefcase';
        }
    }

}
