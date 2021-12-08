import { FilterMonthsEnum, FilterKmTimeEnum } from '@utils/index';
import { MaintenanceElementModel } from './maintenance-element.model';
import { OperationTypeModel } from './operation-type.model';

export class SearchDashboardModel {
    showPerMont: FilterMonthsEnum;
    searchOperationType: OperationTypeModel[];
    searchMaintenanceElement: MaintenanceElementModel[] = [];
    showAxis: boolean;
    showLegend: boolean;
    showAxisLabel: boolean;
    showDataLabel: boolean;
    doghnut: boolean;
    showMyData: boolean;
    filterKmTime: FilterKmTimeEnum;
    searchText: string;
    expensePerKm: boolean;
    showStrict: boolean;
    constructor(month: FilterMonthsEnum = FilterMonthsEnum.MONTH, st: string = '',
                sot: OperationTypeModel[] = [], sme: MaintenanceElementModel[] = [], axis: boolean = true,
                legend: boolean = false, axisLabel: boolean = false, dataLabel: boolean = false,
                dog: boolean = false, myData: boolean = true, kmTime: FilterKmTimeEnum = FilterKmTimeEnum.KM,
                epk: boolean = false, strict: boolean = true) {
        this.showPerMont = month;
        this.searchText = st;
        this.searchOperationType = sot;
        this.searchMaintenanceElement = sme;
        this.showAxis = axis;
        this.showLegend = legend;
        this.showAxisLabel = axisLabel;
        this.showDataLabel = dataLabel;
        this.doghnut = dog;
        this.showMyData = myData;
        this.filterKmTime = kmTime;
        this.expensePerKm = epk;
        this.showStrict = strict;
    }
}
