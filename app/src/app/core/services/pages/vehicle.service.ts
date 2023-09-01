import { Injectable } from '@angular/core';

// MODELS
import { VehicleModel, OperationModel, ISaveBehaviourModel } from '@models/index';

// SERVICES
import { DataBaseService } from '../common/index';

// UTILS
import { ConstantsTable, ConstantsColumns, ActionDBEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    constructor(private dbService: DataBaseService) {
    }

    saveVehicle(vehicles: VehicleModel[], action: ActionDBEnum, operations: OperationModel[] = []) {
        let listActions: ISaveBehaviourModel[] = [];
        if (action === ActionDBEnum.DELETE && !!operations && operations.length > 0) {
            listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT, data: operations, prop: [ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION]});
            listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_OPERATION, data: [ { id : operations[0].vehicle.id }], prop: [ConstantsColumns.COLUMN_MTM_OPERATION_VEHICLE]});
        }
        
        listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_VEHICLE, data: vehicles});

        return this.dbService.saveDataStorage(listActions);
    }
}
