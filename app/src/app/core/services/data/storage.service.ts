import { Injectable } from '@angular/core';

// SERVICES
import { LogService } from '../common/log.service';

// UTILS
import { ToastTypeEnum, PageEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
  })
  export class StorageService {

    private storage: Storage;
  
    constructor(private logService: LogService) {
      this.storage = window.localStorage;
    }

    public setData(key: string, value: any[]): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        try {
          this.storage.setItem(key, JSON.stringify(value));
          resolve(true);
        } catch(error) {
          this.logService.logInfo(ToastTypeEnum.DANGER, PageEnum.HOME, `Error storing item ${key}`, error);
          reject(error);
        }
      });
    }

    public getData(key: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
          try {
            resolve(JSON.parse((this.storage.getItem(key))));
          } catch(error) {
            this.logService.logInfo(ToastTypeEnum.DANGER, PageEnum.HOME, `Error getting item ${key}`, error);
            resolve([]);
          }
        });
    }
}