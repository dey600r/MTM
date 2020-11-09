import { Injectable } from '@angular/core';

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
}
