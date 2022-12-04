import { Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import {
    ConfigurationModel, MaintenanceModel, InfoVehicleConfigurationModel, InfoVehicleConfigurationMaintenanceModel,
    InfoVehicleConfigurationMaintenanceElementModel, VehicleModel, OperationModel, WearVehicleProgressBarViewModel,
    WearMaintenanceProgressBarViewModel, WearReplacementProgressBarViewModel, InfoVehicleHistoricModel,
    InfoVehicleHistoricReplacementModel, InfoVehicleReplacementModel, MaintenanceElementModel
} from '@models/index';

// SERVICES
import { HomeService } from '../pages/home.service';
import { CalendarService, ControlService, CommonService, IconService } from '../common/index';

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
                private commonService: CommonService,
                private iconService: IconService) {}

    // INFO VEHICLE CONFIGURATION

    calculateInfoVehicleConfiguration(operations: OperationModel[], vehicles: VehicleModel[], configurations: ConfigurationModel[],
                                      maintenances: MaintenanceModel[]): InfoVehicleConfigurationModel[] {
        let result: InfoVehicleConfigurationModel[] = [];
        const allWears = this.homeService.getWearReplacementToVehicle(operations, vehicles, configurations, maintenances);

        vehicles.forEach(veh => {
            const vehicleWear: WearVehicleProgressBarViewModel = allWears.find(x => x.idVehicle === veh.id);
            const configuration: ConfigurationModel = configurations.find(x => x.id === veh.configuration.id);
            const listMaintenances = maintenances.filter(x => configuration.listMaintenance.some(y => y.id === x.id));
            const newConfiguration: InfoVehicleConfigurationModel = new InfoVehicleConfigurationModel(
                veh.id, configuration.id, configuration.name, WarningWearEnum.SUCCESS, [], veh.kmEstimated);
            listMaintenances.forEach(main => {
                const maintenanceWear: WearMaintenanceProgressBarViewModel =
                    (!vehicleWear ? new WearMaintenanceProgressBarViewModel() :
                    vehicleWear.listWearMaintenance.find(x => x.idMaintenance === main.id));
                const newMaintenance: InfoVehicleConfigurationMaintenanceModel = new InfoVehicleConfigurationMaintenanceModel(
                    main.description, [], main.maintenanceFreq.code, main.maintenanceFreq.description,
                    main.km, main.time, main.init, main.wear, main.fromKm, main.toKm, WarningWearEnum.SUCCESS, true, main.id
                );
                main.listMaintenanceElement.forEach(rep => {
                    const replacementWear: WearReplacementProgressBarViewModel =
                        (!maintenanceWear ? new WearReplacementProgressBarViewModel() :
                        maintenanceWear.listWearReplacement.find(x => x.idMaintenanceElement === rep.id));
                    const warning: WarningWearEnum = (replacementWear ?
                        this.homeService.calculateWearNotificationPriority(replacementWear.warningKms, replacementWear.warningMonths) :
                        WarningWearEnum.SUCCESS);
                    newMaintenance.listReplacement = [...newMaintenance.listReplacement,{
                        id: rep.id,
                        name: rep.name,
                        warning: warning,
                        warningIcon: this.iconService.getIconKms(warning),
                        warningIconClass: this.iconService.getClassIcon(warning),
                        iconReplacement: rep.icon
                    }];
                });
                newMaintenance.active = this.homeService.validateKmIntoMaintenance(
                    veh.kmEstimated, newMaintenance.fromKm, newMaintenance.toKm);
                newMaintenance.warning = this.calculateWarningFromReplacements<InfoVehicleConfigurationMaintenanceElementModel>(
                    newMaintenance.listReplacement);
                newMaintenance.warningIcon = this.iconService.getIconKms(newMaintenance.warning);
                newMaintenance.warningIconClass = this.iconService.getClassIcon(newMaintenance.warning);
                newMaintenance.iconMaintenance = main.maintenanceFreq.icon;
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
            for (let item of list) {
                result = this.homeService.calculateWearNotificationPriority(result, item.warning);
            }
        }
        return result;
    }

    // INFO SUMMARY VEHICLE

    getLabelKmVehicle(km: number, kmEstimated: number, measure: any): string {
        let labelVehicleKm = this.translator.instant('PAGE_HOME.VehicleKm', { km, measure: measure.value });
        if (km !== kmEstimated) {
            labelVehicleKm += '\n' + this.translator.instant('PAGE_HOME.VehicleEstimatedKm', { km: kmEstimated, measure: measure.value  });
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
            this.iconService.getClassIcon(WarningWearEnum.SKULL) : this.iconService.getIconKms(WarningWearEnum.SKULL));
        } else if (labelPercent >= 25 && labelPercent < 50) {
          return (type === 'color' ?
            this.iconService.getClassIcon(WarningWearEnum.DANGER) : this.iconService.getIconKms(WarningWearEnum.DANGER));
        } else if (labelPercent >= 50 && labelPercent < 75) {
          return (type === 'color' ?
            this.iconService.getClassIcon(WarningWearEnum.WARNING) : this.iconService.getIconKms(WarningWearEnum.WARNING));
        } else {
          return (type === 'color' ? this.iconService.getClassIcon(WarningWearEnum.SUCCESS) : 'checkmark-done-circle');
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
                                     configurations: ConfigurationModel[], maintenanceElements: MaintenanceElementModel[]):
                                     InfoVehicleHistoricModel[] {
        let result: InfoVehicleHistoricModel[] = [];

        const model: InfoVehicleReplacementModel = new InfoVehicleReplacementModel();
        const nameOfKm: string = this.commonService.nameOf(() => model.km);
        const nameOfTime: string = this.commonService.nameOf(() => model.time);
        const nameOfPrice: string = this.commonService.nameOf(() => model.price);
        const nameOfKmAverage: string = this.commonService.nameOf(() => new InfoVehicleHistoricReplacementModel().kmAverage);

        vehicles.forEach(vehicle => {
            const timeDiffVehicle: number = this.calendarService.monthDiff(new Date(vehicle.datePurchase),
                (vehicle.active ? new Date() : new Date(vehicle.dateKms)));
            const idMaintenancesOfVehicle: number[] = configurations.find(c => c.id === vehicle.configuration.id)
                .listMaintenance.map(x => x.id);
            const maintenancesOfVehicle: MaintenanceModel[] = maintenances.filter(x => idMaintenancesOfVehicle.some(y => x.id === y));
            const operationsVehicle: OperationModel[] = this.commonService.orderBy(
                    operations.filter(op => vehicle.id === op.vehicle.id), ConstantsColumns.COLUMN_MTM_OPERATION_KM, true);
            const maintenanceElementsVehicle: MaintenanceElementModel[] = maintenanceElements.filter(x =>
                operationsVehicle.some(op => op.listMaintenanceElement.some(rep => rep.id === x.id)) ||
                maintenancesOfVehicle.some(main => main.listMaintenanceElement.some(rep => rep.id === x.id)));

            let listReplacements: InfoVehicleHistoricReplacementModel[] = [];
            maintenanceElementsVehicle.forEach(replacement => {
                const opWithReplacement: OperationModel[] = operationsVehicle.filter(op =>
                    op.listMaintenanceElement.some(x => x.id === replacement.id));
                let info: InfoVehicleHistoricReplacementModel = new InfoVehicleHistoricReplacementModel();
                if (opWithReplacement && opWithReplacement.length > 0) {
                    const planned = maintenancesOfVehicle.some(main => main.listMaintenanceElement.some(rep => rep.id === replacement.id));
                    info = new InfoVehicleHistoricReplacementModel(replacement.name, 0, 0, 0, 0, 0, planned, [], replacement.id);
                    opWithReplacement.forEach((op, index) => {
                        if (index === (opWithReplacement.length - 1)) {
                            info.listReplacements = [...info.listReplacements, new InfoVehicleReplacementModel(
                                op.description, op.km,
                                this.calendarService.monthDiff(new Date(vehicle.datePurchase), new Date(op.date)),
                                op.date, op.listMaintenanceElement.find(x => x.id === replacement.id).price, op.price, op.id)];
                        } else {
                            info.listReplacements = [...info.listReplacements, new InfoVehicleReplacementModel(
                                op.description, (op.km - opWithReplacement[index + 1].km),
                                this.calendarService.monthDiff(new Date(opWithReplacement[index + 1].date), new Date(op.date)),
                                op.date, op.listMaintenanceElement.find(x => x.id === replacement.id).price, op.price, op.id)];
                        }
                    });
                    info.km = vehicle.kmEstimated - opWithReplacement[0].km;
                    info.time = this.calendarService.monthDiff(new Date(opWithReplacement[0].date),
                        (vehicle.active ? new Date() : new Date(vehicle.dateKms)));
                    info.kmAverage = Math.round(this.commonService.sum(info.listReplacements, nameOfKm) / info.listReplacements.length);
                    info.timeAverage = Math.round(this.commonService.sum(info.listReplacements, nameOfTime) /
                        info.listReplacements.length);
                    info.priceAverage = Math.round(this.commonService.sum(info.listReplacements, nameOfPrice) /
                        info.listReplacements.length);
                    info.iconReplacement = replacement.icon;
                } else {
                    info = new InfoVehicleHistoricReplacementModel(replacement.name, vehicle.kmEstimated, timeDiffVehicle,
                        vehicle.kmEstimated, timeDiffVehicle, 0, true, [], replacement.id);
                }
                listReplacements = [...listReplacements, info];
            });
            result = [...result, new InfoVehicleHistoricModel(vehicle.id, this.commonService.orderBy(listReplacements, nameOfKmAverage))];
        });

        return result;
    }
}
