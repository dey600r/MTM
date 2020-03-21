import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Platform, ModalController, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataBaseService, CommonService, OperationService } from '@services/index';
import { OperationModel } from '@models/index';
import { ConstantsColumns } from '@utils/index';

@Component({
  selector: 'app-operation',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss', '../../app.component.scss']
})
export class OperationPage implements OnInit, OnChanges {

  operations: OperationModel[] = [];

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private modalController: ModalController,
              private translator: TranslateService,
              private alertController: AlertController,
              private toastController: ToastController,
              private commonService: CommonService,
              private operationService: OperationService) {
    this.platform.ready().then(() => {
    let userLang = navigator.language.split('-')[0];
    userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
    this.translator.use(userLang);
    });
  }

  ngOnInit() {
    this.dbService.getOperations().subscribe(x => {
      this.operations = this.commonService.orderBy(x, ConstantsColumns.COLUMN_MTM_OPERATION_DATE);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  openCreateOperationModal() {
    
  }
}
