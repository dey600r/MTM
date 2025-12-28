import { ModalOutputEnum, ModalTypeEnum, PageEnum, HeaderOutputEnum, WarningWearEnum } from '@utils/index';

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

export class HeaderSegmentInputModel {
    id: number;
    name: string;
    icon: string;
    selected: boolean;
    progressColor: string;
    progressValue: number;
    constructor(data: Partial<HeaderSegmentInputModel> = {}) {
        this.id = (data.id ?? 1);
        this.name = (data.name ?? '');
        this.icon = (data.icon ?? '');
        this.selected = (data.selected ?? true);
        this.progressColor = (data.progressColor ?? '');
        this.progressValue = (data.progressValue ?? 0);
    }
}

export class HeaderInputModel {
    title: string;
    iconButtonLeft: string;
    iconButtonRight: string;
    dataSegment: HeaderSegmentInputModel[];
    constructor(data: Partial<HeaderInputModel> = {}) {
        this.title = (data.title ?? '');
        this.iconButtonLeft = (data.iconButtonLeft ?? '');
        this.iconButtonRight = (data.iconButtonRight ?? '');
        this.dataSegment = (data.dataSegment ?? []);
    }
}

export class HeaderOutputModel {
    type: HeaderOutputEnum;
    data: any;
    constructor(t: HeaderOutputEnum, event: any = null) {
        this.type = t;
        this.data = event;
    }
}

export class SkeletonInputModel {
    time: number;
    itemsHeader: number[];
    body: BodySkeletonInputModel;
    card: CardSkeletonInputModel;
    constructor(data: Partial<SkeletonInputModel> = {}) {
        this.time = (data.time ?? 0);
        this.itemsHeader = (data.itemsHeader ?? []);
        this.body = (data.body ?? new BodySkeletonInputModel());
        this.card = (data.card ?? new CardSkeletonInputModel());
    }
}

export class CardSkeletonInputModel {
    activated: boolean;
    items: number[];
    sizelg: number;
    sizemd: number;
    sizesm: number;
    sizexs: number;
    constructor(data: Partial<CardSkeletonInputModel> = {}) {
        this.activated = (data.activated ?? false);
        this.items = (data.items ?? []);
        this.sizelg = (data.sizelg ?? 0);
        this.sizemd = (data.sizemd ?? 0);
        this.sizesm = (data.sizesm ?? 0);
        this.sizexs = (data.sizexs ?? 0);
    }
}

export class BodySkeletonInputModel {
    items: number[];
    avatar: boolean;
    itemsLabel: BodySkeletonLabelsInputModel[];
    constructor(data: Partial<BodySkeletonInputModel> = {}) {
        this.items = (data.items ?? []);
        this.avatar = (data.avatar ?? false);
        this.itemsLabel = (data.itemsLabel ?? []);
    }
}

export class BodySkeletonLabelsInputModel {
    h3Width: number = 0;
    h2Width: number = 0;
    pWidth: number[] = []; 
    divWidth: number = 0;
    divPWidth: number[] = [];
    constructor(data: Partial<BodySkeletonLabelsInputModel> = {}) {
        this.h3Width = (data.h3Width ?? 0);
        this.h2Width = (data.h2Width ?? 0);
        this.pWidth = (data.pWidth ?? []);
        this.divWidth = (data.divWidth ?? 0);
        this.divPWidth = (data.divPWidth ?? []);
    }
}