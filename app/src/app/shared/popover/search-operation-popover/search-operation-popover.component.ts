import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataBaseService, CommonService, OperationService } from '@services/index';
import { MotoModel, SearchOperationModel, OperationTypeModel, MaintenanceElementModel } from '@models/index';
import { ConstantsColumns } from '@utils/index';

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

    constructor(public popoverController: PopoverController,
                public dbService: DataBaseService,
                public commonService: CommonService,
                public operationService: OperationService) {
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
