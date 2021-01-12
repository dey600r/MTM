export class InfoIconModel {
    icon: string;
    tooltip: string;
    alt: string;
    href: string;
    styleClass: string;
    external: boolean;
    constructor(i: string = '', t: string = '', a: string = '', h: string = '', style: string = '',
                ext: boolean = false) {
        this.icon = i;
        this.tooltip = t;
        this.alt = a;
        this.href = h;
        this.styleClass = style;
        this.external = ext;
    }
}
