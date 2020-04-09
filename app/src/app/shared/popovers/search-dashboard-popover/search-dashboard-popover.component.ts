import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { SearchDashboardModel, OperationTypeModel, ModalInputModel } from '@models/index';
import { DashboardService, CommonService, DataBaseService } from '@services/index';
import { FilterMonthsEnum, ConstantsColumns } from '@utils/index';

@Component({
    selector: 'app-search-dashboard-popover',
    templateUrl: 'search-dashboard-popover.component.html',
    styleUrls: ['search-dashboard-popover.component.scss', '../../../app.component.scss']
  })
  export class SearchDashboardPopOverComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();

    // DATA
    operationTypes: OperationTypeModel[] = [];
    filterOpType: number[] = [];
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
    operationTypeSubscription: Subscription = new Subscription();

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
            this.navParams.data.data, this.navParams.data.dataList);

        this.operationTypeSubscription = this.dbService.getOperationType().subscribe(data => {
            this.filterOpType = [];
            this.operationTypes = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION);
            this.searchDashboard.showOpType.forEach(x => this.filterOpType = [...this.filterOpType, x.id]);
        });
    }

    ngOnDestroy() {
        this.operationTypeSubscription.unsubscribe();
    }

    onChangeFilterGrouper() {
        this.searchDashboard.showOpType = this.operationTypes.filter(x => this.filterOpType.some(y => x.id === y));
        this.searchDashboard.showPerMont = this.filterMonth;
        this.dashboardService.setSearchDashboard(
            new SearchDashboardModel(this.searchDashboard.showPerMont,
                                    this.searchDashboard.showOpType,
                                    this.searchDashboard.showAxis,
                                    this.searchDashboard.showLegend,
                                    this.searchDashboard.showAxisLabel,
                                    this.searchDashboard.showDataLabel,
                                    this.searchDashboard.doghnut,
                                    this.searchDashboard.showMyData));
    }

    closePopover() {
        this.popoverController.getTop().then(r => { r.dismiss(); } );
    }

    clearFilter() {
        this.searchDashboard = new SearchDashboardModel();
        this.filterOpType = [];
        this.onChangeFilterGrouper();
    }
}
