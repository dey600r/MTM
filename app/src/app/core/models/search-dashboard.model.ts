import { FilterGroupMotoOpTypeReplacementEnum } from '@utils/index';

export class SearchDashboardModel {
    filterGrouper: FilterGroupMotoOpTypeReplacementEnum;
    showAxis: boolean;
    showLegend: boolean;
    showAxisLabel: boolean;
    showDataLabel: boolean;
    doghnut: boolean;
    constructor(f: FilterGroupMotoOpTypeReplacementEnum = FilterGroupMotoOpTypeReplacementEnum.MOTO,
                axis: boolean = true, legend: boolean = false, axisLabel: boolean = false,
                dataLabel: boolean = false, dog: boolean = false) {
        this.filterGrouper = f;
        this.showAxis = axis;
        this.showLegend = legend;
        this.showAxisLabel = axisLabel;
        this.showDataLabel = dataLabel;
        this.doghnut = dog;
    }
}
