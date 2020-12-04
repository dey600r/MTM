import { preserveWhitespacesDefault } from '@angular/compiler';
import { InfoIconModel } from './info-icon.model';

export class InfoDeveloperModel {
    title: string;
    description: string;
    icons: InfoIconModel[];
    constructor(t: string = '', d: string = '', i: InfoIconModel[] = []) {
        this.title = t;
        this.description = d;
        this.icons = i;
    }
}
