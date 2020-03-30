export enum FilterGroupMotoOpTypeReplacement {
    MOTO = 'M',
    OPERATION_TYPE = 'O'
}

export class SearchDashboardModel {
    filterGrouper: FilterGroupMotoOpTypeReplacement;
    constructor(f: FilterGroupMotoOpTypeReplacement = FilterGroupMotoOpTypeReplacement.MOTO) {
        this.filterGrouper = f;
    }
}
