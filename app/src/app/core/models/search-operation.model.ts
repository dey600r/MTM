import { MotoModel } from './moto.model';
import { OperationTypeModel } from './operation-type.model';
import { MaintenanceElementModel } from './maintenance-element.model';

export class SearchOperationModel {
    searchMoto: MotoModel = new MotoModel();
    searchOperationType: OperationTypeModel[] = [];
    searchMaintenanceElement: MaintenanceElementModel[] = [];
    constructor(sm: MotoModel = new MotoModel(), sot: OperationTypeModel[] = [], sme: MaintenanceElementModel[] = []) {
        this.searchMoto = sm;
        this.searchOperationType = sot;
        this.searchMaintenanceElement = sme;
    }
}
