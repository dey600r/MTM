import { Injectable } from '@angular/core';
import { OperationModel, OperationTypeModel, MotoModel, SearchOperationModel, MaintenanceElementModel } from '@models/index';
import { SqlService } from './sql.service';
import { DataBaseService } from './data-base.service';
import { ConstantsTable, ConstantsColumns, ActionDB } from '@utils/index';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OperationService {

    private searchOperation: SearchOperationModel = new SearchOperationModel();
    public behaviourSearchOperation: BehaviorSubject<SearchOperationModel>
        = new BehaviorSubject<SearchOperationModel>(this.searchOperation);

    constructor(private dbService: DataBaseService,
                private sqlService: SqlService) {
    }

    getObserverSearchOperation(): Observable<SearchOperationModel> {
        return this.behaviourSearchOperation.asObservable();
    }

    getSearchOperation(): SearchOperationModel {
        return this.searchOperation;
    }

    setSearchOperation(sm: MotoModel = new MotoModel(), sot: OperationTypeModel[] = [],
                       sme: MaintenanceElementModel[] = []) {
        this.searchOperation = new SearchOperationModel(sm, sot, sme);
        this.behaviourSearchOperation.next(this.searchOperation);
    }

    saveOperation(op: OperationModel, action: ActionDB) {
        let sqlDB: string;
        const dataDB: any[] = [];
        const listLoadTable: string[] = this.getTablesRefreshDeleteOperation();
        let scriptDB = false;
        switch (action) {
            case ActionDB.create:
                sqlDB = this.sqlService.insertSqlMoto();
                // dataDB = [moto.model, moto.brand, moto.year, moto.km, moto.configuration.id, moto.kmsPerMonth, moto.dateKms];
                break;
            case ActionDB.update:
                sqlDB = this.sqlService.updateSqlMoto();
                // dataDB = [moto.model, moto.brand, moto.year, moto.km, moto.configuration.id, moto.kmsPerMonth, moto.dateKms, moto.id];
                break;
            case ActionDB.delete:
                sqlDB = this.getSqlDeleteOperation([op]);
                scriptDB = true;
                break;
        }
        return (scriptDB ? this.dbService.executeScriptDataBase(sqlDB, listLoadTable) :
            this.dbService.executeSqlDataBase(sqlDB, dataDB, listLoadTable));
    }

    getSqlDeleteOperation(operation: OperationModel[] = []): string {
        let sqlDB = '';
        if (!!operation && operation.length > 0) {
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
                ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_ID_OPERATION, operation.length,
                operation.map(x => x.id)); // DELETE OP_MAINT_ELEMENT
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OPERATION,
                ConstantsColumns.COLUMN_MTM_OPERATION_MOTO, 1, [operation[0].moto.id]); // DELETE OPERATION
        }
        return sqlDB;
    }

    getTablesRefreshDeleteOperation() {
        return [ConstantsTable.TABLE_MTM_OPERATION];
    }
}
