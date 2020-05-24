import { BaseModel } from './common.model';
import { OperationTypeModel } from './operation-type.model';
import { VehicleModel } from './vehicle.model';
import { MaintenanceElementModel } from './maintenance-element.model';

export class OperationModel extends BaseModel {
    description: string;
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
    constructor(desc: string = null, det: string = null, opt: OperationTypeModel = new OperationTypeModel(),
                v: VehicleModel = new VehicleModel(), k: number = null, d: Date = new Date(), l: string = null,
                o: string = null, p: number = null, doc: string = null, id: number = 1,
                listME: MaintenanceElementModel[] = []) {
        super(id);
        this.description = desc;
        this.details = det;
        this.operationType = opt;
        this.vehicle = v;
        this.km = k;
        this.date = d;
        this.location = l;
        this.owner = o;
        this.price = p;
        this.document = doc;
        this.listMaintenanceElement = listME;
    }
}
