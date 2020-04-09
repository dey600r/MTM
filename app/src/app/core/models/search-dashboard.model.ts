import { FilterMonthsEnum } from '@utils/index';
import { OperationTypeModel } from './operation-type.model';

export class SearchDashboardModel {
    showPerMont: FilterMonthsEnum;
    showOpType: OperationTypeModel[];
    showAxis: boolean;
    showLegend: boolean;
    showAxisLabel: boolean;
    showDataLabel: boolean;
    doghnut: boolean;
    showMyData: boolean;
    constructor(month: FilterMonthsEnum = FilterMonthsEnum.MONTH, ot: OperationTypeModel[] = [],
                axis: boolean = true, legend: boolean = false, axisLabel: boolean = false,
                dataLabel: boolean = false, dog: boolean = false, myData: boolean = true) {
        this.showPerMont = month;
        this.showOpType = ot;
        this.showAxis = axis;
        this.showLegend = legend;
        this.showAxisLabel = axisLabel;
        this.showDataLabel = dataLabel;
        this.doghnut = dog;
        this.showMyData = myData;
    }
}
