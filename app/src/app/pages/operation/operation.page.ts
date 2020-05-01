import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService, OperationService, ControlService, DashboardService } from '@services/index';
import {
  OperationModel, MotoModel, ModalInputModel, ModalOutputModel,
  OperationTypeModel, SearchDashboardModel
} from '@models/index';
import { ConstantsColumns, Constants, ActionDBEnum, PageEnum } from '@utils/index';

// COMPONENTS
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { SearchDashboardPopOverComponent } from '@popovers/search-dashboard-popover/search-dashboard-popover.component';
import { DashboardComponent } from '@app/shared/modals/dashboard/dashboard.component';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss', '../../app.component.scss']
})
export class OperationPage implements OnInit {

  // MODAL
  dataReturned: ModalOutputModel;

  // MODEL
  rowSelected: OperationModel = new OperationModel();
  filterDashboard: SearchDashboardModel = new SearchDashboardModel();

  // DATA
  operations: OperationModel[] = [];
  allOperations: OperationModel[] = [];
  nameFilterMoto = '';
  loaded = false;
  iconNameHeaderLeft = 'bar-chart';

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private commonService: CommonService,
              private controlService: ControlService,
              private operationService: OperationService,
              private dashboardService: DashboardService) {
    this.platform.ready().then(() => {
      let userLang = navigator.language.split('-')[0];
      userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
      this.translator.use(userLang);
    }).finally(() => {
      this.initPage();
    });
  }

  /** INIT */

  ngOnInit() {

  }

  initPage() {
    this.dbService.getOperations().subscribe(data => {
      this.allOperations = data;
      this.filterDashboard = this.dashboardService.getSearchDashboard();
      this.dashboardService.setSearchOperation((this.filterDashboard.searchMoto.brand === null ?
        (!!data && data.length > 0 ? data[0].moto : new MotoModel(null, null, null, null, null, null, null, null, 0)) :
        this.filterDashboard.searchMoto));
      this.dashboardService.getObserverSearchODashboard().subscribe(filter => {
        if (data.length === 0) {
          this.iconNameHeaderLeft = 'information-circle';
        } else {
          this.iconNameHeaderLeft = 'bar-chart';
        }
        this.filterDashboard = filter;
        if (this.filterDashboard.searchMoto.brand !== null) {
          this.nameFilterMoto = `${filter.searchMoto.brand} ${filter.searchMoto.model}`;
        }
        this.allOperations = data.filter(op => op.moto.id === filter.searchMoto.id);
        const filteredText: string = filter.searchText.toLowerCase();
        this.operations = this.commonService.orderBy(
          this.allOperations.filter(op =>
            (op.description.toLowerCase().includes(filteredText) || op.details.toLowerCase().includes(filteredText) ||
            op.owner.toLowerCase().includes(filteredText) || op.location.toLowerCase().includes(filteredText)) &&
            (filter.searchOperationType.length === 0 || filter.searchOperationType.some(y => y.id === op.operationType.id)) &&
            (filter.searchMaintenanceElement.length === 0 ||
              filter.searchMaintenanceElement.some(y => op.listMaintenanceElement.some(z => y.id === z.id)))
          ),
          ConstantsColumns.COLUMN_MTM_OPERATION_KM);
      });
    });
  }

  ionViewDidEnter() {
    if (!this.loaded) {
      setTimeout(() => { this.loaded = true; }, 1200);
    }
  }

  /** MODALS */

  openOperationModal(row: OperationModel = new OperationModel(null, null, new OperationTypeModel(), this.filterDashboard.searchMoto),
                     create: boolean = true) {
    this.rowSelected = row;
    this.controlService.openModal(PageEnum.OPERATION,
      AddEditOperationComponent, new ModalInputModel(create, this.rowSelected, [], PageEnum.OPERATION));
  }

  openDashboardOperation() {
    if (this.allOperations.length === 0) {
      this.showModalInfoOperation();
    } else {
      this.controlService.openModal(PageEnum.OPERATION,
        DashboardComponent, new ModalInputModel(true, null, this.allOperations, PageEnum.OPERATION));
    }
  }

  deleteOperation(row: OperationModel) {
    this.rowSelected = row;
    this.showConfirmDelete();
  }

  showModalInfoMoto() {
    this.controlService.showToast(PageEnum.OPERATION, 'ALERT.AddMotoToAddOperation');
  }

  showModalInfoOperation() {
    this.controlService.showToast(PageEnum.OPERATION, 'ALERT.AddOperationToExpenses');
  }

  showConfirmDelete() {
    this.controlService.showConfirm(PageEnum.OPERATION, this.translator.instant('COMMON.OPERATION'),
      this.translator.instant('PAGE_OPERATION.ConfirmDeleteOperation', {operation: this.rowSelected.description}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.operationService.saveOperation(this.rowSelected, ActionDBEnum.DELETE).then(x => {
            this.controlService.showToast(PageEnum.OPERATION,
              'PAGE_OPERATION.DeleteSaveOperation', {operation: this.rowSelected.description});
          }).catch(e => {
            this.controlService.showToast(PageEnum.OPERATION, 'PAGE_OPERATION.ErrorSaveOperation');
          });
        }
      }
    );
  }

  showPopover(ev: any) {
    this.controlService.showPopover(PageEnum.OPERATION, ev, SearchDashboardPopOverComponent,
      new ModalInputModel(true, null, [], PageEnum.OPERATION));
  }

  closePopover() {
    this.controlService.closePopover();
  }

  /** ICONS */

  getIconInfoDashboard(): string {
    return this.allOperations.length > 0 ? 'bar-chart' : 'information-circle';
  }

  geClassIconOperationType(operation: OperationModel): string {
    return `${Constants.CLASS_ION_ICON_OPERATION_TYPE}${operation.operationType.code}`;
  }

  getIconOperationType(operation: OperationModel): string {
    switch (operation.operationType.code) {
      case Constants.OPERATION_TYPE_MAINTENANCE_HOME:
      case Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP:
        return 'build';
      case Constants.OPERATION_TYPE_FAILURE_HOME:
      case Constants.OPERATION_TYPE_FAILURE_WORKSHOP:
        return 'hammer';
      case Constants.OPERATION_TYPE_CLOTHES:
        return 'shirt';
      case Constants.OPERATION_TYPE_ACCESSORIES:
        return 'gift';
      case Constants.OPERATION_TYPE_TOOLS:
        return 'construct';
      case Constants.OPERATION_TYPE_OTHER:
        return 'body';
      case Constants.OPERATION_TYPE_SPARE_PARTS:
        return 'repeat';
    }
  }
}
