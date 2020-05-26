import { Injectable } from '@angular/core';
import { VehicleModel, OperationModel } from '@models/index';
import { SqlService } from './sql.service';
import { DataBaseService } from './data-base.service';
import { ConstantsTable, ConstantsColumns, ActionDBEnum, Constants } from '@utils/index';
import { OperationService } from './operation.service';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    constructor(private dbService: DataBaseService,
                private sqlService: SqlService,
                private operationService: OperationService) {
    }

    saveVehicle(vehicle: VehicleModel, action: ActionDBEnum, operations: OperationModel[] = []) {
        let sqlDB = '';
        let listLoadTable: string[] = [ConstantsTable.TABLE_MTM_VEHICLE];
        switch (action) {
            case ActionDBEnum.CREATE:
                sqlDB = this.sqlService.insertSqlVehicle([vehicle]);
                break;
            case ActionDBEnum.UPDATE:
                sqlDB = this.sqlService.updateSqlVehicle([vehicle]);
                listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_OPERATION];
                break;
            case ActionDBEnum.DELETE:
                if (!!operations && operations.length > 0) { // DELETE OPERATION ASSOCIATED
                    sqlDB = this.operationService.getSqlDeleteVehicleOperation(operations);
                    listLoadTable = [...listLoadTable, ConstantsTable.TABLE_MTM_OPERATION];
                }
                sqlDB += this.sqlService.deleteSql(ConstantsTable.TABLE_MTM_VEHICLE,
                    ConstantsColumns.COLUMN_MTM_ID, [vehicle.id]); // DELETE VEHICLE
                break;
        }
        return this.dbService.executeScriptDataBase(sqlDB, listLoadTable);
    }

    // ICONS

    getIconVehicle(vehicle: VehicleModel): string {
        switch (vehicle.vehicleType.code) {
            case Constants.VEHICLE_TYPE_CODE_MOTO:
                return 'bicycle';
            case Constants.VEHICLE_TYPE_CODE_CAR:
                return 'car-sport';
            default:
                return 'car';
        }
    }
}
