import { ModalOutputEnum, PageEnum, WarningWearEnum } from '@utils/index';

export class BaseModel {
    id: number;
    constructor(id: number = 1) {
        this.id = id;
    }
}

export class ModalInputModel<T = any, R = any> {
    isCreate: boolean;
    data: T;
    dataList: R[];
    parentPage: PageEnum;
    constructor(data: Partial<ModalInputModel<T, R>> = {}) {
        this.isCreate = (data.isCreate !== undefined ? data.isCreate : true);
        this.data = (data.data ? data.data : null);
        this.dataList = (data.dataList ? data.dataList : []);
        this.parentPage = (data.parentPage ? data.parentPage : PageEnum.HOME);
    }
}

export class ModalOutputModel<T = any, R = any> {
    action: ModalOutputEnum;
    data: T;
    dataList: R[];
    constructor(data: Partial<ModalOutputModel<T, R>> = {}) {
        this.action = (data.action ? data.action : ModalOutputEnum.SAVE);
        this.data = (data.data ? data.data : null);
        this.dataList = (data.dataList ? data.dataList : []);
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
