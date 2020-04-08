import { BaseModel } from './common.model';
import { ConfigurationModel } from './configuration.model';

export class MotoModel extends BaseModel {
    model: string;
    brand: string;
    year: number;
    km: number;
    configuration: ConfigurationModel;
    kmsPerMonth: number;
    dateKms: Date;
    datePurchase: Date;
    constructor(m: string = null, b: string = null, y: number = null, k: number = null,
                c: ConfigurationModel = new ConfigurationModel(), kpm: number = null, dk: Date = new Date(),
                dP: Date = new Date(), id: number = 1) {
        super(id);
        this.model = m;
        this.brand = b;
        this.year = y;
        this.km = k;
        this.configuration = c;
        this.kmsPerMonth = kpm;
        this.dateKms = dk;
        this.datePurchase = dP;
    }
}
