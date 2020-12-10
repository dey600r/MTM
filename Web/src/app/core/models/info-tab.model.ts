import { Constants } from '../utils/constants';
import { InfoBaseModel } from './info-base.model';

export class InfoTabModel extends InfoBaseModel {
    type: string;
    icon: string;
    constructor(t: string = '', tp: string = Constants.TYPE_APP_ANDROID, i: string = '') {
        super(t);
        this.type = tp;
        this.icon = i;
    }
}
