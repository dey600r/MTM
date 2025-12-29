import { Injectable } from '@angular/core';

// UTILS
import { Constants } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    /** VERSIONING */
    getVersion(version: string): number {
        const nums: string[] = version.split('.');
        const v1: number = (Number)(nums[0].substring(1)) * 1000;
        const v2: number = (Number)(nums[1]) * 10;
        const v3: number = (Number)(nums[2]);
        return v1 + v2 + v3;
    }

    // VALIDATIONS

    isEventFailure(code: string): boolean {
        return code === Constants.OPERATION_TYPE_FAILURE_HOME ||
            code === Constants.OPERATION_TYPE_FAILURE_WORKSHOP;
    }

    isEventPreventive(code: string): boolean {
        return code === Constants.OPERATION_TYPE_MAINTENANCE_HOME ||
            code === Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP;
    }

    isOperationWithReplacement(code: string): boolean {
        return this.isEventFailure(code) || this.isEventPreventive(code);
    }
}
