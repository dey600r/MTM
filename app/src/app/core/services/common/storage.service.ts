import { Injectable } from '@angular/core';


import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Injectable({
    providedIn: 'root'
  })
  export class StorageService {
  
    constructor(private nativeStorage: NativeStorage) {
    }

    public setData(key: string, value: any[]) {
        this.nativeStorage.setItem(key, value)
          .then(
            () => console.log('Stored item ->' + key),
            error => console.error('Error storing item', error)
          );
    }

    public getData(key: string): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
          this.nativeStorage.getItem(key).then(value => {
            console.log(key, value);
            resolve(value);
          }, error => {
            console.error(key, error);
            resolve([]);
          })
        });
    }
    //   this.nativeStorage.keys().then(value => {
    //     console.log(value);
    //   });
}