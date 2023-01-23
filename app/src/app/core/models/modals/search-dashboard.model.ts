import { FilterMonthsEnum, FilterKmTimeEnum } from '@utils/index';
import { MaintenanceElementModel, OperationTypeModel, VehicleModel } from '../pages/index';

export class SearchDashboardModel {
    showPerMont: FilterMonthsEnum;
    searchOperationType: OperationTypeModel[];
    searchMaintenanceElement: MaintenanceElementModel[];
    searchVehicle: VehicleModel[];
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
    constructor(data: Partial<SearchDashboardModel> = {}) {
        this.showPerMont = (data.showPerMont !== undefined ? data.showPerMont : FilterMonthsEnum.MONTH);
        this.searchText = (data.searchText !== undefined ? data.searchText : '');
        this.searchOperationType = (data.searchOperationType !== undefined ? data.searchOperationType : []);
        this.searchMaintenanceElement = (data.searchMaintenanceElement !== undefined ? data.searchMaintenanceElement : []);
        this.searchVehicle = (data.searchVehicle !== undefined ? data.searchVehicle : []);
        this.showAxis = (data.showAxis !== undefined ? data.showAxis : true);
        this.showLegend = (data.showLegend !== undefined ? data.showLegend : false);
        this.showAxisLabel = (data.showAxisLabel !== undefined ? data.showAxisLabel : false);
        this.showDataLabel = (data.showDataLabel !== undefined ? data.showDataLabel : false);
        this.doghnut = (data.doghnut !== undefined ? data.doghnut : false);
        this.showMyData = (data.showMyData !== undefined ? data.showMyData : true);
        this.filterKmTime = (data.filterKmTime !== undefined ? data.filterKmTime : FilterKmTimeEnum.KM);
        this.expensePerKm = (data.expensePerKm !== undefined ? data.expensePerKm : false);
        this.showStrict = (data.showStrict !== undefined ? data.showStrict : true);
    }
}
