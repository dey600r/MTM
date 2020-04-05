import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Form } from '@angular/forms';
import { Subscription } from 'rxjs';

// UTILS
import { ActionDB, ConstantsColumns } from '@app/core/utils';
import { ModalInputModel, ModalOutputModel, ConfigurationModel, MaintenanceModel } from '@models/index';
import { DataBaseService, CommonService, ConfigurationService } from '@services/index';

@Component({
  selector: 'app-add-edit-configuration',
  templateUrl: 'add-edit-configuration.component.html',
  styleUrls: ['add-edit-configuration.component.scss', '../../../app.component.scss']
})
export class AddEditConfigurationComponent implements OnInit, OnDestroy {

  // MODAL MODELS
  modalInputModel: ModalInputModel = new ModalInputModel();
  modalOutputModel: ModalOutputModel = new ModalOutputModel();

  // MODEL FORM
  configuration: ConfigurationModel = new ConfigurationModel();
  submited = false;

  // DATA
  maintenances: MaintenanceModel[] = [];
  toggleMaintenaces: boolean[] = [];

  // SUBSCRIPTION
  maintenanceSubscription: Subscription = new Subscription();

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dbService: DataBaseService,
    private commonService: CommonService,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit() {

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
      this.navParams.data.data, this.navParams.data.dataList);
    this.configuration = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.isCreate) {
      this.configuration.id = -1;
    }

    this.maintenanceSubscription = this.dbService.getMaintenance().subscribe(data => {
      this.maintenances = this.commonService.orderBy(data, ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
      if (this.modalInputModel.isCreate) {
        this.maintenances.forEach(x => this.toggleMaintenaces = [...this.toggleMaintenaces, false]);
      } else {
        this.maintenances.forEach(x => {
          this.toggleMaintenaces = [...this.toggleMaintenaces, this.configuration.listMaintenance.some(y => y.id === x.id)];
        });
      }
    });
  }

  ngOnDestroy() {
    this.maintenanceSubscription.unsubscribe();
  }

  saveData(f: Form) {
    this.submited = true;
    if (this.isValidForm(f)) {
      this.configuration.listMaintenance = [];
      // Prepare maintenance associated to configuration
      for (let i = 0; i < this.maintenances.length; i++) {
        if (this.toggleMaintenaces[i]) {
          this.configuration.listMaintenance = [...this.configuration.listMaintenance, this.maintenances[i]];
        }
      }
      this.configurationService.saveConfiguration(this.configuration,
          (this.modalInputModel.isCreate ? ActionDB.create : ActionDB.update)).then(res => {
        this.closeModal();
        this.commonService.showToast(
          (this.modalInputModel.isCreate ? 'PAGE_CONFIGURATION.AddSaveConfiguration' : 'PAGE_CONFIGURATION.EditSaveConfiguration'),
          { configuration: this.configuration.name });
      }).catch(e => {
        this.commonService.showToast('PAGE_CONFIGURATION.ErrorSaveConfiguration');
      });
    }
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  isValidForm(f: any): boolean {
    return this.isValidName(f) && this.isValidDescription(f);
  }

  isValidName(f: any): boolean {
    return f.configurationName !== undefined && f.configurationName.validity.valid;
  }

  isValidDescription(f: any): boolean {
    return f.configurationDescription !== undefined && f.configurationDescription.validity.valid;
  }

  getIconMaintenance(maintenance: MaintenanceModel): string {
    return this.configurationService.getIconMaintenance(maintenance);
  }
}
