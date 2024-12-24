import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

// LIBRARIES
import { File, Entry } from '@awesome-cordova-plugins/file/ngx';
import { TranslateService } from '@ngx-translate/core';

// MODELS
import {
  ModalInputModel, SystemConfigurationModel, WearVehicleProgressBarViewModel, ISettingModel,
  ModalHeaderInputModel
} from '@models/index';

// UTILS
import { Constants, ConstantsTable, PageEnum, ToastTypeEnum } from '@utils/index';
import { environment } from '@environment/environment';

// SERVICES
import { SettingsService, DataBaseService, ControlService, ThemeService, SyncService, ExportService, DataService, CRUDService, LogService } from '@services/index';

@Component({
  selector: 'settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    @Input() modalInputModel: ModalInputModel<any, WearVehicleProgressBarViewModel> = new ModalInputModel<any, WearVehicleProgressBarViewModel>();
    modalHeaderInput: ModalHeaderInputModel = new ModalHeaderInputModel();

    // MODEL FORM

    // DATA SETTINGS
    listSettings: SystemConfigurationModel[] = [];
    listDistances: any[] = [];
    distanceSelected: any = {};
    listMoney: ISettingModel[] = [];
    moneySelected: any = {};

    // DATA THEMES
    listThemes: ISettingModel[] = [];
    themeSelected: any = { code: 'L'};

    // DATA EXPORTS AND IMPORTS
    listImportsFile: Entry[] = [];
    importFileSelected = '';
    lastExport = '';
    pathExports = '';
    pathImports = '';

    // DATA PRIVACY POLICY
    acceptPrivacyPolicy: boolean;

    // SYNC
    syncEmail = '';
    syncCode = '';
    synchronizingDownload = false;
    synchronizingUpload = false;
    pwdSync = 0;

    // VERSION
    versionApp: string = `Version app: ${environment.lastVersion}`;
    versionDateApp: string = `${environment.lastUpdate}`;

    constructor(private readonly changeDetector: ChangeDetectorRef,
                private readonly modalController: ModalController,
                private readonly dbService: DataBaseService,
                private readonly crudService: CRUDService,
                private readonly dataService: DataService,
                private readonly settingsService: SettingsService,
                private readonly exportService: ExportService,
                private readonly file: File,
                private readonly controlService: ControlService,
                private readonly translator: TranslateService,
                private readonly themeService: ThemeService,
                private readonly syncService: SyncService,
                private readonly logService: LogService
      ) {
  }

  ngOnInit() {
    this.modalHeaderInput = new ModalHeaderInputModel({
      title: 'COMMON.SETTINGS'
    });

    this.exportService.createOutputDirectory();

    // SETTINGS
    this.listDistances = this.settingsService.getListDistance();
    this.listMoney = this.settingsService.getListMoney();
    this.listThemes = this.settingsService.getListThemes();

    this.listSettings = this.dataService.getSystemConfigurationData();
    if (!!this.listSettings && this.listSettings.length > 0) {
      this.distanceSelected = this.settingsService.getDistanceSelected(this.listSettings);
      this.moneySelected = this.settingsService.getMoneySelected(this.listSettings);
      this.themeSelected = this.settingsService.getThemeSelected(this.listSettings);
      this.acceptPrivacyPolicy = this.settingsService.getPrivacySelected(this.listSettings);
      this.syncEmail = this.settingsService.getSyncEmailSelected(this.listSettings);
    }

    // EXPORTS AND IMPORTS
    this.pathExports = this.logService.getRootRelativePath(Constants.EXPORT_DIR_NAME);
    this.pathImports = this.translator.instant('COMMON.SELECT_FILE');

    this.getLastExportFile();
  }

  ngOnDestroy(): void {
     this.syncService.syncSignOut();
  }

  async closeModal() {
    this.controlService.closeModal(this.modalController);
  }

  // EVENTS SETTINGS

  changeDistance() {
    this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_DISTANCE, this.distanceSelected.code);
  }

  changeMoney() {
    this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_MONEY, this.moneySelected.code);
  }

  changeTheme() {
    this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_THEME, this.themeSelected.code);
    this.themeService.changeTheme(this.themeSelected.code);
  }

  changePrivacy() {
    const settings = this.dataService.getSystemConfigurationData();
    const policyDB = this.settingsService.getPrivacySelected(settings);
    if (policyDB !== this.acceptPrivacyPolicy) {
      this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_PRIVACY,
        (this.acceptPrivacyPolicy ? Constants.DATABASE_YES : Constants.DATABASE_NO)).then(x => {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS,
          (this.acceptPrivacyPolicy ? 'ALERT.InfoAcceptPrivacyPolicy' : 'ALERT.InfoRejectPrivacyPolicy'));
      }).catch(e => {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.InfoErrorSaveSettings', e);
      });
    }
  }

  /** EXPORTS AND IMPORTS */

  // EPXPORT DATA
  exportData() {
    this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.MANAGE_DATA'),
      this.translator.instant('PAGE_HOME.ConfirmExportDB', { path: this.logService.getRootRelativePath(Constants.EXPORT_DIR_NAME) }),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.exportDBToJson();
        }
      }
    );
  }

  exportDBToJson() {
    this.crudService.getAllDataFromStorage().then((json: any) => {
      const exportFileName: string = this.exportService.generateNameExportFile(Constants.EXPORT_FILE_NAME);
      try {
        this.file.writeFile(this.logService.getRootPathFiles(Constants.EXPORT_DIR_NAME), exportFileName,
          JSON.stringify(json), { replace : true}).then(() => {
              this.getLastExportFile();
              this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.SaveExportDB', {file: exportFileName});
            }).catch(err => {
              this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorWritingFile', err);
            });
        } catch(e: any) {
          this.exportService.exportJsonWeb(json, exportFileName);          
          this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.MODAL_SETTINGS, 'This function is not available', e);
        }
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorExportDB', e);
    });
  }

  // IMPORT DATA
  validFileAndImport(event: any) {
    if (!event.target.files || event.target.files.length === 0) {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'PAGE_HOME.InfoNotExistsImportFile');
    } else if (event.target.files[0].type !== 'application/json' || !event.target.files[0].type.includes('json')) {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'PAGE_HOME.FileMandatoryJSON');
      this.clearInputFile(event);
    } else {
      this.readFileJson(event);
    }
  }

  clearInputFile(event: any) {
    event.target.value = '';
    this.pathImports = this.translator.instant('COMMON.SELECT_FILE');
  }

  readFileJson(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const contentFile: string = e.target.result;
      if (this.exportService.validateStructureJsonDB(contentFile, this.crudService.getAllTables())) {
        this.pathImports = file.name;
        this.importData(contentFile, event);
      } else {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'PAGE_HOME.ErrorFormatDB');
        this.clearInputFile(event);
      }
    };
    reader.onerror = (error) => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorReadingFile');
      this.clearInputFile(event);
    };
    reader.readAsText(file);
  }

  importData(contentFile: string, event: any) {
    this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.MANAGE_DATA'),
      this.translator.instant('PAGE_HOME.ConfirmImportDB'),
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.backupAndimportJsonToDB(contentFile, event);
          }
        },
        () => { this.clearInputFile(event); }
    );
  }

  backupAndimportJsonToDB(contentFile: string, event: any) {
    // Backup
    this.crudService.getAllDataFromStorage().then((json: any) => {
      const backupFileName: string = this.exportService.generateNameExportFile(Constants.BACKUP_FILE_NAME);
      // Write backup file
      try {
        this.file.writeFile(this.logService.getRootPathFiles(Constants.IMPORT_DIR_NAME), backupFileName,
          JSON.stringify(json), { replace : true}).then(() => {
            // IMPORT DB
            this.importJsonToDB(contentFile, event);
        }).catch(err => {
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorWritingBackupFile', err);
          this.clearInputFile(event);
        });
      } catch(e: any) {
        this.importJsonToDB(contentFile, event);
        this.logService.logInfo(ToastTypeEnum.DANGER, PageEnum.MODAL_SETTINGS, 'This function is not available', e);
      }
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorBackupDB', e);
      this.clearInputFile(event);
    });
  }

  importJsonToDB(contentFile: string, event: any) {
    const jsonToImport: any = this.mapDataFromContentFile(contentFile);
    if(this.syncService.validateVersionToImport(this.settingsService.getVersionSelected(jsonToImport[ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION]).value)) {
      this.dbService.saveDataIntoStorage(jsonToImport).then(() => {
        this.crudService.loadAllTables();
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.SaveImportDB');
      }).catch(e => {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorImportDB', e);
        this.clearInputFile(event);
      });
    }
  }

  mapDataFromContentFile(contentFile: string): any {
    const contentFileJson: any = JSON.parse(contentFile);
    if (contentFileJson.data) return contentFileJson.data.inserts;
    if (contentFileJson.inserts) return contentFileJson.inserts;
    return contentFileJson;
  }

  // GET LIST FILES
  getLastExportFile() {
    try {
      this.file.listDir(this.logService.getRootPathFiles(), Constants.EXPORT_DIR_NAME).then((listFiles: Entry[]) => {
        this.lastExport = '';
        const listActual: Entry[] = listFiles.filter(x => x.name.includes(Constants.FORMAT_FILE_DB));
        if (!!listActual && listActual.length > 0) {
          this.lastExport = listActual[listActual.length - 1].name;
        }
        this.changeDetector.detectChanges();
      }).catch(err => {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorListingFiles', err);
      });
    } catch(e: any) {
      this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.MODAL_SETTINGS, 'This function is not available', e);
    }
  }

  showRealExportPath() {
    this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.INFO,
      this.exportService.getRootRealRelativePath(Constants.EXPORT_DIR_NAME));
  }

  showRealImportPath() {
    this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.INFO,
      this.exportService.getRootRealRelativePath(Constants.IMPORT_DIR_NAME));
  }

  showGuideExportImport() {
    const guideTranslate: string = this.translator.instant('PAGE_HOME.GuideExportImport');
    const guide1Translate: string = this.translator.instant('PAGE_HOME.GuideStep1',
      {path: this.exportService.getRootRealRelativePath(Constants.EXPORT_DIR_NAME)});
    const guide2Translate: string = this.translator.instant('PAGE_HOME.GuideStep2',
      {path: this.exportService.getRootRealRelativePath(Constants.IMPORT_DIR_NAME)});
    const guide3Translate: string = this.translator.instant('PAGE_HOME.GuideStep3');
    this.controlService.alertInfo(PageEnum.MODAL_SETTINGS,
      `${guide1Translate}</br>${guide2Translate}</br>${guide3Translate}`, guideTranslate);
  }

  // DELETE FILES
  deleteExportFiles() {
    this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.MANAGE_DATA'),
      this.translator.instant('PAGE_HOME.ConfirmDeleteExportFile',
        { path: this.logService.getRootRelativePath(Constants.EXPORT_DIR_NAME) }),
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.deleteFiles(Constants.EXPORT_DIR_NAME);
          }
        }
      );
  }

  deleteFiles(path: string) {
    try {
      this.file.listDir(this.logService.getRootPathFiles(), path).then((listFiles: Entry[]) => {
        const listActual: Entry[] = listFiles.filter(x => x.name.includes(Constants.FORMAT_FILE_DB));
        if (!!listActual && listActual.length > 0) {
          listActual.forEach(f => {
            this.file.removeFile(this.logService.getRootPathFiles(path), f.name);
          });
          this.getLastExportFile();
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.DeleteExportDB',
            {path: this.logService.getRootRelativePath(path)});
        } else {
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'PAGE_HOME.InfoNotExistsFilesToDelete');
        }
      }).catch(err => {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorListingFiles', err);
      });
    } catch(e: any) {
      this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.MODAL_SETTINGS, 'This function is not available', e);
    }
  }

  // PRIVACY POLICY
  showPrivacyPolicy() {
    this.controlService.showPrivacyPolicy();
  }

  // SYNCHRONIZE
  unlockSync(order: number, num: number) {
    if ((order === 1 && this.pwdSync === 0) ||
        (order === 3 && this.pwdSync === 2) ||
        (order === 2 && this.pwdSync === 7) ||
        (order === 4 && this.pwdSync === 15) ||
        (order === 3 && this.pwdSync === 24)) {
      this.pwdSync += num;
    } else {
      this.pwdSync = 0;
    }
  }

  showInfoSynchronize() {
    this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.INFO, 'ALERT.InfoSync', null, Constants.DELAY_TOAST_HIGH);
  }

  syncDownload() {
    this.saveSyncData();
    this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.SYNCHRONIZE'),
      this.translator.instant('PAGE_HOME.ConfirmSyncDownload', { email: this.syncEmail }),
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.synchronizingDownload = true;
            this.syncService.syncDownload(this.syncEmail, this.syncCode).then(() => { this.synchronizingDownload = false; });
          }
        });
  }

  syncUpload() {
    this.saveSyncData();
    this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.SYNCHRONIZE'),
      this.translator.instant('PAGE_HOME.ConfirmSyncUpload', { email: this.syncEmail }),
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.synchronizingUpload = true;
            this.syncService.syncUpload(this.syncEmail, this.syncCode).then(() => { this.synchronizingUpload = false; });
          }
        });
  }

  saveSyncData() {
    if (this.settingsService.getSyncEmailSelected(this.listSettings) !== this.syncEmail) {
      this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_SYNC_EMAIL, this.syncEmail);
    }
  }
}
