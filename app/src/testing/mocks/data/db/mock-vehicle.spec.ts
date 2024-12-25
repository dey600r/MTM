import { IVehicleStorageModel, IVehicleTypeStorageModel } from '@models/index';

import { Constants } from '@utils/index';

import { MockDBConfiguration } from './mock-configuration.spec';

export class MockDBVehicle {

    /* VEHICLE TYPE */
    public static readonly VehicleTypes: IVehicleTypeStorageModel[] = [
        { code: Constants.VEHICLE_TYPE_CODE_MOTO, description: 'MOTORBIKE', id: 1 },
        { code: Constants.VEHICLE_TYPE_CODE_CAR, description: 'CAR', id: 2 },
        { code: 'O', description: 'OTHER', id: 3 },
    ];

    /* VEHICLES */
    public static readonly Vehicles: IVehicleStorageModel[] = [
        {
            model: 'R6',
            brand: 'Yamaha',
            year: 2005,
            km: 111200,
            idConfiguration: MockDBConfiguration.Configurations[0].id,
            idVehicleType: MockDBVehicle.VehicleTypes[0].id,
            kmsPerMonth: 600,
            dateKms: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 2, new Date().getDate() - 14),
            datePurchase: new Date(new Date().getFullYear() - 17, new Date().getMonth() - 5, new Date().getDate() + 11),
            active: true,
            id: 1
        },
        {
            model: 'gt125r',
            brand: 'Hyosung',
            year: 2006,
            km: 76750,
            idConfiguration: MockDBConfiguration.Configurations[1].id,
            idVehicleType: MockDBVehicle.VehicleTypes[0].id,
            kmsPerMonth: 50,
            dateKms: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 2, new Date().getDate() - 14),
            datePurchase: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 1, new Date().getDate() - 4),
            active: true,
            id: 2
        },
        {
            model: 'Ninja 1000sx',
            brand: 'Kawasaki',
            year: 2021,
            km: 28000,
            idConfiguration: MockDBConfiguration.Configurations[2].id,
            idVehicleType: MockDBVehicle.VehicleTypes[0].id,
            kmsPerMonth: 600, 
            dateKms: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 2, new Date().getDate() - 14),
            datePurchase: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 5, new Date().getDate() - 11),
            active: true,
            id: 3
        }
    ];

}