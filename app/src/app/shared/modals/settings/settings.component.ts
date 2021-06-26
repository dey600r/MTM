import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { File, Entry } from '@ionic-native/file/ngx';
import { TranslateService } from '@ngx-translate/core';

// MODELS
import {
  ModalInputModel, ModalOutputModel
} from '@models/index';

// UTILS
import { Constants, PageEnum, ConstantsTable, ToastTypeEnum } from '@utils/index';

// SERVICES
import { SettingsService, DataBaseService, ControlService, ThemeService } from '@services/index';

@Component({
  selector: 'settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss', '../../../app.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();

    // MODEL FORM

    // DATA SETTINGS
    listDistances: any[] = [];
    distanceSelected: any = {};
    listMoney: any[] = [];
    moneySelected: any = {};

    // DATA THEMES
    listThemes: string [] = [];
    themeSelected: any = { code: 'L'};

    // DATA EXPORTS AND IMPORTS
    listImportsFile: Entry[] = [];
    importFileSelected = '';
    lastExport = '';
    pathExports = '';
    pathImports = '';

    // SUBSCRIPTION
    settingsSubscription: Subscription = new Subscription();

    constructor(private navParams: NavParams,
                private changeDetector: ChangeDetectorRef,
                private modalController: ModalController,
                private dbService: DataBaseService,
                private settingsService: SettingsService,
                private file: File,
                private sqlitePorter: SQLitePorter,
                private controlService: ControlService,
                private translator: TranslateService,
                private themeService: ThemeService) {
  }

  ngOnInit() {
    this.settingsService.createOutputDirectory();

    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    // SETTINGS
    this.listDistances = this.settingsService.getListDistance();
    this.listMoney = this.settingsService.getListMoney();
    this.listThemes = this.settingsService.getListThemes();

    this.settingsSubscription = this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.distanceSelected = this.settingsService.getDistanceSelected(settings);
        this.moneySelected = this.settingsService.getMoneySelected(settings);
        this.themeSelected = this.settingsService.getThemeSelected(settings);
      }
    });

    // EXPORTS AND IMPORTS

    this.pathExports = this.settingsService.getRootRelativePath(Constants.EXPORT_DIR_NAME);
    this.pathImports = this.translator.instant('COMMON.SELECT_FILE');

    this.getLastExportFile();
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
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

  /** EXPORTS AND IMPORTS */

  // EPXPORT DATA
  exportData() {
    this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.MANAGE_DATA'),
      this.translator.instant('PAGE_HOME.ConfirmExportDB', { path: this.settingsService.getRootRelativePath(Constants.EXPORT_DIR_NAME) }),
      {
        text: this.translator.instant('COMMON.ACCEPT'),
        handler: () => {
          this.exportDBToJson();
        }
      }
    );
  }

  exportDBToJson() {
    this.sqlitePorter.exportDbToJson(this.dbService.getDB()).then((json: any) => {
      const exportFileName: string = this.settingsService.generateNameExportFile(Constants.EXPORT_FILE_NAME);
      this.file.writeFile(this.settingsService.getRootPathFiles(Constants.EXPORT_DIR_NAME), exportFileName,
        JSON.stringify(json), { replace : true}).then(() => {
            this.getLastExportFile();
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.SaveExportDB', {file: exportFileName});
          }).catch(err => {
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorWritingFile');
          });
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorExportDB');
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
      if (this.validateStructureJsonDB(contentFile)) {
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
            this.importJsonToDB(contentFile, event);
          }
        },
        () => { this.clearInputFile(event); }
      );
  }

  validateStructureJsonDB(contentFile: string): boolean {
    return contentFile.includes(ConstantsTable.TABLE_MTM_CONFIGURATION) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_CONFIG_MAINT) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_MAINTENANCE) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_MAINTENANCE_ELEMENT_REL) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_MAINTENANCE_FREQ) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_OPERATION) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_OPERATION_TYPE) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_OP_MAINT_ELEMENT) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_VEHICLE) &&
    contentFile.includes(ConstantsTable.TABLE_MTM_VEHICLE_TYPE);
  }

  importJsonToDB(contentFile: string, event: any) {
    // Backup
    this.sqlitePorter.exportDbToJson(this.dbService.getDB()).then((json: any) => {
      const backupFileName: string = this.settingsService.generateNameExportFile(Constants.BACKUP_FILE_NAME);
      // Write backup file
      this.file.writeFile(this.settingsService.getRootPathFiles(Constants.IMPORT_DIR_NAME), backupFileName,
        JSON.stringify(json), { replace : true}).then(() => {
            // IMPORT DB
            this.sqlitePorter.importJsonToDb(this.dbService.getDB(), JSON.parse(contentFile)).then((ok: any) => {
              this.settingsService.insertSystemConfiguration();
              this.dbService.loadAllTables();
              this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.SaveImportDB');
            }).catch(e => {
              this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorImportDB');
              this.clearInputFile(event);
            });
          }).catch(err => {
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorWritingBackupFile');
            this.clearInputFile(event);
          });
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorBackupDB');
      this.clearInputFile(event);
    });
  }

  // GET LIST FILES
  getLastExportFile() {
    this.file.listDir(this.settingsService.getRootPathFiles(), Constants.EXPORT_DIR_NAME).then((listFiles: Entry[]) => {
      this.lastExport = '';
      const listActual: Entry[] = listFiles.filter(x => x.name.includes(Constants.FORMAT_FILE_DB));
      if (!!listActual && listActual.length > 0) {
        this.lastExport = listActual[listActual.length - 1].name;
      }
      this.changeDetector.detectChanges();
    }).catch(err => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorListingFiles');
    });
  }

  showRealExportPath() {
    this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.INFO,
      this.settingsService.getRootRealRelativePath(Constants.EXPORT_DIR_NAME));
  }

  showRealImportPath() {
    this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.INFO,
      this.settingsService.getRootRealRelativePath(Constants.IMPORT_DIR_NAME));
  }

  showGuideExportImport() {
    const guideTranslate: string = this.translator.instant('PAGE_HOME.GuideExportImport');
    const guide1Translate: string = this.translator.instant('PAGE_HOME.GuideStep1',
      {path: this.settingsService.getRootRealRelativePath(Constants.EXPORT_DIR_NAME)});
    const guide2Translate: string = this.translator.instant('PAGE_HOME.GuideStep2',
      {path: this.settingsService.getRootRealRelativePath(Constants.IMPORT_DIR_NAME)});
    const guide3Translate: string = this.translator.instant('PAGE_HOME.GuideStep3');
    this.controlService.alertInfo(PageEnum.MODAL_SETTINGS,
      `${guide1Translate}</br>${guide2Translate}</br>${guide3Translate}`, guideTranslate);
  }

  // DELETE FILES
  deleteExportFiles() {
    this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.MANAGE_DATA'),
      this.translator.instant('PAGE_HOME.ConfirmDeleteExportFile',
        { path: this.settingsService.getRootRelativePath(Constants.EXPORT_DIR_NAME) }),
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.deleteFiles(Constants.EXPORT_DIR_NAME);
          }
        }
      );
  }

  deleteFiles(path: string) {
    this.file.listDir(this.settingsService.getRootPathFiles(), path).then((listFiles: Entry[]) => {
      const listActual: Entry[] = listFiles.filter(x => x.name.includes(Constants.FORMAT_FILE_DB));
      if (!!listActual && listActual.length > 0) {
        listActual.forEach(f => {
          this.file.removeFile(this.settingsService.getRootPathFiles(path), f.name);
        });
        this.getLastExportFile();
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.DeleteExportDB',
          {path: this.settingsService.getRootRelativePath(path)});
      } else {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'PAGE_HOME.InfoNotExistsFilesToDelete');
      }
    }).catch(err => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorListingFiles');
    });
  }
}
