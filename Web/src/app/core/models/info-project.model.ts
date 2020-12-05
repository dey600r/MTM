import { InfoBaseModel } from './info-base.model';
import { InfoDeveloperModel } from './info-developer.model';

export class InfoProjectModel extends InfoBaseModel {
    infoDeveloper: InfoDeveloperModel;
    constructor(t: string = '', infoD: InfoDeveloperModel = new InfoDeveloperModel()) {
        super(t);
        this.infoDeveloper = infoD;
    }
}
