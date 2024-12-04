import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

// UTILS
import { ActionDBEnum, ConstantsColumns, PageEnum, ToastTypeEnum } from '@app/core/utils';
import { ModalInputModel, ConfigurationModel, MaintenanceModel, MaintenanceElementModel, ISettingModel } from '@models/index';
import { DataService, CommonService, ConfigurationService, ControlService, SettingsService } from '@services/index';

@Component({
  selector: 'app-add-edit-configuration',
  templateUrl: 'add-edit-configuration.component.html',
  styleUrls: []
})
export class AddEditConfigurationComponent implements OnInit {

  // MODAL MODELS
  modalInputModel: ModalInputModel<ConfigurationModel> = new ModalInputModel<ConfigurationModel>();

  // MODEL FORM
  configuration: ConfigurationModel = new ConfigurationModel();
  submited = false;

  // DATA
  maintenances: MaintenanceModel[] = [];
  toggleMaintenaces: boolean[] = [];
  measure: ISettingModel;

  constructor(
    private readonly modalController: ModalController,
    private readonly navParams: NavParams,
    private readonly dataService: DataService,
    private readonly commonService: CommonService,
    private readonly controlService: ControlService,
    private readonly settingsService: SettingsService,
    private readonly configurationService: ConfigurationService
  ) {
  }

  ngOnInit() {

    const settings = this.dataService.getSystemConfigurationData();
    if (!!settings && settings.length > 0) {
      this.measure = this.settingsService.getDistanceSelected(settings);
    }

    this.modalInputModel = new ModalInputModel<ConfigurationModel>(this.navParams.data);
    this.configuration = Object.assign({}, this.modalInputModel.data);
    if (this.modalInputModel.isCreate) {
      this.configuration.id = -1;
    }

    this.maintenances = this.commonService.orderBy(this.dataService.getMaintenanceData(), ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
    if (this.modalInputModel.isCreate) {
      this.maintenances.forEach(x => this.toggleMaintenaces = [...this.toggleMaintenaces, false]);
    } else {
      this.maintenances.forEach(x => {
        this.toggleMaintenaces = [...this.toggleMaintenaces, this.configuration.listMaintenance.some(y => y.id === x.id)];
      });
    }
  }

  saveData(f: HTMLFormElement) {
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
          (this.modalInputModel.isCreate ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
        this.closeModal();
        this.controlService.showToast(PageEnum.MODAL_CONFIGURATION, ToastTypeEnum.SUCCESS,
          (this.modalInputModel.isCreate ? 'PAGE_CONFIGURATION.AddSaveConfiguration' : 'PAGE_CONFIGURATION.EditSaveConfiguration'),
          { configuration: this.configuration.name });
      }).catch(e => {
        this.controlService.showToast(PageEnum.MODAL_CONFIGURATION, ToastTypeEnum.DANGER, 'PAGE_CONFIGURATION.ErrorSaveConfiguration', e);
      });
    }
  }

  getReplacementCommas(replacements: MaintenanceElementModel[]): string {
    return this.configurationService.getReplacement(replacements);
  }

  closeModal() {
    this.controlService.closeModal(this.modalController);
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
}
