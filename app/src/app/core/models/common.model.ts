import { ModalOutputEnum, PageEnum } from '@utils/index';

export class BaseModel {
    id: number;
    constructor(id: number = 1) {
        this.id = id;
    }
}

export class ModalInputModel<T = any, R = any> {
    isCreate: boolean;
    data: any;
    dataList: any[];
    parentPage: PageEnum;
    action: string;
    constructor(create: boolean = true, d: T = null, dl: R[] = [], parentPage: PageEnum = PageEnum.HOME,
                act: string = '') {
        this.isCreate = create;
        this.data = d;
        this.dataList = dl;
        this.parentPage = parentPage;
        this.action = act;
    }
}

export class ModalOutputModel<T = any, R = any> {
    action: ModalOutputEnum;
    data: T;
    dataList: R[];
    constructor(a: ModalOutputEnum = ModalOutputEnum.SAVE, d: T = null, dl: R[] = []) {
        this.action = a;
        this.data = d;
        this.dataList = dl;
    }
}
