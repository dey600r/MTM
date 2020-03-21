import { BaseModel } from './common.model';
import { OperationTypeModel } from './operation-type.model';
import { MotoModel } from './moto.model';

export class OperationModel extends BaseModel {
    description: string;
    details: string;
    operationType: OperationTypeModel;
    moto: MotoModel;
    km: number;
    date: Date;
    location: string;
    owner: string;
    price: number;
    document: string;
    constructor(desc: string = null, det: string = null, opt: OperationTypeModel = new OperationTypeModel(),
                m: MotoModel = new MotoModel(), k: number = null, d: Date = new Date(), l: string = null,
                o: string = null, p: number = null, doc: string = null, id: number = 1) {
        super(id);
        this.description = desc;
        this.details = det;
        this.operationType = opt;
        this.moto = m;
        this.km = k;
        this.date = d;
        this.location = l;
        this.owner = o;
        this.price = p;
        this.document = doc;
    }
}