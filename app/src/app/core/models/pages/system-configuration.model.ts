import { BaseModel } from '../common/index';

export class SystemConfigurationModel extends BaseModel {
    key: string;
    value: string;
    updated: Date;
    constructor(k: string = '', v: string = '', u: Date = new Date(), id: number = 1) {
        super(id);
        this.key = k;
        this.value = v;
        this.updated = u;
    }
}
