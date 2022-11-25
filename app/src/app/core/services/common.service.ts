import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    /** ORDER BY */
    orderBy(data: any[], prop: string = null, asc: boolean = false): any[] {
        let listData = [];
        if (data !== null && data !== undefined) {
            listData = [...data];
            listData.sort((a: any, b: any) => {
                const firstValue = (prop != null ? a[prop] : a);
                const secondValue = (prop != null ? b[prop] : b);
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
            const compare: number = (value1 > value2) ? 1 : 0;
            result = (value1 < value2) ? -1 : compare;
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
    sum(data: any[], prop: string = null): number {
        let listData = 0;
        if (data !== null && data !== undefined) {
            listData = data.reduce((sum, current) => {
                const val = (prop !== null ? current[prop] : current);
                const valSum = (val !== null && val !== undefined ? val : 0);
                return sum + valSum;
            }, 0);
        }
        return listData;
    }

    /** MIN */
    min(data: any[], prop: string = null): any {
        let listData = null;
        if (data !== null && data !== undefined) {
            listData = data.reduce((min, p) => {
                const val = (prop !== null ? p[prop] : p);
                return val < min ? val : min;
            }, (prop != null ? data[0][prop] : data[0]));
        }
        return listData;
    }

    /** MAX */
    max(data: any[], prop: string = null): any {
        let listData = null;
        if (data !== null && data !== undefined) {
            listData = data.reduce((max, p) => {
                const val = (prop !== null ? p[prop] : p);
                return val > max ? val : max;
            }, (prop != null ? data[0][prop] : data[0]));
        }
        return listData;
    }

    /** NAME OF */
    nameOf(selector: () => any): string {
        const s: string = '' + selector;
        const auxArray: string[] = s.split('.');
        let result: string = (auxArray.length > 0 ? auxArray[auxArray.length - 1].split(';')[0] : '-1');
        if (result.includes('}')) {
            result = result.substring(0, result.length - 1);
        }
        return result;

    }

    /** ROUND DECIMAL */
    round(value: number, decimal: number): number {
        return Math.round((value + Number.EPSILON) * decimal) / decimal;
    }
}
