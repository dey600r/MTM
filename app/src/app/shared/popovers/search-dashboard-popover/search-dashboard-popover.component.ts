import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { SearchDashboardModel, OperationTypeModel, ModalInputModel, MotoModel, MaintenanceElementModel } from '@models/index';
import { DashboardService, CommonService, DataBaseService } from '@services/index';
import { FilterMonthsEnum, ConstantsColumns, PageEnum } from '@utils/index';

@Component({
    selector: 'app-search-dashboard-popover',
    templateUrl: 'search-dashboard-popover.component.html',
    styleUrls: ['../../../app.component.scss']
  })
  export class SearchDashboardPopOverComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();

    // DATA
    motos: MotoModel[] = [];
    operationTypes: OperationTypeModel[] = [];
    maintenanceElements: MaintenanceElementModel[] = [];
    filterMoto = 1;
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

    // SUSCRIPTION
    motoSubscription: Subscription = new Subscription();
    operationTypeSubscription: Subscription = new Subscription();
    maintenanceElementSubscription: Subscription = new Subscription();

    // TRANSLATE
    translateAccept = '';
    translateCancel = '';
    translateSelect = '';

    constructor(private popoverController: PopoverController,
                private navParams: NavParams,
                private dbService: DataBaseService,
                private dashboardService: DashboardService,
                private commonService: CommonService,
                private translator: TranslateService) {
        this.searchDashboard = this.dashboardService.getSearchDashboard();
        this.filterMonth = this.searchDashboard.showPerMont;
        this.translateAccept = this.translator.instant('COMMON.ACCEPT');
        this.translateCancel = this.translator.instant('COMMON.CANCEL');
        this.translateSelect = this.translator.instant('COMMON.SELECT');
    }

    ngOnInit() {
        this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
            this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

        this.motoSubscription = this.dbService.getMotos().subscribe(data => {
            this.motos = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MOTO_BRAND);
            this.filterMoto = this.searchDashboard.searchMoto.id;
        });

        this.operationTypeSubscription = this.dbService.getOperationType().subscribe(data => {
            this.filterOpType = [];
            this.operationTypes = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION);
            this.searchDashboard.searchOperationType.forEach(x => this.filterOpType = [...this.filterOpType, x.id]);
        });

        this.maintenanceElementSubscription = this.dbService.getMaintenanceElement().subscribe(data => {
            this.filterMaintElement = [];
            this.maintenanceElements = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME);
            this.searchDashboard.searchMaintenanceElement.forEach(x => this.filterMaintElement = [...this.filterMaintElement, x.id]);
        });
    }

    ngOnDestroy() {
        this.motoSubscription.unsubscribe();
        this.operationTypeSubscription.unsubscribe();
        this.maintenanceElementSubscription.unsubscribe();
    }

    onChangeFilterGrouper() {
        this.searchDashboard.searchMoto = this.motos.find(x => this.filterMoto === x.id);
        this.searchDashboard.searchOperationType = this.operationTypes.filter(x => this.filterOpType.some(y => x.id === y));
        this.searchDashboard.searchMaintenanceElement = this.maintenanceElements.filter(x => this.filterMaintElement.some(y => x.id === y));
        this.searchDashboard.showPerMont = this.filterMonth;
        this.dashboardService.setSearchDashboard(
            new SearchDashboardModel(this.searchDashboard.showPerMont,
                                    this.searchDashboard.searchText,
                                    this.searchDashboard.searchMoto,
                                    this.searchDashboard.searchOperationType,
                                    this.searchDashboard.searchMaintenanceElement,
                                    this.searchDashboard.showAxis,
                                    this.searchDashboard.showLegend,
                                    this.searchDashboard.showAxisLabel,
                                    this.searchDashboard.showDataLabel,
                                    this.searchDashboard.doghnut,
                                    this.searchDashboard.showMyData,
                                    this.searchDashboard.filterKmTime));
    }

    closePopover() {
        this.popoverController.getTop().then(r => { r.dismiss(); } );
    }

    clearFilter() {
        this.searchDashboard = new SearchDashboardModel(FilterMonthsEnum.MONTH, '', this.motos.find(x => this.filterMoto === x.id));
        this.filterOpType = [];
        this.filterMaintElement = [];
        this.onChangeFilterGrouper();
    }

    isParentPageHome() {
        return this.modalInputModel.parentPage === PageEnum.HOME;
    }

    isParentPageDashboardMoto() {
        return this.modalInputModel.parentPage === PageEnum.MODAL_DASHBOARD_MOTO;
    }

    isParentPageDashboardOperation() {
        return this.modalInputModel.parentPage === PageEnum.MODAL_DASHBOARD_OPERATION;
    }

    isParentPageOperation() {
        return this.modalInputModel.parentPage === PageEnum.OPERATION;
    }
}
