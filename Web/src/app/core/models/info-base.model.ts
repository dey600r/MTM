export class InfoBaseModel {
    title: string;
    constructor(t: string) {
        this.title = t;
    }
}

export class InfoBaseDescModel extends InfoBaseModel {
    description: string;
    constructor(t: string, d: string ) {
        super(t);
        this.description = d;
    }
}
