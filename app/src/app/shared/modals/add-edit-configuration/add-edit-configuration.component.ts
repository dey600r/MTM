import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// UTILS
import { ActionDBEnum, ConstantsColumns, ModalTypeEnum, PageEnum, ToastTypeEnum } from '@utils/index';
import { ModalInputModel, ConfigurationModel, MaintenanceModel, MaintenanceElementModel, ISettingModel, HeaderInputModel } from '@models/index';
import { DataService, UtilsService, ConfigurationService, ControlService, SettingsService } from '@services/index';

@Component({
    selector: 'app-add-edit-configuration',
    templateUrl: 'add-edit-configuration.component.html',
    styleUrls: [],
    standalone: false
})
export class AddEditConfigurationComponent implements OnInit {

  // INJECTIONS
  private readonly modalController: ModalController = inject(ModalController);
  private readonly dataService: DataService = inject(DataService);
  private readonly utilsService: UtilsService = inject(UtilsService);
  private readonly controlService: ControlService = inject(ControlService);
  private readonly settingsService: SettingsService = inject(SettingsService);
  private readonly configurationService: ConfigurationService = inject(ConfigurationService);

  // MODAL MODELS
  @Input() modalInputModel: ModalInputModel<ConfigurationModel> = new ModalInputModel<ConfigurationModel>();
  headerInput: HeaderInputModel = new HeaderInputModel();

  // MODEL FORM
  configuration: ConfigurationModel = new ConfigurationModel();
  submited = false;

  // DATA
  maintenances: MaintenanceModel[] = [];
  toggleMaintenaces: boolean[] = [];
  measure: ISettingModel;
  
  ngOnInit() {
    this.headerInput = new HeaderInputModel({
      title: (this.modalInputModel.type == ModalTypeEnum.CREATE ? 'PAGE_CONFIGURATION.AddNewConfiguration' : 'PAGE_CONFIGURATION.EditConfiguration')
    });

    const settings = this.dataService.getSystemConfigurationData();
    if (!!settings && settings.length > 0) {
      this.measure = this.settingsService.getDistanceSelected(settings);
    }

    this.configuration = Object.assign({}, this.modalInputModel.data);
    
    this.maintenances = this.utilsService.orderBy(this.dataService.getMaintenanceData(), ConstantsColumns.COLUMN_MTM_MAINTENANCE_KM);
    if (this.modalInputModel.type === ModalTypeEnum.CREATE) {
      this.configuration.id = -1;
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
          (this.modalInputModel.type === ModalTypeEnum.CREATE ? ActionDBEnum.CREATE : ActionDBEnum.UPDATE)).then(res => {
        this.closeModal();
        this.controlService.showToast(PageEnum.MODAL_CONFIGURATION, ToastTypeEnum.SUCCESS,
          (this.modalInputModel.type === ModalTypeEnum.CREATE ? 'PAGE_CONFIGURATION.AddSaveConfiguration' : 'PAGE_CONFIGURATION.EditSaveConfiguration'),
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
