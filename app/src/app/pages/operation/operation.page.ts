import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Platform, ModalController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataBaseService, CommonService, OperationService } from '@services/index';
import { OperationModel, MotoModel } from '@models/index';
import { ConstantsColumns, Constants } from '@utils/index';
import { SearchOperationPopOverComponent } from '@app/shared/popover/search-operation-popover/search-operation-popover.component';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss', '../../app.component.scss']
})
export class OperationPage implements OnInit, OnChanges {

  currentPopover = null;
  operations: OperationModel[] = [];
  nameFilterMoto = '';

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
    });
  }

  ngOnInit() {
    this.dbService.getOperations().subscribe(data => {
      this.operationService.setSearchOperation(
        (!!data && data.length > 0 ? data[0].moto : new MotoModel(null, null, null, null, null, null, null, 0)));
      this.operationService.getObserverSearchOperation().subscribe(filter => {
        this.nameFilterMoto = this.translator.instant('YOURS_OPERATIONS');
        if (!!data && data.length > 0) {
          this.nameFilterMoto = `${this.translator.instant('OPERATIONS_OF')} ${filter.searchMoto.brand} ${filter.searchMoto.model}`;
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

  ngOnChanges(changes: SimpleChanges) {
  }

  openCreateOperationModal() {

  }

  openEditModal(operation: OperationModel) {

  }

  deleteOperation(operation: OperationModel) {

  }

  async presentPopover(ev: any) {
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
