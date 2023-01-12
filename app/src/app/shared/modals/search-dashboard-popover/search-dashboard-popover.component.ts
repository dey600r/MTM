import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';

// MODELS
import { 
    SearchDashboardModel, OperationTypeModel, ModalInputModel, MaintenanceElementModel, VehicleModel
} from '@models/index';

// SERVICES
import { DashboardService, CommonService, DataBaseService, SettingsService, ConfigurationService } from '@services/index';

// UTILS
import { 
    FilterMonthsEnum, ConstantsColumns, PageEnum, ISearcherControlModel, IDisplaySearcherControlModel, ISettingModel
} from '@utils/index';

@Component({
    selector: 'app-search-dashboard-popover',
    templateUrl: 'search-dashboard-popover.component.html',
    styleUrls: []
  })
  export class SearchDashboardPopOverComponent implements OnInit {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();

    // DATA
    config: ISearcherControlModel;
    measure: ISettingModel;
    coin: ISettingModel;
    refresh = true;
    vehicles: VehicleModel[] = [];
    operationTypes: OperationTypeModel[] = [];
    maintenanceElements: MaintenanceElementModel[] = [];
    filterVehicle: number[] = [];
    filterOpType: number[] = [];
    filterMaintElement: number[] = [];
    filterMonth: FilterMonthsEnum = FilterMonthsEnum.MONTH;
    searchDashboard: SearchDashboardModel = this.dashboardService.getSearchDashboard();
    months: any[] = [{
        id:  FilterMonthsEnum.MONTH,
        name: `1 ${this.translator.instant('COMMON.MONTH')}`
    },
    {
        id:  FilterMonthsEnum.QUARTER,
        name: `4 ${this.translator.instant('COMMON.MONTHS')}`
    },
    {
        id:  FilterMonthsEnum.YEAR,
        name: `12 ${this.translator.instant('COMMON.MONTHS')}`
    }];

    // TRANSLATE
    translateAccept = '';
    translateCancel = '';
    translateSelect = '';
    translateExpensePerKM = '';

    // VISIBILITY
    showFilterKmTime = false;
    showSearchText = false;
    showFilterOpType = false;
    showFilterVehicle = false;
    showFilterMaintElement = false;
    showFilterMonth = false;
    showStrict = false;
    showExpensePerKm = false;
    showAxis = false;
    showLegend = false;
    showAxisLabel = false;
    showDataLabel = false;
    showDoghnut = false;
    showMyData = false;

    constructor(private popoverController: PopoverController,
                private navParams: NavParams,
                private dbService: DataBaseService,
                private dashboardService: DashboardService,
                private commonService: CommonService,
                private configurationService: ConfigurationService,
                private translator: TranslateService,
                private settingsService: SettingsService) {
        this.searchDashboard = this.dashboardService.getSearchDashboard();
        this.filterMonth = this.searchDashboard.showPerMont;
        this.translateAccept = this.translator.instant('COMMON.ACCEPT');
        this.translateCancel = this.translator.instant('COMMON.CANCEL');
        this.translateSelect = this.translator.instant('COMMON.SELECT');
    }

    ngOnInit() {
        this.config = this.dashboardService.getConfigSearcher();
        this.modalInputModel = new ModalInputModel(this.navParams.data);

        // FILTER VEHICLES
        this.filterVehicle = [];
        this.vehicles = this.commonService.orderBy(this.dbService.getVehiclesData(), ConstantsColumns.COLUMN_MTM_VEHICLE_BRAND);
        this.searchDashboard.searchVehicle.forEach(x => this.filterVehicle = [...this.filterVehicle, x.id]);

        // FILTER OPERATION TYPE
        this.filterOpType = [];
        this.operationTypes = this.commonService.orderBy(
            this.dbService.getOperationTypeData(), ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION);
        this.searchDashboard.searchOperationType.forEach(x => this.filterOpType = [...this.filterOpType, x.id]);

        // FILTER MAINTENANCE ELEMENT
        this.filterMaintElement = [];
        this.maintenanceElements = this.configurationService.orderMaintenanceElement(this.dbService.getMaintenanceElementData());
        this.searchDashboard.searchMaintenanceElement.forEach(x => this.filterMaintElement = [...this.filterMaintElement, x.id]);

        const settings = this.dbService.getSystemConfigurationData();
        if (!!settings && settings.length > 0) {
            this.measure = this.settingsService.getDistanceSelected(settings);
            this.coin = this.settingsService.getMoneySelected(settings);
            this.translateExpensePerKM = `${this.coin.value}/${this.measure.value}`;
        }

        this.configFilters(this.config.controls, this.modalInputModel.parentPage);
    }

    configFilters(config: IDisplaySearcherControlModel, parentPage: PageEnum) {
        this.showFilterKmTime = config.showFilterKmTime.some(x => x === parentPage);
        this.showSearchText = config.showSearchText.some(x => x === parentPage);
        this.showFilterOpType = config.showFilterOpType.some(x => x === parentPage);
        this.showFilterVehicle = config.showFilterVehicle.some(x => x === parentPage);
        this.showFilterMaintElement = config.showFilterMaintElement.some(x => x === parentPage);
        this.showFilterMonth = config.showFilterMonth.some(x => x === parentPage);
        this.showStrict = config.showStrict.some(x => x === parentPage);
        this.showExpensePerKm = config.showExpensePerKm.some(x => x === parentPage);
        this.showAxis = config.showAxis.some(x => x === parentPage);
        this.showLegend = config.showLegend.some(x => x === parentPage);
        this.showAxisLabel = config.showAxisLabel.some(x => x === parentPage);
        this.showDataLabel = config.showDataLabel.some(x => x === parentPage);
        this.showDoghnut = config.showDoghnut.some(x => x === parentPage);
        this.showMyData = config.showMyData.some(x => x === parentPage);
    }

    onChangeFilterGrouper(property: string = '') {
        if (this.refresh) {
            this.updateFilterGrouper();
            if (property === '' || this.config.observers.filterOperationGrouper.some(y => property === y)) {
                this.onChangeFilterOperationGrouper();
            }
            if (property === '' || this.config.observers.filterDashboardGrouper.some(y => property === y)) {
                this.onChangeFilterDashboardGrouper();
            }
            if (property === '' || this.config.observers.filterDashboardRecordsGrouper.some(y => property === y)) {
                this.onChangeFilterDashboardRecordsGrouper();
            }
            if (property === '' || this.config.observers.filterConfigurationGrouper.some(y => property === y)) {
                this.onChangeFilterConfigurationGrouper();
            }
        }
    }

    private updateFilterGrouper() {
        this.searchDashboard.searchOperationType = this.operationTypes.filter(x => this.filterOpType.some(y => x.id === y));
        this.searchDashboard.searchMaintenanceElement = this.maintenanceElements.filter(x =>
            this.filterMaintElement.some(y => x.id === y));
        this.searchDashboard.searchVehicle = this.vehicles.filter(x => this.filterVehicle.some(y => x.id === y));
        this.searchDashboard.showPerMont = this.filterMonth;
    }

    private onChangeFilterOperationGrouper() {
        this.dashboardService.setSearchOperation(this.searchDashboard.searchOperationType,
                                                this.searchDashboard.searchMaintenanceElement,
                                                this.searchDashboard.searchText);
    }

    private onChangeFilterConfigurationGrouper() {
        this.dashboardService.setSearchConfiguration(this.searchDashboard.searchVehicle,
                                                    this.searchDashboard.searchText);
    }

    private onChangeFilterDashboardGrouper() {
        this.dashboardService.setSearchDashboard(new SearchDashboardModel(this.searchDashboard));
    }

    private onChangeFilterDashboardRecordsGrouper() {
        this.dashboardService.setSearchDashboardRecords(this.searchDashboard.filterKmTime, this.searchDashboard.showStrict);
    }

    closePopover() {
        this.popoverController.getTop().then(r => { r.dismiss(); } );
    }

    clearFilter() {
        this.refresh = false;
        this.searchDashboard = new SearchDashboardModel();
        this.filterOpType = [];
        this.filterMaintElement = [];
        this.filterVehicle = [];
        this.filterMonth = FilterMonthsEnum.MONTH;
        setTimeout(() => {
            this.refresh = true;
            this.onChangeFilterGrouper();
        }, 250);
    }    
}
