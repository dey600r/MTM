import { InfoButtonEnum, PageEnum } from "./enums";

export interface ISqlitePorterModel {
    structure: any;
    data: any;
}

export interface IInfoModel {
    text: string;
    icon: string;
    info: InfoButtonEnum;
}

export interface ISearcherControlModel {
    controls: IDisplaySearcherControlModel;
    observers: IObserverSearcherControlModel;
}

export interface IDisplaySearcherControlModel {
    showFilterKmTime: PageEnum[];
    showSearchText: PageEnum[];
    showFilterOpType: PageEnum[];
    showFilterVehicle: PageEnum[];
    showFilterMaintElement: PageEnum[];
    showFilterMonth: PageEnum[];
    showStrict: PageEnum[];
    showExpensePerKm: PageEnum[];
    showAxis: PageEnum[];
    showLegend: PageEnum[];
    showAxisLabel: PageEnum[];
    showDataLabel: PageEnum[];
    showDoghnut: PageEnum[];
    showMyData: PageEnum[];
}

export interface IObserverSearcherControlModel {
    filterOperationGrouper: string[];
    filterConfigurationGrouper: string[];
    filterDashboardGrouper: string[];
    filterDashboardRecordsGrouper: string[];
}

export interface IDashboardModel {
    id: number;
    name: string;
    value: any;
}

export interface IDashboardSerieModel {
    id: number;
    name: string;
    series: any[];
}

export interface IDashboardColorModel {
    domain: any[];
}

export interface ISettingModel {
    code: string;
    value: string;
    valueLarge: string;
}