import { OperationModel, OperationTypeModel } from '@models/index';
import { CalendarService, IconService } from '@services/index';

import { Constants } from '@utils/index';
import { MockMaintenance } from './mock-maintenance.spec';

import { MockVehicle } from './mock-vehicle.spec';

export class MockOperation {
    static iconService: IconService = new IconService();
    static calendarService: CalendarService = new CalendarService(null);

    /* OPERATION TYPES */
    public static OperationTypesAux: OperationTypeModel[] = [
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
    public static OperationTypes: OperationTypeModel[] = MockOperation.OperationTypesAux.map(x => {
        return {...x, icon: this.iconService.getIconOperationType(x.code) };
    });

    /* OPERATIONS */
    static Operations: OperationModel[] = [
        new OperationModel({
            description: 'Compra moto',
            details: 'Compra hyosung GT125r 2006',
            operationType: MockOperation.OperationTypes[5],
            vehicle: MockVehicle.Vehicles[1],
            km: 0,
            date: new Date(2006, 9, 12),
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
            operationType: MockOperation.OperationTypes[0],
            vehicle: MockVehicle.Vehicles[1],
            km: 4000, 
            date: new Date(2006, 11, 15),
            location: 'Motos real (Ciudad Real)',
            owner: 'Yo',
            price: 40,
            document: '',
            id: 2,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[0],
                MockMaintenance.MaintenanceElements[2],
                MockMaintenance.MaintenanceElements[3],
                MockMaintenance.MaintenanceElements[4]
            ]
        }),
        new OperationModel({
            description: 'Comprar Moto',
            details: 'Yamaha R6 2005',
            operationType: MockOperation.OperationTypes[5],
            vehicle: MockVehicle.Vehicles[0],
            km: 0,
            date: new Date(2006, 9, 19),
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
            operationType: MockOperation.OperationTypes[0],
            vehicle: MockVehicle.Vehicles[1],
            km: 988,
            date: new Date(2006, 11, 21),
            location: 'Madrid (Motos Cortes)',
            owner: 'Otro',
            price: 100,
            document: '',
            id: 4,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[1],
                MockMaintenance.MaintenanceElements[4],
                MockMaintenance.MaintenanceElements[5],
                MockMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({
            description: 'Revisión3',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockOperation.OperationTypes[6],
            vehicle: MockVehicle.Vehicles[1],
            km: 4200,
            date: new Date(2008, 2, 10),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 200,
            document: '',
            id: 5,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[8],
                MockMaintenance.MaintenanceElements[5],
                MockMaintenance.MaintenanceElements[6],
                MockMaintenance.MaintenanceElements[10]
            ]
        }),
        new OperationModel({
            description: 'Revisión4',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockOperation.OperationTypes[0],
            vehicle: MockVehicle.Vehicles[1],
            km: 68770,
            date: new Date(2021, 2, 11),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 300,
            document: '',
            id: 6,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[1],
                MockMaintenance.MaintenanceElements[7]
            ]
        }),
        new OperationModel({
            description: 'Revisión5',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockOperation.OperationTypes[6],
            vehicle: MockVehicle.Vehicles[0],
            km: 55000,
            date: new Date(2016, 1, 29),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 650,
            document: '',
            id: 7,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[0],
                MockMaintenance.MaintenanceElements[1],
                MockMaintenance.MaintenanceElements[4],
                MockMaintenance.MaintenanceElements[5],
                MockMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({
            description: 'Revisión6',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockOperation.OperationTypes[6],
            vehicle: MockVehicle.Vehicles[0],
            km: 67000,
            date: new Date(2017, 7, 23),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 333,
            document: '',
            id: 8,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[0],
                MockMaintenance.MaintenanceElements[3],
                MockMaintenance.MaintenanceElements[4],
                MockMaintenance.MaintenanceElements[5],
                MockMaintenance.MaintenanceElements[10]
            ]
        }),
        new OperationModel({
            description: 'Revisión7',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockOperation.OperationTypes[0],
            vehicle: MockVehicle.Vehicles[0],
            km: 100000,
            date: new Date(2018, 2, 11),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 300,
            document: '',
            id: 9,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[2],
                MockMaintenance.MaintenanceElements[4],
                MockMaintenance.MaintenanceElements[5],
                MockMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({ 
            description: 'Revisión8',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockOperation.OperationTypes[0],
            vehicle: MockVehicle.Vehicles[1],
            km: 72000,
            date: new Date(2021, 5, 21),
            location: 'Ciudad Real (Motos Real)',
            owner: 'Yo',
            price: 400,
            document: '',
            id: 10,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[4],
                MockMaintenance.MaintenanceElements[5],
                MockMaintenance.MaintenanceElements[6]
            ]
        }),
        new OperationModel({
            description: 'Revisión8',
            details: 'Filtro aceite, aceite motor, residuos',
            operationType: MockOperation.OperationTypes[0],
            vehicle: MockVehicle.Vehicles[0],
            km: 110300,
            date: new Date(2018, 7, 24),
            location: 'Madrid (Motos Cortes)',
            owner: 'Yo',
            price: 700,
            document: '',
            id: 11,
            listMaintenanceElement: [
                MockMaintenance.MaintenanceElements[2],
                MockMaintenance.MaintenanceElements[4],
                MockMaintenance.MaintenanceElements[5],
                MockMaintenance.MaintenanceElements[6]
            ]
        })
    ];
}