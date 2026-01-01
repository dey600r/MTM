import { OperationModel, OperationTypeModel } from '@models/index';
import { CalendarService, IconService } from '@services/index';

import { Constants } from '@utils/index';

import { MockAppMaintenance } from './mock-maintenance.spec';
import { MockAppVehicle } from './mock-vehicle.spec';

export class MockAppOperation {
    public static readonly iconService: IconService = new IconService();
    public static readonly calendarService: CalendarService = new CalendarService(null);

    /* OPERATION TYPES */
    public static readonly OperationTypesAux: OperationTypeModel[] = [
        new OperationTypeModel(Constants.OPERATION_TYPE_MAINTENANCE_WORKSHOP, 'MAINTENANCE_WORKSHOP', 1),
        new OperationTypeModel(Constants.OPERATION_TYPE_FAILURE_WORKSHOP, 'FAILURE_WORKSHOP', 2),
        new OperationTypeModel(Constants.OPERATION_TYPE_CLOTHES, 'CLOTHES', 3),
        new OperationTypeModel(Constants.OPERATION_TYPE_TOOLS, 'TOOLS', 4),
        new OperationTypeModel(Constants.OPERATION_TYPE_ACCESSORIES, 'ACCESORIES', 5),
        new OperationTypeModel(Constants.OPERATION_TYPE_OTHER, 'OTHERS', 6),
        new OperationTypeModel(Constants.OPERATION_TYPE_MAINTENANCE_HOME, 'MAINTENANCE_HOME', 7),
        new OperationTypeModel(Constants.OPERATION_TYPE_FAILURE_HOME, 'FAILURE_HOME', 8),
        new OperationTypeModel(Constants.OPERATION_TYPE_SPARE_PARTS, 'SPARE_PARTS', 9)
    ];
    public static readonly OperationTypes: OperationTypeModel[] = MockAppOperation.OperationTypesAux.map(x => {
        return {...x, icon: this.iconService.getIconOperationType(x.code) };
    });

    /* OPERATIONS */
    public static readonly Operations: OperationModel[] = [
        new OperationModel({
            description: 'Compra moto',
            details: 'Compra hyosung GT125r 2006',
            operationType: MockAppOperation.OperationTypes[5],
            vehicle: MockAppVehicle.Vehicles[1],
            km: 0,
            date: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 1, new Date().getDate() - 2),
            location: 'Motos real (Ciudad Real)',
            owner: 'Yo',
            price: 3500,
            document: '',
            id: 1,
            listMaintenanceElement: []
        }),
        new OperationModel({
            description: 'Revision1',
            details: 'Aceite motor, filtro aceite, pastillas de freno',
            operationType: MockAppOperation.OperationTypes[0],
            vehicle: MockAppVehicle.Vehicles[1],
            km: 4000, 
            date: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 3, new Date().getDate() - 1),
            location: 'Motos real (Ciudad Real)',
            owner: 'Yo',
            price: 40,
            document: '',
            id: 2,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[0],
                MockAppMaintenance.MaintenanceElements[2],
                MockAppMaintenance.MaintenanceElements[3],
                MockAppMaintenance.MaintenanceElements[4]
            ]
        }),
        new OperationModel({
            description: 'Comprar Moto',
            details: 'Yamaha R6 2005',
            operationType: MockAppOperation.OperationTypes[5],
            vehicle: MockAppVehicle.Vehicles[0],
            km: 0,
            date: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 1, new Date().getDate() + 3),
            location: 'Madrid (Motos Cortes)',
            owner: 'Otro',
            price: 8155.35,
            document: '',
            id: 3,
            listMaintenanceElement: []
        }),
        new OperationModel({
            description: 'Primera Revisión',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[0],
            vehicle: MockAppVehicle.Vehicles[1],
            km: 988,
            date: new Date(new Date().getFullYear() - 17, new Date().getMonth() + 3, new Date().getDate() + 5),
            location: 'Madrid (Motos Cortes)',
            owner: 'Otro',
            price: 100,
            document: '',
            id: 4,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[1],
                MockAppMaintenance.MaintenanceElements[4],
                MockAppMaintenance.MaintenanceElements[5],
                MockAppMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({
            description: 'Revisión3',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[6],
            vehicle: MockAppVehicle.Vehicles[1],
            km: 4200,
            date: new Date(new Date().getFullYear() - 15, new Date().getMonth() - 6, new Date().getDate() - 6),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 200,
            document: '',
            id: 5,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[8],
                MockAppMaintenance.MaintenanceElements[5],
                MockAppMaintenance.MaintenanceElements[6],
                MockAppMaintenance.MaintenanceElements[10]
            ]
        }),
        new OperationModel({
            description: 'Revisión4',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[0],
            vehicle: MockAppVehicle.Vehicles[1],
            km: 68770,
            date: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 6, new Date().getDate() - 5),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 300,
            document: '',
            id: 6,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[1],
                MockAppMaintenance.MaintenanceElements[7]
            ]
        }),
        new OperationModel({
            description: 'Revisión5',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[6],
            vehicle: MockAppVehicle.Vehicles[0],
            km: 55000,
            date: new Date(new Date().getFullYear() - 7, new Date().getMonth() - 7, new Date().getDate() - 13),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 650,
            document: '',
            id: 7,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[0],
                MockAppMaintenance.MaintenanceElements[1],
                MockAppMaintenance.MaintenanceElements[4],
                MockAppMaintenance.MaintenanceElements[5],
                MockAppMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({
            description: 'Revisión6',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[6],
            vehicle: MockAppVehicle.Vehicles[0],
            km: 67000,
            date: new Date(new Date().getFullYear() - 6, new Date().getMonth() - 1, new Date().getDate() + 7),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 333,
            document: '',
            id: 8,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[0],
                MockAppMaintenance.MaintenanceElements[3],
                MockAppMaintenance.MaintenanceElements[4],
                MockAppMaintenance.MaintenanceElements[5],
                MockAppMaintenance.MaintenanceElements[10]
            ]
        }),
        new OperationModel({
            description: 'Revisión7',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[0],
            vehicle: MockAppVehicle.Vehicles[0],
            km: 100000,
            date: new Date(new Date().getFullYear() - 5, new Date().getMonth() - 6, new Date().getDate() - 5),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 300,
            document: '',
            id: 9,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[2],
                MockAppMaintenance.MaintenanceElements[4],
                MockAppMaintenance.MaintenanceElements[5],
                MockAppMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({ 
            description: 'Revisión8',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[0],
            vehicle: MockAppVehicle.Vehicles[1],
            km: 72000,
            date: new Date(new Date().getFullYear() - 2, new Date().getMonth() - 3, new Date().getDate() + 6),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 400,
            document: '',
            id: 10,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[4],
                MockAppMaintenance.MaintenanceElements[5],
                MockAppMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({
            description: 'Revisión9',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[0],
            vehicle: MockAppVehicle.Vehicles[0],
            km: 110300,
            date: new Date(new Date().getFullYear() - 5, new Date().getMonth() - 1, new Date().getDate() + 8),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 700,
            document: '',
            id: 11,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[2],
                MockAppMaintenance.MaintenanceElements[4],
                MockAppMaintenance.MaintenanceElements[5],
                MockAppMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({
            description: 'Fallo9',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockAppOperation.OperationTypes[1],
            vehicle: MockAppVehicle.Vehicles[0],
            km: 119500,
            date: new Date(new Date().getFullYear() - 3, new Date().getMonth() - 4, new Date().getDate() + 2),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 900,
            document: '',
            id: 12,
            listMaintenanceElement: [
                MockAppMaintenance.MaintenanceElements[4],
                MockAppMaintenance.MaintenanceElements[5],
                MockAppMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({
            description: 'Chaqueta moto',
            details: 'Alpinestar',
            operationType: MockAppOperation.OperationTypes[3],
            vehicle: MockAppVehicle.Vehicles[0],
            km: 120500,
            date: new Date(new Date().getFullYear() - 3, new Date().getMonth() - 3, new Date().getDate() + 1),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 204,
            document: '',
            id: 13,
            listMaintenanceElement: []
        })
    ];
}