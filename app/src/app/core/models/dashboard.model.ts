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
    barPadding: number;
    groupPadding: number;
    constructor(v: any[], d: any[], color: any = null,
                x: boolean = true, y: boolean = true, grad: boolean = true, legShow: boolean = false,
                legTitle: string = '', xShow: boolean = false, xLabel: string = '',
                yShow: boolean = false, yLabel: string = '', labelShow: boolean = true, doug: boolean = false,
                legPos: string = '', barPad: number = 2, groupPad: number = 4) {
        this.view = v;
        this.data = d;
        this.colorScheme = (!color ? this.getColorSchemeDefault() : color);
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
        this.barPadding = barPad;
        this.groupPadding = groupPad;
    }

    getColorSchemeDefault(): any {
        return { domain: ['#1CEAF6', '#1C9BF6', '#1C32F6', '#971CF6', '#D91CF6', '#1CF69F', '#C8F61C', '#F6931C']};
    }
}
