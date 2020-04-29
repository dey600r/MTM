import { FilterMonthsEnum, FilterKmTimeEnum } from '@utils/index';
import { MaintenanceElementModel } from './maintenance-element.model';
import { MotoModel } from './moto.model';
import { OperationTypeModel } from './operation-type.model';

export class SearchDashboardModel {
    showPerMont: FilterMonthsEnum;
    searchMoto: MotoModel = new MotoModel();
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
    constructor(month: FilterMonthsEnum = FilterMonthsEnum.MONTH, st: string = '', sm: MotoModel = new MotoModel(),
                sot: OperationTypeModel[] = [], sme: MaintenanceElementModel[] = [], axis: boolean = true,
                legend: boolean = false, axisLabel: boolean = false, dataLabel: boolean = false,
                dog: boolean = false, myData: boolean = true, kmTime: FilterKmTimeEnum = FilterKmTimeEnum.KM) {
        this.showPerMont = month;
        this.searchText = st;
        this.searchMoto = sm;
        this.searchOperationType = sot;
        this.searchMaintenanceElement = sme;
        this.showAxis = axis;
        this.showLegend = legend;
        this.showAxisLabel = axisLabel;
        this.showDataLabel = dataLabel;
        this.doghnut = dog;
        this.showMyData = myData;
        this.filterKmTime = kmTime;
    }
}
