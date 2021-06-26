export class ListModalModel {
    titleHeader: string;
    active: boolean;
    listData: ListDataModalModel[];
    constructor(title: string, active: boolean, data: ListDataModalModel[]) {
        this.titleHeader = title;
        this.listData = data;
        this.active = active;
    }
}

export class ListDataModalModel {
    id: number;
    title: string;
    description: string;
    icon: string;
    selected: boolean;
    detail: string;
    disabled: boolean;
    constructor(id: number, title: string, description: string, detail: string, icon: string,
                selected: boolean, disabled: boolean = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.selected = selected;
        this.detail = detail;
        this.disabled = disabled;
    }
}
