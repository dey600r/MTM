import { IOperationMaintenanceElementStorageModel, IOperationStorageModel, IOperationTypeStorageModel } from '@models/index';

import { Constants } from '@utils/index';

import { MockDBMaintenance } from './mock-maintenance.spec';
import { MockDBVehicle } from './mock-vehicle.spec';

export class MockDBOperation {

    /* OPERATION TYPES */
    public static readonly OperationTypes: IOperationTypeStorageModel[] = [
        { code: Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP, description: 'MAINTENANCE_WORKSHOP', id: 1 },
        { code: Constants.OPERATION_TYPE_FAILURE_WORKSHOP, description: 'FAILURE_WORKSHOP', id: 2 },
        { code: Constants.OPERATION_TYPE_CLOTHES, description: 'CLOTHES', id: 3 },
        { code: Constants.OPERATION_TYPE_TOOLS, description: 'TOOLS', id: 4 },
        { code: Constants.OPERATION_TYPE_ACCESSORIES, description: 'ACCESORIES', id: 5 },
        { code: Constants.OPERATION_TYPE_OTHER, description: 'OTHERS', id: 6 },
        { code: Constants.OPERATION_TYPE_MAINTENANCE_HOME, description: 'MAINTENANCE_HOME', id: 7 },
        { code: Constants.OPERATION_TYPE_FAILURE_HOME, description: 'FAILURE_HOME', id: 8 },
        { code: Constants.OPERATION_TYPE_SPARE_PARTS, description: 'SPARE_PARTS',id: 9 }
    ];

    /* OPERATIONS */
    public static readonly Operations: IOperationStorageModel[] = [
        {
            description: 'Compra moto',
            details: 'Compra hyosung GT125r 2006',
            idOperationType: MockDBOperation.OperationTypes[5].id,
            idVehicle: MockDBVehicle.Vehicles[1].id,
            km: 0,
            date: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 1, new Date().getDate() - 2),
            location: 'Motos real (Ciudad Real)',
            owner: 'Yo',
            price: 3500,
            document: '',
            id: 1,
        },
        {
            description: 'Revision1',
            details: 'Aceite motor, filtro aceite, pastillas de freno',
            idOperationType: MockDBOperation.OperationTypes[0].id,
            idVehicle: MockDBVehicle.Vehicles[1].id,
            km: 4000, 
            date: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 3, new Date().getDate() - 1),
            location: 'Motos real (Ciudad Real)',
            owner: 'Yo',
            price: 40,
            document: '',
            id: 2,
        },
        {
            description: 'Comprar Moto',
            details: 'Yamaha R6 2005',
            idOperationType: MockDBOperation.OperationTypes[5].id,
            idVehicle: MockDBVehicle.Vehicles[0].id,
            km: 0,
            date: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 1, new Date().getDate() + 3),
            location: 'Madrid (Motos Cortes)',
            owner: 'Otro',
            price: 8155.35,
            document: '',
            id: 3,
        },
        {
            description: 'Primera Revisión',
            details: 'Filtro aceite, aceite motor, residuos',
            idOperationType: MockDBOperation.OperationTypes[0].id,
            idVehicle: MockDBVehicle.Vehicles[1].id,
            km: 988,
            date: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 3, new Date().getDate() + 5),
            location: 'Madrid (Motos Cortes)',
            owner: 'Otro',
            price: 100,
            document: '',
            id: 4,
        },
        {
            description: 'Revisión3',
            details: 'Filtro aceite, aceite motor, residuos',
            idOperationType: MockDBOperation.OperationTypes[6].id,
            idVehicle: MockDBVehicle.Vehicles[1].id,
            km: 4200,
            date: new Date(new Date().getFullYear() - 15, new Date().getMonth() - 6, new Date().getDate() - 6),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 200,
            document: '',
            id: 5,
        },
        {
            description: 'Revisión4',
            details: 'Filtro aceite, aceite motor, residuos',
            idOperationType: MockDBOperation.OperationTypes[0].id,
            idVehicle: MockDBVehicle.Vehicles[1].id,
            km: 68770,
            date: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 6, new Date().getDate() - 5),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 300,
            document: '',
            id: 6,
        },
        {
            description: 'Revisión5',
            details: 'Filtro aceite, aceite motor, residuos',
            idOperationType: MockDBOperation.OperationTypes[6].id,
            idVehicle: MockDBVehicle.Vehicles[0].id,
            km: 55000,
            date: new Date(new Date().getFullYear() - 7, new Date().getMonth() - 7, new Date().getDate() - 13),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 650,
            document: '',
            id: 7,
        },
        {
            description: 'Revisión6',
            details: 'Filtro aceite, aceite motor, residuos',
            idOperationType: MockDBOperation.OperationTypes[6].id,
            idVehicle: MockDBVehicle.Vehicles[0].id,
            km: 67000,
            date: new Date(new Date().getFullYear() - 6, new Date().getMonth() - 1, new Date().getDate() + 7),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 333,
            document: '',
            id: 8
        },
        {
            description: 'Revisión7',
            details: 'Filtro aceite, aceite motor, residuos',
            idOperationType: MockDBOperation.OperationTypes[0].id,
            idVehicle: MockDBVehicle.Vehicles[0].id,
            km: 100000,
            date: new Date(new Date().getFullYear() - 5, new Date().getMonth() - 6, new Date().getDate() - 5),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 300,
            document: '',
            id: 9,
        },
        { 
            description: 'Revisión8',
            details: 'Filtro aceite, aceite motor, residuos',
            idOperationType: MockDBOperation.OperationTypes[0].id,
            idVehicle: MockDBVehicle.Vehicles[1].id,
            km: 72000,
            date: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 3, new Date().getDate() + 6),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 400,
            document: '',
            id: 10
        },
        {
            description: 'Revisión8',
            details: 'Filtro aceite, aceite motor, residuos',
            idOperationType: MockDBOperation.OperationTypes[0].id,
            idVehicle: MockDBVehicle.Vehicles[0].id,
            km: 110300,
            date: new Date(new Date().getFullYear() - 5, new Date().getMonth() - 1, new Date().getDate() + 8),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 700,
            document: '',
            id: 11
        }
    ];

    public static readonly OperationMaintenanceElement: IOperationMaintenanceElementStorageModel[] = [
        { id: 1, idOperation: MockDBOperation.Operations[1].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[0].id, price: 110 },
        { id: 2, idOperation: MockDBOperation.Operations[1].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[2].id, price: 45 },
        { id: 3, idOperation: MockDBOperation.Operations[1].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[3].id, price: 34 },
        { id: 4, idOperation: MockDBOperation.Operations[1].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id, price: 6 },
        { id: 5, idOperation: MockDBOperation.Operations[3].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[1].id, price: 180 },
        { id: 6, idOperation: MockDBOperation.Operations[3].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id, price: 6 },
        { id: 7, idOperation: MockDBOperation.Operations[3].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id, price: 32 },
        { id: 8, idOperation: MockDBOperation.Operations[3].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[0].id, price: 110 },
        { id: 9, idOperation: MockDBOperation.Operations[4].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[8].id, price: 5 },
        { id: 10, idOperation: MockDBOperation.Operations[4].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id, price: 32 },
        { id: 11, idOperation: MockDBOperation.Operations[4].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[6].id, price: 34 },
        { id: 12, idOperation: MockDBOperation.Operations[4].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[10].id, price: 11 },
        { id: 13, idOperation: MockDBOperation.Operations[5].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[1].id, price: 180 },
        { id: 14, idOperation: MockDBOperation.Operations[5].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[7].id, price: 38 },
        { id: 15, idOperation: MockDBOperation.Operations[6].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[0].id, price: 110 },
        { id: 16, idOperation: MockDBOperation.Operations[6].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[1].id, price: 180 },
        { id: 17, idOperation: MockDBOperation.Operations[6].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id, price: 6 },
        { id: 18, idOperation: MockDBOperation.Operations[6].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id, price: 32 },
        { id: 19, idOperation: MockDBOperation.Operations[6].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[6].id, price: 34 },
        { id: 20, idOperation: MockDBOperation.Operations[7].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[0].id, price: 110 },
        { id: 21, idOperation: MockDBOperation.Operations[7].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[3].id, price: 34 },
        { id: 22, idOperation: MockDBOperation.Operations[7].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id, price: 6 },
        { id: 23, idOperation: MockDBOperation.Operations[7].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id, price: 32 },
        { id: 24, idOperation: MockDBOperation.Operations[7].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[10].id, price: 11 },
        { id: 25, idOperation: MockDBOperation.Operations[8].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[2].id, price: 45 },
        { id: 26, idOperation: MockDBOperation.Operations[8].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id, price: 6 },
        { id: 27, idOperation: MockDBOperation.Operations[8].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id, price: 32 },
        { id: 28, idOperation: MockDBOperation.Operations[8].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[6].id, price: 34 },
        { id: 29, idOperation: MockDBOperation.Operations[9].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id, price: 6 },
        { id: 30, idOperation: MockDBOperation.Operations[9].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id, price: 32 },
        { id: 31, idOperation: MockDBOperation.Operations[9].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[6].id, price: 34 },
        { id: 32, idOperation: MockDBOperation.Operations[10].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[2].id, price: 45 },
        { id: 33, idOperation: MockDBOperation.Operations[10].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id, price: 6 },
        { id: 34, idOperation: MockDBOperation.Operations[10].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id, price: 32 },
        { id: 35, idOperation: MockDBOperation.Operations[10].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[6].id, price: 34 }        
    ];
}