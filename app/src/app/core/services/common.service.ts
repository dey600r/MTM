import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor() {
    }

    /** ORDER BY */
    orderBy(data: any[], prop: string = null, asc: boolean = false): any[] {
        const listData = [...data];
        if (data !== null && data !== undefined) {
            listData.sort((a: any, b: any) => {
                const firstValue = (!!data ? a[prop] : a);
                const secondValue = (!!data ? b[prop] : b);
                return this.compareData(firstValue, secondValue, asc);
            });
        }
        return listData;
    }

    compareData(value1: any, value2: any, asc: boolean = false): number {
        let result = null;
        if (value1 == null && value2 != null) {
            result = -1;
        } else if (value1 != null && value2 == null) {
            result = 1;
        } else if (value1 == null && value2 == null) {
            result = 0;
        } else if (typeof value1 === 'string' && typeof value2 === 'string') {
            result = value1.localeCompare(value2);
        } else {
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
        }
        return (asc ? (result * -1) : result);
    }

    /** GROUP BY */
    groupBy(data: any[], prop: string): any {
        let listData = [];
        if (data !== null && data !== undefined) {
            listData = data.reduce((ubc, u) => ({
                ...ubc,
                [u[prop]]: [ ...(ubc[u[prop]] || []), u ],
            }), {});
        }
        return listData;
    }

    /** SUM */
    sum(data: any[], prop: string): number {
        return data.reduce((sum, current) => sum + current[prop], 0);
    }

    /** MIN */
    min(data: any[], prop: string = null): any {
        let listData = [];
        if (data !== null && data !== undefined) {
            listData = data.reduce((min, p) => p[prop] < min ? p[prop] : min, data[0][prop]);
        }
        return listData;
    }

    /** MAX */
    max(data: any[], prop: string = null): any {
        let listData = [];
        if (data !== null && data !== undefined) {
            listData = data.reduce((max, p) => p[prop] > max ? p[prop] : max, data[0][prop]);
        }
        return listData;
    }
}
