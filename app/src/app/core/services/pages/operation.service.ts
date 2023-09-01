import { Injectable } from '@angular/core';

// UTILS
import { ConstantsTable, ConstantsColumns, ActionDBEnum } from '@utils/index';

// MODELS
import { ISaveBehaviourModel, OperationModel } from '@models/index';

// SERVICES
import { DataBaseService, DataService, MapService } from '../common/index';

@Injectable({
    providedIn: 'root'
})
export class OperationService {

    constructor(private dbService: DataBaseService,
                private mapService: MapService,
                private dataService: DataService) {
    }

    // SAVE OPERATION

    saveOperation(op: OperationModel, action: ActionDBEnum) {
        let listActions: ISaveBehaviourModel[] = [];
        switch(action) {
            case ActionDBEnum.CREATE:
                if(!!op.listMaintenanceElement && op.listMaintenanceElement.length > 0) {
                    op.id = this.dbService.getLastId(this.dataService.getOperationsData());
                    listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT, data: this.mapService.saveMapOpMaintenanceRel(op)});
                }
                break;
            case ActionDBEnum.UPDATE:
                listActions = [
                    { action: ActionDBEnum.DELETE, table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT, data: [op], prop: [ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION]},
                    { action: ActionDBEnum.CREATE, table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT, data: this.mapService.saveMapOpMaintenanceRel(op)}
                ];
                break;
            case ActionDBEnum.DELETE:
                if (!!op.listMaintenanceElement && op.listMaintenanceElement.length > 0) {
                    listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT, data: [op], prop: [ConstantsColumns.COLUMN_MTM_OP_MAINTENANCE_ELEMENT_OPERATION]});
                }
                break;
            }
            
        listActions.push({ action: action, table: ConstantsTable.TABLE_MTM_OPERATION, data: [op]});
        
        return this.dbService.saveDataStorage(listActions);
    }

}
