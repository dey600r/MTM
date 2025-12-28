import { Color } from "@swimlane/ngx-charts";
import { FailurePredictionTypeEnum, InfoButtonEnum, PageEnum } from "@utils/enums";

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

export interface IDashboardRatioModel {
    id: number;
    name: string;
    x: number;
    y: number;
    r: number;
}

export interface IDashboardSerieModel {
    id: number;
    name: string;
    series: any[];
}

export interface IDashboardColorModel extends Color {
}

export interface ISettingModel {
    code: string;
    value: string;
    valueLarge: string;
}

export interface ICalendarColorMode {
    iterator: number;
    color: string;
}

export interface IReplaclementEventFailurePrediction {
    idReplacement: number;
    nameReplacement: string;
    idVehicle: number;
    brandVehicle: string;
    events: IEventFailurePrediction[];
    modelVehicle: string;
}

export interface IEventFailurePrediction {
    tkm: number;
    ttime: number;
    type: FailurePredictionTypeEnum;
    cost: number;
}

export interface IIWeibullParams {
    beta: number;
    eta: number;
}

export interface IOptimalCostTime {
    Tmin: number;
    Tmax: number;
    optimalT: number;
    optimalCostPerKm: number;
}

export interface IProbabilityTime {
    T: number;
    probability: number;
    cost: number;
}

export interface IOptimalPredictiveMaintenance {
    optimal: IOptimalCostTime;
    dataPredictive: IProbabilityTime[];
}