import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { SearchDashboardModel, OperationTypeModel, ModalInputModel, MaintenanceElementModel } from '@models/index';
import { DashboardService, CommonService, DataBaseService, SettingsService } from '@services/index';
import { FilterMonthsEnum, ConstantsColumns, PageEnum } from '@utils/index';

@Component({
    selector: 'app-search-dashboard-popover',
    templateUrl: 'search-dashboard-popover.component.html',
    styleUrls: []
  })
  export class SearchDashboardPopOverComponent implements OnInit {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();

    // DATA
    measure: any = {};
    coin: any = {};
    refresh = true;
    operationTypes: OperationTypeModel[] = [];
    maintenanceElements: MaintenanceElementModel[] = [];
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

    constructor(private popoverController: PopoverController,
                private navParams: NavParams,
                private dbService: DataBaseService,
                private dashboardService: DashboardService,
                private commonService: CommonService,
                private translator: TranslateService,
                private settingsService: SettingsService) {
        this.searchDashboard = this.dashboardService.getSearchDashboard();
        this.filterMonth = this.searchDashboard.showPerMont;
        this.translateAccept = this.translator.instant('COMMON.ACCEPT');
        this.translateCancel = this.translator.instant('COMMON.CANCEL');
        this.translateSelect = this.translator.instant('COMMON.SELECT');
    }

    ngOnInit() {
        this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
            this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

        // FILTER OPERATION TYPE
        this.filterOpType = [];
        this.operationTypes = this.commonService.orderBy(
            this.dbService.getOperationTypeData(), ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION);
        this.searchDashboard.searchOperationType.forEach(x => this.filterOpType = [...this.filterOpType, x.id]);

        // FILTER MAINTENANCE ELEMENT
        this.filterMaintElement = [];
        this.maintenanceElements = this.commonService.orderBy(
            this.dbService.getMaintenanceElementData(), ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME);
        this.searchDashboard.searchMaintenanceElement.forEach(x => this.filterMaintElement = [...this.filterMaintElement, x.id]);

        const settings = this.dbService.getSystemConfigurationData();
        if (!!settings && settings.length > 0) {
            this.measure = this.settingsService.getDistanceSelected(settings);
            this.coin = this.settingsService.getMoneySelected(settings);
            this.translateExpensePerKM = `${this.coin.value}/${this.measure.value}`;
        }
    }

    onChangeFilterGrouper() {
        this.onChangeFilterOperationGrouper();
        this.onChangeFilterDashboardGrouper();
        this.onChangeFilterDashboardRecordsGrouper();
    }

    onChangeFilterOperationGrouper() {
        if (this.refresh) {
            this.searchDashboard.searchOperationType = this.operationTypes.filter(x => this.filterOpType.some(y => x.id === y));
            this.searchDashboard.searchMaintenanceElement = this.maintenanceElements.filter(x =>
                this.filterMaintElement.some(y => x.id === y));
            this.dashboardService.setSearchOperation(this.searchDashboard.searchOperationType,
                                                    this.searchDashboard.searchMaintenanceElement,
                                                    this.searchDashboard.searchText);
        }
    }

    onChangeFilterDashboardGrouper() {
        if (this.refresh) {
            this.searchDashboard.showPerMont = this.filterMonth;
            this.dashboardService.setSearchDashboard(
                new SearchDashboardModel(this.searchDashboard.showPerMont,
                                        this.searchDashboard.searchText,
                                        this.searchDashboard.searchOperationType,
                                        this.searchDashboard.searchMaintenanceElement,
                                        this.searchDashboard.showAxis,
                                        this.searchDashboard.showLegend,
                                        this.searchDashboard.showAxisLabel,
                                        this.searchDashboard.showDataLabel,
                                        this.searchDashboard.doghnut,
                                        this.searchDashboard.showMyData,
                                        this.searchDashboard.filterKmTime,
                                        this.searchDashboard.expensePerKm,
                                        this.searchDashboard.showStrict));
        }
    }

    onChangeFilterDashboardRecordsGrouper() {
        if (this.refresh) {
            this.dashboardService.setSearchDashboardRecords(this.searchDashboard.filterKmTime, this.searchDashboard.showStrict);
        }
    }

    closePopover() {
        this.popoverController.getTop().then(r => { r.dismiss(); } );
    }

    clearFilter() {
        this.refresh = false;
        this.searchDashboard = new SearchDashboardModel(FilterMonthsEnum.MONTH, '');
        this.filterOpType = [];
        this.filterMaintElement = [];
        this.filterMonth = FilterMonthsEnum.MONTH;
        setTimeout(() => {
            this.refresh = true;
            this.onChangeFilterGrouper();
        }, 250);
    }

    isParentPageHome() {
        return this.modalInputModel.parentPage === PageEnum.HOME;
    }

    isParentPageDashboardVehicle() {
        return this.modalInputModel.parentPage === PageEnum.MODAL_DASHBOARD_VEHICLE;
    }

    isParentPageDashboardOperation() {
        return this.modalInputModel.parentPage === PageEnum.MODAL_DASHBOARD_OPERATION;
    }

    isParentPageOperation() {
        return this.modalInputModel.parentPage === PageEnum.OPERATION;
    }
}
