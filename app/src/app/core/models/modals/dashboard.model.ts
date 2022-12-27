export class DashboardModel {
    view: any[];
    data: any[];
    showXAxis: boolean;
    showYAxis: boolean;
    gradient: boolean;
    showLegend: boolean;
    showXAxisLabel: boolean;
    xAxisLabel: string;
    showYAxisLabel: boolean;
    yAxisLabel: string;
    legendTitle: string;
    colorScheme: any[];
    showLabels: boolean;
    isDoughnut: boolean;
    legendPosition: string;
    showDataLabel: boolean;
    barPadding: number;
    groupPadding: number;
    constructor(data: Partial<DashboardModel> = {}) {
        this.setData1(data);
        this.setData2(data);
    }

    private setData1(data: Partial<DashboardModel>) {
        this.view = (data.view ? data.view : []);
        this.data = (data.data ? data.data : []);
        this.colorScheme = (data.colorScheme === undefined || data.colorScheme === null ? this.getColorSchemeDefault() : this.mapColorScheme(data.colorScheme));
        this.showXAxis = (data.showXAxis !== undefined ? data.showXAxis : true);
        this.showYAxis = (data.showYAxis !== undefined ? data.showYAxis : true);
        this.gradient = (data.gradient !== undefined ? data.gradient : true);
        this.showLegend = (data.showLegend !== undefined ? data.showLegend : false);
        this.legendTitle = (data.legendTitle !== undefined ? data.legendTitle : '');
        this.showXAxisLabel = (data.showXAxisLabel !== undefined ? data.showXAxisLabel : false);
    }

    private setData2(data: Partial<DashboardModel>) {
        this.xAxisLabel = (data.xAxisLabel !== undefined ? data.xAxisLabel : '');
        this.showYAxisLabel = (data.showYAxisLabel !== undefined ? data.showYAxisLabel : false);
        this.yAxisLabel = (data.yAxisLabel !== undefined ? data.yAxisLabel : '');
        this.showLabels = (data.showLabels !== undefined ? data.showLabels : true);
        this.isDoughnut = (data.isDoughnut !== undefined ? data.isDoughnut : false);
        this.legendPosition = (data.legendPosition !== undefined ? data.legendPosition : '');
        this.showDataLabel = (data.showDataLabel !== undefined ? data.showDataLabel : false);
        this.barPadding = (data.barPadding !== undefined ? data.barPadding : 2);
        this.groupPadding = (data.groupPadding !== undefined ? data.groupPadding : 4);
    }

    getColorSchemeDefault(): any {
        return this.mapColorScheme([
            'var(--ion-color-chart-first)',
            'var(--ion-color-chart-second)',
            'var(--ion-color-chart-third)',
            'var(--ion-color-chart-fourth)',
            'var(--ion-color-chart-five)',
            'var(--ion-color-chart-sixth)',
            'var(--ion-color-chart-seventh)',
            'var(--ion-color-chart-eight)',
            'var(--ion-color-chart-nine)',
            'var(--ion-color-chart-ten)',
            'var(--ion-color-chart-eleventh)',
            'var(--ion-color-chart-twelve)']);
    }

    mapColorScheme(colors: any[]): any {
        return { domain: colors };
    }
}
