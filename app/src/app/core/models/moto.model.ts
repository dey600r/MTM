import { BaseModel } from './common.model';
import { ConfigurationModel } from './configuration.model';

export class MotoModel extends BaseModel {
    model: string;
    brand: string;
    year: number;
    km: number;
    configuration: ConfigurationModel;
    constructor(m: string = '', b: string = '', y: number, k: number, c: ConfigurationModel = new ConfigurationModel(),
                id: number = 1) {
        super(id);
        this.model = m;
        this.brand = b;
        this.year = y;
        this.km = k;
        this.configuration = c;
    }
}
