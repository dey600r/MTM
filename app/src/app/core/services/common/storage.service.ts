import { Injectable } from '@angular/core';


import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Injectable({
    providedIn: 'root'
  })
  export class StorageService {
  
    constructor(private nativeStorage: NativeStorage) {
    }

    public setData(key: string, value: any[]): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        this.nativeStorage.setItem(key, value)
          .then(() => {
            console.log('Stored item -> ' + key);
            resolve(true);
          }, error => {
            console.error('Error storing item ->' + key, error)
            reject(error);
          });
        });
    }

    public getData(key: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
          this.nativeStorage.getItem(key).then(value => {
            resolve(value);
          }, error => {
            console.error('Error getting item -> ' + key, error);
            reject(error);
          })
        });
    }
    //   this.nativeStorage.keys().then(value => {
    //     console.log(value);
    //   });
}