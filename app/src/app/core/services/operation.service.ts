import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

// UTILS
import { OperationModel, OperationTypeModel, MotoModel, SearchOperationModel, MaintenanceElementModel } from '@models/index';
import { SqlService } from './sql.service';
import { DataBaseService } from './data-base.service';
import { ConstantsTable, ConstantsColumns, ActionDBEnum } from '@utils/index';

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

    // SEARCHER OPERATION

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

    // SAVE OPERATION

    saveOperation(op: OperationModel, action: ActionDBEnum) {
        let sqlDB = '';
        const listLoadTable: string[] = [ConstantsTable.TABLE_MTM_OPERATION];
        switch (action) {
            case ActionDBEnum.CREATE:
                sqlDB = this.sqlService.insertSqlOperation([op]);
                sqlDB += this.sqlService.insertSqlOpMaintenanceElement(op);
                break;
            case ActionDBEnum.UPDATE:
                sqlDB = this.sqlService.updateSqlOperation([op]);
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
                    ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION, [op.id]);
                sqlDB += this.sqlService.insertSqlOpMaintenanceElement(op);
                break;
            case ActionDBEnum.DELETE:
                sqlDB = this.getSqlDeleteOperation(op);
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    getSqlDeleteOperation(operation: OperationModel): string {
        let sqlDB = '';
        if (!!operation.listMaintenanceElement && operation.listMaintenanceElement.length > 0) {
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
                    ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION,
                    operation.listMaintenanceElement.map(x => x.id)); // DELETE OP_MAINT_ELEMENT
        }
        sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OPERATION,
            ConstantsColumns.COLUMN_MTM_ID, [operation.id]); // DELETE OPERATION
        return sqlDB;
    }

    getSqlDeleteMotoOperation(operations: OperationModel[] = []): string {
        let sqlDB = '';
        if (!!operations && operations.length > 0) {
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
                ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION, operations.map(x => x.id)); // DELETE OP_MAINT_ELEMENT
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OPERATION,
                ConstantsColumns.COLUMN_MTM_OPERATION_MOTO, [operations[0].moto.id]); // DELETE OPERATION
        }
        return sqlDB;
    }
}
