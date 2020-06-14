import { BaseModel } from './common.model';

export class SystemConfigurationModel extends BaseModel {
    key: string;
    value: string;
    updated: Date;
}
