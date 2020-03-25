import { Injectable } from '@angular/core';
import { MotoModel, ConfigurationModel, OperationModel } from '@models/index';
import { SqlService } from './sql.service';
import { DataBaseService } from './data-base.service';
import { ConstantsTable, ConstantsColumns, ActionDB } from '@utils/index';
import { OperationService } from './operation.service';

@Injectable({
    providedIn: 'root'
})
export class MotoService {

    constructor(private dbService: DataBaseService,
                private sqlService: SqlService,
                private operationService: OperationService) {
    }

    saveMoto(moto: MotoModel, action: ActionDB, operation: OperationModel[] = []) {
        let sqlDB = '';
        let dataDB: any[] = [];
        let listLoadTable: string[] = [];
        let scriptDB = false;
        switch (action) {
            case ActionDB.create:
                sqlDB = this.sqlService.insertSqlMoto();
                dataDB = [moto.model, moto.brand, moto.year, moto.km, moto.configuration.id, moto.kmsPerMonth, moto.dateKms];
                listLoadTable = [ConstantsTable.TABLE_MTM_MOTO];
                break;
            case ActionDB.update:
                sqlDB = this.sqlService.updateSqlMoto();
                dataDB = [moto.model, moto.brand, moto.year, moto.km, moto.configuration.id, moto.kmsPerMonth, moto.dateKms, moto.id];
                listLoadTable = [ConstantsTable.TABLE_MTM_MOTO];
                break;
            case ActionDB.delete:
                if (!!operation && operation.length > 0) {
                    sqlDB = this.operationService.getSqlDeleteOperation(operation);
                    listLoadTable = this.operationService.getTablesRefreshDeleteOperation();
                }
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MOTO,
                    ConstantsColumns.COLUMN_MTM_ID, 1, [moto.id]); // DELETE MOTO
                listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_MOTO];
                scriptDB = true;
                break;
        }
        return (scriptDB ? this.dbService.executeScriptDataBase(sqlDB, listLoadTable) :
            this.dbService.executeSqlDataBase(sqlDB, dataDB, listLoadTable));
    }
}
