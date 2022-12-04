import { Injectable } from '@angular/core';

// LIBRARIES
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { getDatabase, set, ref, get, child } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';

// SERVICES
import { DataBaseService } from './data-base.service';
import { ControlService } from './control.service';
import { ExportService } from './export.service';
import { SettingsService } from '../modals/index';

// UTILS
import * as loginData from '@assets/data/login-firebase.json';
import { Constants, ConstantsTable, PageEnum, ToastTypeEnum } from '@utils/index';

// MODLS
import { SystemConfigurationModel } from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  login = false;

  constructor(private sqlitePorter: SQLitePorter,
              private dbService: DataBaseService,
              private exportService: ExportService,
              private controlService: ControlService,
              private settingsService: SettingsService,
              private file: File) { }

  // syncRegisterUser(email: string, pwd: string) {
  //   const auth = getAuth();
  //   createUserWithEmailAndPassword(auth, email, pwd)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });
  // }

  syncSignOut() {
    if (this.login) {
      signOut(getAuth()).then(() => {
        this.login = false;
      }).catch((error) => {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncLogout', { error: error.message });
      });
    }
  }
  syncDownload(email: string, pwd: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        // INIT APP WITH API KEY
        initializeApp(loginData);
        // LOGIN EMAIL AND PASSWORD
        signInWithEmailAndPassword(getAuth(), email, pwd).then(async (userCredential: UserCredential) => {
          this.login = true;
          await this.syncDownloadData(userCredential);
          resolve(true);
        })
        .catch((error) => {
          resolve(false);
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncLogin', { error: error.message });
        });
    });
  }

  private async syncDownloadData(userCredential: UserCredential) {
    // GET FROM FIREBASE
    await get(child(ref(getDatabase()), this.getPathUser(userCredential.user.uid))).then(async snapshot => {
      const data = snapshot.val();
      if (this.validSyncDownloadData(data)) {
        // EXPORT DB
        await this.sqlitePorter.exportDbToJson(this.dbService.getDB()).then(async (json: any) => {
          const backupFileName: string = this.exportService.generateNameExportFile(Constants.BACKUP_SYNC_FILE_NAME);
          // WRITE BACKUP FILE
          await this.file.writeFile(this.exportService.getRootPathFiles(Constants.IMPORT_DIR_NAME), backupFileName,
            JSON.stringify(json), { replace : true}).then(() => {
              // This is intentional
          }).catch(err => {
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorWritingBackupFile');
          });
          const dataImport: any = json;
          this.dbService.getSyncTables().forEach(x => {
              dataImport.data.inserts[x] = JSON.parse(data[x]);
          });
          // IMPORT DB
          await this.sqlitePorter.importJsonToDb(this.dbService.getDB(), dataImport).then(() => {
            this.settingsService.finishImportLoad();
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.SyncDownload');
          }).catch(e => {
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorImportDB');
          });
        }).catch(e => {
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorExportDB');
        });
      }
    }).catch((error) => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncDownload', { error: error.message });
    });
  }

  syncUpload(email: string, pwd: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      // INIT APP WITH API KEY
      initializeApp(loginData);
      // LOGIN EMAIL AND PASSWORD
      signInWithEmailAndPassword(getAuth(), email, pwd).then(async (userCredential: UserCredential) => {
        this.login = true;
        await this.syncUploadData(userCredential);
        resolve(true);
      }).catch((error) => {
        resolve(false);
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncLogin', { error: error.message });
      });
    });
  }

  private async syncUploadData(userCredential: UserCredential) {
    // EXPORT DB
    await this.sqlitePorter.exportDbToJson(this.dbService.getDB()).then(async (json: any) => {
      const syncdata: any = {};
      this.dbService.getSyncTables().forEach(x => {
          syncdata[x] = JSON.stringify(json.data.inserts[x]);
      });
      // SAVE DATA
      await set(ref(getDatabase(), this.getPathUser(userCredential.user.uid)), syncdata).then(() => {
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.SyncUpload');
      })
      .catch((error) => {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncUpload', { error: error.message });
      });
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorExportDB');
    });
  }

  // FUNCTIONS

  getPathUser(uid: string): string {
    return `${Constants.SYNC_PATH_USERS}/${uid}/`;
  }

  validSyncDownloadData(data: any): boolean {
    if (data) {
      const settings: SystemConfigurationModel[] = JSON.parse(data[ConstantsTable.TABLE_MTM_SYSTEM_CONFIGURATION]);
      if (settings && settings.length >= 6 &&
          this.exportService.validateStructureJsonDB(JSON.stringify(data), this.dbService.getSyncTables())) {
        const syncVersion: SystemConfigurationModel = this.settingsService.getVersionSelected(settings);
        const appVersion: SystemConfigurationModel = this.settingsService.getVersionSelected(this.dbService.getSystemConfigurationData());
        if (syncVersion && syncVersion.value === appVersion.value) {
          return true;
        } else {
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'ALERT.ErrorSyncVersion',
            { version: syncVersion.value, versionNow: appVersion.value }, Constants.DELAY_TOAST_HIGH);
        }
      } else {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'PAGE_HOME.ErrorFormatDB');
      }
    } else {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'ALERT.ErrorSyncDataNotFound');
    }
    return false;
  }
}
