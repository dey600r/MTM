import { MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel } from '@models/index';
import { CalendarService, IconService } from '@services/index';

import { Constants } from '@utils/index';

export class MockAppMaintenance {
    public static readonly iconService: IconService = new IconService();
    public static readonly calendarService: CalendarService = new CalendarService(null);

    /* MAINTENANCE ELELEMTNS */
    public static readonly MaintenanceElementsAux: MaintenanceElementModel[] = [
        new MaintenanceElementModel({
            name: 'DB.FRONT_WHEEL',
            nameKey: 'FRONT_WHEEL',
            description: 'DB.CHANGE_FRONT_WHEEL',
            descriptionKey: 'CHANGE_FRONT_WHEEL',
            master: true,
            price: 110,
            id: 1
        }),
        new MaintenanceElementModel({
            name: 'DB.BACK_WHEEL',
            nameKey: 'BACK_WHEEL',
            description: 'DB.CHANGE_BACK_WHEEL',
            descriptionKey: 'CHANGE_BACK_WHEEL',
            master: true,
            price: 180,
            id: 2
        }),
        new MaintenanceElementModel({
            name: 'DB.ENGINE_OIL',
            nameKey: 'ENGINE_OIL',
            description: 'DB.CHANGE_ENGINE_OIL',
            descriptionKey: 'CHANGE_ENGINE_OIL',
            master: true,
            price: 45,
            id: 3
        }),
        new MaintenanceElementModel({
            name: 'DB.AIR_FILTER',
            nameKey: 'AIR_FILTER',
            description: 'DB.CHANGE_AIR_FILTER',
            descriptionKey: 'CHANGE_AIR_FILTER',
            master: true,
            price: 34,
            id: 4
        }),
        new MaintenanceElementModel({
            name: 'DB.OIL_FILTER',
            nameKey: 'OIL_FILTER',
            description: 'DB.CHANGE_OIL_FILTER',
            descriptionKey: 'CHANGE_OIL_FILTER',
            master: true,
            price: 6,
            id: 5
        }),
        new MaintenanceElementModel({
            name: 'DB.SPARK_PLUG',
            nameKey: 'SPARK_PLUG',
            description: 'DB.CHANGE_SPARK_PLUG',
            descriptionKey: 'CHANGE_SPARK_PLUG',
            master: false,
            price: 32,
            id: 6
        }),
        new MaintenanceElementModel({
            name: 'DB.SPARK_PLUG',
            nameKey: 'SPARK_PLUG',
            description: 'DB.CHANGE_SPARK_PLUG',
            descriptionKey: 'CHANGE_SPARK_PLUG',
            master: false,
            price: 34,
            id: 7
        }),
        new MaintenanceElementModel({
            name: 'DB.ENGINE_OIL',
            nameKey: 'ENGINE_OIL',
            description: 'DB.CHANGE_ENGINE_OIL',
            descriptionKey: 'CHANGE_ENGINE_OIL',
            master: false,
            price: 38,
            id: 8
        }),
        new MaintenanceElementModel({
            name: 'DB.FRONT_BRAKE_FLUID',
            nameKey: 'FRONT_BRAKE_FLUID',
            description: 'DB.CHANGE_FRONT_BRAKE_FLUID',
            descriptionKey: 'CHANGE_FRONT_BRAKE_FLUID',
            master: false,
            price: 5,
            id: 9
        }),
        new MaintenanceElementModel({
            name: 'DB.BACK_BRAKE_FLUID',
            nameKey: 'BACK_BRAKE_FLUID',
            description: 'DB.CHANGE_BACK_BRAKE_FLUID',
            descriptionKey: 'CHANGE_BACK_BRAKE_FLUID',
            master: false,
            price: 5,
            id: 10
        }),
        new MaintenanceElementModel({
            name: 'DB.OIL_FILTER2',
            nameKey: 'OIL_FILTER2',
            description: 'DB.CHANGE_OIL_FILTER2',
            descriptionKey: 'CHANGE_OIL_FILTER2',
            master: true,
            price: 11,
            id: 11
        })
    ];
    public static readonly MaintenanceElements: MaintenanceElementModel[] = MockAppMaintenance.MaintenanceElementsAux.map(x => {
        return {...x, icon: this.iconService.getIconReplacement(x.id) };
    });

    /* MAINTENANCE FREQUENCIES */
    public static readonly MaintenanceFreqsAux: MaintenanceFreqModel[] = [
        new MaintenanceFreqModel(Constants.MAINTENANCE_FREQ_ONCE_CODE, 'ONCE', 1),
        new MaintenanceFreqModel(Constants.MAINTENANCE_FREQ_CALENDAR_CODE, 'CALENDAR', 2)
    ];
    public static readonly MaintenanceFreqs: MaintenanceFreqModel[] = MockAppMaintenance.MaintenanceFreqsAux.map(x => {
        return {...x, icon: this.iconService.getIconMaintenance(x.code) };
    });

    /* MAINTENANCES */
    public static readonly Maintenances: MaintenanceModel[] = [
        new MaintenanceModel({
            description: 'DB.FIRST_REVIEW',
            descriptionKey: 'FIRST_REVIEW',
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[0], MockAppMaintenance.MaintenanceElements[2]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[0],
            km: 1000,
            time: 6,
            init: true,
            wear: false,
            fromKm: 0,
            toKm: null,
            master: true,
            id: 1
        }),
        new MaintenanceModel({
            description: 'DB.BASIC_REVIEW',
            descriptionKey: 'BASIC_REVIEW',
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[1], MockAppMaintenance.MaintenanceElements[3], MockAppMaintenance.MaintenanceElements[7]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[1],
            km: 8000,
            time: 12,
            init: false,
            wear: false,
            fromKm: 0,
            toKm: null,
            master: true,
            id: 2
        }),
        new MaintenanceModel({
            description: 'DB.FIRST_REVIEW',
            descriptionKey: 'FIRST_REVIEW',
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[4], MockAppMaintenance.MaintenanceElements[5]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[1],
            km: 16000,
            time: 24,
            init: false,
            wear: false,
            fromKm: 0,
            toKm: null,
            master: true,
            id: 3
        }),
        new MaintenanceModel({
            description: 'DB.REVIEW_SPARKS',
            descriptionKey: 'REVIEW_SPARKS',
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[2], MockAppMaintenance.MaintenanceElements[6]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[1],
            km: 20000,
            time: null,
            init: false,
            wear: false,
            fromKm: 0,
            toKm: null,
            master: true,
            id: 4
        }),
        new MaintenanceModel({
            description: 'DB.REVIEW_SPARKS',
            descriptionKey: 'REVIEW_SPARKS',
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[2], MockAppMaintenance.MaintenanceElements[4], MockAppMaintenance.MaintenanceElements[5]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[1],
            km: 26000,
            time: 0,
            init: false,
            wear: false,
            fromKm: 0, 
            toKm: null,
            master: true,
            id: 5
        }),
        new MaintenanceModel({
            description: 'DB.CHANGE WHEELS',
            descriptionKey: 'CHANGE WHEELS',
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[0], MockAppMaintenance.MaintenanceElements[1]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[1],
            km: 18000,
            time: 48,
            init: false,
            wear: true,
            fromKm: 0,
            toKm: null,
            master: false,
            id: 6
        }),
        new MaintenanceModel({
            description: 'DB.REVIES BRAKES', 
            descriptionKey: 'REVIES BRAKES', 
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[8], MockAppMaintenance.MaintenanceElements[9]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[1],
            km: 18000,
            time: 48,
            init: false,
            wear: true,
            fromKm: 0,
            toKm: null,
            master: false,
            id: 7
        }),
        new MaintenanceModel({
            description: 'DB.REVIEWS AIR FILTER - 1', 
            descriptionKey: 'REVIEWS AIR FILTER - 1', 
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[3]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[1],
            km: 5000,
            time: 24,
            init: false,
            wear: false,
            fromKm: 0,
            toKm: 12000,
            master: false,
            id: 8
        }),
        new MaintenanceModel({
            description: 'DB.REVIEWS AIR FILTER - 2', 
            descriptionKey: 'REVIEWS AIR FILTER - 2', 
            listMaintenanceElement: [MockAppMaintenance.MaintenanceElements[3]],
            maintenanceFreq: MockAppMaintenance.MaintenanceFreqs[1],
            km: 2000,
            time: 18,
            init: false,
            wear: false,
            fromKm: 12000,
            toKm: null,
            master: false,
            id: 9
        })
    ];
}