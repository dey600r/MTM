import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Platform, ModalController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DataBaseService, CommonService, OperationService } from '@services/index';
import { OperationModel, MotoModel, ModalInputModel, ModalOutputModel, SearchOperationModel, OperationTypeModel } from '@models/index';
import { ConstantsColumns, Constants, ActionDB } from '@utils/index';

// COMPONENTS
import { AddEditOperationComponent } from '@modals/add-edit-operation/add-edit-operation.component';
import { SearchOperationPopOverComponent } from '@popovers/search-operation-popover/search-operation-popover.component';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss', '../../app.component.scss']
})
export class OperationPage implements OnInit, OnChanges {

  currentPopover = null;
  operations: OperationModel[] = [];
  nameFilterMoto = '';
  filterOperations: SearchOperationModel = new SearchOperationModel();

  dataInputModel: ModalInputModel;
  dataReturned: ModalOutputModel;
  rowSelected: OperationModel = new OperationModel();

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private modalController: ModalController,
              private translator: TranslateService,
              private alertController: AlertController,
              private toastController: ToastController,
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

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  initPage() {
    this.nameFilterMoto = this.translator.instant('YOURS_OPERATIONS');
    this.dbService.getOperations().subscribe(data => {
      this.operationService.setSearchOperation((!!data && data.length > 0 ?
        this.filterOperations.searchMoto :
        new MotoModel(null, null, null, null, null, null, null, 0)));
      this.operationService.getObserverSearchOperation().subscribe(filter => {
        this.filterOperations = filter;
        if (!!data && data.length > 0) {
          this.nameFilterMoto = `${this.translator.instant('OPERATIONS_OF')} ${filter.searchMoto.brand} ${filter.searchMoto.model}`;
        } else {
          this.nameFilterMoto = this.translator.instant('YOURS_OPERATIONS');
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

  openCreateOperationModal() {
    this.rowSelected = new OperationModel(null, null, new OperationTypeModel(), this.filterOperations.searchMoto);
    this.dataInputModel = new ModalInputModel(true, this.rowSelected);
    this.openModal();
  }

  openEditModal(row: OperationModel) {
    this.rowSelected = row;
    this.dataInputModel = new ModalInputModel(false, this.rowSelected);
    this.openModal();
  }

  deleteOperation(row: OperationModel) {
    this.rowSelected = row;
    this.showConfirmDelete();
  }

  async openModal() {

    const modal = await this.modalController.create({
      component: AddEditOperationComponent,
      componentProps: this.dataInputModel
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
      header: this.translator.instant('OPERATION'),
      message: this.translator.instant('ConfirmDeleteOperation', {operation: this.rowSelected.description}),
      buttons: [
        {
          text: this.translator.instant('CANCEL'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translator.instant('ACCEPT'),
          handler: () => {
            this.operationService.saveOperation(this.rowSelected, ActionDB.delete).then(x => {
              this.commonService.showSaveToast('DeleteSaveOperation', {operation: this.rowSelected.description});
            }).catch(e => {
              this.commonService.showSaveToast('ErrorSaveOperation');
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
    }
  }
}
