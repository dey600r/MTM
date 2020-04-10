import { PageEnum } from '@utils/index';

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
    parentPage: PageEnum;
    action: string;
    constructor(create: boolean = true, d: any = null, dl: any[] = [], parentPage: PageEnum = PageEnum.HOME,
                act: string = '') {
        this.isCreate = create;
        this.data = d;
        this.dataList = dl;
        this.parentPage = parentPage;
        this.action = act;
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
