import { Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// UTILS
import { DashboardModel, OperationModel } from '@models/index';
import { CommonService } from './common.service';
import { ConstantsColumns } from '../utils';



@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private commonService: CommonService,
                private translator: TranslateService) {
    }

    getSizeWidthHeight(w: number, h: number): any[] {
        return (w < h ? [w - 5, (h / 3) - 10] : [w - 5, h - 10]);
    }

    // MOTO EXPENSES
    getDashboardModelMotoExpenses(view: any[], data: OperationModel[]): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardMotoExpenses(data));
    }

    mapOperationToDashboardMotoExpenses(data: OperationModel[]): any[] {
        let result: any[] = [];
        data.forEach(x => {
            let dash: any = result.find(y => y.name === x.moto.model);
            const sumPrice: number = this.commonService.sum(
                data.filter(z => z.moto.id === x.moto.id && z.operationType.id === x.operationType.id),
                ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
            if (sumPrice > 0) {
                if (!!dash) {
                    if (!dash.series.some((z: any) => z.id === x.operationType.id)) {
                        dash.series = [...dash.series, {
                            id: x.operationType.id,
                            name: this.translator.instant(x.operationType.description),
                            value: sumPrice
                        }];
                    }
                } else {
                    dash = {
                        name: x.moto.model,
                        series: [{
                            id: x.operationType.id,
                            name: this.translator.instant(x.operationType.description),
                            value: sumPrice
                        }]
                    };
                    result = [...result, dash];
                }
            }
        });
        return result;
    }

    // OPERATION TYPE EXPENSES
    getDashboardModelOpTypeExpenses(view: any[], data: OperationModel[]): DashboardModel {
        return new DashboardModel(view, this.mapOperationToDashboardOpTypeExpenses(data), null, true, true, true, true,
        this.translator.instant('OP_TYPE'), false, '', false, '', false, false, 'right');
    }

    mapOperationToDashboardOpTypeExpenses(data: OperationModel[]): any[] {
        let result: any[] = [];
        data.forEach(x => {
            if (!result.some((z: any) => z.id === x.operationType.id)) {
                const sumPrice: number = this.commonService.sum(
                    data.filter(z => z.operationType.id === x.operationType.id),
                    ConstantsColumns.COLUMN_MTM_OPERATION_PRICE);
                result = [...result, {
                    id: x.operationType.id,
                    name: this.translator.instant(x.operationType.description),
                    value: sumPrice
                }];
            }
        });
        return result;
    }
}
