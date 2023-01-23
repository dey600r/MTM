import { MaintenanceElementModel, OperationTypeModel, SearchDashboardModel, VehicleModel } from "@models/index";
import { FilterKmTimeEnum, FilterMonthsEnum } from "@utils/index";

describe('SearchDashboardModels', () => {

    it('should initialize search dashboard model', () => {
        let base: SearchDashboardModel = new SearchDashboardModel();
        expect(base.showPerMont).toEqual(FilterMonthsEnum.MONTH);
        expect(base.searchOperationType).toEqual([]);
        expect(base.searchMaintenanceElement).toEqual([]);
        expect(base.searchVehicle).toEqual([]);
        expect(base.showAxis).toEqual(true);
        expect(base.showLegend).toEqual(false);
        expect(base.showAxisLabel).toEqual(false);
        expect(base.showDataLabel).toEqual(false);
        expect(base.doghnut).toEqual(false);
        expect(base.showMyData).toEqual(true);
        expect(base.filterKmTime).toEqual(FilterKmTimeEnum.KM);
        expect(base.searchText).toEqual('');
        expect(base.expensePerKm).toEqual(false);
        expect(base.showStrict).toEqual(true);
        base = new SearchDashboardModel({
            showPerMont: FilterMonthsEnum.YEAR,
            searchOperationType: [new OperationTypeModel('code')],
            searchMaintenanceElement: [new MaintenanceElementModel({ name: 'name' })],
            searchVehicle: [new VehicleModel({ model: 'model' })],
            showAxis: false,
            showLegend: true,
            showAxisLabel: true,
            showDataLabel: true,
            doghnut: true,
            showMyData: false,
            filterKmTime: FilterKmTimeEnum.TIME,
            searchText: 'david',
            expensePerKm: true,
            showStrict: false
        });
        expect(base.showPerMont).toEqual(FilterMonthsEnum.YEAR);
        expect(base.searchOperationType[0].code).toEqual('code');
        expect(base.searchMaintenanceElement[0].name).toEqual('name');
        expect(base.searchVehicle[0].model).toEqual('model');
        expect(base.showAxis).toEqual(false);
        expect(base.showLegend).toEqual(true);
        expect(base.showAxisLabel).toEqual(true);
        expect(base.showDataLabel).toEqual(true);
        expect(base.doghnut).toEqual(true);
        expect(base.showMyData).toEqual(false);
        expect(base.filterKmTime).toEqual(FilterKmTimeEnum.TIME);
        expect(base.searchText).toEqual('david');
        expect(base.expensePerKm).toEqual(true);
        expect(base.showStrict).toEqual(false);
    });

});