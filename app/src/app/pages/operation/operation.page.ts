import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Platform, ModalController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataBaseService, CommonService, OperationService } from '@services/index';
import { OperationModel } from '@models/index';
import { ConstantsColumns } from '@utils/index';
import { SearchOperationPopOverComponent } from '@app/shared/popover/search-operation-popover/search-operation-popover.component';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss', '../../app.component.scss']
})
export class OperationPage implements OnInit, OnChanges {

  currentPopover = null;
  operations: OperationModel[] = [];

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
      this.operationService.getObserverSearchOperation().subscribe(filter => {
        this.operations = this.commonService.orderBy(
          data.filter(op =>
            op.moto.id === filter.searchMoto.id &&
            (filter.searchOperationType.length === 0 || filter.searchOperationType.some(y => y.id === op.operationType.id)) &&
            (filter.searchMaintenanceElement.length === 0 ||
              filter.searchMaintenanceElement.some(y => op.listMaintenanceElement.some(z => y.id === z.id)))
          ),
          ConstantsColumns.COLUMN_MTM_OPERATION_DATE);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  openCreateOperationModal() {

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
}
