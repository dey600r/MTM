import { Injectable } from '@angular/core';
import { MotoModel, OperationModel } from '@models/index';
import { SqlService } from './sql.service';
import { DataBaseService } from './data-base.service';
import { ConstantsTable, ConstantsColumns, ActionDBEnum } from '@utils/index';
import { OperationService } from './operation.service';

@Injectable({
    providedIn: 'root'
})
export class MotoService {

    private loaded = false;

    constructor(private dbService: DataBaseService,
                private sqlService: SqlService,
                private operationService: OperationService) {
    }

    saveMoto(moto: MotoModel, action: ActionDBEnum, operations: OperationModel[] = []) {
        let sqlDB = '';
        let listLoadTable: string[] = [ConstantsTable.TABLE_MTM_MOTO];
        switch (action) {
            case ActionDBEnum.CREATE:
                sqlDB = this.sqlService.insertSqlMoto([moto]);
                break;
            case ActionDBEnum.UPDATE:
                sqlDB = this.sqlService.updateSqlMoto([moto]);
                break;
            case ActionDBEnum.DELETE:
                if (!!operations && operations.length > 0) { // DELETE OPERATION ASSOCIATED
                    sqlDB = this.operationService.getSqlDeleteMotoOperation(operations);
                    listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_OPERATION];
                }
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_MOTO,
                    ConstantsColumns.COLUMN_MTM_ID, [moto.id]); // DELETE MOTO
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }
}
