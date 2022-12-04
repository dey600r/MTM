import { Injectable } from '@angular/core';

// MODELS
import { VehicleModel, OperationModel } from '@models/index';

// SERVICES
import { OperationService } from './operation.service';
import { SqlService, DataBaseService } from '../common/index';

// UTILS
import { ConstantsTable, ConstantsColumns, ActionDBEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    constructor(private dbService: DataBaseService,
                private sqlService: SqlService,
                private operationService: OperationService) {
    }

    saveVehicle(vehicles: VehicleModel[], action: ActionDBEnum, operations: OperationModel[] = []) {
        let sqlDB = '';
        let listLoadTable: string[] = [ConstantsTable.TABLE_MTM_VEHICLE];
        switch (action) {
            case ActionDBEnum.CREATE:
                sqlDB = this.sqlService.insertSqlVehicle(vehicles);
                break;
            case ActionDBEnum.UPDATE:
                sqlDB = this.sqlService.updateSqlVehicle(vehicles);
                listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_OPERATION];
                break;
            case ActionDBEnum.DELETE:
                if (!!operations && operations.length > 0) { // DELETE OPERATION ASSOCIATED
                    sqlDB = this.operationService.getSqlDeleteVehicleOperation(operations);
                    listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_OPERATION];
                }
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_VEHICLE,
                    ConstantsColumns.COLUMN_MTM_ID, vehicles.map(x => x.id)); // DELETE VEHICLE
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

}
