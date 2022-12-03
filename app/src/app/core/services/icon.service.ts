import { Injectable } from '@angular/core';

// UTILS
import { Constants, WarningWearEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class IconService {

    // ICONS / CLASS CSS

    getClassProgressbar(warning: WarningWearEnum): string {
        switch (warning) {
            case WarningWearEnum.SUCCESS:
                return ` quizz-progress-success`;
            case WarningWearEnum.WARNING:
                return ` quizz-progress-warning`;
            case WarningWearEnum.DANGER:
            case WarningWearEnum.SKULL:
                return ` quizz-progress-danger`;
        }
    }

    getClassIcon(warning: WarningWearEnum): string {
        switch (warning) {
            case WarningWearEnum.SUCCESS:
                return ` icon-color-success`;
            case WarningWearEnum.WARNING:
                return ` icon-color-warning`;
            case WarningWearEnum.DANGER:
                return ` icon-color-danger`;
            case WarningWearEnum.SKULL:
                return ` icon-color-skull`;
        }
    }

    getIconKms(warning: WarningWearEnum): string {
        switch (warning) {
            case WarningWearEnum.SUCCESS:
                return 'checkmark-circle';
            case WarningWearEnum.WARNING:
                return 'warning';
            case WarningWearEnum.DANGER:
                return 'nuclear';
            case WarningWearEnum.SKULL:
                return 'skull';
        }
    }

    loadIconDashboard<T>(data: T[]): string {
        if (data.length === 0) {
          return 'information-circle';
        } else {
          return 'bar-chart';
        }
    }

    // VEHICLE

    getIconVehicle(codeVehicleType: string): string {
        switch (codeVehicleType) {
            case Constants.VEHICLE_TYPE_CODE_MOTO:
                return 'bicycle';
            case Constants.VEHICLE_TYPE_CODE_CAR:
                return 'car-sport';
            default:
                return 'car';
        }
    }

    // OPERATION

    getIconOperationType(codeOperationType: string): string {
        switch (codeOperationType) {
          case Constants.OPERATION_TYPE_MAINTENANCE_HOME:
          case Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP:
            return 'build';
          case Constants.OPERATION_TYPE_FAILURE_HOME:
          case Constants.OPERATION_TYPE_FAILURE_WORKSHOP:
            return 'hammer';
          case Constants.OPERATION_TYPE_CLOTHES:
            return 'shirt';
          case Constants.OPERATION_TYPE_ACCESSORIES:
            return 'gift';
          case Constants.OPERATION_TYPE_TOOLS:
            return 'construct';
          case Constants.OPERATION_TYPE_OTHER:
            return 'body';
          case Constants.OPERATION_TYPE_SPARE_PARTS:
            return 'repeat';
        }
    }

    // MAINTENANCE

    getIconMaintenance(codeMaintenanceFreq: string): string {
        switch (codeMaintenanceFreq) {
          case Constants.MAINTENANCE_FREQ_ONCE_CODE:
            return 'alarm';
          case Constants.MAINTENANCE_FREQ_CALENDAR_CODE:
            return 'calendar';
        }
    }

    // REPLACEMENT

    getIconReplacement(idMaintenanceElement: number): string {
        switch (idMaintenanceElement) {
          case 1: case 2: case 22: case 23: case 25: case 28: case 29:
            return 'disc';
          case 4: case 5: case 27:
            return 'basket';
          case 6:
            return 'flash';
          case 9: case 14: case 15:
            return 'thermometer';
          case 3: case 7: case 8: case 12: case 32:
            return 'color-fill';
          case 11: case 13: case 16:
            return 'layers';
          case 18: case 19:
            return 'eyedrop';
          case 10: case 17: case 20: case 21: case 26:
            return 'settings';
          case 24:
            return 'battery-charging';
          case 30: case 31:
            return 'barcode';
          default:
            return this.getRandomIcon(idMaintenanceElement);
        }
    }

    getRandomIcon(rand: number): string {
        const min = 40;
        if (rand <= min) {
            return 'cube';
        } else if (rand > min && rand <= (min + 15)) {
            return 'bulb';
        } else if (rand > (min + 15) && rand <= (min + 25)) {
            return 'bandage';
        } else {
            return 'briefcase';
        }
    }
}