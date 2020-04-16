import { Component, OnInit } from '@angular/core';
import { Platform, ModalController, AlertController, PopoverController } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService, OperationService } from '@services/index';
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
  currentPopover = null;
  filterOperations: SearchOperationModel = new SearchOperationModel();

  // DATA
  operations: OperationModel[] = [];
  nameFilterMoto = '';

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private modalController: ModalController,
              private translator: TranslateService,
              private alertController: AlertController,
              private commonService: CommonService,
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
    this.openModal(AddEditOperationComponent, new ModalInputModel(create, this.rowSelected, [], PageEnum.OPERATION));
  }

  openDashboardOperation() {
    this.openModal(DashboardComponent, new ModalInputModel(true, null, this.operations, PageEnum.OPERATION));
  }

  deleteOperation(row: OperationModel) {
    this.rowSelected = row;
    this.showConfirmDelete();
  }

  showModalInfoMoto() {
    this.commonService.showToast('ALERT.AddMotoToAddOperation');
  }

  showModalInfoOperation() {
    this.commonService.showToast('ALERT.AddOperationToExpenses');
  }

  async openModal(modalComponent: any, inputModel: ModalInputModel) {

    const modal = await this.modalController.create({
      component: modalComponent,
      componentProps: inputModel
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
    });

    return await modal.present();
  }

  async showConfirmDelete() {
    const alert = await this.alertController.create({
      header: this.translator.instant('COMMON.OPERATION'),
      message: this.translator.instant('PAGE_OPERATION.ConfirmDeleteOperation', {operation: this.rowSelected.description}),
      buttons: [
        {
          text: this.translator.instant('COMMON.CANCEL'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.operationService.saveOperation(this.rowSelected, ActionDBEnum.DELETE).then(x => {
              this.commonService.showToast('PAGE_OPERATION.DeleteSaveOperation', {operation: this.rowSelected.description});
            }).catch(e => {
              this.commonService.showToast('PAGE_OPERATION.ErrorSaveOperation');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showPopover(ev: any) {
    this.currentPopover = await this.popoverController.create({
      component: SearchOperationPopOverComponent,
      event: ev,
      translucent: true
    });
    return await this.currentPopover.present();
  }

  closePopover() {
    this.currentPopover.dissmis();
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
