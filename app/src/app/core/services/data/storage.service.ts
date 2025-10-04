import { inject, Injectable } from '@angular/core';

// SERVICES
import { LogService } from '../common/log.service';

// UTILS
import { ToastTypeEnum, PageEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
  })
  export class StorageService {

    //INJECTIONS
    private readonly logService: LogService = inject(LogService);
    private readonly storage: Storage = window.localStorage;

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
            let result: string = this.storage.getItem(key);
            if(result === null || result === undefined) {
              this.logService.logInfo(ToastTypeEnum.WARNING, PageEnum.HOME, `Error getting item ${key}`);
              reject(`Error getting item ${key}`);
            } else {
              resolve(JSON.parse(result));
            }            
          } catch(error) {
            this.logService.logInfo(ToastTypeEnum.DANGER, PageEnum.HOME, `Error getting item ${key}`, error);
            reject(error);
          }
        });
    }
}