import { BaseModel } from './common.model';

export class ConfigurationModel extends BaseModel {
    name: string;
    description: string;
    constructor(n: string = '', d: string = '', id: number = 1) {
        super(id);
        this.name = n;
        this.description = d;
    }
}
