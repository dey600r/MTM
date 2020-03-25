import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataBaseService, CommonService, OperationService } from '@services/index';
import { MotoModel, SearchOperationModel, OperationTypeModel, MaintenanceElementModel } from '@models/index';
import { ConstantsColumns } from '@utils/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-search-operation-popover',
    templateUrl: 'search-operation-popover.component.html',
    styleUrls: ['search-operation-popover.component.scss', '../../../app.component.scss']
  })
  export class SearchOperationPopOverComponent implements OnInit {

    motos: MotoModel[] = [];
    operationTypes: OperationTypeModel[] = [];
    maintenanceElements: MaintenanceElementModel[] = [];
    searchOperation: SearchOperationModel = this.operationService.getSearchOperation();
    filterMoto = 1;
    filterOpType: number[] = [];
    filterMaintElement: number[] = [];

    // translate
    translateAccept = '';
    translateCancel = '';
    translateSelect = '';

    constructor(private popoverController: PopoverController,
                private dbService: DataBaseService,
                private commonService: CommonService,
                private operationService: OperationService,
                private translator: TranslateService) {
      this.translateAccept = this.translator.instant('ACCEPT');
      this.translateCancel = this.translator.instant('CANCEL');
      this.translateSelect = this.translator.instant('SELECT');
      this.searchOperation = this.operationService.getSearchOperation();
      this.filterMoto = this.searchOperation.searchMoto.id;
      this.filterOpType = this.searchOperation.searchOperationType.map(x => x.id);
      this.filterMaintElement = this.searchOperation.searchMaintenanceElement.map(x => x.id);
    }

    ngOnInit() {
      this.dbService.getMotos().subscribe(data => {
        this.motos = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MOTO_BRAND);
      });
      this.dbService.getOperationType().subscribe(data => {
        this.operationTypes = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_OPERATION_TYPE_DESCRIPTION);
      });
      this.dbService.getMaintenanceElement().subscribe(data => {
        this.maintenanceElements = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_ELEMENT_NAME);
      });
    }

    changeSearcherMoto() {
      this.searchOperation.searchMoto = this.motos.find(x => x.id === this.filterMoto);
      this.operationService.setSearchOperation(this.searchOperation.searchMoto,
        this.searchOperation.searchOperationType,
        this.searchOperation.searchMaintenanceElement);
    }

    changeSearcherOperationType() {
      this.searchOperation.searchOperationType = this.operationTypes.filter(x => this.filterOpType.some(y => x.id === y));
      this.operationService.setSearchOperation(this.searchOperation.searchMoto,
        this.searchOperation.searchOperationType,
        this.searchOperation.searchMaintenanceElement);
    }

    changeSearcherMaintenanceElement() {
      this.searchOperation.searchMaintenanceElement = this.maintenanceElements.filter(x => this.filterMaintElement.some(y => x.id === y));
      this.operationService.setSearchOperation(this.searchOperation.searchMoto,
        this.searchOperation.searchOperationType,
        this.searchOperation.searchMaintenanceElement);
    }

    closePopover() {
        this.popoverController.getTop().then(r => { r.dismiss(); } );
    }
}
