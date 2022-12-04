import { Injectable } from '@angular/core';

// UTILS
import { ConstantsTable, ConstantsColumns, ActionDBEnum } from '@utils/index';

// MODELS
import { OperationModel } from '@models/index';

// SERVICES
import { SqlService, DataBaseService } from '../common/index';

@Injectable({
    providedIn: 'root'
})
export class OperationService {

    constructor(private dbService: DataBaseService,
                private sqlService: SqlService) {
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

    getSqlDeleteVehicleOperation(operations: OperationModel[] = []): string {
        let sqlDB = '';
        if (!!operations && operations.length > 0) {
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT,
                ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION, operations.map(x => x.id)); // DELETE OP_MAINT_ELEMENT
            sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_OPERATION,
                ConstantsColumns.COLUMN_MTM_OPERATION_VEHICLE, [operations[0].vehicle.id]); // DELETE OPERATION
        }
        return sqlDB;
    }
}
