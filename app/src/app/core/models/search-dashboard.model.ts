import { FilterGroupMotoOpTypeReplacementEnum } from '@utils/index';

export class SearchDashboardModel {
    filterGrouper: FilterGroupMotoOpTypeReplacementEnum;
    constructor(f: FilterGroupMotoOpTypeReplacementEnum = FilterGroupMotoOpTypeReplacementEnum.MOTO) {
        this.filterGrouper = f;
    }
}
