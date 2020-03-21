import { Injectable } from '@angular/core';
import { OperationModel, OperationTypeModel, MotoModel } from '@models/index';
import { SqlService } from './sql.service';
import { DataBaseService } from './data-base.service';
import { ConstantsTable, ConstantsColumns, ActionDB } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class OperationService {

    constructor(private dbService: DataBaseService,
                private sqlService: SqlService) {
    }

    saveOperation(op: OperationModel, action: ActionDB) {
        let sqlDB: string;
        let dataDB: any[];
        switch (action) {
            case ActionDB.create:
                sqlDB = this.sqlService.insertSqlMoto();
                //dataDB = [moto.model, moto.brand, moto.year, moto.km, moto.configuration.id, moto.kmsPerMonth, moto.dateKms];
                break;
            case ActionDB.update:
                sqlDB = this.sqlService.updateSqlMoto();
                //dataDB = [moto.model, moto.brand, moto.year, moto.km, moto.configuration.id, moto.kmsPerMonth, moto.dateKms, moto.id];
                break;
            case ActionDB.delete:
                sqlDB = this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OPERATION, ConstantsColumns.COLUMN_MTM_ID);
                dataDB = [op.id];
                break;
        }
        return this.dbService.executeSqlDataBase(sqlDB, dataDB);
    }
}
