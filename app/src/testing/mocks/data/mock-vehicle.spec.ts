import { VehicleModel, VehicleTypeModel } from '@models/index';
import { CalendarService, IconService } from '@services/index';

import { Constants } from '@utils/index';

import { MockConfiguration } from './mock-configuration.spec';

export class MockVehicle {
    static iconService: IconService = new IconService();
    static calendarService: CalendarService = new CalendarService(null);

    /* VEHICLE TYPE */
    public static VehicleTypesAux: VehicleTypeModel[] = [
        new VehicleTypeModel(Constants.VEHICLE_TYPE_CODE_MOTO, 'MOTORBIKE', 1),
        new VehicleTypeModel(Constants.VEHICLE_TYPE_CODE_CAR, 'CAR', 2),
        new VehicleTypeModel('O', 'OTHER', 3),
    ];
    public static VehicleTypes: VehicleTypeModel[] = MockVehicle.VehicleTypesAux.map(x => {
        return {...x, icon: this.iconService.getIconVehicle(x.code) };
    });

    /* VEHICLES */
    public static VehiclesAux: VehicleModel[] = [
        new VehicleModel({
            model: 'R6',
            brand: 'Yamaha',
            year: 2005,
            km: 100200,
            configuration: MockConfiguration.Configurations[0],
            vehicleType: MockVehicle.VehicleTypes[0],
            kmsPerMonth: 600,
            dateKms: new Date(2021, 6, 2),
            datePurchase: new Date(2006, 3, 27),
            active: true,
            id: 1
        }),
        new VehicleModel({
            model: 'gt125r',
            brand: 'Hyosung',
            year: 2006,
            km: 76750,
            configuration: MockConfiguration.Configurations[1],
            vehicleType: MockVehicle.VehicleTypes[0],
            kmsPerMonth: 50,
            dateKms: new Date(2021, 6, 2),
            datePurchase: new Date(2006, 9, 12),
            active: true,
            id: 2
        }),
        new VehicleModel({
            model: 'Ninja 1000sx',
            brand: 'Kawasaki',
            year: 2021,
            km: 28000,
            configuration: MockConfiguration.Configurations[2],
            vehicleType: MockVehicle.VehicleTypes[0],
            kmsPerMonth: 600, 
            dateKms: new Date(2021, 6, 2),
            datePurchase: new Date(2021, 3, 5),
            active: true,
            id: 3
        })
    ];
    public static Vehicles: VehicleModel[] = MockVehicle.VehiclesAux.map(x => {
        return {...x, kmEstimated: this.calendarService.calculateKmVehicleEstimated(x) };
    });

}