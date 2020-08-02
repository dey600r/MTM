import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

// LIBRARIES
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { File, Entry } from '@ionic-native/file/ngx';
import { TranslateService } from '@ngx-translate/core';

// UTILS
import {
  ModalInputModel, ModalOutputModel
} from '@models/index';
import { Constants, PageEnum } from '@utils/index';
import { SettingsService, DataBaseService, ControlService } from '@services/index';

@Component({
  selector: 'settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss', '../../../app.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

    // MODAL MODELS
    modalInputModel: ModalInputModel = new ModalInputModel();
    modalOutputModel: ModalOutputModel = new ModalOutputModel();

    // MODEL FORM

    // DATA SETTINGS
    listDistances: any[] = [];
    distanceSelected: any = {};
    listMoney: any[] = [];
    moneySelected: any = {};

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
                private translator: TranslateService) {
  }

  ngOnInit() {
    this.modalInputModel = new ModalInputModel(this.navParams.data.isCreate,
        this.navParams.data.data, this.navParams.data.dataList, this.navParams.data.parentPage);

    // SETTINGS
    this.listDistances = this.settingsService.getListDistance();
    this.listMoney = this.settingsService.getListMoney();

    this.settingsSubscription = this.dbService.getSystemConfiguration().subscribe(settings => {
      if (!!settings && settings.length > 0) {
        this.distanceSelected = this.settingsService.getDistanceSelected(settings);
        this.moneySelected = this.settingsService.getMoneySelected(settings);
      }
    });

    // EXPORTS AND IMPORTS

    this.pathExports = this.settingsService.getRootRelativePath(Constants.EXPORT_DIR_NAME);
    this.pathImports = this.settingsService.getRootRelativePath(Constants.IMPORT_DIR_NAME);
    this.getListImportsFile();
    this.getLastExportFile();
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
  }

  async closeModal() {
    this.modalOutputModel = new ModalOutputModel(true);
    await this.modalController.dismiss(this.modalOutputModel);
  }

  /** SETTINGS */

  // EVENTS SETTINGS

  changeDistance() {
    this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_DISTANCE, this.distanceSelected.code);
  }

  changeMoney() {
    this.settingsService.saveSystemConfiguration(Constants.KEY_CONFIG_MONEY, this.moneySelected.code);
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
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.SaveExportDB', {file: exportFileName});
          }).catch(err => {
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.ErrorWritingFile');
          });
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.ErrorExportDB');
    });
  }

  // IMPORT DATA
  importData() {
    if (!!this.importFileSelected) {
      this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.MANAGE_DATA'),
      this.translator.instant('PAGE_HOME.ConfirmImportDB', { path: this.settingsService.getRootRelativePath(Constants.EXPORT_DIR_NAME) }),
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.importJsonToDB();
          }
        }
      );
    } else {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'ALERT.InfoNotExistsImportFile',
        {path: this.settingsService.getRootRelativePath(Constants.IMPORT_DIR_NAME)}, Constants.DELAY_TOAST_HIGH);
    }
  }

  importJsonToDB() {
    // Backup
    this.sqlitePorter.exportDbToJson(this.dbService.getDB()).then((json: any) => {
      const backupFileName: string = this.settingsService.generateNameExportFile(Constants.BACKUP_FILE_NAME);
      // Write backup file
      this.file.writeFile(this.settingsService.getRootPathFiles(Constants.IMPORT_DIR_NAME), backupFileName,
        JSON.stringify(json), { replace : true}).then(() => {
            this.getListImportsFile();
            // Read import file
            this.file.readAsText(this.settingsService.getRootPathFiles(Constants.IMPORT_DIR_NAME),
              this.importFileSelected).then(contentFile => {
              // IMPORT DB
              this.sqlitePorter.importJsonToDb(this.dbService.getDB(), JSON.parse(contentFile)).then((ok: any) => {
                this.dbService.loadAllTables();
                this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.SaveImportDB');
              }).catch(e => {
                this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.ErrorImportDB');
              });
            });
          }).catch(err => {
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.ErrorWritingBackupFile');
          });
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.ErrorBackupDB');
    });
  }

  // GET LIST FILES
  getListImportsFile() {
    this.file.listDir(this.settingsService.getRootPathFiles(), Constants.IMPORT_DIR_NAME).then((listFiles: Entry[]) => {
      this.listImportsFile = [];
      const listActual: Entry[] = listFiles.filter(x => x.name.includes(Constants.FORMAT_FILE_DB));
      if (!!listActual && listActual.length > 0) {
        this.listImportsFile = listActual;
      }
      this.changeDetector.detectChanges();
    }).catch(err => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.ErrorListingFiles');
    });
  }

  getLastExportFile() {
    this.file.listDir(this.settingsService.getRootPathFiles(), Constants.EXPORT_DIR_NAME).then((listFiles: Entry[]) => {
      this.lastExport = '';
      const listActual: Entry[] = listFiles.filter(x => x.name.includes(Constants.FORMAT_FILE_DB));
      if (!!listActual && listActual.length > 0) {
        this.lastExport = listActual[listActual.length - 1].name;
      }
      this.changeDetector.detectChanges();
    }).catch(err => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.ErrorListingFiles');
    });
  }

  showRealExportPath() {
    this.controlService.showToast(PageEnum.MODAL_SETTINGS, this.settingsService.getRootRealRelativePath(Constants.EXPORT_DIR_NAME));
  }

  showRealImportPath() {
    this.controlService.showToast(PageEnum.MODAL_SETTINGS, this.settingsService.getRootRealRelativePath(Constants.IMPORT_DIR_NAME));
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

  deleteImportFiles() {
    this.controlService.showConfirm(PageEnum.MODAL_SETTINGS, this.translator.instant('COMMON.MANAGE_DATA'),
      this.translator.instant('PAGE_HOME.ConfirmDeleteImportFile',
        { path: this.settingsService.getRootRelativePath(Constants.IMPORT_DIR_NAME) }),
        {
          text: this.translator.instant('COMMON.ACCEPT'),
          handler: () => {
            this.deleteFiles(Constants.IMPORT_DIR_NAME);
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
        let msg = '';
        switch (path) {
          case Constants.EXPORT_DIR_NAME:
            msg = 'PAGE_HOME.DeleteExportDB';
            this.getLastExportFile();
            break;
          case Constants.IMPORT_DIR_NAME:
            msg = 'PAGE_HOME.DeleteImportDB';
            this.getListImportsFile();
            break;
        }
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, msg, {path: this.settingsService.getRootRelativePath(path)});
      } else {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'ALERT.InfoNotExistsFilesToDelete');
      }
    }).catch(err => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, 'PAGE_HOME.ErrorListingFiles');
    });
  }
}
