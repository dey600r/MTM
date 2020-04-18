import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, PopoverController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService, OperationService, ControlService } from '@services/index';
import { OperationModel, MotoModel, ModalInputModel, ModalOutputModel, SearchOperationModel, OperationTypeModel } from '@models/index';
import { ConstantsColumns, Constants, ActionDBEnum, PageEnum } from '@utils/index';

// COMPONENTS
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { SearchOperationPopOverComponent } from '@popovers/search-operation-popover/search-operation-popover.component';
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
  filterOperations: SearchOperationModel = new SearchOperationModel();

  // DATA
  operations: OperationModel[] = [];
  nameFilterMoto = '';

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private alertController: AlertController,
              private commonService: CommonService,
              private controlService: ControlService,
              private operationService: OperationService,
              public popoverController: PopoverController) {
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
      this.filterOperations = this.operationService.getSearchOperation();
      this.operationService.setSearchOperation((this.filterOperations.searchMoto.brand === null ?
        (!!data && data.length > 0 ? data[0].moto : new MotoModel(null, null, null, null, null, null, null, null, 0)) :
        this.filterOperations.searchMoto));
      this.operationService.getObserverSearchOperation().subscribe(filter => {
        this.filterOperations = filter;
        if (this.filterOperations.searchMoto.brand !== null) {
          this.nameFilterMoto = `${filter.searchMoto.brand} ${filter.searchMoto.model}`;
        }
        this.operations = this.commonService.orderBy(
          data.filter(op =>
            op.moto.id === filter.searchMoto.id &&
            (filter.searchOperationType.length === 0 || filter.searchOperationType.some(y => y.id === op.operationType.id)) &&
            (filter.searchMaintenanceElement.length === 0 ||
              filter.searchMaintenanceElement.some(y => op.listMaintenanceElement.some(z => y.id === z.id)))
          ),
          ConstantsColumns.COLUMN_MTM_OPERATION_KM);
      });
    });
  }

  /** MODALS */

  openOperationModal(row: OperationModel = new OperationModel(null, null, new OperationTypeModel(), this.filterOperations.searchMoto),
                     create: boolean = true) {
    this.rowSelected = row;
    this.controlService.openModal(PageEnum.OPERATION,
      AddEditOperationComponent, new ModalInputModel(create, this.rowSelected, [], PageEnum.OPERATION));
  }

  openDashboardOperation() {
    this.controlService.openModal(PageEnum.OPERATION,
      DashboardComponent, new ModalInputModel(true, null, this.operations, PageEnum.OPERATION));
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
    this.controlService.showPopover(PageEnum.OPERATION, ev, SearchOperationPopOverComponent, new ModalInputModel());
  }

  closePopover() {
    this.controlService.closePopover();
  }

  /** ICONS */

  geClassIconOperationType(operation: OperationModel): string {
    return `${Constants.CLASS_ION_ICON_OPERATION_TYPE}${operation.operationType.code}`;
  }

  getIconOperationType(operation: OperationModel): string {
    switch (operation.operationType.code) {
      case Constants.OPERATION_TYPE_MAINTENANCE_HOME:
        return 'build';
      case Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP:
        return 'build';
      case Constants.OPERATION_TYPE_FAILURE_HOME:
        return 'hammer';
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
