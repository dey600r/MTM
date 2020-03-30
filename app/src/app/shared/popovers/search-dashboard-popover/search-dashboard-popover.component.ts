import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { SearchDashboardModel, FilterGroupMotoOpTypeReplacement } from '@models/index';
import { DashboardService } from '@services/index';


@Component({
    selector: 'app-search-dashboard-popover',
    templateUrl: 'search-dashboard-popover.component.html',
    styleUrls: ['search-dashboard-popover.component.scss', '../../../app.component.scss']
  })
  export class SearchDashboardPopOverComponent implements OnInit {

    searchDashboard: SearchDashboardModel = this.dashboardService.getSearchDashboard();
    filterGrouper: FilterGroupMotoOpTypeReplacement;

    constructor(private popoverController: PopoverController,
                private dashboardService: DashboardService,
                private translator: TranslateService) {
        this.searchDashboard = this.dashboardService.getSearchDashboard();
        this.filterGrouper = this.searchDashboard.filterGrouper;
    }

    ngOnInit() {
    }

    onChangeFilterGrouper() {
        this.searchDashboard.filterGrouper = this.filterGrouper;
        this.dashboardService.setSearchDashboard(this.searchDashboard.filterGrouper);
    }

    closePopover() {
        this.popoverController.getTop().then(r => { r.dismiss(); } );
    }

    clearFilter() {
    }
}
