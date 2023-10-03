import { VehicleModel, VehicleTypeModel } from '@models/index';
import { CalendarService, IconService } from '@services/index';

import { Constants } from '@utils/index';

import { MockAppConfiguration } from './mock-configuration.spec';

export class MockAppVehicle {
    static iconService: IconService = new IconService();
    static calendarService: CalendarService = new CalendarService(null);

    /* VEHICLE TYPE */
    public static VehicleTypesAux: VehicleTypeModel[] = [
        new VehicleTypeModel(Constants.VEHICLE_TYPE_CODE_MOTO, 'MOTORBIKE', 1),
        new VehicleTypeModel(Constants.VEHICLE_TYPE_CODE_CAR, 'CAR', 2),
        new VehicleTypeModel('O', 'OTHER', 3),
    ];
    public static VehicleTypes: VehicleTypeModel[] = MockAppVehicle.VehicleTypesAux.map(x => {
        return {...x, icon: this.iconService.getIconVehicle(x.code) };
    });

    /* VEHICLES */
    public static VehiclesAux: VehicleModel[] = [
        new VehicleModel({
            model: 'R6',
            brand: 'Yamaha',
            year: 2005,
            km: 111200,
            configuration: MockAppConfiguration.Configurations[0],
            vehicleType: MockAppVehicle.VehicleTypes[0],
            kmsPerMonth: 600,
            dateKms: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 2, new Date().getDate() - 14),
            datePurchase: new Date(new Date().getFullYear() - 17, new Date().getMonth() - 5, new Date().getDate() + 11),
            active: true,
            id: 1
        }),
        new VehicleModel({
            model: 'gt125r',
            brand: 'Hyosung',
            year: 2006,
            km: 76750,
            configuration: MockAppConfiguration.Configurations[1],
            vehicleType: MockAppVehicle.VehicleTypes[0],
            kmsPerMonth: 50,
            dateKms: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 2, new Date().getDate() - 14),
            datePurchase: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 1, new Date().getDate() - 4),
            active: true,
            id: 2
        }),
        new VehicleModel({
            model: 'Ninja 1000sx',
            brand: 'Kawasaki',
            year: 2021,
            km: 28000,
            configuration: MockAppConfiguration.Configurations[2],
            vehicleType: MockAppVehicle.VehicleTypes[0],
            kmsPerMonth: 600, 
            dateKms: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 2, new Date().getDate() - 14),
            datePurchase: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 5, new Date().getDate() - 11),
            active: true,
            id: 3
        })
    ];
    public static Vehicles: VehicleModel[] = MockAppVehicle.VehiclesAux.map(x => {
        return {...x, kmEstimated: this.calendarService.calculateKmVehicleEstimated(x) };
    });

}