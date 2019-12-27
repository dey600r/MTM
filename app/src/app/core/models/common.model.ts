export class BaseModel {
    id: number;
    constructor(id: number = 1) {
        this.id = id;
    }
}

export class ModalInputModel {
    isCreate: boolean;
    data: any;
    dataList: any[];
    constructor(create: boolean = true, d: any = null, dl: any[] = []) {
        this.isCreate = create;
        this.data = d;
        this.dataList = dl;
    }
}

export class ModalOutputModel {
    data: any;
    dataList: any[];
    constructor(d: any = null, dl: any[] = []) {
        this.data = d;
        this.dataList = dl;
    }
}
