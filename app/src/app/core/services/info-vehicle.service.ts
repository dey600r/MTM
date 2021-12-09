import { Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import {
    ConfigurationModel, MaintenanceModel, InfoVehicleConfigurationModel, InfoVehicleConfigurationMaintenanceModel,
    InfoVehicleConfigurationMaintenanceElementModel, VehicleModel, OperationModel, WearVehicleProgressBarViewModel,
    WearMaintenanceProgressBarViewModel, WearReplacementProgressBarViewModel, InfoVehicleHistoricModel,
    InfoVehicleHistoricReplacementModel, InfoVehicleReplacementModel
} from '@models/index';

// SERVICES
import { HomeService } from './home.service';
import { CalendarService } from './calendar.service';
import { ControlService } from './control.service';
import { CommonService } from './common.service';

// UTILS
import { Constants, ConstantsColumns, PageEnum, ToastTypeEnum, WarningWearEnum } from '@utils/index';

@Injectable({
    providedIn: 'root'
})
export class InfoVehicleService {

    constructor(private homeService: HomeService,
                private calendarService: CalendarService,
                private translator: TranslateService,
                private controlService: ControlService,
                private commonService: CommonService) {}

    // INFO VEHICLE CONFIGURATION

    calculateInfoVehicleConfiguration(operations: OperationModel[], vehicles: VehicleModel[], configurations: ConfigurationModel[],
                                      maintenances: MaintenanceModel[]): InfoVehicleConfigurationModel[] {
        let result: InfoVehicleConfigurationModel[] = [];
        const allWears = this.homeService.getWearReplacementToVehicle(operations, vehicles, configurations, maintenances);

        vehicles.forEach(veh => {
            const vehicleWear: WearVehicleProgressBarViewModel = allWears.find(x => x.idVehicle === veh.id);
            const kmVehicleEstimated: number = this.calendarService.calculateKmVehicleEstimated(veh);
            const configuration: ConfigurationModel = configurations.find(x => x.id === veh.configuration.id);
            const listMaintenances = maintenances.filter(x => configuration.listMaintenance.some(y => y.id === x.id));
            const newConfiguration: InfoVehicleConfigurationModel = new InfoVehicleConfigurationModel(
                veh.id, configuration.id, configuration.name, WarningWearEnum.SUCCESS, [], kmVehicleEstimated);
            listMaintenances.forEach(main => {
                const maintenanceWear: WearMaintenanceProgressBarViewModel =
                    (!vehicleWear ? new WearMaintenanceProgressBarViewModel() :
                    vehicleWear.listWearMaintenance.find(x => x.idMaintenance === main.id));
                const newMaintenance: InfoVehicleConfigurationMaintenanceModel = new InfoVehicleConfigurationMaintenanceModel(
                    main.description, [], main.maintenanceFreq.code, main.maintenanceFreq.description,
                    main.km, main.time, main.init, main.wear, main.fromKm, main.toKm
                );
                main.listMaintenanceElement.forEach(rep => {
                    const replacementWear: WearReplacementProgressBarViewModel =
                        (!maintenanceWear ? new WearReplacementProgressBarViewModel() :
                        maintenanceWear.listWearReplacement.find(x => x.idMaintenanceElement === rep.id));
                    const warning: WarningWearEnum = (replacementWear ?
                        this.homeService.calculateWearNotificationPriority(replacementWear.warningKms, replacementWear.warningMonths) :
                        WarningWearEnum.SUCCESS);
                    newMaintenance.listReplacement = [...newMaintenance.listReplacement,
                        new InfoVehicleConfigurationMaintenanceElementModel(rep.name, warning, rep.id)];
                });
                newMaintenance.active = this.homeService.validateKmIntoMaintenance(
                    kmVehicleEstimated, newMaintenance.fromKm, newMaintenance.toKm);
                newMaintenance.warning = this.calculateWarningFromReplacements<InfoVehicleConfigurationMaintenanceElementModel>(
                    newMaintenance.listReplacement);
                newConfiguration.listMaintenance = [...newConfiguration.listMaintenance, newMaintenance];
            });
            newConfiguration.warning = this.calculateWarningFromReplacements<InfoVehicleConfigurationMaintenanceModel>(
                newConfiguration.listMaintenance);
            result = [...result, newConfiguration];
        });

        return result;
    }

    calculateWarningFromReplacements<T>(listData: T[]): WarningWearEnum {
        let result: WarningWearEnum = WarningWearEnum.SUCCESS;
        const list: any = listData;
        if (list.length === 1) {
            result = list[0].warning;
        } else {
            for (let i = 0; i < list.length - 1; i++) {
                result = this.homeService.calculateWearNotificationPriority(list[i].warning, list[i + 1].warning);
            }
        }
        return result;
    }

    // INFO SUMMARY VEHICLE

    getLabelKmVehicle(km: number, kmEmstimated: number, measure: any): string {
        let labelVehicleKm = this.translator.instant('PAGE_HOME.VehicleKm', { km, measure: measure.value });
        if (km !== kmEmstimated) {
            labelVehicleKm += '\n' + this.translator.instant('PAGE_HOME.VehicleEstimatedKm', { km: kmEmstimated, measure: measure.value  });
        }
        return labelVehicleKm;
    }

    getPercentKmVehicle(data: InfoVehicleConfigurationModel): number {
        return Math.round(((data.listMaintenance.filter(x => x.warning === WarningWearEnum.SUCCESS).length +
            data.listMaintenance.filter(x => x.warning === WarningWearEnum.WARNING).length) * 100) /
            data.listMaintenance.length);
    }

    getIconPercent(labelPercent: number, type: string): string {
        if (labelPercent < 25) {
          return (type === 'color' ?
            this.homeService.getClassIcon(WarningWearEnum.SKULL, '') : this.homeService.getIconKms(WarningWearEnum.SKULL));
        } else if (labelPercent >= 25 && labelPercent < 50) {
          return (type === 'color' ?
            this.homeService.getClassIcon(WarningWearEnum.DANGER, '') : this.homeService.getIconKms(WarningWearEnum.DANGER));
        } else if (labelPercent >= 50 && labelPercent < 75) {
          return (type === 'color' ?
            this.homeService.getClassIcon(WarningWearEnum.WARNING, '') : this.homeService.getIconKms(WarningWearEnum.WARNING));
        } else {
          return (type === 'color' ? this.homeService.getClassIcon(WarningWearEnum.SUCCESS, '') : 'checkmark-done-circle');
        }
      }

    showInfoVehicle(dateKmsVehicle: Date, measure: any) {
        const msg = this.translator.instant('ALERT.LastUpdateVehicleKm',
          { date: this.calendarService.getDateString(new Date(dateKmsVehicle)), measurelarge: measure.valueLarge });
        this.controlService.showMsgToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST_HIGH);
    }

    showToastInfoReplacement(rep: InfoVehicleHistoricReplacementModel, subRep: InfoVehicleReplacementModel, measure: any, coin: any) {
        const msg = this.translator.instant('ALERT.InfoVehicleReplacement', {
                replacement: rep.name,
                operation: subRep.opName,
                date: this.calendarService.getDateString(new Date(subRep.date)),
                priceOp: subRep.priceOp,
                coin: coin.value,
                price: subRep.price,
                km: subRep.km,
                measure: measure.value,
                time: subRep.time
            });
        this.controlService.showMsgToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST_HIGHER);
      }

    // INFO REPLACEMENT HISTORIC

    calculateInfoReplacementHistoric(vehicles: VehicleModel[], maintenances: MaintenanceModel[], operations: OperationModel[],
                                     configurations: ConfigurationModel[]): InfoVehicleHistoricModel[] {
        let result: InfoVehicleHistoricModel[] = [];

        vehicles.forEach(vehicle => {
            const kmVehicleEstimated: number = this.calendarService.calculateKmVehicleEstimated(vehicle);
            const timeDiffVehicle: number = this.calendarService.monthDiff(new Date(vehicle.datePurchase),
                (vehicle.active ? new Date() : new Date(vehicle.dateKms)));
            const maintenancesOfVehicle: number[] = configurations.find(c => c.id === vehicle.configuration.id)
                .listMaintenance.map(x => x.id);
            let listReplacements: InfoVehicleHistoricReplacementModel[] = [];
            maintenances.filter(x => maintenancesOfVehicle.some(y => x.id === y)).forEach(maintenance => {
                maintenance.listMaintenanceElement.forEach(replacement => {
                    if (!listReplacements.some(x => x.id === replacement.id)) {
                        const operationsVehicle: OperationModel[] = this.commonService.orderBy(
                            operations.filter(op => vehicle.id === op.vehicle.id &&
                                op.listMaintenanceElement.some(x => x.id === replacement.id)),
                            ConstantsColumns.COLUMN_MTM_OPERATION_KM, true);
                        let info: InfoVehicleHistoricReplacementModel = new InfoVehicleHistoricReplacementModel();
                        if (operationsVehicle && operationsVehicle.length > 0) {
                            info = new InfoVehicleHistoricReplacementModel(replacement.name, 0, 0, 0, 0, 0, [], replacement.id);
                            operationsVehicle.forEach((op, index) => {
                                if (index === (operationsVehicle.length - 1)) {
                                    info.listReplacements = [...info.listReplacements, new InfoVehicleReplacementModel(
                                        op.description, op.km,
                                        this.calendarService.monthDiff(new Date(vehicle.datePurchase), new Date(op.date)),
                                        op.date, op.listMaintenanceElement.find(x => x.id === replacement.id).price, op.price, op.id)];
                                } else {
                                    info.listReplacements = [...info.listReplacements, new InfoVehicleReplacementModel(
                                        op.description, (op.km - operationsVehicle[index + 1].km),
                                        this.calendarService.monthDiff(new Date(operationsVehicle[index + 1].date), new Date(op.date)),
                                        op.date, op.listMaintenanceElement.find(x => x.id === replacement.id).price, op.price, op.id)];
                                }
                            });
                            info.km = kmVehicleEstimated - operationsVehicle[0].km;
                            info.time = this.calendarService.monthDiff(new Date(operationsVehicle[0].date),
                                (vehicle.active ? new Date() : new Date(vehicle.dateKms)));
                            info.kmAverage = Math.round(this.commonService.sum(info.listReplacements, 'km') / info.listReplacements.length);
                            info.timeAverage = Math.round(this.commonService.sum(info.listReplacements, 'time') /
                                info.listReplacements.length);
                            info.priceAverage = Math.round(this.commonService.sum(info.listReplacements, 'price') /
                                info.listReplacements.length);
                        } else {
                            info = new InfoVehicleHistoricReplacementModel(replacement.name, kmVehicleEstimated, timeDiffVehicle,
                                kmVehicleEstimated, timeDiffVehicle, 0, [], replacement.id);
                        }
                        listReplacements = [...listReplacements, info];
                    }
                });
            });
            result = [...result, new InfoVehicleHistoricModel(vehicle.id, listReplacements)];
        });

        return result;
    }
}
