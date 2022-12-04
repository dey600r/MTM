import { ModalOutputEnum, PageEnum, WarningWearEnum } from '@utils/index';

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

export class BaseNameModel extends BaseModel {
    name: string;
    constructor(n: string = null,  id: number = 1) {
        super(id);
        this.name = n;
    }
}

export class BaseDescriptionModel extends BaseModel {
    description: string;
    constructor(d: string = null, id: number = 1) {
        super(id);
        this.description = d;
    }
}

export class BaseNameDescriptionModel extends BaseDescriptionModel {
    name: string;
    constructor(n: string = null, d: string = null, id: number = 1) {
        super(d, id);
        this.name = n;
    }
}

export class BaseIconNameDescriptionModel extends BaseNameDescriptionModel {
    icon: string; // Calculated
    constructor(c: string = null, d: string = null, id: number = 1) {
        super(c, d, id);
    }
}

export class BaseCodeDescriptionModel extends BaseDescriptionModel {
    code: string;
    constructor(c: string = null, d: string = null, id: number = 1) {
        super(d, id);
        this.code = c;
    }
}

export class BaseIconCodeDescriptionModel extends BaseCodeDescriptionModel {
    icon: string; // Calculated
    constructor(c: string = null, d: string = null, id: number = 1) {
        super(c, d, id);
    }
}

export class BaseWarningIconModel {
    warning: WarningWearEnum = WarningWearEnum.SUCCESS;
    warningIcon: string = '';
    warningIconClass: string = '';
}

export class BaseMaintenanceModel extends BaseDescriptionModel {
    km: number;
    time: number;
    init: boolean;
    wear: boolean;
    fromKm: number;
    toKm: number;
    constructor(d: string = null, k: number = null, t: number = null, i: boolean = false, w: boolean = false,
                fr: number = 0, to: number = null, id: number = 1) {
        super(d, id);
        this.km = k;
        this.time = t;
        this.init = i;
        this.wear = w;
        this.fromKm = fr;
        this.toKm = to;
    }
}
