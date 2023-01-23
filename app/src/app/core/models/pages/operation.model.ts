import { BaseDescriptionModel } from '../common/index';
import { OperationTypeModel } from './operation-type.model';
import { VehicleModel } from './vehicle.model';
import { MaintenanceElementModel } from './maintenance-element.model';

export class OperationModel extends BaseDescriptionModel {
    details: string;
    operationType: OperationTypeModel;
    vehicle: VehicleModel;
    km: number;
    date: Date;
    location: string;
    owner: string;
    price: number;
    document: string;
    listMaintenanceElement: MaintenanceElementModel[];
    constructor(data: Partial<OperationModel> = {}) {
        super(data.description, data.id);
        this.details = (data.details ? data.details : null);
        this.operationType = (data.operationType ? data.operationType : new OperationTypeModel());
        this.vehicle = (data.vehicle ? data.vehicle : new VehicleModel());
        this.km = (data.km !== undefined ? data.km : null);
        this.date = (data.date ? data.date : new Date());
        this.location = (data.location ? data.location : null);
        this.owner = (data.owner ? data.owner : null);
        this.price = (data.price !== undefined ? data.price : null);
        this.document = (data.document ? data.document : null);
        this.listMaintenanceElement = (data.listMaintenanceElement ? data.listMaintenanceElement : []);
    }
}
