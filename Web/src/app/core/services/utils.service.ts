import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { Constants } from '@utils/constants';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  joinPath(paths: string []): string {
    let result = '.';
    paths.forEach(path => {
      result += `/${path}`;
    });
    return result;
  }

  getPathImages(type: string): string {
    return (type === Constants.TYPE_APP_ANDROID ?
      environment.pathImagesAndroid : environment.pathImagesWindows);
  }
}
