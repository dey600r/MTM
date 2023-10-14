import { IMaintenanceElementRelStorageModel, IMaintenanceElementStorageModel, IMaintenanceFreqStorageModel, IMaintenanceStorageModel } from "@models/index";

import { Constants } from "@utils/index";

export class MockDBMaintenance {

    /* MAINTENANCE ELELEMTNS */
    static MaintenanceElements: IMaintenanceElementStorageModel[] = [
        {
            name: 'FRONT_WHEEL',
            description: 'CHANGE_FRONT_WHEEL',
            master: true,
            id: 1
        },
        {
            name: 'BACK_WHEEL',
            description: 'CHANGE_BACK_WHEEL',
            master: true,
            id: 2
        },
        {
            name: 'ENGINE_OIL',
            description: 'CHANGE_ENGINE_OIL',
            master: true,
            id: 3
        },
        {
            name: 'AIR_FILTER',
            description: 'CHANGE_AIR_FILTER',
            master: true,
            id: 4
        },
        {
            name: 'OIL_FILTER',
            description: 'CHANGE_OIL_FILTER',
            master: true,
            id: 5
        },
        {
            name: 'SPARK_PLUG',
            description: 'CHANGE_SPARK_PLUG',
            master: false,
            id: 6
        },
        {
            name: 'SPARK_PLUG',
            description: 'CHANGE_SPARK_PLUG',
            master: false,
            id: 7
        },
        {
            name: 'ENGINE_OIL',
            description: 'CHANGE_ENGINE_OIL',
            master: false,
            id: 8
        },
        {
            name: 'FRONT_BRAKE_FLUID',
            description: 'CHANGE_FRONT_BRAKE_FLUID',
            master: false,
            id: 9
        },
        {
            name: 'BACK_BRAKE_FLUID',
            description: 'CHANGE_BACK_BRAKE_FLUID',
            master: false,
            id: 10
        },
        {
            name: 'OIL_FILTER2',
            description: 'CHANGE_OIL_FILTER2',
            master: true,
            id: 11
        }
    ];

    /* MAINTENANCE FREQUENCIES */
    public static MaintenanceFreqs: IMaintenanceFreqStorageModel[] = [
        { code: Constants.MAINTENANCE_FREQ_ONCE_CODE, description: 'ONCE', id: 1 },
        { code: Constants.MAINTENANCE_FREQ_CALENDAR_CODE, description: 'CALENDAR', id: 2}
    ];

    /* MAINTENANCES */
    public static Maintenances: IMaintenanceStorageModel[] = [
        {
            description: 'FIRST_REVIEW',
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[0].id,
            km: 1000,
            time: 6,
            init: true,
            wear: false,
            fromKm: 0,
            toKm: null,
            master: true,
            id: 1
        },
        {
            description: 'BASIC_REVIEW',
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[1].id,
            km: 8000,
            time: 12,
            init: false,
            wear: false,
            fromKm: 0,
            toKm: null,
            master: true,
            id: 2
        },
        {
            description: 'FIRST_REVIEW',
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[1].id,
            km: 16000,
            time: 24,
            init: false,
            wear: false,
            fromKm: 0,
            toKm: null,
            master: true,
            id: 3
        },
        {
            description: 'REVIEW_SPARKS',
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[1].id,
            km: 20000,
            time: null,
            init: false,
            wear: false,
            fromKm: 0,
            toKm: null,
            master: true,
            id: 4
        },
        {
            description: 'REVIEW_SPARKS',
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[1].id,
            km: 26000,
            time: 0,
            init: false,
            wear: false,
            fromKm: 0, 
            toKm: null,
            master: true,
            id: 5
        },
        {
            description: 'CHANGE WHEELS',
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[1].id,
            km: 18000,
            time: 48,
            init: false,
            wear: true,
            fromKm: 0,
            toKm: null,
            master: false,
            id: 6
        },
        {
            description: 'REVIES BRAKES', 
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[1].id,
            km: 18000,
            time: 48,
            init: false,
            wear: true,
            fromKm: 0,
            toKm: null,
            master: false,
            id: 7
        },
        {
            description: 'REVIEWS AIR FILTER - 1', 
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[1].id,
            km: 5000,
            time: 24,
            init: false,
            wear: false,
            fromKm: 0,
            toKm: 12000,
            master: false,
            id: 8
        },
        {
            description: 'REVIEWS AIR FILTER - 2', 
            idMaintenanceFrec: MockDBMaintenance.MaintenanceFreqs[1].id,
            km: 2000,
            time: 18,
            init: false,
            wear: false,
            fromKm: 12000,
            toKm: null,
            master: false,
            id: 9
        }
    ];

    public static MaintenanceElementRel: IMaintenanceElementRelStorageModel[] = [
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[0].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[0].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[0].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[2].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[1].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[1].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[1].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[3].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[1].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[7].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[2].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[2].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[3].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[2].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[3].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[6].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[4].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[2].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[4].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[4].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[4].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[5].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[5].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[0].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[5].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[1].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[6].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[8].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[6].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[9].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[7].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[3].id },
        { id: 1, idMaintenance: MockDBMaintenance.Maintenances[8].id, idMaintenanceElement: MockDBMaintenance.MaintenanceElements[3].id },
    ];
}