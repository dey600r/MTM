import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor() {
    }

    orderBy(data: any[], prop: string = null): any[] {
        return data.sort((x, y) => this.compareData(x, y , prop));
    }

    compareData(x: any, y: any, prop: string = null): number {
        if(x[prop] < y[prop]) {
            return -1;
        }
        if(x[prop] > y[prop]) {
            return 1;
        }
        return 0;
    }
}
