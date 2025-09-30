import { inject, Injectable } from '@angular/core';

// LIBRARIES
import { TranslateService } from '@ngx-translate/core';

// MODELS
import {
    ConfigurationModel, MaintenanceModel, InfoVehicleConfigurationModel, InfoVehicleConfigurationMaintenanceModel,
    InfoVehicleConfigurationMaintenanceElementModel, VehicleModel, OperationModel, WearVehicleProgressBarViewModel,
    WearMaintenanceProgressBarViewModel, WearReplacementProgressBarViewModel, InfoVehicleHistoricModel,
    InfoVehicleHistoricReplacementModel, InfoVehicleReplacementModel, MaintenanceElementModel,
    IDashboardModel, ISettingModel
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

    // INJECTIONS
    private readonly homeService: HomeService = inject(HomeService);
    private readonly calendarService: CalendarService = inject(CalendarService);
    private readonly translator: TranslateService = inject(TranslateService);
    private readonly controlService: ControlService = inject(ControlService);
    private readonly commonService: CommonService = inject(CommonService);
    private readonly iconService: IconService = inject(IconService);

    // INFO VEHICLE CONFIGURATION

    calculateInfoVehicleConfiguration(operations: OperationModel[], vehicles: VehicleModel[], configurations: ConfigurationModel[],
                                      maintenances: MaintenanceModel[]): InfoVehicleConfigurationModel[] {
        let result: InfoVehicleConfigurationModel[] = [];
        const allWears = this.homeService.getWearReplacementToVehicle(operations, vehicles, configurations, maintenances);
        vehicles.forEach(veh => {
            const vehicleWear: WearVehicleProgressBarViewModel = allWears.find(x => x.idVehicle === veh.id);
            const configuration: ConfigurationModel = configurations.find(x => x.id === veh.configuration.id);
            const listMaintenances = maintenances.filter(x => configuration.listMaintenance.some(y => y.id === x.id));
            let infoListMaintenance: InfoVehicleConfigurationMaintenanceModel[] = [];
            listMaintenances.forEach(main => {
                const maintenanceWear: WearMaintenanceProgressBarViewModel =
                    (!vehicleWear ? new WearMaintenanceProgressBarViewModel() :
                    vehicleWear.listWearMaintenance.find(x => x.idMaintenance === main.id));
                let infoListReplacement: InfoVehicleConfigurationMaintenanceElementModel[] = [];
                main.listMaintenanceElement.forEach(rep => {
                    const replacementWear: WearReplacementProgressBarViewModel =
                        (!maintenanceWear ? new WearReplacementProgressBarViewModel() :
                        maintenanceWear.listWearReplacement.find(x => x.idMaintenanceElement === rep.id));
                    const warning: WarningWearEnum = (replacementWear ?
                        this.homeService.calculateWearNotificationPriority(replacementWear.warningKms, replacementWear.warningMonths) :
                        WarningWearEnum.SUCCESS);
                    infoListReplacement = [...infoListReplacement, {
                        id: rep.id,
                        name: rep.name,
                        warning: warning,
                        warningIcon: this.iconService.getIconKms(warning),
                        warningIconClass: this.iconService.getClassIcon(warning),
                        iconReplacement: rep.icon
                    }];
                });
                let infoWarning: WarningWearEnum = this.calculateWarningFromReplacements<InfoVehicleConfigurationMaintenanceElementModel>(infoListReplacement);
                infoListMaintenance = [...infoListMaintenance, new InfoVehicleConfigurationMaintenanceModel({
                    description: main.description,
                    codeFrequency: main.maintenanceFreq.code,
                    descFrequency: main.maintenanceFreq.description,
                    km: main.km,
                    time: main.time,
                    init: main.init,
                    wear: main.wear,
                    fromKm: main.fromKm,
                    toKm: main.toKm,
                    warning: infoWarning,
                    warningIcon: this.iconService.getIconKms(infoWarning),
                    warningIconClass: this.iconService.getClassIcon(infoWarning),
                    active: this.homeService.validateKmIntoMaintenance(veh.kmEstimated, main.fromKm, main.toKm),
                    id: main.id,
                    listReplacement: infoListReplacement,
                    iconMaintenance: main.maintenanceFreq.icon,
                })];
            });
            result = [...result, new InfoVehicleConfigurationModel({
                idVehicle: veh.id,
                idConfiguration: configuration.id,
                nameConfiguration: configuration.name,
                kmEstimated: veh.kmEstimated,
                warning: this.calculateWarningFromReplacements<InfoVehicleConfigurationMaintenanceModel>(infoListMaintenance),
                listMaintenance: infoListMaintenance
            })];
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

    getLabelAverageKmVehicle(data: IDashboardModel[], measure: ISettingModel) {
        const model = <IDashboardModel>{};
        const sum: number = this.commonService.sum(data, this.commonService.nameOf(() => model.value));
        return this.translator.instant('PAGE_HOME.VehicleAverageKm', { km1: Math.floor(sum / data.length), km2: data[data.length - 1].value, measure: measure.value });
    }

    getLabelKmVehicle(km: number, kmEstimated: number, measure: ISettingModel): string {
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

    showInfoVehicle(dateKmsVehicle: Date, measure: ISettingModel) {
        const msg = this.translator.instant('ALERT.LastUpdateVehicleKm',
          { date: this.calendarService.getDateString(new Date(dateKmsVehicle)), measurelarge: measure.valueLarge });
        this.controlService.showMsgToast(PageEnum.MODAL_INFO, ToastTypeEnum.INFO, msg, Constants.DELAY_TOAST_HIGH);
    }

    showToastInfoReplacement(rep: InfoVehicleHistoricReplacementModel, subRep: InfoVehicleReplacementModel,
                            measure: ISettingModel, coin: ISettingModel) {
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
                let infoListReplacement: InfoVehicleReplacementModel[] = [];
                let infoPlanned: boolean = true;
                let infoKm: number = 0;
                let infoTime: number = 0;
                let infoPriceAverage: number = 0;
                let infoKmAverage: number = 0;
                let infoTimeAverage: number = 0;
                if (opWithReplacement && opWithReplacement.length > 0) {
                    infoPlanned = maintenancesOfVehicle.some(main => main.listMaintenanceElement.some(rep => rep.id === replacement.id));
                    opWithReplacement.forEach((op, index) => {
                        if (index === (opWithReplacement.length - 1)) {
                            infoListReplacement = [...infoListReplacement, new InfoVehicleReplacementModel({
                                opName: op.description,
                                km: op.km,
                                time: this.calendarService.monthDiff(new Date(vehicle.datePurchase), new Date(op.date)),
                                date: op.date,
                                price: op.listMaintenanceElement.find(x => x.id === replacement.id).price,
                                priceOp: op.price,
                                id: op.id
                            })];
                        } else {
                            infoListReplacement = [...infoListReplacement, new InfoVehicleReplacementModel({
                                opName: op.description,
                                km: (op.km - opWithReplacement[index + 1].km),
                                time: this.calendarService.monthDiff(new Date(opWithReplacement[index + 1].date), new Date(op.date)),
                                date:op.date,
                                price: op.listMaintenanceElement.find(x => x.id === replacement.id).price,
                                priceOp: op.price,
                                id: op.id
                            })];
                        }
                    });
                    infoKm = vehicle.kmEstimated - opWithReplacement[0].km;
                    infoTime = this.calendarService.monthDiff(new Date(opWithReplacement[0].date),
                        (vehicle.active ? new Date() : new Date(vehicle.dateKms)));
                    infoKmAverage = Math.round(this.commonService.sum(infoListReplacement, nameOfKm) / infoListReplacement.length);
                    infoTimeAverage = Math.round(this.commonService.sum(infoListReplacement, nameOfTime) /
                        infoListReplacement.length);
                    infoPriceAverage = Math.round(this.commonService.sum(infoListReplacement, nameOfPrice) / infoListReplacement.length);
                } else {
                    infoKm = vehicle.kmEstimated;
                    infoTime = timeDiffVehicle;
                    infoKmAverage = vehicle.kmEstimated;
                    infoTimeAverage = timeDiffVehicle;
                }
                listReplacements = [...listReplacements, new InfoVehicleHistoricReplacementModel({
                    name: replacement.name,
                    km: infoKm,
                    time: infoTime,
                    priceAverage: infoPriceAverage,
                    kmAverage: infoKmAverage,
                    timeAverage: infoTimeAverage,
                    planned: infoPlanned,
                    id: replacement.id,
                    iconReplacement: replacement.icon,
                    listReplacements: infoListReplacement
                })];
            });
            result = [...result, new InfoVehicleHistoricModel(vehicle.id, this.commonService.orderBy(listReplacements, nameOfKmAverage))];
        });

        return result;
    }
}
