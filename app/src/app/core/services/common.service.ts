import { Injectable } from '@angular/core';

// LIBRARY ANGULAR
import { TranslateService } from '@ngx-translate/core';
import * as Moment from 'moment';

// UTILS
import { Constants } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor() {
    }

    /** ORDER BY */
    orderBy(data: any[], prop: string = null): any[] {
        return data.sort((x, y) => this.compareData(x, y , prop));
    }

    compareData(x: any, y: any, prop: string = null): number {
        if (x[prop] < y[prop]) {
            return -1;
        }
        if (x[prop] > y[prop]) {
            return 1;
        }
        return 0;
    }

    /** GROUP BY */
    groupBy(data: any[], prop: string): any[] {
        return data.reduce(
            (objectsByKeyValue, obj) => ({
              ...objectsByKeyValue,
              [obj[prop]]: (objectsByKeyValue[obj[prop]] || []).concat(obj)
            }),
            {}
        );
    }

    /** SUM */
    sum(data: any[], prop: string): number {
        return data.reduce((sum, current) => sum + current[prop], 0);
    }

    /** MIN */
    min(data: any[], prop: string = null): any {
        return data.reduce((min, p) => p[prop] < min ? p[prop] : min, data[0][prop]);
    }

    /** MAX */
    max(data: any[], prop: string = null): any {
        return data.reduce((max, p) => p[prop] > max ? p[prop] : max, data[0][prop]);
    }
}
