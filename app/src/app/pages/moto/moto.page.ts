import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { ActionDBEnum, ConstantsColumns, PageEnum } from '@utils/index';
import { DataBaseService, MotoService, CommonService, ControlService, DashboardService } from '@services/index';
import { MotoModel, ModalInputModel, ModalOutputModel, OperationModel } from '@models/index';

// COMPONENTS
import { AddEditMotoComponent } from '@modals/add-edit-moto/add-edit-moto.component';
import { DashboardComponent } from '@modals/dashboard/dashboard.component';

@Component({
  selector: 'app-moto',
  templateUrl: 'moto.page.html',
  styleUrls: ['moto.page.scss', '../../app.component.scss']
})
export class MotoPage implements OnInit {

  // MODAL
  dataReturned: ModalOutputModel;

  // MODEL
  rowSelected: MotoModel = new MotoModel();
  activateInfo = false;

  // DATA
  motos: MotoModel[] = [];
  operations: OperationModel[] = [];
  loaded = false;

  constructor(private platform: Platform,
              private dbService: DataBaseService,
              private translator: TranslateService,
              private motoService: MotoService,
              private commonService: CommonService,
              private controlService: ControlService,
              private dashboarService: DashboardService) {
      this.platform.ready().then(() => {
        let userLang = navigator.language.split('-')[0];
        userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';
        this.translator.use(userLang);
      });
  }

  /** INIT */

  ngOnInit() {
    this.dbService.getMotos().subscribe(data => {
      if (!!data && data.length > 0) {
        if (this.dashboarService.getSearchDashboard().searchMoto.brand === null) {
          this.dashboarService.setSearchOperation(data[0]);
        }
      } else {
        this.dashboarService.setSearchOperation();
      }
      this.motos = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MOTO_BRAND);
    });

    this.dbService.getOperations().subscribe(op => {
      this.operations = op;
    });

  }

  ionViewDidEnter() {
    if (!this.loaded) {
      setTimeout(() => { this.loaded = this.motoService.closeLoader(); }, 1000);
    }
  }

  /** MODALS */

  openMotoModal(row: MotoModel = new MotoModel(), create: boolean = true) {
    this.rowSelected = row;
    this.controlService.openModal(PageEnum.MOTO,
      AddEditMotoComponent, new ModalInputModel(create, this.rowSelected, [], PageEnum.MOTO));
  }

  deleteMoto(row: MotoModel) {
    this.rowSelected = row;
    this.showConfirmDelete();
  }

  openDashboardMoto() {
    this.controlService.openModal(PageEnum.MOTO,
      DashboardComponent, new ModalInputModel(false, null, this.operations, PageEnum.MOTO));
  }

  showModalInfo() {
    this.controlService.showToast(PageEnum.MOTO, 'ALERT.AddMotorbikeToExpenses');
  }

  changeFilterOperation(idMoto: number) {
    this.dashboarService.setSearchOperation(this.motos.find(x => x.id === idMoto));
  }

  showConfirmDelete() {
    let ops: OperationModel[] = [];
    if (!!this.operations && this.operations.length > 0) {
      ops = this.operations.filter(x => x.moto.id === this.rowSelected.id);
    }
    const message: string = (!!ops && ops.length > 0 ?
      'PAGE_MOTO.ConfirmDeleteMotoOperation' : 'PAGE_MOTO.ConfirmDeleteMoto');

    this.controlService.showConfirm(PageEnum.MOTO, this.translator.instant('COMMON.MOTORBIKE'),
      this.translator.instant(message, {moto: `${this.rowSelected.brand} ${this.rowSelected.model}`}),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.motoService.saveMoto(this.rowSelected, ActionDBEnum.DELETE, ops).then(x => {
            this.controlService.showToast(PageEnum.MOTO, 'PAGE_MOTO.DeleteSaveMoto',
              { moto: `${this.rowSelected.brand} ${this.rowSelected.model}` });
          }).catch(e => {
            this.controlService.showToast(PageEnum.MOTO, 'PAGE_MOTO.ErrorSaveMoto');
          });
        }
      }
    );
  }

}
