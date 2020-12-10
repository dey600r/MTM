import { InfoBaseDescModel } from './info-base.model';

export class InfoCardModel extends InfoBaseDescModel {
    image: string;
    constructor(t: string = '', d: string = '', i: string = '') {
        super(t, d);
        this.image = i;
    }
}
