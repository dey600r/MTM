import { MaintenanceElementModel, MaintenanceFreqModel, MaintenanceModel } from '@models/index';
import { CalendarService, IconService } from '@services/index';

import { Constants } from '@utils/index';

export class MockMaintenance {
    static iconService: IconService = new IconService();
    static calendarService: CalendarService = new CalendarService(null);

    /* MAINTENANCE ELELEMTNS */
    static MaintenanceElementsAux: MaintenanceElementModel[] = [
        new MaintenanceElementModel({
            name: 'FRONT_WHEEL',
            description: 'CHANGE_FRONT_WHEEL',
            master: true,
            price: 110,
            id: 1
        }),
        new MaintenanceElementModel({
            name: 'BACK_WHEEL',
            description: 'CHANGE_BACK_WHEEL',
            master: true,
            price: 180,
            id: 2
        }),
        new MaintenanceElementModel({
            name: 'ENGINE_OIL',
            description: 'CHANGE_ENGINE_OIL',
            master: true,
            price: 45,
            id: 3
        }),
        new MaintenanceElementModel({
            name: 'AIR_FILTER',
            description: 'CHANGE_AIR_FILTER',
            master: true,
            price: 34,
            id: 4
        }),
        new MaintenanceElementModel({
            name: 'OIL_FILTER',
            description: 'CHANGE_OIL_FILTER',
            master: true,
            price: 6,
            id: 5
        }),
        new MaintenanceElementModel({
            name: 'SPARK_PLUG',
            description: 'CHANGE_SPARK_PLUG',
            master: false,
            price: 32,
            id: 6
        }),
        new MaintenanceElementModel({
            name: 'SPARK_PLUG',
            description: 'CHANGE_SPARK_PLUG',
            master: false,
            price: 34,
            id: 7
        }),
        new MaintenanceElementModel({
            name: 'ENGINE_OIL',
            description: 'CHANGE_ENGINE_OIL',
            master: false,
            price: 38,
            id: 8
        }),
        new MaintenanceElementModel({
            name: 'FRONT_BRAKE_FLUID',
            description: 'CHANGE_FRONT_BRAKE_FLUID',
            master: false,
            price: 5,
            id: 9
        }),
        new MaintenanceElementModel({
            name: 'BACK_BRAKE_FLUID',
            description: 'CHANGE_BACK_BRAKE_FLUID',
            master: false,
            price: 5,
            id: 10
        }),
        new MaintenanceElementModel({
            name: 'OIL_FILTER2',
            description: 'CHANGE_OIL_FILTER2',
            master: true,
            price: 11,
            id: 11
        })
    ];
    public static MaintenanceElements: MaintenanceElementModel[] = MockMaintenance.MaintenanceElementsAux.map(x => {
        return {...x, icon: this.iconService.getIconReplacement(x.id) };
    });

    /* MAINTENANCE FREQUENCIES */
    public static MaintenanceFreqsAux: MaintenanceFreqModel[] = [
        new MaintenanceFreqModel(Constants.MAINTENANCE_FREQ_ONCE_CODE, 'ONCE', 1),
        new MaintenanceFreqModel(Constants.MAINTENANCE_FREQ_CALENDAR_CODE, 'CALENDAR', 2)
    ];
    public static MaintenanceFreqs: MaintenanceFreqModel[] = MockMaintenance.MaintenanceFreqsAux.map(x => {
        return {...x, icon: this.iconService.getIconMaintenance(x.code) };
    });

    /* MAINTENANCES */
    public static Maintenances: MaintenanceModel[] = [
        new MaintenanceModel({
            description: 'FIRST_REVIEW',
            listMaintenanceElement: [MockMaintenance.MaintenanceElements[0], MockMaintenance.MaintenanceElements[2]],
            maintenanceFreq: MockMaintenance.MaintenanceFreqs[0],
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
            description: 'BASIC_REVIEW',
            listMaintenanceElement: [MockMaintenance.MaintenanceElements[1], MockMaintenance.MaintenanceElements[3], MockMaintenance.MaintenanceElements[7]],
            maintenanceFreq: MockMaintenance.MaintenanceFreqs[1],
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
            description: 'FIRST_REVIEW',
            listMaintenanceElement: [MockMaintenance.MaintenanceElements[4], MockMaintenance.MaintenanceElements[5]],
            maintenanceFreq: MockMaintenance.MaintenanceFreqs[1],
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
            description: 'REVIEW_SPARKS',
            listMaintenanceElement: [MockMaintenance.MaintenanceElements[2], MockMaintenance.MaintenanceElements[6]],
            maintenanceFreq: MockMaintenance.MaintenanceFreqs[1],
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
            description: 'REVIEW_SPARKS',
            listMaintenanceElement: [MockMaintenance.MaintenanceElements[2], MockMaintenance.MaintenanceElements[4], MockMaintenance.MaintenanceElements[5]],
            maintenanceFreq: MockMaintenance.MaintenanceFreqs[1],
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
            description: 'CHANGE WHEELS',
            listMaintenanceElement: [MockMaintenance.MaintenanceElements[0], MockMaintenance.MaintenanceElements[1]],
            maintenanceFreq: MockMaintenance.MaintenanceFreqs[1],
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
            description: 'REVIES BRAKES', 
            listMaintenanceElement: [MockMaintenance.MaintenanceElements[8], MockMaintenance.MaintenanceElements[8]],
            maintenanceFreq: MockMaintenance.MaintenanceFreqs[1],
            km: 18000,
            time: 48,
            init: false,
            wear: true,
            fromKm: 0,
            toKm: null,
            master: false,
            id: 7
        })
    ];
}