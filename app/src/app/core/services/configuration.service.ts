import { Injectable } from '@angular/core';

// LIBRARIES ANGULAR
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { MaintenanceElementModel } from '@models/index';
import { ConstantsColumns, ActionDB, ConstantsTable, Constants } from '@utils/index';
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

    saveMaintenanceElement(replacement: MaintenanceElementModel, action: ActionDB) {
        let sqlDB = '';
        let dataDB: any[] = [];
        const listLoadTable: string[] = [ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT];
        switch (action) {
            case ActionDB.create:
                sqlDB = this.sqlService.insertSqlMaintenanceElement();
                dataDB = [replacement.name, replacement.description, Constants.DATABASE_NO];
                break;
            case ActionDB.update:
                sqlDB = this.sqlService.updateSqlMaintenanceElement();
                dataDB = [replacement.name, replacement.description, Constants.DATABASE_NO, replacement.id];
                break;
            case ActionDB.delete:
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT,
                    ConstantsColumns.COLUMN_MTM_ID, [replacement.id], true);
                dataDB = [replacement.id];
                break;
        }
        return this.dbService.executeSqlDataBase(sqlDB, dataDB, listLoadTable);
    }

}
