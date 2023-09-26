import { DashboardModel } from "@models/index";

describe('DashboardModels', () => {

    it('should initialize dashboard model', () => {
        let base: DashboardModel<number> = new DashboardModel();
        expect(base.view).toEqual([]);
        expect(base.data).toEqual([]);
        expect(base.showXAxis).toEqual(true);
        expect(base.showYAxis).toEqual(true);
        expect(base.gradient).toEqual(true);
        expect(base.showLegend).toEqual(false);
        expect(base.showXAxisLabel).toEqual(false);
        expect(base.xAxisLabel).toEqual('');
        expect(base.showYAxisLabel).toEqual(false);
        expect(base.yAxisLabel).toEqual('');
        expect(base.legendTitle).toEqual('');
        expect(base.colorScheme).toEqual(base.getColorSchemeDefault());
        expect(base.showLabels).toEqual(true);
        expect(base.isDoughnut).toEqual(false);
        expect(base.legendPosition).toEqual('');
        expect(base.showDataLabel).toEqual(false);
        expect(base.barPadding).toEqual(2);
        expect(base.groupPadding).toEqual(4);
        base = new DashboardModel<number>({
            view: [1, 2, 3],
            data: [4, 5, 6],
            colorScheme: ['david'],
            showXAxis: false,
            showYAxis: false,
            gradient: false,
            showLegend: true,
            legendTitle: 'title',
            showXAxisLabel: true,
            xAxisLabel: 'x',
            showYAxisLabel: true,
            yAxisLabel: 'y',
            showLabels: false,
            isDoughnut: true,
            legendPosition: 'top',
            showDataLabel: true,
            barPadding: 7,
            groupPadding: 9
        });
        expect(base.view).toEqual([1, 2, 3]);
        expect(base.data).toEqual([4, 5, 6]);
        expect(base.showXAxis).toEqual(false);
        expect(base.showYAxis).toEqual(false);
        expect(base.gradient).toEqual(false);
        expect(base.showLegend).toEqual(true);
        expect(base.showXAxisLabel).toEqual(true);
        expect(base.xAxisLabel).toEqual('x');
        expect(base.showYAxisLabel).toEqual(true);
        expect(base.yAxisLabel).toEqual('y');
        expect(base.legendTitle).toEqual('title');
        expect(base.colorScheme).toEqual(base.mapColorScheme(['david']));
        expect(base.showLabels).toEqual(false);
        expect(base.isDoughnut).toEqual(true);
        expect(base.legendPosition).toEqual('top');
        expect(base.showDataLabel).toEqual(true);
        expect(base.barPadding).toEqual(7);
        expect(base.groupPadding).toEqual(9);
    });
});