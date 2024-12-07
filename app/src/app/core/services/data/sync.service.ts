import { Injectable } from '@angular/core';

// LIBRARIES
import { File } from '@awesome-cordova-plugins/file/ngx';
import { getDatabase, set, ref, get, child } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';

// SERVICES
import { ControlService, LogService, CommonService } from '../common/index';
import { DataBaseService } from './data-base.service';
import { ExportService } from './export.service';
import { CRUDService } from './crud.service';
import { SettingsService } from '../modals/index';

// UTILS
import * as loginData from '@assets/data/login-firebase.json';
import { Constants, ConstantsTable, PageEnum, ToastTypeEnum } from '@utils/index';
import { environment } from '@environment/environment';

// MODALS
import { SystemConfigurationModel } from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  login = false;

  constructor(private readonly dbService: DataBaseService,
              private readonly crudService: CRUDService,
              private readonly exportService: ExportService,
              private readonly controlService: ControlService,
              private readonly settingsService: SettingsService,
              private readonly file: File,
              private readonly logService: LogService,
              private readonly commonService: CommonService) { }

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
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncLogout', { error: error.message }, error);
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
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncLogin', { error: error.message }, error);
        });
    });
  }

  private async syncDownloadData(userCredential: UserCredential) {
    // GET FROM FIREBASE
    await get(child(ref(getDatabase()), this.getPathUser(userCredential.user.uid))).then(async snapshot => {
      const data = snapshot.val();
      if (this.validSyncDownloadData(data)) {
        // EXPORT DB
        await this.crudService.getAllDataFromStorage().then(async (json: any) => {
          const backupFileName: string = this.exportService.generateNameExportFile(Constants.BACKUP_SYNC_FILE_NAME);
          // WRITE BACKUP FILE
          try {
            await this.file.writeFile(this.logService.getRootPathFiles(Constants.IMPORT_DIR_NAME), backupFileName,
              JSON.stringify(json), { replace : true}).then(() => {
                // This is intentional
            }).catch(err => {
              this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorWritingBackupFile');
            });
          } catch(e: any) {
            this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `Error creating backup file sync`, e);
          }
          const dataImport: any = json;
          this.crudService.getSyncTables().forEach(x => {
              dataImport[x] = JSON.parse(data[x]);
          });
          // IMPORT DB
          await this.dbService.saveDataIntoStorage(dataImport).then(() => {
            this.crudService.loadAllTables();
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.SyncDownload');
          }).catch(e => {
            this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorImportDB', e);
          });
        }).catch(e => {
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorExportDB', e);
        });
      }
    }).catch((error) => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncDownload', { error: error.message }, error);
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
    await this.crudService.getAllDataFromStorage().then(async (json: any) => {
      const syncdata: any = {};
      this.crudService.getSyncTables().forEach(x => {
          syncdata[x] = JSON.stringify(json[x]);
      });
      // SAVE DATA
      await set(ref(getDatabase(), this.getPathUser(userCredential.user.uid)), syncdata).then(() => {
          this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.SUCCESS, 'PAGE_HOME.SyncUpload');
      })
      .catch((error) => {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'ALERT.ErrorSyncUpload', { error: error.message }, error);
      });
    }).catch(e => {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.DANGER, 'PAGE_HOME.ErrorExportDB', e);
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
          this.exportService.validateStructureJsonDB(JSON.stringify(data), this.crudService.getSyncTables())) {
        return this.validateVersionToImport(this.settingsService.getVersionSelected(settings).value);
      } else {
        this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'PAGE_HOME.ErrorFormatDB');
      }
    } else {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'ALERT.ErrorSyncDataNotFound');
    }
    return false;
  }

  validateVersionToImport(newVersion: string): boolean {
    const syncVersion: number = this.commonService.getVersion(newVersion);
    const minVersion: number = this.commonService.getVersion(environment.minVersion);
    const result: boolean = syncVersion && syncVersion >= minVersion;
    if (!result) {
      this.controlService.showToast(PageEnum.MODAL_SETTINGS, ToastTypeEnum.WARNING, 'ALERT.ErrorSyncVersion',
        { version: environment.minVersion, versionNow: environment.lastVersion, versionSync: newVersion }, Constants.DELAY_TOAST_HIGH);
    }
    return result;
  }
}
