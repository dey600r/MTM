import {
    ConfigurationModel, SystemConfigurationModel
} from '@models/index';
import { CalendarService, IconService } from '@services/index';

import { Constants } from '@utils/index';

import { MockMaintenance } from './mock-maintenance.spec';

export class MockConfiguration {
    static iconService: IconService = new IconService();
    static calendarService: CalendarService = new CalendarService(null);

    /* SYSTEM CONFIGURATION */
    public static SystemConfigurations: SystemConfigurationModel[] = [
        new SystemConfigurationModel(Constants.KEY_LAST_UPDATE_DB, 'v3.1.0', new Date(), 1),
        new SystemConfigurationModel(Constants.KEY_CONFIG_DISTANCE, Constants.SETTING_DISTANCE_KM, new Date(), 2),
        new SystemConfigurationModel(Constants.KEY_CONFIG_MONEY, Constants.SETTING_MONEY_EURO, new Date(), 3),
        new SystemConfigurationModel(Constants.KEY_CONFIG_THEME, Constants.SETTING_THEME_DARK, new Date(), 4),
        new SystemConfigurationModel(Constants.KEY_CONFIG_PRIVACY, Constants.DATABASE_NO, new Date(), 5),
        new SystemConfigurationModel(Constants.KEY_CONFIG_SYNC_EMAIL, 'USER_TEST@gmail.com', new Date(), 6),
    ];

    /* CONFIGURATION */
    static Configurations: ConfigurationModel[] = [
        new ConfigurationModel({
            name: 'PRODUCTION', 
            description: 'PRODUCTION SETUP', 
            master: true, 
            listMaintenance: [
                MockMaintenance.Maintenances[0],
                MockMaintenance.Maintenances[1],
                MockMaintenance.Maintenances[4],
                MockMaintenance.Maintenances[5]
            ],
            id: 1
        }),
        new ConfigurationModel({
            name: 'HYOSUNG', 
            description: 'PRODUCTION SETUP HYOSUNG',
            master: true,
            listMaintenance: MockMaintenance.Maintenances,
            id: 2
        }),
        new ConfigurationModel({
            name: 'KAWASAKI',
            description: 'PRODUCTION SETUP KAWASAKI',
            master: true,
            listMaintenance: [
                MockMaintenance.Maintenances[1],
                MockMaintenance.Maintenances[3],
                MockMaintenance.Maintenances[6],
                MockMaintenance.Maintenances[7],
                MockMaintenance.Maintenances[8]
            ],
            id: 3
        })
    ];
}