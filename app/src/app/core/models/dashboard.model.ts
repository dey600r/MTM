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
    constructor(v: any[], d: any[], color: any = null,
                x: boolean = true, y: boolean = true, grad: boolean = true, legShow: boolean = false,
                legTitle: string = '', xShow: boolean = false, xLabel: string = '',
                yShow: boolean = false, yLabel: string = '', labelShow: boolean = true, doug: boolean = false,
                legPos: string = '', dataLabel: boolean = false, barPad: number = 2, groupPad: number = 4) {
        this.view = v;
        this.data = d;
        this.colorScheme = (!color ? this.getColorSchemeDefault() : this.mapColorScheme(color));
        this.showXAxis = x;
        this.showYAxis = y;
        this.gradient = grad;
        this.showLegend = legShow;
        this.legendTitle = legTitle;
        this.showXAxisLabel = xShow;
        this.xAxisLabel = xLabel;
        this.showYAxisLabel = yShow;
        this.yAxisLabel = yLabel;
        this.showLabels = labelShow;
        this.isDoughnut = doug;
        this.legendPosition = legPos;
        this.showDataLabel = dataLabel;
        this.barPadding = barPad;
        this.groupPadding = groupPad;
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
