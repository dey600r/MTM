import { ModalHeaderOutputEnum, ModalOutputEnum, ModalTypeEnum, PageEnum, WarningWearEnum } from '@utils/index';

export class BaseModel {
    id: number;
    constructor(id: number = 1) {
        this.id = id;
    }
}

export class ModalInputModel<T = any, R = any> {
    type: ModalTypeEnum;
    data: T;
    dataList: R[];
    parentPage: PageEnum;
    constructor(data: Partial<ModalInputModel<T, R>> = {}) {
        this.type = (data.type ?? ModalTypeEnum.CREATE);
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
    descriptionKey: string;
    constructor(d: string = null, id: number = 1) {
        super(id);
        this.description = d;
    }
}

export class BaseNameDescriptionModel extends BaseDescriptionModel {
    name: string;
    nameKey: string;
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
    constructor(data: Partial<BaseMaintenanceModel> = {}) {
        super(data.description, data.id);
        this.km = (data.km !== undefined ? data.km : null);
        this.time = (data.time !== undefined ? data.time : null);
        this.init = (data.init !== undefined ? data.init : false);
        this.wear = (data.wear !== undefined ? data.wear : false);
        this.fromKm = (data.fromKm !== undefined ? data.fromKm : 0);
        this.toKm = (data.toKm !== undefined ? data.toKm : null);
    }
}

export class ModalHeaderSegmentInputModel {
    id: number;
    name: string;
    icon: string;
    selected: boolean;
    constructor(id: number, name: string, icon: string, selected: boolean) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.selected = selected;
    }
}

export class ModalHeaderInputModel {
    title: string;
    iconButton: string;
    dataSegment: ModalHeaderSegmentInputModel[];
    constructor(data: Partial<ModalHeaderInputModel> = {}) {
        this.title = (data.title ?? '');
        this.iconButton = (data.iconButton ?? '');
        this.dataSegment = (data.dataSegment ?? []);
    }
}

export class ModalHeaderOutputModel {
    type: ModalHeaderOutputEnum;
    data: any;
    constructor(t: ModalHeaderOutputEnum, event: any = null) {
        this.type = t;
        this.data = event;
    }
}