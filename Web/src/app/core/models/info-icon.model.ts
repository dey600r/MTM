export class InfoIconModel {
    icon: string;
    tooltip: string;
    alt: string;
    href: string;
    constructor(i: string = '', t: string = '', a: string = '', h: string = '') {
        this.icon = i;
        this.tooltip = t;
        this.alt = a;
        this.href = h;
    }
}
