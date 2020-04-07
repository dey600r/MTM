import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

// UTILS
import { SearchDashboardModel } from '@models/index';
import { DashboardService } from '@services/index';
import { FilterGroupMotoOpTypeReplacementEnum } from '@utils/index';

@Component({
    selector: 'app-search-dashboard-popover',
    templateUrl: 'search-dashboard-popover.component.html',
    styleUrls: ['search-dashboard-popover.component.scss', '../../../app.component.scss']
  })
  export class SearchDashboardPopOverComponent implements OnInit {

    searchDashboard: SearchDashboardModel = this.dashboardService.getSearchDashboard();
    filterGrouper: FilterGroupMotoOpTypeReplacementEnum;

    constructor(private popoverController: PopoverController,
                private dashboardService: DashboardService) {
        this.searchDashboard = this.dashboardService.getSearchDashboard();
        this.filterGrouper = this.searchDashboard.filterGrouper;
    }

    ngOnInit() {
    }

    onChangeFilterGrouper() {
        this.searchDashboard.filterGrouper = this.filterGrouper;
        this.dashboardService.setSearchDashboard(
            new SearchDashboardModel(this.searchDashboard.filterGrouper,
                                    this.searchDashboard.showAxis,
                                    this.searchDashboard.showLegend,
                                    this.searchDashboard.showAxisLabel,
                                    this.searchDashboard.showDataLabel,
                                    this.searchDashboard.doghnut));
    }

    closePopover() {
        this.popoverController.getTop().then(r => { r.dismiss(); } );
    }

    clearFilter() {
        this.searchDashboard = new SearchDashboardModel();
        this.onChangeFilterGrouper();
    }
}
